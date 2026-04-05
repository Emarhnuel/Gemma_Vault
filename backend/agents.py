"""
Agent configurations for GemmaVault AI Assistant.

This module defines the supervisor agent and sub-agents for financial
operations, analysis, and management using the Deep Agents framework.
"""

import os
from pathlib import Path
from langchain_ollama import ChatOllama
from langgraph.checkpoint.memory import MemorySaver
from langgraph.store.memory import InMemoryStore
from deepagents import create_deep_agent
from deepagents.backends import FilesystemBackend, CompositeBackend, StoreBackend
from langchain_core.messages import AIMessage
from langgraph.types import Command
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Configure LangSmith tracing (reads from env vars automatically)
if os.getenv("LANGSMITH_TRACING", "").lower() == "true":
    os.environ["LANGCHAIN_TRACING_V2"] = "true"
    if os.getenv("LANGSMITH_PROJECT"):
        os.environ["LANGCHAIN_PROJECT"] = os.getenv("LANGSMITH_PROJECT")
    print(f"[INFO] LangSmith tracing enabled for project: {os.getenv('LANGSMITH_PROJECT', 'default')}")

# Import tools and prompts
from tools import (
    execute_transfer_tool,
    query_transactions_tool,
    configure_budget_tool,
    verify_fraud_tool,
    update_account_tool,
    tavily_search_tool,
    draft_invoice_tool,
    send_email_tool,
)

from prompts import (
    SUPERVISOR_SYSTEM_PROMPT,
    PAYMENTS_SYSTEM_PROMPT,
    ANALYTICS_SYSTEM_PROMPT,
    BUDGETING_SYSTEM_PROMPT,
    SECURITY_SYSTEM_PROMPT,
    ACCOUNT_SYSTEM_PROMPT,
    INVESTMENT_SYSTEM_PROMPT,
    INVOICE_SYSTEM_PROMPT,
)

# =============================================================================
# MODEL CONFIGURATION
# =============================================================================

# Ollama - Main model for all agents
# Assuming a local LLM like llama3 or mistral is running
OLLAMA_MODEL_ID = os.getenv("OLLAMA_MODEL", "llama3")
OLLAMA_BASE_URL = os.getenv("OLLAMA_BASE_URL", "http://localhost:11434")

model_primary = ChatOllama(
    model=OLLAMA_MODEL_ID,
    base_url=OLLAMA_BASE_URL,
    temperature=0.0,
)

# =============================================================================
# BACKEND CONFIGURATION
# =============================================================================

checkpointer = MemorySaver()

# Agent data directory - all sub-agent files land here on actual disk
AGENT_DATA_DIR = Path("agent_data")
AGENT_DATA_DIR.mkdir(exist_ok=True)

# FilesystemBackend: writes real files to ./agent_data on disk.
_fs_backend = FilesystemBackend(root_dir=str(AGENT_DATA_DIR), virtual_mode=True)

def make_backend(runtime):
    return CompositeBackend(
        default=_fs_backend,
        routes={
            "/memories/": StoreBackend(runtime),
        }
    )

# =============================================================================
# AGENT FACTORY
# =============================================================================

# 1. Payments Agent
payments_agent = {
    "name": "payments_agent",
    "description": "Handles conversational money transfers and bill splitting.",
    "system_prompt": PAYMENTS_SYSTEM_PROMPT,
    "tools": [execute_transfer_tool],
    "model": model_primary
}

# 2. Analytics Agent
analytics_agent = {
    "name": "analytics_agent",
    "description": "Sifts through transaction history, categorizes data, and provides advisory insights.",
    "system_prompt": ANALYTICS_SYSTEM_PROMPT,
    "tools": [query_transactions_tool],
    "model": model_primary
}

# 3. Budgeting Agent
budgeting_agent = {
    "name": "budgeting_agent",
    "description": "Configures automated background rules and micro-investing targets.",
    "system_prompt": BUDGETING_SYSTEM_PROMPT,
    "tools": [configure_budget_tool],
    "model": model_primary
}

# 4. Security Agent
security_agent = {
    "name": "security_agent",
    "description": "Proactively detects anomalies, messages the user for verification, and executes card freezes/replacements.",
    "system_prompt": SECURITY_SYSTEM_PROMPT,
    "tools": [verify_fraud_tool],
    "model": model_primary,
    "interrupt_on": {"verify_fraud_tool": True} # HITL Approval required to freeze cards/cancel transactions
}

# 5. Account Agent
account_agent = {
    "name": "account_agent",
    "description": "Interfaces with backend administrative tools for address changes and limit updates.",
    "system_prompt": ACCOUNT_SYSTEM_PROMPT,
    "tools": [update_account_tool],
    "model": model_primary
}

# 6. Investment Advisory Agent
investment_advisory_agent = {
    "name": "investment_advisory_agent",
    "description": "Fetches real-time market data, reads financial news, and advises on stock/commodity trends (like oil).",
    "system_prompt": INVESTMENT_SYSTEM_PROMPT,
    "tools": [tavily_search_tool],
    "model": model_primary
}

# 7. Invoice Agent
invoice_agent = {
    "name": "invoice_agent",
    "description": "Drafts custom invoices based on user specifications and sends them out.",
    "system_prompt": INVOICE_SYSTEM_PROMPT,
    "tools": [draft_invoice_tool, send_email_tool],
    "model": model_primary,
    "interrupt_on": {"send_email_tool": True} # HITL so user can click 'Send' or 'Rewrite'
}

# =============================================================================
# CREATE MAIN SUPERVISOR
# =============================================================================

supervisor = create_deep_agent(
    model=model_primary,
    system_prompt=SUPERVISOR_SYSTEM_PROMPT,
    subagents=[
        payments_agent, 
        analytics_agent, 
        budgeting_agent, 
        security_agent, 
        account_agent,
        investment_advisory_agent,
        invoice_agent
    ],
    tools=[],
    checkpointer=checkpointer,
    backend=make_backend,
    store=InMemoryStore(),  # For local dev; swap for PostgresStore in production
)

print("[INFO] GemmaVault Supervisor agent created successfully")
