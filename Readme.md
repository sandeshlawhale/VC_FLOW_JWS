# 1. Generate DID for issuer

node index.js gen-did keys/issuer.json

# 2. Generate DID for subject

node index.js gen-did keys/subject.json

# 3. Issue a VC JWT

node index.js issue keys/issuer.json keys/subject.json > vc.jwt

# 4. Verify the VC

node index.js verify "$(cat vc.jwt)"
