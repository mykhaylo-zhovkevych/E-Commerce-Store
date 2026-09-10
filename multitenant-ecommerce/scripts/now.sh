#!/usr/bin/env bash
# Throwaway test script — prints the current date/time a few ways.
#   ./scripts/now.sh
set -euo pipefail

echo "Local time : $(date '+%Y-%m-%d %H:%M:%S %Z')"
echo "UTC time   : $(date -u '+%Y-%m-%d %H:%M:%S UTC')"
echo "Unix epoch : $(date +%s)"
echo "ISO 8601   : $(date -Iseconds)"
echo "Weekday    : $(date '+%A')"
