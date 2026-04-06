import os
import uuid
from datetime import datetime, timezone
from langchain_core.tools import tool
from supabase import create_client, Client
from dotenv import load_dotenv

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
def configure_budget_tool(category: str, limit: float) -> str:
    """Set up an automated budgeting or micro-investing rule."""
    return f"Budget rule set for {category} at {limit}."


@tool
def update_account_tool(field: str, value: str) -> str:
    """Update bank account administrative details."""
    return f"Account {field} updated to {value}."

@tool
def tavily_search_tool(query: str) -> str:
    """Search the web for financial news and investment a
    dvice."""
    return "Market is looking bullish on tech."

@tool
def draft_invoice_tool(client_name: str, email: str, amount: float) -> str:
    """Draft an invoice for review."""
    return f"Drafted invoice for {client_name} ({email}) for ${amount}."

@tool
def send_email_tool(to_email: str, content: str) -> str:
    """Send an email/invoice."""
    return f"Email sent successfully to {to_email}."
