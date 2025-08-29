import { Ionicons } from "@expo/vector-icons"
import { PeraWalletConnect } from "@perawallet/connect"
import algosdk from "algosdk"
import React, { useEffect, useState } from "react"
import { Alert, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native"

// Init Pera Wallet connector
const peraWallet = new PeraWalletConnect({
  shouldShowSignTxnToast: false,
})

const Dashboard: React.FC = () => {
  const [accountAddress, setAccountAddress] = useState<string | null>(null)
  const [balance, setBalance] = useState<number | null>(null)

  // reconnect if user had connected before
  useEffect(() => {
    peraWallet.reconnectSession().then((accounts) => {
      if (accounts.length) {
        setAccountAddress(accounts[0])
        fetchBalance(accounts[0])
      }
    })
  }, [])

  // function to connect wallet
  const handleConnect = async () => {
    try {
      const newAccounts = await peraWallet.connect()
      peraWallet.connector?.on("disconnect", () => {
        setAccountAddress(null)
        setBalance(null)
      })
      setAccountAddress(newAccounts[0])
      fetchBalance(newAccounts[0])
    } catch (err) {
      console.error("Wallet connect error:", err)
      Alert.alert("Error", "Failed to connect wallet.")
    }
  }

  // fetch balance
  const fetchBalance = async (address: string) => {
    try {
      const algodClient = new algosdk.Algodv2(
        "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa", // localnet sandbox token
        "http://localhost", // sandbox algod url
        4001 // port
      )
      const accountInfo = await algodClient.accountInformation(address).do()
      setBalance(accountInfo.amount / 1e6) // in ALGOs
    } catch (err) {
      console.error("Error fetching balance:", err)
    }
  }

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.header}>DikiHealth Dashboard</Text>

      {/* Wallet Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Wallet</Text>
        {accountAddress ? (
          <View>
            <Text style={styles.detail}>Address: {accountAddress}</Text>
            <Text style={styles.detail}>Balance: {balance ?? 0} ALGO</Text>
          </View>
        ) : (
          <TouchableOpacity style={styles.button} onPress={handleConnect}>
            <Ionicons name="wallet" size={20} color="white" />
            <Text style={styles.buttonText}>Connect Wallet</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* EHR Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Electronic Health Records</Text>
        <TouchableOpacity style={styles.linkButton}>
          <Text style={styles.linkText}>View My EHR</Text>
        </TouchableOpacity>
      </View>

      {/* Assets Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Medical Assets</Text>
        <TouchableOpacity style={styles.linkButton}>
          <Text style={styles.linkText}>Purchased / Leased Assets</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.linkButton}>
          <Text style={styles.linkText}>Explore New Assets</Text>
        </TouchableOpacity>
      </View>

      {/* IoT Devices Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>IoT Devices</Text>
        <TouchableOpacity style={styles.linkButton}>
          <Text style={styles.linkText}>My Devices</Text>
        </TouchableOpacity>
      </View>

      {/* Emergency */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Emergency</Text>
        <TouchableOpacity style={styles.emergencyButton}>
          <Ionicons name="alert-circle" size={20} color="white" />
          <Text style={styles.emergencyText}>Emergency Response</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#fff" },
  header: { fontSize: 24, fontWeight: "bold", marginBottom: 20, textAlign: "center" },
  section: { marginBottom: 25 },
  sectionTitle: { fontSize: 18, fontWeight: "bold", marginBottom: 10 },
  detail: { fontSize: 14, marginBottom: 5 },
  button: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#4CAF50",
    padding: 12,
    borderRadius: 8,
  },
  buttonText: { color: "white", fontWeight: "bold", marginLeft: 8 },
  linkButton: { paddingVertical: 10 },
  linkText: { fontSize: 16, color: "#007BFF" },
  emergencyButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#E53935",
    padding: 12,
    borderRadius: 8,
  },
  emergencyText: { color: "white", fontWeight: "bold", marginLeft: 8 },
})

export default Dashboard
