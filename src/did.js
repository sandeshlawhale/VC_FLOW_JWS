// src/did.js
import crypto from "crypto";
import { b64uEncode, b64uDecode } from "./utils.js";

/**
 * Generate a new Ed25519 DID and DID Document.
 */
export function generateDID() {
  const { publicKey, privateKey } = crypto.generateKeyPairSync("ed25519");
  const pubDer = publicKey.export({ format: "der", type: "spki" });
  const pubPem = publicKey.export({ format: "pem", type: "spki" });
  const privPem = privateKey.export({ format: "pem", type: "pkcs8" });

  const did = "did:mini:" + b64uEncode(pubDer);
  const vmId = `${did}#keys-1`;

  const didDocument = {
    "@context": ["https://www.w3.org/ns/did/v1"],
    id: did,
    verificationMethod: [
      {
        id: vmId,
        type: "Ed25519VerificationKey",
        controller: did,
        publicKeyFormat: "SPKI-der-b64u",
        publicKeyBase64Url: b64uEncode(pubDer),
      },
    ],
    assertionMethod: [vmId],
  };

  return { did, didDocument, privateKeyPem: privPem, publicKeyPem: pubPem };
}

/**
 * Resolve a did:mini DID → publicKey + DID Document
 */
export function resolveDID(did) {
  if (!did.startsWith("did:mini:")) {
    throw new Error("Unsupported DID method");
  }

  const b64 = did.slice("did:mini:".length);
  const pubDer = b64uDecode(b64);
  const publicKey = crypto.createPublicKey({
    key: pubDer,
    format: "der",
    type: "spki",
  });

  const vmId = `${did}#keys-1`;
  const didDocument = {
    "@context": ["https://www.w3.org/ns/did/v1"],
    id: did,
    verificationMethod: [
      {
        id: vmId,
        type: "Ed25519VerificationKey",
        controller: did,
        publicKeyFormat: "SPKI-der-b64u",
        publicKeyBase64Url: b64,
      },
    ],
    assertionMethod: [vmId],
  };

  return { didDocument, publicKey, verificationMethodId: vmId };
}
