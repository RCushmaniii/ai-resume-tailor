"""
Stripe Integration Module

Handles:
- Checkout session creation (embedded checkout)
- Webhook processing for payment events
- Customer portal access
- Subscription management

File: server/stripe_integration.py

Setup:
1. pip install stripe
2. Set environment variables:
   - STRIPE_SECRET_KEY
   - STRIPE_PUBLISHABLE_KEY
   - STRIPE_WEBHOOK_SECRET
   - STRIPE_PRICE_MONTHLY (price ID)
   - STRIPE_PRICE_ANNUAL (price ID)
"""

import os
import logging
from datetime import datetime, timedelta
from functools import wraps

import stripe
from flask import Blueprint, request, jsonify
from dotenv import load_dotenv
from supabase import create_client, Client

# Load environment variables
load_dotenv()

# Initialize Supabase admin client (uses service role key for admin operations)
_supabase_url = os.getenv("SUPABASE_URL", "").strip()
_supabase_service_key = os.getenv("SUPABASE_SERVICE_ROLE_KEY", "").strip()

supabase_admin: Client | None = None
if _supabase_url and _supabase_service_key:
    supabase_admin = create_client(_supabase_url, _supabase_service_key)
else:
    logging.warning("Supabase admin client not initialized - missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY")

# Configure logging
logger = logging.getLogger(__name__)

# Initialize Stripe
stripe.api_key = os.getenv("STRIPE_SECRET_KEY")

# Create Blueprint
stripe_bp = Blueprint('stripe', __name__, url_prefix='/api')

# Configuration
STRIPE_CONFIG = {
    "publishable_key": os.getenv("STRIPE_PUBLISHABLE_KEY"),
    "webhook_secret": os.getenv("STRIPE_WEBHOOK_SECRET"),
    "prices": {
        "monthly": os.getenv("STRIPE_PRICE_MONTHLY", "price_monthly_xxx"),
        "annual": os.getenv("STRIPE_PRICE_ANNUAL", "price_annual_xxx"),
    },
    "success_url": os.getenv("FRONTEND_URL", "http://localhost:3000") + "/checkout-success?session_id={CHECKOUT_SESSION_ID}",
    "cancel_url": os.getenv("FRONTEND_URL", "http://localhost:3000") + "/pricing",
}


# ═══════════════════════════════════════════════════════════════════════════
# HELPER FUNCTIONS
# ═══════════════════════════════════════════════════════════════════════════

def get_user_from_token():
    """Extract user from Authorization header. Returns user dict or None."""
    from app import _get_bearer_token, _validate_supabase_token
    
    token = _get_bearer_token()
    if not token:
        return None
    
    return _validate_supabase_token(token)


def require_auth(f):
    """Decorator to require authentication."""
    @wraps(f)
    def decorated(*args, **kwargs):
        user = get_user_from_token()
        if not user:
            return jsonify({"error": "Authentication required"}), 401
        return f(user, *args, **kwargs)
    return decorated


def get_or_create_stripe_customer(user_id: str, email: str) -> str:
    """
    Get existing Stripe customer or create new one.
    
    In production, you'd store stripe_customer_id in your database.
    For now, we search by metadata or create new.
    """
    # Try to find existing customer by email
    existing = stripe.Customer.list(email=email, limit=1)
    
    if existing.data:
        return existing.data[0].id
    
    # Create new customer
    customer = stripe.Customer.create(
        email=email,
        metadata={
            "user_id": user_id,
        }
    )
    
    logger.info(f"Created Stripe customer {customer.id} for user {user_id}")
    return customer.id


def update_user_subscription(user_id: str, tier: str, subscription_data: dict):
    """
    Update user's subscription status in database.

    Args:
        user_id: Supabase auth user ID
        tier: 'free' or 'pro'
        subscription_data: Dict with customer, subscription_id, status, current_period_end, etc.
    """
    if not supabase_admin:
        logger.error("Cannot update subscription: Supabase admin client not initialized")
        return

    try:
        # Build update payload
        update_data = {
            "subscription_tier": tier,
            "subscription_status": subscription_data.get("status", "none"),
            "updated_at": datetime.utcnow().isoformat(),
        }

        # Add optional fields if present
        if subscription_data.get("customer"):
            update_data["stripe_customer_id"] = subscription_data["customer"]

        if subscription_data.get("current_period_end"):
            # Convert Unix timestamp to ISO format
            period_end = subscription_data["current_period_end"]
            if isinstance(period_end, (int, float)):
                update_data["subscription_period_end"] = datetime.utcfromtimestamp(period_end).isoformat()
            else:
                update_data["subscription_period_end"] = period_end

        # For Pro tier upgrades, also set usage limits and reset date
        if tier == "pro" and subscription_data.get("status") in ["active", "trialing"]:
            update_data["analyses_limit"] = 50
            update_data["analyses_used_this_period"] = 0
            if subscription_data.get("current_period_end"):
                period_end = subscription_data["current_period_end"]
                if isinstance(period_end, (int, float)):
                    update_data["analyses_reset_date"] = datetime.utcfromtimestamp(period_end).isoformat()

        # For downgrades to free, reset to free tier limits
        if tier == "free":
            update_data["analyses_limit"] = 5
            update_data["subscription_period_end"] = None
            update_data["analyses_reset_date"] = None

        # Execute update
        result = supabase_admin.table("profiles").update(update_data).eq("id", user_id).execute()

        if result.data:
            logger.info(f"Updated subscription for user {user_id}: tier={tier}, status={subscription_data.get('status')}")
        else:
            logger.warning(f"No profile found for user {user_id} - update may have failed")

    except Exception as e:
        logger.error(f"Failed to update subscription for user {user_id}: {e}")


# ═══════════════════════════════════════════════════════════════════════════
# API ENDPOINTS
# ═══════════════════════════════════════════════════════════════════════════

@stripe_bp.route('/checkout/config', methods=['GET'])
def get_checkout_config():
    """Return Stripe publishable key for frontend."""
    return jsonify({
        "publishableKey": STRIPE_CONFIG["publishable_key"],
    })


@stripe_bp.route('/checkout/create-session', methods=['POST'])
def create_checkout_session():
    """
    Create a Stripe Checkout session for embedded checkout.

    Supports both authenticated users and guest checkout.

    Request body:
    {
        "priceId": "price_xxx" or "monthly"/"annual",
        "billingPeriod": "monthly" or "annual" (alternative to priceId),
        "email": "guest@example.com" (required for guest checkout)
    }

    Returns:
    {
        "clientSecret": "xxx" (for embedded checkout)
    }
    """
    try:
        data = request.json or {}

        # Get price ID
        price_id = data.get("priceId")
        billing_period = data.get("billingPeriod", "monthly")

        if not price_id or price_id in ["monthly", "annual"]:
            price_id = STRIPE_CONFIG["prices"].get(billing_period)

        if not price_id:
            return jsonify({"error": "Invalid billing period"}), 400

        # Check if user is authenticated
        user = get_user_from_token()

        if user:
            # Authenticated user - use their info
            user_id = user.get("id")
            email = user.get("email")
            is_guest = False
        else:
            # Guest checkout - require email in request
            email = data.get("email")
            if not email:
                return jsonify({"error": "Email is required for guest checkout"}), 400
            user_id = None
            is_guest = True

        # Get or create Stripe customer
        customer_id = get_or_create_stripe_customer(
            user_id=user_id or f"guest_{email}",
            email=email
        )

        # Build metadata
        metadata = {
            "is_guest": str(is_guest).lower(),
            "email": email,
        }
        if user_id:
            metadata["user_id"] = user_id

        # Create checkout session for embedded checkout
        session = stripe.checkout.Session.create(
            customer=customer_id,
            payment_method_types=["card"],
            line_items=[{
                "price": price_id,
                "quantity": 1,
            }],
            mode="subscription",
            ui_mode="embedded",  # For embedded checkout
            return_url=STRIPE_CONFIG["success_url"],
            metadata=metadata,
            subscription_data={
                "metadata": metadata,
            },
            # Allow promotion codes
            allow_promotion_codes=True,
        )

        checkout_type = "guest" if is_guest else f"user {user_id}"
        logger.info(f"Created checkout session {session.id} for {checkout_type}")

        return jsonify({
            "clientSecret": session.client_secret,
            "sessionId": session.id,
        })

    except stripe.error.StripeError as e:
        logger.error(f"Stripe error: {e}")
        return jsonify({"error": str(e)}), 400
    except Exception as e:
        logger.error(f"Checkout error: {e}")
        return jsonify({"error": "Failed to create checkout session"}), 500


@stripe_bp.route('/checkout/session-status', methods=['GET'])
def get_session_status():
    """
    Get checkout session status.
    Used to verify payment completion.
    """
    session_id = request.args.get("session_id")
    
    if not session_id:
        return jsonify({"error": "Missing session_id"}), 400
    
    try:
        session = stripe.checkout.Session.retrieve(session_id)
        
        return jsonify({
            "status": session.status,
            "paymentStatus": session.payment_status,
            "customerEmail": session.customer_details.email if session.customer_details else None,
        })
        
    except stripe.error.StripeError as e:
        logger.error(f"Stripe error: {e}")
        return jsonify({"error": str(e)}), 400


@stripe_bp.route('/subscription', methods=['GET'])
@require_auth
def get_subscription(user):
    """
    Get user's current subscription status.
    """
    try:
        # In production, fetch from your database
        # For now, check Stripe directly
        
        customer_email = user.get("email")
        customers = stripe.Customer.list(email=customer_email, limit=1)
        
        if not customers.data:
            return jsonify({
                "tier": "free",
                "subscription": None,
                "analyses_used": 0,  # Fetch from your database
            })
        
        customer = customers.data[0]
        
        # Get active subscriptions
        subscriptions = stripe.Subscription.list(
            customer=customer.id,
            status="active",
            limit=1
        )
        
        if not subscriptions.data:
            return jsonify({
                "tier": "free",
                "subscription": None,
                "analyses_used": 0,
            })
        
        sub = subscriptions.data[0]
        
        return jsonify({
            "tier": "pro",
            "subscription": {
                "id": sub.id,
                "status": sub.status,
                "current_period_end": sub.current_period_end,
                "cancel_at_period_end": sub.cancel_at_period_end,
            },
            "analyses_used": 0,  # Fetch from your database
            "period_end": datetime.fromtimestamp(sub.current_period_end).isoformat(),
        })
        
    except stripe.error.StripeError as e:
        logger.error(f"Stripe error: {e}")
        return jsonify({"error": str(e)}), 400
    except Exception as e:
        logger.error(f"Subscription fetch error: {e}")
        return jsonify({"error": "Failed to fetch subscription"}), 500


@stripe_bp.route('/subscription/claim', methods=['POST'])
@require_auth
def claim_subscription(user):
    """
    Claim a guest subscription after account creation.

    This links a Stripe subscription (created during guest checkout)
    to the newly created user account.

    Request body:
    {
        "email": "guest@example.com",
        "session_id": "cs_xxx" (optional, for verification)
    }
    """
    try:
        data = request.json or {}
        email = data.get("email")

        if not email:
            return jsonify({"error": "Email is required"}), 400

        # Verify the email matches the authenticated user
        if user.get("email") != email:
            return jsonify({"error": "Email mismatch"}), 403

        user_id = user.get("id")

        # Find Stripe customer by email
        customers = stripe.Customer.list(email=email, limit=1)

        if not customers.data:
            return jsonify({"error": "No subscription found for this email"}), 404

        customer = customers.data[0]
        customer_id = customer.id

        # Get active subscriptions
        subscriptions = stripe.Subscription.list(
            customer=customer_id,
            status="active",
            limit=1
        )

        if not subscriptions.data:
            # Check for trialing subscriptions too
            subscriptions = stripe.Subscription.list(
                customer=customer_id,
                status="trialing",
                limit=1
            )

        if not subscriptions.data:
            return jsonify({"error": "No active subscription found"}), 404

        sub = subscriptions.data[0]

        # Update customer metadata with the user_id
        stripe.Customer.modify(
            customer_id,
            metadata={
                "user_id": user_id,
                "pending_subscription": "false",
            }
        )

        # Update subscription metadata
        stripe.Subscription.modify(
            sub.id,
            metadata={
                "user_id": user_id,
                "is_guest": "false",
            }
        )

        # Update user's profile in database
        update_user_subscription(user_id, "pro", {
            "customer": customer_id,
            "subscription_id": sub.id,
            "status": sub.status,
            "current_period_end": sub.current_period_end,
        })

        logger.info(f"Claimed subscription {sub.id} for user {user_id}")

        return jsonify({
            "success": True,
            "subscription_id": sub.id,
            "tier": "pro",
        })

    except stripe.error.StripeError as e:
        logger.error(f"Stripe error claiming subscription: {e}")
        return jsonify({"error": str(e)}), 400
    except Exception as e:
        logger.error(f"Error claiming subscription: {e}")
        return jsonify({"error": "Failed to claim subscription"}), 500


@stripe_bp.route('/billing/portal', methods=['POST'])
@require_auth
def create_portal_session(user):
    """
    Create a Stripe Customer Portal session.
    Allows users to manage their subscription.
    """
    try:
        # Get customer
        customer_email = user.get("email")
        customers = stripe.Customer.list(email=customer_email, limit=1)
        
        if not customers.data:
            return jsonify({"error": "No subscription found"}), 404
        
        customer = customers.data[0]
        
        # Create portal session
        portal_session = stripe.billing_portal.Session.create(
            customer=customer.id,
            return_url=os.getenv("FRONTEND_URL", "http://localhost:3000") + "/settings/billing",
        )
        
        return jsonify({
            "url": portal_session.url,
        })
        
    except stripe.error.StripeError as e:
        logger.error(f"Stripe error: {e}")
        return jsonify({"error": str(e)}), 400


@stripe_bp.route('/stripe/webhook', methods=['POST'])
def stripe_webhook():
    """
    Handle Stripe webhook events.
    
    Important events:
    - checkout.session.completed: Payment successful
    - customer.subscription.updated: Subscription changed
    - customer.subscription.deleted: Subscription cancelled
    - invoice.payment_failed: Payment failed
    """
    payload = request.data
    sig_header = request.headers.get("Stripe-Signature")
    
    if not sig_header:
        return jsonify({"error": "Missing signature"}), 400
    
    try:
        event = stripe.Webhook.construct_event(
            payload, sig_header, STRIPE_CONFIG["webhook_secret"]
        )
    except ValueError as e:
        logger.error(f"Invalid payload: {e}")
        return jsonify({"error": "Invalid payload"}), 400
    except stripe.error.SignatureVerificationError as e:
        logger.error(f"Invalid signature: {e}")
        return jsonify({"error": "Invalid signature"}), 400
    
    # Handle the event
    event_type = event["type"]
    event_data = event["data"]["object"]
    
    logger.info(f"Received webhook: {event_type}")
    
    try:
        if event_type == "checkout.session.completed":
            handle_checkout_completed(event_data)
        
        elif event_type == "customer.subscription.updated":
            handle_subscription_updated(event_data)
        
        elif event_type == "customer.subscription.deleted":
            handle_subscription_deleted(event_data)
        
        elif event_type == "invoice.payment_failed":
            handle_payment_failed(event_data)
        
        elif event_type == "invoice.payment_succeeded":
            handle_payment_succeeded(event_data)
        
        else:
            logger.info(f"Unhandled event type: {event_type}")
    
    except Exception as e:
        logger.error(f"Error handling webhook {event_type}: {e}")
        # Return 200 anyway to prevent Stripe retries for handled events
    
    return jsonify({"received": True})


# ═══════════════════════════════════════════════════════════════════════════
# WEBHOOK HANDLERS
# ═══════════════════════════════════════════════════════════════════════════

def handle_checkout_completed(session):
    """Handle successful checkout for both authenticated users and guests."""
    metadata = session.get("metadata", {})
    user_id = metadata.get("user_id")
    is_guest = metadata.get("is_guest", "false") == "true"
    email = metadata.get("email")
    customer_id = session.get("customer")
    subscription_id = session.get("subscription")

    if is_guest:
        # Guest checkout - log for now, user can claim subscription when they create account
        logger.info(f"Guest checkout completed for {email}, customer_id={customer_id}")
        # Store the pending subscription info in Stripe customer metadata
        if customer_id:
            try:
                stripe.Customer.modify(
                    customer_id,
                    metadata={
                        "pending_subscription": "true",
                        "subscription_id": subscription_id,
                        "checkout_email": email,
                    }
                )
            except Exception as e:
                logger.error(f"Failed to update customer metadata: {e}")
        return

    if not user_id:
        logger.warning("Checkout completed without user_id in metadata (non-guest)")
        return

    logger.info(f"Checkout completed for user {user_id}")

    # Get subscription details
    if subscription_id:
        subscription = stripe.Subscription.retrieve(subscription_id)

        update_user_subscription(user_id, "pro", {
            "customer": customer_id,
            "subscription_id": subscription_id,
            "status": subscription.status,
            "current_period_end": subscription.current_period_end,
        })


def handle_subscription_updated(subscription):
    """Handle subscription updates (upgrades, downgrades, etc.)."""
    user_id = subscription.get("metadata", {}).get("user_id")
    
    if not user_id:
        # Try to get from customer
        customer_id = subscription.get("customer")
        if customer_id:
            customer = stripe.Customer.retrieve(customer_id)
            user_id = customer.get("metadata", {}).get("user_id")
    
    if not user_id:
        logger.warning("Subscription updated without user_id")
        return
    
    status = subscription.get("status")
    
    # Determine tier based on status
    if status in ["active", "trialing"]:
        tier = "pro"
    else:
        tier = "free"
    
    logger.info(f"Subscription updated for user {user_id}: status={status}, tier={tier}")
    
    update_user_subscription(user_id, tier, {
        "subscription_id": subscription.get("id"),
        "status": status,
        "current_period_end": subscription.get("current_period_end"),
        "cancel_at_period_end": subscription.get("cancel_at_period_end"),
    })


def handle_subscription_deleted(subscription):
    """Handle subscription cancellation."""
    user_id = subscription.get("metadata", {}).get("user_id")
    
    if not user_id:
        customer_id = subscription.get("customer")
        if customer_id:
            customer = stripe.Customer.retrieve(customer_id)
            user_id = customer.get("metadata", {}).get("user_id")
    
    if user_id:
        logger.info(f"Subscription deleted for user {user_id}")
        update_user_subscription(user_id, "free", {
            "subscription_id": None,
            "status": "cancelled",
        })


def handle_payment_failed(invoice):
    """Handle failed payment."""
    customer_id = invoice.get("customer")
    
    if customer_id:
        customer = stripe.Customer.retrieve(customer_id)
        user_id = customer.get("metadata", {}).get("user_id")
        
        if user_id:
            logger.warning(f"Payment failed for user {user_id}")
            # You might want to:
            # - Send email notification
            # - Update user status
            # - Show warning in app


def handle_payment_succeeded(invoice):
    """Handle successful payment (subscription renewal)."""
    customer_id = invoice.get("customer")
    subscription_id = invoice.get("subscription")

    if not customer_id or not subscription_id:
        return

    customer = stripe.Customer.retrieve(customer_id)
    user_id = customer.get("metadata", {}).get("user_id")

    if not user_id:
        logger.warning("Payment succeeded but no user_id found in customer metadata")
        return

    logger.info(f"Payment succeeded for user {user_id}, resetting usage")

    # Reset monthly usage counter in database
    if not supabase_admin:
        logger.error("Cannot reset usage: Supabase admin client not initialized")
        return

    try:
        # Get the subscription to find the next billing period end
        subscription = stripe.Subscription.retrieve(subscription_id)
        next_period_end = subscription.current_period_end

        # Reset usage counter and set new reset date
        update_data = {
            "analyses_used_this_period": 0,
            "analyses_reset_date": datetime.utcfromtimestamp(next_period_end).isoformat(),
            "updated_at": datetime.utcnow().isoformat(),
        }

        result = supabase_admin.table("profiles").update(update_data).eq("id", user_id).execute()

        if result.data:
            logger.info(f"Reset usage counter for user {user_id}, next reset: {update_data['analyses_reset_date']}")
        else:
            logger.warning(f"No profile found for user {user_id} - usage reset may have failed")

    except Exception as e:
        logger.error(f"Failed to reset usage for user {user_id}: {e}")


# ═══════════════════════════════════════════════════════════════════════════
# REGISTRATION
# ═══════════════════════════════════════════════════════════════════════════

def register_stripe_routes(app):
    """Register Stripe routes with Flask app."""
    app.register_blueprint(stripe_bp)
    logger.info("Stripe routes registered")


# ═══════════════════════════════════════════════════════════════════════════
# CLI HELPERS (for setup)
# ═══════════════════════════════════════════════════════════════════════════

def create_stripe_products():
    """
    Helper to create Stripe products and prices.
    Run once during initial setup.
    """
    # Create product
    product = stripe.Product.create(
        name="AI Resume Tailor Pro",
        description="Full access to AI Resume Tailor including resume rewriter, interview prep, and cover letter generator.",
    )
    
    print(f"Created product: {product.id}")
    
    # Create monthly price
    monthly_price = stripe.Price.create(
        product=product.id,
        unit_amount=1200,  # $12.00 in cents
        currency="usd",
        recurring={"interval": "month"},
    )
    
    print(f"Created monthly price: {monthly_price.id}")
    
    # Create annual price
    annual_price = stripe.Price.create(
        product=product.id,
        unit_amount=7900,  # $79.00 in cents
        currency="usd",
        recurring={"interval": "year"},
    )
    
    print(f"Created annual price: {annual_price.id}")
    
    print("\nAdd these to your .env file:")
    print(f"STRIPE_PRICE_MONTHLY={monthly_price.id}")
    print(f"STRIPE_PRICE_ANNUAL={annual_price.id}")
    
    return {
        "product_id": product.id,
        "monthly_price_id": monthly_price.id,
        "annual_price_id": annual_price.id,
    }


if __name__ == "__main__":
    # Run setup helper
    print("Stripe Integration Module")
    print("=" * 50)
    print("\nTo create Stripe products, run:")
    print("  python -c 'from stripe_integration import create_stripe_products; create_stripe_products()'")