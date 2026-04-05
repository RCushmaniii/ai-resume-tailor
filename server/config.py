"""
Environment variable validation.
Call validate_env() at startup to fail fast on missing required config.
"""

import os
import sys
import logging

logger = logging.getLogger(__name__)


def validate_env():
    """Validate environment variables at startup. Fail fast on missing required vars."""
    errors = []
    warnings = []

    # Always required
    for var in ["OPENAI_API_KEY", "DATABASE_URL"]:
        if not os.getenv(var):
            errors.append(f"Missing required: {var}")

    # Required in production
    env = os.getenv("FLASK_ENV", "production")
    if env != "development":
        if not os.getenv("FRONTEND_URL"):
            errors.append("Missing required (production): FRONTEND_URL")
        if not os.getenv("CLERK_SECRET_KEY") and not os.getenv("CLERK_JWKS_URL"):
            errors.append(
                "Missing required (production): CLERK_SECRET_KEY or CLERK_JWKS_URL"
            )

    # Optional with defaults — log for visibility
    defaults = {
        "OPENAI_MODEL": "gpt-4o",
        "GUEST_CREDITS_TOTAL": "3",
        "REG_CREDITS_TOTAL": "7",
    }
    for var, default in defaults.items():
        if not os.getenv(var):
            warnings.append(f"{var} not set, using default: {default}")

    # Conditional: Stripe (warn if partially configured)
    stripe_vars = [
        "STRIPE_SECRET_KEY",
        "STRIPE_PUBLISHABLE_KEY",
        "STRIPE_WEBHOOK_SECRET",
        "STRIPE_PRICE_MONTHLY",
        "STRIPE_PRICE_ANNUAL",
    ]
    stripe_set = [v for v in stripe_vars if os.getenv(v)]
    if 0 < len(stripe_set) < len(stripe_vars):
        missing = [v for v in stripe_vars if not os.getenv(v)]
        warnings.append(f"Partial Stripe config. Missing: {', '.join(missing)}")

    # Conditional: Clerk webhooks
    if os.getenv("CLERK_SECRET_KEY") and not os.getenv("CLERK_WEBHOOK_SECRET"):
        warnings.append(
            "CLERK_WEBHOOK_SECRET not set — Clerk webhooks will not verify signatures"
        )

    # Report
    for w in warnings:
        logger.warning(f"ENV: {w}")

    if errors:
        for e in errors:
            logger.error(f"ENV: {e}")
        logger.error("Startup aborted due to missing environment variables.")
        sys.exit(1)

    logger.info("ENV: All required environment variables validated")
