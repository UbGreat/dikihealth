// src/utils/wallet.ts
import algosdk from "algosdk"
import { getAuth } from "firebase/auth"
import { doc, getDoc, getFirestore, setDoc } from "firebase/firestore"

// 🔹 Algorand Client (you can change to TestNet or MainNet)
const algodClient = new algosdk.Algodv2(
  "",
  "https://testnet-api.algonode.cloud", // ✅ TestNet endpoint
  ""
)

interface Wallet {
  addr: string
  sk: Uint8Array
}

// 🔹 Create a new Algorand account
export const createAccount = async () => {
  const account = algosdk.generateAccount()
  const mnemonic = algosdk.secretKeyToMnemonic(account.sk)

  const auth = getAuth()
  const user = auth.currentUser
  if (!user) throw new Error("No user logged in")

  const db = getFirestore()
  await setDoc(
    doc(db, "wallets", user.uid),
    {
      address: account.addr,
      mnemonic,
    },
    { merge: true }
  )

  return { addr: account.addr, mnemonic }
}

// 🔹 Fetch saved wallet (creates one if missing)
export const getWallet = async (): Promise<Wallet | null> => {
  const auth = getAuth()
  const user = auth.currentUser
  if (!user) return null

  const db = getFirestore()
  const snap = await getDoc(doc(db, "wallets", user.uid))

  if (snap.exists()) {
    const data = snap.data()
    const mnemonic: string = data.mnemonic
    const recovered = algosdk.mnemonicToSecretKey(mnemonic)
    return recovered
  } else {
    // 🚀 If no wallet exists, create one
    const { addr, mnemonic } = await createAccount()
    return algosdk.mnemonicToSecretKey(mnemonic)
  }
}

// 🔹 Get ALGO balance
export const getBalance = async (address: string): Promise<number> => {
  try {
    const accountInfo = await algodClient.accountInformation(address).do()
    return Number(accountInfo.amount) / 1e6 // Convert microAlgos to Algos
  } catch (err) {
    console.error("Error fetching balance:", err)
    return 0
  }
}
