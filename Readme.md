# VC Flow with JWS

### 1. Generate DID for issuer

```node index.js gen-did keys/issuer.json```

> Make sure u have ```keys/issuer.json``` before running this command.

### 2. Generate DID for subject

```node index.js gen-did keys/subject.json```

> Make sure u have ```keys/subject.json``` before running this command.

### 3. Issue a VC JWT

```node index.js issue keys/issuer.json keys/subject.json > vc.jwt```

> This command creates the jws encoded signed vc in ```vc.jwt``` file in your root dir. Also If u want to see what's inside try JWT decode websites.

### 4. Verify the VC

```node index.js verify "$(cat vc.jwt)"```

> This will check if the JWS can be verified or not. This refers to the ```vc.jwt``` file that was created by the ```3rd step```.
