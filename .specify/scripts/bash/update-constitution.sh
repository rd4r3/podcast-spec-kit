#!/bin/bash

# Constitution Update Script
# Handles creation, updating, and validation of project constitution

set -euo pipefail

# Configuration
TEMPLATE_PATH=".specify/templates/constitution-template.md"
CONSTITUTION_PATH=".specify/memory/constitution.md"
AGENT_CONTEXT_SCRIPT=".specify/scripts/bash/update-agent-context.sh"

# Initialize constitution directory if it doesn't exist
mkdir -p "$(dirname "$CONSTITUTION_PATH")"

# Function to check if constitution exists
constitution_exists() {
    [ -f "$CONSTITUTION_PATH" ]
}

# Function to initialize constitution from template
initialize_constitution() {
    echo "Initializing constitution from template..."
    if [ ! -f "$TEMPLATE_PATH" ]; then
        echo "Error: Constitution template not found at $TEMPLATE_PATH"
        exit 1
    fi
    cp "$TEMPLATE_PATH" "$CONSTITUTION_PATH"
    echo "Constitution initialized at $CONSTITUTION_PATH"
}

# Function to validate constitution
validate_constitution() {
    local content="$1"
    local errors=0

    # Check for remaining placeholders
    if grep -q '\[[A-Z_]\+\]' <<< "$content"; then
        echo "Validation Error: Constitution still contains unfilled placeholders"
        grep -o '\[[A-Z_]\+\]' <<< "$content" | sort | uniq
        errors=$((errors + 1))
    fi

    # Check version format
    if ! grep -qE '^Version: [0-9]+\.[0-9]+\.[0-9]+' <<< "$content"; then
        echo "Validation Error: Version format should be X.Y.Z"
        errors=$((errors + 1))
    fi

    # Check date formats
    if ! grep -qE 'Ratified: [0-9]{4}-[0-9]{2}-[0-9]{2}' <<< "$content"; then
        echo "Validation Error: Ratified date should be in YYYY-MM-DD format"
        errors=$((errors + 1))
    fi

    if ! grep -qE 'Last Amended: [0-9]{4}-[0-9]{2}-[0-9]{2}' <<< "$content"; then
        echo "Validation Error: Last Amended date should be in YYYY-MM-DD format"
        errors=$((errors + 1))
    fi

    return $errors
}

# Function to update agent context
update_agent_context() {
    if [ -f "$AGENT_CONTEXT_SCRIPT" ]; then
        echo "Updating agent context..."
        bash "$AGENT_CONTEXT_SCRIPT" constitution
    else
        echo "Warning: Agent context script not found at $AGENT_CONTEXT_SCRIPT"
    fi
}

# Function to generate sync impact report
generate_sync_report() {
    local old_version="$1"
    local new_version="$2"
    local changes="$3"

    cat <<EOF
<!--
Sync Impact Report
Version: $old_version → $new_version
Date: $(date +%Y-%m-%d)
Changes:
$changes
-->
EOF
}

# Main execution
main() {
    # Initialize if needed
    if ! constitution_exists; then
        initialize_constitution
    fi

    # Read current constitution
    current_content=$(cat "$CONSTITUTION_PATH")

    # Extract current version
    current_version=$(grep -E '^Version: [0-9]+\.[0-9]+\.[0-9]+' <<< "$current_content" | cut -d' ' -f2)
    old_version=${current_version:-"0.0.0"}

    # Process updates (this would be replaced by actual update logic)
    # For now we'll just validate the existing content
    if ! validate_constitution "$current_content"; then
        echo "Constitution validation failed. Please fix the issues above."
        exit 1
    fi

    # Generate sync report
    sync_report=$(generate_sync_report "$old_version" "$old_version" "Initial validation passed")

    # Update constitution with sync report
    echo "$sync_report" > "$CONSTITUTION_PATH.tmp"
    echo "$current_content" >> "$CONSTITUTION_PATH.tmp"
    mv "$CONSTITUTION_PATH.tmp" "$CONSTITUTION_PATH"

    # Update agent context
    update_agent_context

    echo "Constitution processing complete"
}

main "$@"