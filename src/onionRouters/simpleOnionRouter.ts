import bodyParser from "body-parser";
import express from "express";
import { generateRsaKeyPair, exportPubKey, exportPrvKey, exportSymKey } from "../crypto";
import { BASE_ONION_ROUTER_PORT, REGISTRY_PORT } from "../config";
import { log } from "console";

export async function simpleOnionRouter(nodeId: number) {
  const onionRouter = express();
  onionRouter.use(express.json());
  onionRouter.use(bodyParser.json());

  const keyPair = await generateRsaKeyPair();
  

  // Register the node with the registry
  const registryUrl = `http://localhost:${REGISTRY_PORT}/registerNode`;
  const response = await fetch(registryUrl, {
    method: "POST",
    body: JSON.stringify({
      nodeId,
      pubKey: await exportPubKey(keyPair.publicKey),
    }),
    headers: {
      "Content-Type": "application/json",
    },
  });

  // GET /status
  onionRouter.get("/status", (req, res) => {
    res.send("live");
  });

  // GET /getLastReceivedEncryptedMessage
  onionRouter.get("/getLastReceivedEncryptedMessage", (req, res) => {
    res.json({ result: null });
  });

  // GET /getLastReceivedDecryptedMessage
  onionRouter.get("/getLastReceivedDecryptedMessage", (req, res) => {
    res.json({ result: null });
  });

  // GET /getLastMessageDestination
  onionRouter.get("/getLastMessageDestination", (req, res) => {
    res.json({ result: null });
  });

  // GET /getPrivateKey
  onionRouter.get("/getPrivateKey", (req, res) => {
    // Returns the private key in base64 format
    exportPrvKey(keyPair.privateKey).then((result) => {
      res.json({ result });
    });
  });



  const server = onionRouter.listen(BASE_ONION_ROUTER_PORT + nodeId, () => {
    console.log(
      `Onion router ${nodeId} is listening on port ${
        BASE_ONION_ROUTER_PORT + nodeId
      }`
    );
  });

  return server;
}
