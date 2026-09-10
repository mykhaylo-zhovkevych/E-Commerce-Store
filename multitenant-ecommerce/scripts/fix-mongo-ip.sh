#!/usr/bin/env bash
# Add the machine's current public IP to the MongoDB Atlas access list and
# verify the DB connection. Re-run whenever your ISP rotates your IP.
#
#   ./scripts/fix-mongo-ip.sh
#
# Requires: atlas CLI (logged in: `atlas auth login`), node, a DATABASE_URL in .env
set -euo pipefail
cd "$(dirname "$0")/.."

IP="$(curl -fsS https://api.ipify.org)"
echo "Current public IP: $IP"

# Use ATLAS_PROJECT_ID from env if set, else take the first project on the account.
PROJECT_ID="${ATLAS_PROJECT_ID:-$(atlas projects list -o json | node -pe 'JSON.parse(require("fs").readFileSync(0)).results[0].id')}"
echo "Atlas project: $PROJECT_ID"

if atlas accessList list --projectId "$PROJECT_ID" -o json | grep -q "\"$IP\""; then
  echo "IP already in the access list — nothing to add."
else
  atlas accessList create "$IP/32" \
    --projectId "$PROJECT_ID" \
    --comment "auto: $(hostname) $(date +%F)" \
    -o json >/dev/null
  echo "Added $IP/32 to the access list."
fi

echo "Testing connection…"
for i in 1 2 3 4 5; do
  if node -e '
    const { MongoClient } = require("mongodb");
    require("dotenv").config();
    const c = new MongoClient(process.env.DATABASE_URL, { serverSelectionTimeoutMS: 8000 });
    c.connect().then(() => c.db().command({ ping: 1 }))
      .then(() => { console.log("CONNECT OK"); process.exit(0); })
      .catch((e) => { console.error("FAIL:", e.message); process.exit(1); });
  '; then
    exit 0
  fi
  echo "  not ready, retrying in 15s ($i/5)…"
  sleep 15
done
echo "Still failing after retries — check Atlas console." >&2
exit 1
