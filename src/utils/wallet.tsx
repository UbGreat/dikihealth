import { PeraWalletConnect } from "@perawallet/connect"

const peraWallet = new PeraWalletConnect()

export const connectWallet = async () => {
  try {
    const accounts = await peraWallet.connect()
    peraWallet.connector?.on("disconnect", handleDisconnect)
    return accounts
  } catch (err) {
    console.error("Wallet connection failed", err)
    return null
  }
}

export const disconnectWallet = async () => {
  peraWallet.disconnect()
}

export const reconnectWallet = async () => {
  try {
    const accounts = await peraWallet.reconnectSession()
    peraWallet.connector?.on("disconnect", handleDisconnect)
    return accounts
  } catch (err) {
    console.error("Reconnect failed", err)
    return null
  }
}

const handleDisconnect = () => {
  console.log("Wallet disconnected")
}
