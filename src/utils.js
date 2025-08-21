// src/utils.js
import crypto from "crypto";

export function b64uEncode(buf) {
  return Buffer.from(buf)
    .toString("base64")
    .replace(/=/g, "")
    .replace(/\+/g, "-")
    .replace(/\//g, "_");
}

export function b64uDecode(str) {
  const pad = str.length % 4 === 2 ? "==" : str.length % 4 === 3 ? "=" : "";
  return Buffer.from(str.replace(/-/g, "+").replace(/_/g, "/") + pad, "base64");
}

export function jsonB64u(obj) {
  return b64uEncode(Buffer.from(JSON.stringify(obj), "utf8"));
}

export function nowSec() {
  return Math.floor(Date.now() / 1000);
}

export function uuid() {
  return crypto.randomUUID();
}
