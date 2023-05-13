import axios from "axios";
import fs from "fs";
import FormData from "form-data";

const pinataApiKey = "010c373b411c8676b904";
const pinataSecretApiKey =
  "186df95adbbf8574805e1967f6f800a039480d48445013b2eaf8d4f59b96f036";
const JWT =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySW5mb3JtYXRpb24iOnsiaWQiOiJmZmJjZWU0NS0zNGZkLTQ3ZGYtYjU5ZC1mYzQxOTQwMGMxMGQiLCJlbWFpbCI6Imp1c3Rpbi5hbGV4YW5kZXIuaGVpbnpAZ21haWwuY29tIiwiZW1haWxfdmVyaWZpZWQiOnRydWUsInBpbl9wb2xpY3kiOnsicmVnaW9ucyI6W3siaWQiOiJGUkExIiwiZGVzaXJlZFJlcGxpY2F0aW9uQ291bnQiOjF9XSwidmVyc2lvbiI6MX0sIm1mYV9lbmFibGVkIjpmYWxzZX0sImF1dGhlbnRpY2F0aW9uVHlwZSI6InNjb3BlZEtleSIsInNjb3BlZEtleUtleSI6IjAxMGMzNzNiNDExYzg2NzZiOTA0Iiwic2NvcGVkS2V5U2VjcmV0IjoiMTg2ZGY5NWFkYmJmODU3NDgwNWUxOTY3ZjZmODAwYTAzOTQ4MGQ0ODQ0NTAxM2IyZWFmOGQ0ZjU5Yjk2ZjAzNiIsImlhdCI6MTY0ODkxNjE3Nn0.lDRJp_a4ylZGPcvh3ccY5PE_FCUixpPFhY5PFo1BjmQ";

//works probably. Have to test it with file upload

export async function pinFileToIPFS(file: File) {
  const url = "https://api.pinata.cloud/pinning/pinFileToIPFS";

  let data = new FormData();
  data.append("file", file);

  const response = await axios.post(url, data, {
    maxContentLength: 100000000000000000,
    headers: {
      ...data.getHeaders(),
      pinata_api_key: "YOUR_PINATA_API_KEY",
      pinata_secret_api_key: "YOUR_PINATA_SECRET_API_KEY",
    },
  });
  console.log("hji");
  console.log(response.data);
  return response.data;
}
