import algosdk from "algosdk"
import * as Crypto from "expo-crypto"
import { Stack, useRouter } from "expo-router"
import * as SecureStore from "expo-secure-store"
import { getAuth } from "firebase/auth"
import { doc, getDoc, getFirestore } from "firebase/firestore"
import React, { useEffect, useState } from "react"
import { Alert, Button, Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native"
import Header from '../../../src/components/header'
import { fundWallet } from "../../../src/utils/wallet"; // ✅ import wallet service



const DISPENSER_KEY = "dikihealth_dispenser_mnemonic"

const Dashboard: React.FC = () => {
  const [profile, setProfile] = useState<any>(null)
  const [wallet, setWallet] = useState<any>(null)
  const [balance, setBalance] = useState<number | null>(null)
  const [loadingBalance, setLoadingBalance] = useState(false)
  const [dispenserAccount, setDispenserAccount] = useState<any>(null)

  const auth = getAuth()
  const db = getFirestore()
  const router = useRouter()

  const algodClient = new algosdk.Algodv2(
    "",
    "https://testnet-api.algonode.cloud",
    ""
  )

  // 🔹 Fetch user profile + wallet
  useEffect(() => {
    const fetchUser = async () => {
      const user = auth.currentUser
      if (!user) return

      const snap = await getDoc(doc(db, "users", user.uid))
      if (snap.exists()) {
        const data = snap.data()
        setProfile(data.profile)
        setWallet(data.wallet)
      }
    }
    fetchUser()
  }, [])

  // 🔹 Fetch wallet balance
  const fetchBalance = async (address: string) => {
    try {
      setLoadingBalance(true)
      const accountInfo = await algodClient.accountInformation(address).do()
      setBalance(Number(accountInfo.amount) / 1e6)
    } catch (err) {
      console.error("Balance fetch error:", err)
      Alert.alert("Error", "Could not fetch wallet balance")
    } finally {
      setLoadingBalance(false)
    }
  }

  useEffect(() => {
    if (wallet?.address) fetchBalance(wallet.address)
  }, [wallet])

  // 🔹 Load or Initialize Dispenser
  useEffect(() => {
    const initDispenser = async () => {
      try {
        let mnemonic = await SecureStore.getItemAsync(DISPENSER_KEY)

        if (!mnemonic) {
          // ⚠️ For demo: replace with secure provisioning
          mnemonic = "your 25-word mnemonic goes here"
          await SecureStore.setItemAsync(DISPENSER_KEY, mnemonic)
        }

        const hash = await Crypto.digestStringAsync(
          Crypto.CryptoDigestAlgorithm.SHA256,
          mnemonic
        )
        console.log("🔑 Loaded dispenser hash:", hash.slice(0, 12))

        setDispenserAccount(algosdk.mnemonicToSecretKey(mnemonic))
      } catch (err) {
        console.error("Dispenser init error:", err)
      }
    }
    initDispenser()
  }, [])

  // 🔹 Fund Wallet
 const handleFundWallet = async () => {
  if (!wallet?.address) {
    Alert.alert("Error", "Wallet not available")
    return
  }

  try {
    const txId = await fundWallet(wallet.address, 0.5)
    Alert.alert("Success", `Wallet funded! TxID: ${txId}`)
    fetchBalance(wallet.address)
  } catch (err) {
    console.error("Funding error:", err)
    Alert.alert("Error", "Funding failed. Please try again.")
  }
}

  return (
    
   
    <View style={{ flex: 1 }}>
       <Stack.Screen options={{ headerShown: false }} />
      <Header />
    <ScrollView style={styles.container}>
      
      {/* Profile */}
      {profile && (
        <View style={styles.profileSection}>
          <Image source={{ uri: profile.profilePhoto }} style={styles.avatar} />
          <Text style={styles.name}>{profile.firstname} {profile.surname}</Text>
          <Text style={styles.phone}>{profile.phone}</Text>
        </View>
      )}

      {/* Wallet */}
      {wallet && (
        <View style={styles.walletCard}>
          <Text style={styles.walletLabel}>Wallet Address:</Text>
          <Text style={styles.walletAddr}>{wallet.address}</Text>
          <View style={styles.walletRow}>
            <Text style={styles.balance}>
              Balance: {loadingBalance ? "Loading..." : `${balance ?? 0} Algos`}
            </Text>
            <Button title="Fund Wallet" onPress={handleFundWallet} />
          </View>
        </View>
      )}

      {/* Quick Links */}
      <Text style={styles.sectionTitle}>Quick Access</Text>
      <View style={styles.links}>
        <TouchableOpacity style={styles.card} onPress={() => router.push("/tabs/ehr")}>
          <Text style={styles.cardText}>📑 EHR</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.card} onPress={() => router.push("/tabs/monitoring")}>
          <Text style={styles.cardText}>📡 IoT Devices</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.card} onPress={() => router.push("/tabs/assets")}>
          <Text style={styles.cardText}>🏥 Assets</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.card} onPress={() => router.push("/tabs/emergency")}>
          <Text style={styles.cardText}>🚑 Emergency</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f9f9f9", padding: 16 },
  profileSection: { alignItems: "center", marginBottom: 20 },
  avatar: { width: 90, height: 90, borderRadius: 45, marginBottom: 10 },
  name: { fontSize: 20, fontWeight: "bold" },
  phone: { fontSize: 14, color: "gray" },
  walletCard: { backgroundColor: "#fff", padding: 15, borderRadius: 12, marginBottom: 20, elevation: 2 },
  walletLabel: { fontSize: 14, fontWeight: "600" },
  walletAddr: { fontSize: 12, marginVertical: 5, color: "#555" },
  walletRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  balance: { fontSize: 16, fontWeight: "bold" },
  sectionTitle: { fontSize: 18, fontWeight: "bold", marginBottom: 10 },
  links: { flexDirection: "row", flexWrap: "wrap", justifyContent: "space-between" },
  card: { width: "47%", backgroundColor: "#e6f0ff", padding: 20, borderRadius: 10, marginBottom: 15, alignItems: "center" },
  cardText: { fontSize: 16, fontWeight: "600" },
})

export default Dashboard
