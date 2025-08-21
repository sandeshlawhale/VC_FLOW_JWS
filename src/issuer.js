// src/issuer.js
import fs from "fs";
import { resolveDID } from "./did.js";
import { signJWS } from "./signer.js";
import { nowSec, uuid } from "./utils.js";

export function issueVC(issuerPath, subjectDID, claims = {}) {
  const issuer = JSON.parse(fs.readFileSync(issuerPath, "utf8"));
  const { verificationMethodId } = resolveDID(issuer.did);

  const iat = nowSec();
  const payload = {
    iss: issuer.did,
    sub: subjectDID,
    iat,
    nbf: iat,
    jti: `urn:uuid:${uuid()}`,
    vc: {
      "@context": ["https://www.w3.org/2018/credentials/v1"],
      type: ["VerifiableCredential"],
      issuer: issuer.did,
      issuanceDate: new Date(iat * 1000).toISOString(),
      credentialSubject: { id: subjectDID, ...claims },
    },
  };

  const header = {
    alg: "EdDSA",
    typ: "JWT",
    kid: verificationMethodId,
  };

  return signJWS(issuer.privateKeyPem, header, payload);
}
