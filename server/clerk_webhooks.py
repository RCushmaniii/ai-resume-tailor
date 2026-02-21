"""
Clerk Webhook Handlers

Handles Clerk webhook events, primarily user.created
to auto-create profiles in the database.

File: server/clerk_webhooks.py

Setup:
1. In Clerk Dashboard -> Webhooks -> Add Endpoint
2. URL: https://your-backend.com/api/webhooks/clerk
3. Events: user.created, user.updated, user.deleted
4. Copy the signing secret to CLERK_WEBHOOK_SECRET env var
"""

import os
import json
import hashlib
import hmac
import logging
from datetime import datetime

from flask import Blueprint, request, jsonify

from database import ensure_profile

logger = logging.getLogger(__name__)

clerk_webhook_bp = Blueprint("clerk_webhooks", __name__, url_prefix="/api")


def verify_clerk_webhook(payload: bytes, headers: dict) -> bool:
    """Verify Clerk webhook signature using svix."""
    webhook_secret = os.getenv("CLERK_WEBHOOK_SECRET", "")
    if not webhook_secret:
        logger.warning("CLERK_WEBHOOK_SECRET not set - skipping verification")
        return True

    try:
        from svix.webhooks import Webhook
        wh = Webhook(webhook_secret)
        wh.verify(payload, {
            "svix-id": headers.get("svix-id", ""),
            "svix-timestamp": headers.get("svix-timestamp", ""),
            "svix-signature": headers.get("svix-signature", ""),
        })
        return True
    except ImportError:
        # svix not installed - fall back to no verification in dev
        logger.warning("svix not installed - webhook signature not verified")
        return True
    except Exception as e:
        logger.error(f"Webhook verification failed: {e}")
        return False


@clerk_webhook_bp.route("/webhooks/clerk", methods=["POST"])
def handle_clerk_webhook():
    """Handle incoming Clerk webhook events."""
    payload = request.data
    headers = dict(request.headers)

    # Verify webhook signature
    if not verify_clerk_webhook(payload, headers):
        return jsonify({"error": "Invalid signature"}), 400

    try:
        event = json.loads(payload)
    except json.JSONDecodeError:
        return jsonify({"error": "Invalid JSON"}), 400

    event_type = event.get("type")
    event_data = event.get("data", {})

    logger.info(f"Received Clerk webhook: {event_type}")

    try:
        if event_type == "user.created":
            handle_user_created(event_data)
        elif event_type == "user.updated":
            handle_user_updated(event_data)
        elif event_type == "user.deleted":
            handle_user_deleted(event_data)
        else:
            logger.info(f"Unhandled Clerk event: {event_type}")
    except Exception as e:
        logger.error(f"Error handling Clerk webhook {event_type}: {e}")

    return jsonify({"received": True})


def handle_user_created(data: dict):
    """Create a profile when a new user signs up via Clerk."""
    user_id = data.get("id")
    if not user_id:
        logger.warning("user.created event without user ID")
        return

    # Extract email from Clerk user data
    email_addresses = data.get("email_addresses", [])
    primary_email_id = data.get("primary_email_address_id")
    email = None
    for ea in email_addresses:
        if ea.get("id") == primary_email_id:
            email = ea.get("email_address")
            break
    if not email and email_addresses:
        email = email_addresses[0].get("email_address")

    full_name = f"{data.get('first_name', '')} {data.get('last_name', '')}".strip() or None
    avatar_url = data.get("image_url")

    profile = ensure_profile(user_id, email=email, full_name=full_name, avatar_url=avatar_url)
    logger.info(f"Created profile for Clerk user {user_id} ({email})")


def handle_user_updated(data: dict):
    """Update profile when user data changes in Clerk."""
    user_id = data.get("id")
    if not user_id:
        return

    email_addresses = data.get("email_addresses", [])
    primary_email_id = data.get("primary_email_address_id")
    email = None
    for ea in email_addresses:
        if ea.get("id") == primary_email_id:
            email = ea.get("email_address")
            break

    full_name = f"{data.get('first_name', '')} {data.get('last_name', '')}".strip() or None
    avatar_url = data.get("image_url")

    ensure_profile(user_id, email=email, full_name=full_name, avatar_url=avatar_url)
    logger.info(f"Updated profile for Clerk user {user_id}")


def handle_user_deleted(data: dict):
    """Handle user deletion from Clerk. Profile cascades via FK."""
    user_id = data.get("id")
    if user_id:
        logger.info(f"Clerk user {user_id} deleted - profile will cascade if FK set")


def register_clerk_webhook_routes(app):
    """Register Clerk webhook routes with Flask app."""
    app.register_blueprint(clerk_webhook_bp)
    logger.info("Clerk webhook routes registered")
