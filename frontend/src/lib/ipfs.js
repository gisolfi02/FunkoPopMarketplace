import lighthouse from '@lighthouse-web3/sdk';

export async function uploadToLighthouse(file) {
  const apiKey = import.meta.env.VITE_LIGHTHOUSE_KEY;
  if (!apiKey) throw new Error("VITE_LIGHTHOUSE_KEY non trovato nel .env");

  const output = await lighthouse.upload([file], apiKey);

  return `ipfs://${output.data.Hash}`;
}

export function toHttpFromIpfs(s) {
  if (!s) return "";
  if (s.startsWith("ipfs://"))
    return `https://gateway.lighthouse.storage/ipfs/${s.slice(7)}`;
  if (/^[a-z0-9]{46,}$/i.test(s))
    return `https://gateway.lighthouse.storage/ipfs/${s}`;
  return s;
}
