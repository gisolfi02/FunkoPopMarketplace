import lighthouse from "@lighthouse-web3/sdk";

export async function uploadToLighthouse(file) {
  const apiKey = import.meta.env.VITE_LIGHTHOUSE_KEY;
  if (!apiKey) throw new Error("VITE_LIGHTHOUSE_KEY non trovato nel .env");

  const output = await lighthouse.upload([file], apiKey);

  return `ipfs://${output.data.Hash}`;
}

export async function uploadMetadataToIPFS(metadata) {
  const apiKey = import.meta.env.VITE_LIGHTHOUSE_KEY;
  if (!apiKey) throw new Error("VITE_LIGHTHOUSE_KEY non trovato nel .env");

  // Converti metadata in JSON e crea un Blob
  const jsonString = JSON.stringify(metadata);
  const blob = new Blob([jsonString], { type: "application/json" });

  // Converti Blob in File
  const file = new File([blob], "metadata.json", { type: "application/json" });

  const output = await lighthouse.upload([file], apiKey);

  return `ipfs://${output.data.Hash}`;
}

export async function fetchMetadataFromIPFS(ipfsHash) {
  if (!ipfsHash) return null;

  const hash = ipfsHash.startsWith("ipfs://") ? ipfsHash.slice(7) : ipfsHash;
  const url = `https://gateway.lighthouse.storage/ipfs/${hash}`;

  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    return await response.json();
  } catch (e) {
    console.error("Errore nel fetch dei metadati da IPFS:", e);
    return null;
  }
}

export function toHttpFromIpfs(s) {
  if (!s) return "";
  if (s.startsWith("ipfs://"))
    return `https://gateway.lighthouse.storage/ipfs/${s.slice(7)}`;
  if (/^[a-z0-9]{46,}$/i.test(s))
    return `https://gateway.lighthouse.storage/ipfs/${s}`;
  return s;
}
