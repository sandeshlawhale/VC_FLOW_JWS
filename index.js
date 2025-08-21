// main.js
import fs from "fs";
import { generateDID } from "./src/did.js";
import { issueVC } from "./src/issuer.js";
import { verifyVC } from "./src/verifier.js";

const [, , cmd, ...args] = process.argv;

if (cmd === "gen-did") {
  const did = generateDID();
  fs.writeFileSync(
    args[0] || "./keys/issuer.json",
    JSON.stringify(did, null, 2)
  );
  console.log("DID generated:", did.did);
} else if (cmd === "issue") {
  const [issuerPath, subjectPath] = args;
  const subjectDID = JSON.parse(fs.readFileSync(subjectPath, "utf8")).did;
  const jwt = await issueVC(issuerPath, subjectDID);
  console.log(jwt);
} else if (cmd === "verify") {
  const [jwt] = args;
  console.log(JSON.stringify(verifyVC(jwt), null, 2));
} else {
  console.log(`
Usage:
  node main.js gen-did [outputFile]
  node main.js issue <issuer.json> <subject.json>
  node main.js verify <vc.jwt>
  `);
}
