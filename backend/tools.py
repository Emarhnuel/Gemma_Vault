import os
import uuid
from datetime import datetime, timezone
from langchain_core.tools import tool
from supabase import create_client, Client
from dotenv import load_dotenv
from langchain_tavily import TavilySearch

load_dotenv()

# Initialize Supabase client
supabase: Client = create_client(
    os.environ["SUPABASE_URL"],
    os.environ["SUPABASE_ANON_KEY"]
)

DEMO_USER_ID = "usr_001"


@tool
def execute_transfer_tool(amount: float, recipient: str) -> str:
    """Execute a money transfer to a beneficiary. Returns an error if the recipient is not found or balance is insufficient."""

    # 1. Look up beneficiary (case-insensitive)
    ben_result = (
        supabase.table("beneficiaries")
        .select("*")
        .eq("user_id", DEMO_USER_ID)
        .ilike("name", recipient)
        .execute()
    )

    if not ben_result.data:
        return f"RECIPIENT_NOT_FOUND: '{recipient}' is not in your beneficiary list. Please provide their bank details (name, account number, sort code, bank name) to proceed."

    beneficiary = ben_result.data[0]

    # 2. Check balance
    user_result = (
        supabase.table("users")
        .select("balance")
        .eq("id", DEMO_USER_ID)
        .execute()
    )
    current_balance = float(user_result.data[0]["balance"])

    if current_balance < amount:
        return f"INSUFFICIENT_FUNDS: Your balance is £{current_balance:,.2f}. Cannot transfer £{amount:,.2f}."

    # 3. Debit account
    new_balance = current_balance - amount
    supabase.table("users").update({"balance": new_balance}).eq("id", DEMO_USER_ID).execute()

    # 4. Record transaction
    txn_id = f"txn_{uuid.uuid4().hex[:8]}"
    supabase.table("transactions").insert({
        "id": txn_id,
        "user_id": DEMO_USER_ID,
        "type": "debit",
        "amount": amount,
        "currency": "GBP",
        "description": f"Transfer to {beneficiary['name']}",
        "category": "transfer",
        "date": datetime.now(timezone.utc).isoformat(),
        "recipient": beneficiary["name"],
        "status": "completed",
        "is_demo": False,
    }).execute()

    return f"SUCCESS: £{amount:,.2f} transferred to {beneficiary['name']} ({beneficiary['bank']}). New balance: £{new_balance:,.2f}. Transaction ID: {txn_id}"

@tool
def query_transactions_tool(
    category: str = "",
    date_from: str = "",
    date_to: str = "",
    transaction_type: str = "",
    recipient: str = "",
    limit: int = 50,
) -> str:
    """Query transactions from the database. All filters are optional.
    
    Args:
        category: Filter by category (e.g. 'groceries', 'bills', 'transport', 'dining', 'entertainment', 'betting', 'transfer', 'income', 'shopping').
        date_from: Start date in ISO format (e.g. '2026-03-01').
        date_to: End date in ISO format (e.g. '2026-04-01').
        transaction_type: Filter by 'credit' or 'debit'.
        recipient: Filter by recipient name (partial match).
        limit: Max number of results to return (default 50).
    """

    query = (
        supabase.table("transactions")
        .select("id, type, amount, currency, description, category, date, recipient, status")
        .eq("user_id", DEMO_USER_ID)
        .order("date", desc=True)
        .limit(limit)
    )

    if category:
        query = query.ilike("category", category)
    if date_from:
        query = query.gte("date", date_from)
    if date_to:
        query = query.lte("date", date_to)
    if transaction_type:
        query = query.eq("type", transaction_type)
    if recipient:
        query = query.ilike("recipient", f"%{recipient}%")

    result = query.execute()

    if not result.data:
        return "NO_TRANSACTIONS_FOUND: No transactions match your query."

    # Format results
    total = sum(float(t["amount"]) for t in result.data)
    lines = []
    for t in result.data:
        sign = "-" if t["type"] == "debit" else "+"
        lines.append(
            f"{t['date'][:10]} | {sign}£{float(t['amount']):,.2f} | {t['description']} | {t['category']}"
        )

    summary = "\n".join(lines)
    return f"Found {len(result.data)} transaction(s). Total: £{total:,.2f}\n\n{summary}"

@tool
def configure_budget_tool(
    category: str,
    rule_description: str,
    destination: str,
    source_account: str = "",
    trigger_amount: float = 0,
    save_amount: float = 0,
    save_percentage: float = 0,
) -> str:
    """Set up an automated budgeting or savings rule.

    Args:
        category: The type of rule (e.g. 'savings', 'micro-investing', 'round-up').
        rule_description: Human-readable description of the rule (e.g. 'Save £500 every time £5,000+ arrives from Monzo Bank').
        destination: Where the savings go (e.g. 'vacation fund', 'emergency savings').
        source_account: The income source or bank the trigger is based on (e.g. 'Monzo Bank').
        trigger_amount: The incoming amount that activates the rule (e.g. 5000).
        save_amount: Fixed amount to save per trigger (e.g. 500). Use this OR save_percentage.
        save_percentage: Percentage to save per trigger (e.g. 10). Use this OR save_amount.
    """

    rule_id = f"rule_{uuid.uuid4().hex[:8]}"

    row = {
        "id": rule_id,
        "user_id": DEMO_USER_ID,
        "category": category,
        "rule_description": rule_description,
        "destination": destination,
        "is_active": True,
        "is_demo": False,
    }

    if source_account:
        row["source_account"] = source_account
    if trigger_amount > 0:
        row["trigger_amount"] = trigger_amount
    if save_amount > 0:
        row["save_amount"] = save_amount
    if save_percentage > 0:
        row["save_percentage"] = save_percentage

    supabase.table("budget_rules").insert(row).execute()

    return f"RULE_CREATED: '{rule_description}' is now active. Savings will go to '{destination}'. Rule ID: {rule_id}"


@tool
def update_account_tool(field: str, value: str) -> str:
    """Update a bank account or card detail.

    Args:
        field: The field to update. Allowed user fields: 'first_name', 'last_name', 'email', 'phone'. Allowed card fields: 'daily_limit', 'is_frozen'.
        value: The new value for the field.
    """

    USER_FIELDS = {"first_name", "last_name", "email", "phone"}
    CARD_FIELDS = {"daily_limit", "is_frozen"}

    if field in USER_FIELDS:
        supabase.table("users").update({field: value}).eq("id", DEMO_USER_ID).execute()
        return f"SUCCESS: Your '{field}' has been updated to '{value}'."

    if field in CARD_FIELDS:
        # Convert types for card fields
        if field == "daily_limit":
            parsed_value = float(value)
            supabase.table("cards").update({field: parsed_value}).eq("user_id", DEMO_USER_ID).execute()
            return f"SUCCESS: Your daily spending limit has been updated to £{parsed_value:,.2f}."
        if field == "is_frozen":
            parsed_value = value.lower() in ("true", "yes", "1", "freeze")
            supabase.table("cards").update({field: parsed_value}).eq("user_id", DEMO_USER_ID).execute()
            status = "frozen" if parsed_value else "unfrozen"
            return f"SUCCESS: Your card has been {status}."

    allowed = ", ".join(sorted(USER_FIELDS | CARD_FIELDS))
    return f"INVALID_FIELD: '{field}' is not a valid field. Allowed fields: {allowed}"


tavily_search_tool = TavilySearch(
    max_results=5,
    topic="finance",
    search_depth="advanced",
)

@tool
def draft_invoice_tool(
    client_name: str,
    client_email: str,
    amount: float,
    description: str = "Services rendered",
) -> str:
    """Draft a professional invoice for review before sending.

    Args:
        client_name: The client's full name or company name.
        client_email: The client's email address.
        amount: The total invoice amount in GBP.
        description: What the invoice is for (e.g. 'Logo Design', 'Web Development').
    """

    # Fetch sender details
    user = supabase.table("users").select("*").eq("id", DEMO_USER_ID).execute().data[0]

    invoice_num = f"INV-{uuid.uuid4().hex[:6].upper()}"
    invoice_date = datetime.now(timezone.utc).strftime("%d %B %Y")

    invoice = f"""
============================================
             INVOICE
============================================
Invoice No:  {invoice_num}
Date:        {invoice_date}

FROM:
  {user['first_name']} {user['last_name']}
  {user['email']}
  Account: {user['account_number']}
  Sort Code: {user['sort_code']}

TO:
  {client_name}
  {client_email}

--------------------------------------------
DESCRIPTION                          AMOUNT
--------------------------------------------
{description:<36} £{amount:,.2f}
--------------------------------------------
TOTAL DUE:                           £{amount:,.2f}
--------------------------------------------

Payment Method: Bank Transfer
Account Number: {user['account_number']}
Sort Code: {user['sort_code']}

Thank you for your business.
============================================
"""

    return f"INVOICE_DRAFTED: Ready for review.\nClient: {client_name} ({client_email})\nAmount: £{amount:,.2f}\n\n{invoice.strip()}"
@tool
def send_email_tool(to_email: str, subject: str, content: str) -> str:
    """Send an email (e.g. an invoice) via Gmail SMTP.

    Args:
        to_email: The recipient's email address.
        subject: The email subject line.
        content: The full email body content.
    """
    import smtplib
    from email.mime.text import MIMEText
    from email.mime.multipart import MIMEMultipart

    sender_email = os.environ.get("EMAIL_ADDRESS", "")
    sender_password = os.environ.get("EMAIL_APP_PASSWORD", "")

    if not sender_email or not sender_password:
        return "EMAIL_NOT_CONFIGURED: Set EMAIL_ADDRESS and EMAIL_APP_PASSWORD in your .env file to enable sending."

    msg = MIMEMultipart()
    msg["From"] = sender_email
    msg["To"] = to_email
    msg["Subject"] = subject
    msg.attach(MIMEText(content, "plain"))

    try:
        with smtplib.SMTP("smtp.gmail.com", 587) as server:
            server.starttls()
            server.login(sender_email, sender_password)
            server.send_message(msg)
        return f"SUCCESS: Email sent to {to_email} with subject '{subject}'."
    except smtplib.SMTPAuthenticationError:
        return "EMAIL_AUTH_FAILED: Check your EMAIL_ADDRESS and EMAIL_APP_PASSWORD. Make sure you're using a Google App Password, not your regular password."
    except Exception as e:
        return f"EMAIL_FAILED: {str(e)}"
