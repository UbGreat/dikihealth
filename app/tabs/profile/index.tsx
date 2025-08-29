import algosdk from "algosdk"
import { useRouter } from "expo-router"
import { getAuth } from "firebase/auth"
import { doc, getDoc, getFirestore } from "firebase/firestore"
import React, { useEffect, useState } from "react"
import { Alert, Button, Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native"

const Dashboard: React.FC = () => {
  const [profile, setProfile] = useState<any>(null)
  const [wallet, setWallet] = useState<any>(null)
  const [balance, setBalance] = useState<number | null>(null)
  const [loadingBalance, setLoadingBalance] = useState(false)

  const auth = getAuth()
  const db = getFirestore()
  const router = useRouter()

  // 🔹 Fetch user profile + wallet from Firestore
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

  // 🔹 Fetch wallet balance from Algorand node
  const fetchBalance = async (address: string) => {
    try {
      setLoadingBalance(true)
      const algodClient = new algosdk.Algodv2(
        "", // token
        "https://testnet-api.algonode.cloud", // algod url (use MainNet in production)
        "" // port
      )
      const accountInfo = await algodClient.accountInformation(address).do()
      setBalance(accountInfo.amount / 1e6) // microAlgos → Algos
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

  const handleFundWallet = () => {
    Alert.alert("Fund Wallet", "Feature to fund wallet from bank account coming soon!")
  }

  return (
    <ScrollView style={styles.container}>
      {/* Profile Section */}
      {profile && (
        <View style={styles.profileSection}>
          <Image source={{ uri: profile.profilePhoto }} style={styles.avatar} />
          <Text style={styles.name}>{profile.firstname} {profile.surname}</Text>
          <Text style={styles.phone}>{profile.phone}</Text>
        </View>
      )}

      {/* Wallet Section */}
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
        <TouchableOpacity style={styles.card} onPress={() => router.push("/ehr")}>
          <Text style={styles.cardText}>📑 EHR</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.card} onPress={() => router.push("/iotDevices")}>
          <Text style={styles.cardText}>📡 IoT Devices</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.card} onPress={() => router.push("/assets")}>
          <Text style={styles.cardText}>🏥 Assets</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.card} onPress={() => router.push("/emergency")}>
          <Text style={styles.cardText}>🚑 Emergency</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f9f9f9",
    padding: 16,
  },
  profileSection: {
    alignItems: "center",
    marginBottom: 20,
  },
  avatar: {
    width: 90,
    height: 90,
    borderRadius: 45,
    marginBottom: 10,
  },
  name: {
    fontSize: 20,
    fontWeight: "bold",
  },
  phone: {
    fontSize: 14,
    color: "gray",
  },
  walletCard: {
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 12,
    marginBottom: 20,
    elevation: 2,
  },
  walletLabel: {
    fontSize: 14,
    fontWeight: "600",
  },
  walletAddr: {
    fontSize: 12,
    marginVertical: 5,
    color: "#555",
  },
  walletRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  balance: {
    fontSize: 16,
    fontWeight: "bold",
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  links: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  card: {
    width: "47%",
    backgroundColor: "#e6f0ff",
    padding: 20,
    borderRadius: 10,
    marginBottom: 15,
    alignItems: "center",
  },
  cardText: {
    fontSize: 16,
    fontWeight: "600",
  },
})

export default Dashboard
