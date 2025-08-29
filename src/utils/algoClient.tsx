import algosdk from "algosdk"

export const algodClient = new algosdk.Algodv2(
  "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa", // default token
  "http://127.0.0.1:4001", // LocalNet Algod endpoint
  "" // no port needed
)
