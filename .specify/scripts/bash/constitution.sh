#!/bin/bash

# Constitution Command Handler
# Processes the /speckit.constitution command

set -euo pipefail

# Configuration
TEMPLATE_PATH=".specify/templates/constitution-template.md"
CONSTITUTION_PATH=".specify/memory/constitution.md"
UPDATE_SCRIPT=".specify/scripts/bash/update-constitution.sh"
CHECK_SCRIPT=".specify/scripts/bash/check-prerequisites.sh"

# Function to display help
show_help() {
    cat <<EOF
Constitution Command Handler

Usage: $0 [OPTIONS] [ARGUMENTS]

Options:
  --help, -h      Show this help message
  --init, -i      Initialize constitution from template
  --validate, -v  Validate current constitution
  --update, -u     Update constitution with new principles
  --version, -V    Show current constitution version

Arguments:
  Any text provided will be treated as new principles or updates to add

Examples:
  $0 --init
  $0 --update "New principle about security"
  $0 "Add principle about code quality"
EOF
}

# Function to initialize constitution
initialize() {
    echo "Initializing constitution from template..."
    if [ ! -f "$TEMPLATE_PATH" ]; then
        echo "Error: Constitution template not found at $TEMPLATE_PATH"
        exit 1
    fi

    mkdir -p "$(dirname "$CONSTITUTION_PATH")"
    cp "$TEMPLATE_PATH" "$CONSTITUTION_PATH"
    echo "Constitution initialized at $CONSTITUTION_PATH"

    # Run update script to validate
    bash "$UPDATE_SCRIPT"
}

# Function to validate constitution
validate() {
    if [ ! -f "$CONSTITUTION_PATH" ]; then
        echo "Error: Constitution not found at $CONSTITUTION_PATH"
        echo "Run with --init to create a new constitution"
        exit 1
    fi

    echo "Validating constitution..."
    bash "$UPDATE_SCRIPT" --validate
}

# Function to update constitution
update() {
    local arguments="$1"

    if [ -z "$arguments" ]; then
        echo "Error: No update content provided"
        show_help
        exit 1
    fi

    if [ ! -f "$CONSTITUTION_PATH" ]; then
        echo "Constitution not found. Initializing new constitution..."
        initialize
    fi

    echo "Updating constitution with: $arguments"
    # In a real implementation, this would parse the arguments and update the constitution
    # For now we'll just run the update script which validates the existing content
    bash "$UPDATE_SCRIPT"

    echo "Update process complete. Constitution is ready for manual editing."
    echo "Edit $CONSTITUTION_PATH to add your principles, then run validation."
}

# Function to show version
show_version() {
    if [ ! -f "$CONSTITUTION_PATH" ]; then
        echo "No constitution found"
        return
    fi

    version=$(grep -E '^Version: [0-9]+\.[0-9]+\.[0-9]+' "$CONSTITUTION_PATH" | cut -d' ' -f2)
    if [ -z "$version" ]; then
        echo "Version not found in constitution"
    else
        echo "Current constitution version: $version"
    fi
}

# Main execution
main() {
    # Check prerequisites
    if [ ! -f "$CHECK_SCRIPT" ]; then
        echo "Error: Prerequisite check script not found at $CHECK_SCRIPT"
        exit 1
    fi

    # Parse arguments
    init=false
    validate=false
    update_mode=false
    show_version=false
    arguments=""

    while [[ $# -gt 0 ]]; do
        case "$1" in
            --help|-h)
                show_help
                exit 0
                ;;
            --init|-i)
                init=true
                shift
                ;;
            --validate|-v)
                validate=true
                shift
                ;;
            --update|-u)
                update_mode=true
                shift
                ;;
            --version|-V)
                show_version=true
                shift
                ;;
            *)
                arguments="$arguments $1"
                shift
                ;;
        esac
    done

    # Execute based on flags
    if $show_version; then
        show_version
    elif $init; then
        initialize
    elif $validate; then
        validate
    elif $update_mode || [ -n "$arguments" ]; then
        update "$arguments"
    else
        show_help
    fi
}

main "$@"