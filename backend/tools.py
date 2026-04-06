from langchain_core.tools import tool

@tool
def execute_transfer_tool(amount: float, recipient: str) -> str:
    """Execute a money transfer."""
    return f"Transferred {amount} to {recipient}."

@tool
def query_transactions_tool(query: str) -> str:
    """Query recent transactions based on user parameters."""
    return "Dummy transaction results."

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
    """Search the web for financial news and investment advice."""
    return "Market is looking bullish on tech."

@tool
def draft_invoice_tool(client_name: str, email: str, amount: float) -> str:
    """Draft an invoice for review."""
    return f"Drafted invoice for {client_name} ({email}) for ${amount}."

@tool
def send_email_tool(to_email: str, content: str) -> str:
    """Send an email/invoice."""
    return f"Email sent successfully to {to_email}."
