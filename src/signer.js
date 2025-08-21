// src/signer.js
import crypto from "crypto";
import { jsonB64u, b64uEncode, b64uDecode } from "./utils.js";

export function signJWS(privateKeyPem, header, payload) {
  const headerB64 = jsonB64u(header);
  const payloadB64 = jsonB64u(payload);
  const signingInput = `${headerB64}.${payloadB64}`;

  const privateKey = crypto.createPrivateKey(privateKeyPem);
  const signature = crypto.sign(null, Buffer.from(signingInput), privateKey);

  return `${signingInput}.${b64uEncode(signature)}`;
}

export function verifyJWS(jws, publicKey) {
  const parts = jws.split(".");
  if (parts.length !== 3) throw new Error("Invalid JWS");

  const [headerB64, payloadB64, sigB64] = parts;
  const signingInput = `${headerB64}.${payloadB64}`;
  const signature = b64uDecode(sigB64);

  const ok = crypto.verify(
    null,
    Buffer.from(signingInput),
    publicKey,
    signature
  );

  return {
    ok,
    header: JSON.parse(b64uDecode(headerB64).toString("utf8")),
    payload: JSON.parse(b64uDecode(payloadB64).toString("utf8")),
  };
}
