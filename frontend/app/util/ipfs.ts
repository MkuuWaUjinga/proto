import axios from "axios";
const pinataApiKey = "010c373b411c8676b904";
const pinataSecretApiKey =
  "186df95adbbf8574805e1967f6f800a039480d48445013b2eaf8d4f59b96f036";
const JWT =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySW5mb3JtYXRpb24iOnsiaWQiOiJmZmJjZWU0NS0zNGZkLTQ3ZGYtYjU5ZC1mYzQxOTQwMGMxMGQiLCJlbWFpbCI6Imp1c3Rpbi5hbGV4YW5kZXIuaGVpbnpAZ21haWwuY29tIiwiZW1haWxfdmVyaWZpZWQiOnRydWUsInBpbl9wb2xpY3kiOnsicmVnaW9ucyI6W3siaWQiOiJGUkExIiwiZGVzaXJlZFJlcGxpY2F0aW9uQ291bnQiOjF9XSwidmVyc2lvbiI6MX0sIm1mYV9lbmFibGVkIjpmYWxzZX0sImF1dGhlbnRpY2F0aW9uVHlwZSI6InNjb3BlZEtleSIsInNjb3BlZEtleUtleSI6IjAxMGMzNzNiNDExYzg2NzZiOTA0Iiwic2NvcGVkS2V5U2VjcmV0IjoiMTg2ZGY5NWFkYmJmODU3NDgwNWUxOTY3ZjZmODAwYTAzOTQ4MGQ0ODQ0NTAxM2IyZWFmOGQ0ZjU5Yjk2ZjAzNiIsImlhdCI6MTY0ODkxNjE3Nn0.lDRJp_a4ylZGPcvh3ccY5PE_FCUixpPFhY5PFo1BjmQ";

export async function pinFileToIPFS(filePath: string) {
  try {
    // Step 1: Upload file to Pinata
    const uploadResponse = await axios.post(
      "https://api.pinata.cloud/pinning/pinFileToIPFS",
      // FormData with file data
      {
        file: filePath,
      },
      {
        headers: {
          "Content-Type": `multipart/form-data; boundary=${formData._boundary}`,
          pinata_api_key: pinataApiKey,
          pinata_secret_api_key: pinataSecretApiKey,
        },
      }
    );

    // Step 2: Get pinning status
    const pinataPinId = uploadResponse.data.IpfsHash;
    let getStatusResponse = await axios.get(
      `https://api.pinata.cloud/pinning/pinJobs/${pinataPinId}`,
      {
        headers: {
          pinata_api_key: pinataApiKey,
          pinata_secret_api_key: pinataSecretApiKey,
        },
      }
    );

    // Step 3: Wait for pinning to complete
    while (getStatusResponse.data.status !== "pinned") {
      await new Promise((resolve) => setTimeout(resolve, 1000)); // Wait for 1 second before checking status again
      getStatusResponse = await axios.get(
        `https://api.pinata.cloud/pinning/pinJobs/${pinataPinId}`,
        {
          headers: {
            pinata_api_key: pinataApiKey,
            pinata_secret_api_key: pinataSecretApiKey,
          },
        }
      );
    }

    // Step 4: Retrieve IPFS CID
    const cid = getStatusResponse.data.ipfs_pin_hash;

    console.log(`File pinned successfully. CID: ${cid}`);
  } catch (error) {
    console.error("An error occurred while pinning the file:", error);
  }
}
