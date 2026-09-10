---
description: Add current public IP to MongoDB Atlas access list and verify the connection
---

Run `./scripts/fix-mongo-ip.sh` and report the result.

If it fails because the Atlas CLI session is expired, tell me to run
`! atlas auth login`, wait, then run the script again. Do not edit any
application code — this is an Atlas access-list issue only.
