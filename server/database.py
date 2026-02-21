"""
Database Module (Neon Postgres)

Replaces Supabase RPC functions with direct SQL queries.
Uses psycopg2 for connection management.

File: server/database.py
"""

import os
import logging
import uuid
from datetime import datetime
from contextlib import contextmanager

import psycopg2
from psycopg2.extras import RealDictCursor, Json

logger = logging.getLogger(__name__)


def get_connection():
    """Get a database connection using DATABASE_URL."""
    database_url = os.getenv("DATABASE_URL")
    if not database_url:
        raise RuntimeError("DATABASE_URL environment variable is not set")
    return psycopg2.connect(database_url, cursor_factory=RealDictCursor)


@contextmanager
def get_db():
    """Context manager for database connections with auto-commit/rollback."""
    conn = get_connection()
    try:
        yield conn
        conn.commit()
    except Exception:
        conn.rollback()
        raise
    finally:
        conn.close()


# =========================================================================
# Profile Operations
# =========================================================================

def ensure_profile(user_id: str, email: str = None, full_name: str = None, avatar_url: str = None):
    """Create a profile if it doesn't exist, or return the existing one."""
    with get_db() as conn:
        with conn.cursor() as cur:
            cur.execute(
                """
                INSERT INTO profiles (id, email, full_name, avatar_url)
                VALUES (%s, %s, %s, %s)
                ON CONFLICT (id) DO UPDATE SET
                    email = COALESCE(EXCLUDED.email, profiles.email),
                    full_name = COALESCE(EXCLUDED.full_name, profiles.full_name),
                    avatar_url = COALESCE(EXCLUDED.avatar_url, profiles.avatar_url),
                    updated_at = NOW()
                RETURNING *
                """,
                (user_id, email, full_name, avatar_url),
            )
            return cur.fetchone()


def get_profile(user_id: str):
    """Get a user's profile."""
    with get_db() as conn:
        with conn.cursor() as cur:
            cur.execute("SELECT * FROM profiles WHERE id = %s", (user_id,))
            return cur.fetchone()


def update_profile(user_id: str, updates: dict):
    """Update profile fields."""
    if not updates:
        return None

    # Build SET clause dynamically
    set_parts = []
    values = []
    for key, value in updates.items():
        set_parts.append(f"{key} = %s")
        values.append(value)

    set_parts.append("updated_at = NOW()")
    values.append(user_id)

    with get_db() as conn:
        with conn.cursor() as cur:
            cur.execute(
                f"UPDATE profiles SET {', '.join(set_parts)} WHERE id = %s RETURNING *",
                values,
            )
            return cur.fetchone()


# =========================================================================
# Analysis Operations
# =========================================================================

def save_analysis_with_credit(
    user_id: str,
    resume_text: str,
    job_description: str,
    job_title: str = None,
    company_name: str = None,
    score: int = 0,
    result_json: dict = None,
):
    """Save an analysis and increment usage counter atomically."""
    analysis_id = str(uuid.uuid4())

    with get_db() as conn:
        with conn.cursor() as cur:
            # Insert the analysis
            cur.execute(
                """
                INSERT INTO analyses (id, user_id, resume_text, job_description, job_title, company_name, score, result_json)
                VALUES (%s, %s, %s, %s, %s, %s, %s, %s)
                """,
                (analysis_id, user_id, resume_text, job_description, job_title, company_name, score, Json(result_json)),
            )

            # Increment usage
            cur.execute(
                """
                UPDATE profiles
                SET analyses_used_this_period = analyses_used_this_period + 1,
                    updated_at = NOW()
                WHERE id = %s
                RETURNING analyses_used_this_period, analyses_limit
                """,
                (user_id,),
            )
            profile = cur.fetchone()

    credits_remaining = max(0, (profile["analyses_limit"] or 5) - (profile["analyses_used_this_period"] or 0)) if profile else 0

    return {
        "success": True,
        "analysis_id": analysis_id,
        "credits_remaining": credits_remaining,
    }


def get_analysis_history(user_id: str, limit: int = 20, offset: int = 0):
    """Get user's analysis history with pagination."""
    with get_db() as conn:
        with conn.cursor() as cur:
            cur.execute(
                """
                SELECT id, job_title, company_name, score, is_favorite, created_at
                FROM analyses
                WHERE user_id = %s
                ORDER BY created_at DESC
                LIMIT %s OFFSET %s
                """,
                (user_id, limit, offset),
            )
            rows = cur.fetchall()
            return [dict(row) for row in rows]


def get_analysis_by_id(analysis_id: str):
    """Get a single analysis by ID."""
    with get_db() as conn:
        with conn.cursor() as cur:
            cur.execute("SELECT * FROM analyses WHERE id = %s", (analysis_id,))
            row = cur.fetchone()
            return dict(row) if row else None


def toggle_analysis_favorite(user_id: str, analysis_id: str):
    """Toggle favorite status for an analysis."""
    with get_db() as conn:
        with conn.cursor() as cur:
            cur.execute(
                """
                UPDATE analyses
                SET is_favorite = NOT is_favorite, updated_at = NOW()
                WHERE id = %s AND user_id = %s
                RETURNING is_favorite
                """,
                (analysis_id, user_id),
            )
            row = cur.fetchone()
            if not row:
                return {"success": False, "error": "Analysis not found"}
            return {"success": True, "is_favorite": row["is_favorite"]}


def delete_analysis(analysis_id: str, user_id: str):
    """Delete an analysis."""
    with get_db() as conn:
        with conn.cursor() as cur:
            cur.execute(
                "DELETE FROM analyses WHERE id = %s AND user_id = %s",
                (analysis_id, user_id),
            )
            return cur.rowcount > 0


# =========================================================================
# Subscription / Credit Operations
# =========================================================================

def increment_analysis_usage(user_id: str):
    """Increment the analysis usage counter for a user."""
    with get_db() as conn:
        with conn.cursor() as cur:
            cur.execute(
                """
                UPDATE profiles
                SET analyses_used_this_period = analyses_used_this_period + 1,
                    updated_at = NOW()
                WHERE id = %s
                RETURNING analyses_used_this_period, analyses_limit
                """,
                (user_id,),
            )
            return cur.fetchone()


def update_subscription(user_id: str, tier: str, subscription_data: dict):
    """Update user's subscription status in database."""
    try:
        update_data = {
            "subscription_tier": tier,
            "subscription_status": subscription_data.get("status", "none"),
            "updated_at": datetime.utcnow().isoformat(),
        }

        if subscription_data.get("customer"):
            update_data["stripe_customer_id"] = subscription_data["customer"]

        if subscription_data.get("current_period_end"):
            period_end = subscription_data["current_period_end"]
            if isinstance(period_end, (int, float)):
                update_data["subscription_period_end"] = datetime.utcfromtimestamp(period_end).isoformat()
            else:
                update_data["subscription_period_end"] = period_end

        # Pro tier: set higher limits and reset usage
        if tier == "pro" and subscription_data.get("status") in ["active", "trialing"]:
            update_data["analyses_limit"] = 50
            update_data["analyses_used_this_period"] = 0
            if subscription_data.get("current_period_end"):
                period_end = subscription_data["current_period_end"]
                if isinstance(period_end, (int, float)):
                    update_data["analyses_reset_date"] = datetime.utcfromtimestamp(period_end).isoformat()

        # Downgrade to free
        if tier == "free":
            update_data["analyses_limit"] = 5
            update_data["subscription_period_end"] = None
            update_data["analyses_reset_date"] = None

        return update_profile(user_id, update_data)

    except Exception as e:
        logger.error(f"Failed to update subscription for user {user_id}: {e}")
        return None


def reset_usage(user_id: str, next_period_end: int = None):
    """Reset monthly usage counter (called on successful payment renewal)."""
    updates = {
        "analyses_used_this_period": 0,
    }
    if next_period_end:
        updates["analyses_reset_date"] = datetime.utcfromtimestamp(next_period_end).isoformat()

    return update_profile(user_id, updates)


def transfer_guest_usage(user_id: str, guest_used: int):
    """Transfer guest usage count to a new user profile."""
    with get_db() as conn:
        with conn.cursor() as cur:
            cur.execute(
                """
                UPDATE profiles
                SET analyses_used_this_period = analyses_used_this_period + %s,
                    guest_analyses_transferred = true,
                    updated_at = NOW()
                WHERE id = %s
                RETURNING *
                """,
                (guest_used, user_id),
            )
            return cur.fetchone()
