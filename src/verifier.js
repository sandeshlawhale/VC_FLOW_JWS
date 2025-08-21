// src/verifier.js
import { resolveDID } from "./did.js";
import { verifyJWS } from "./signer.js";
import { nowSec } from "./utils.js";

export function verifyVC(jwt) {
  const { header, payload, ok } = verifyJWS(
    jwt,
    resolveDID(headerFromJWT(jwt)).publicKey
  );

  if (!ok) return { verified: false, reason: "Invalid signature" };
  if (payload.nbf && payload.nbf > nowSec())
    return { verified: false, reason: "VC not yet valid" };

  return { verified: true, payload };
}

function headerFromJWT(jwt) {
  const [headerB64] = jwt.split(".");
  return JSON.parse(
    Buffer.from(headerB64, "base64url").toString("utf8")
  ).kid.split("#")[0];
}
