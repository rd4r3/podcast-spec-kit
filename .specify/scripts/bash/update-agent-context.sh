#!/bin/bash

# Agent Context Update Script
# Updates agent-specific context files based on project changes

set -euo pipefail

# Configuration
CONTEXT_DIR=".specify/context"
AGENT="$1"  # First argument should be the agent name (e.g., "constitution")

# Function to update context for a specific agent
update_context() {
    local agent="$1"
    local context_file="$CONTEXT_DIR/${agent}-context.md"

    echo "Updating context for $agent agent..."

    # Create context directory if it doesn't exist
    mkdir -p "$CONTEXT_DIR"

    # Initialize context file if it doesn't exist
    if [ ! -f "$context_file" ]; then
        cat > "$context_file" <<EOF
# $agent Agent Context

## Last Updated
$(date +%Y-%m-%d)

## Current State
Initial context file created.

## Key Principles
(To be populated by agent)

## Technical Standards
(To be populated by agent)

## Recent Changes
(To be populated by agent)
EOF
        echo "Created new context file at $context_file"
    else
        # Update the last updated date
        local temp_file="${context_file}.tmp"
        local updated=false

        # Read the file line by line and update the date
        while IFS= read -r line; do
            if [[ "$line" == "#"*Agent*Context ]]; then
                echo "$line"
            elif [[ "$line" == "## Last Updated" ]]; then
                echo "$line"
                echo "$(date +%Y-%m-%d)"
                updated=true
            else
                echo "$line"
            fi
        done < "$context_file" > "$temp_file"

        mv "$temp_file" "$context_file"

        if $updated; then
            echo "Updated last modified date in $context_file"
        else
            echo "No updates needed for $context_file"
        fi
    fi

    # Add agent-specific updates based on the agent type
    case "$agent" in
        "constitution")
            echo "Adding constitution-specific context..."
            # Check if constitution exists and add relevant info
            if [ -f ".specify/memory/constitution.md" ]; then
                version=$(grep -E '^Version: [0-9]+\.[0-9]+\.[0-9]+' ".specify/memory/constitution.md" | cut -d' ' -f2 || echo "unknown")
                echo "" >> "$context_file"
                echo "## Constitution Status" >> "$context_file"
                echo "- Version: $version" >> "$context_file"
                echo "- Last validated: $(date +%Y-%m-%d)" >> "$context_file"
            fi
            ;;
        *)
            echo "No special handling for $agent agent"
            ;;
    esac

    echo "Context update for $agent complete"
}

# Main execution
main() {
    if [ -z "$1" ]; then
        echo "Error: No agent specified"
        echo "Usage: $0 <agent-name>"
        exit 1
    fi

    update_context "$1"
}

main "$@"