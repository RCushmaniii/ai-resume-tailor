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

# Load environment variables
load_dotenv()

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
    "success_url": os.getenv("FRONTEND_URL", "http://localhost:3000") + "/checkout/success?session_id={CHECKOUT_SESSION_ID}",
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
    
    In production, implement this to update your Supabase users table.
    """
    # TODO: Implement database update
    # Example with Supabase:
    # supabase.table('users').update({
    #     'subscription_tier': tier,
    #     'stripe_customer_id': subscription_data.get('customer'),
    #     'subscription_status': subscription_data.get('status'),
    #     'subscription_period_end': subscription_data.get('current_period_end'),
    # }).eq('id', user_id).execute()
    
    logger.info(f"Updated subscription for user {user_id}: tier={tier}")
    pass


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
@require_auth
def create_checkout_session(user):
    """
    Create a Stripe Checkout session for embedded checkout.
    
    Request body:
    {
        "priceId": "price_xxx" or "monthly"/"annual",
        "billingPeriod": "monthly" or "annual" (alternative to priceId)
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
        
        # Get or create Stripe customer
        customer_id = get_or_create_stripe_customer(
            user_id=user.get("id"),
            email=user.get("email")
        )
        
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
            metadata={
                "user_id": user.get("id"),
            },
            subscription_data={
                "metadata": {
                    "user_id": user.get("id"),
                }
            },
            # Allow promotion codes
            allow_promotion_codes=True,
        )
        
        logger.info(f"Created checkout session {session.id} for user {user.get('id')}")
        
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
    """Handle successful checkout."""
    user_id = session.get("metadata", {}).get("user_id")
    customer_id = session.get("customer")
    subscription_id = session.get("subscription")
    
    if not user_id:
        logger.warning("Checkout completed without user_id in metadata")
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
    
    if customer_id and subscription_id:
        customer = stripe.Customer.retrieve(customer_id)
        user_id = customer.get("metadata", {}).get("user_id")
        
        if user_id:
            # Reset monthly usage counter
            logger.info(f"Payment succeeded for user {user_id}, resetting usage")
            # TODO: Reset analyses_used in database


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