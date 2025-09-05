// app/tabs/wallet/index.tsx
import { Ionicons } from "@expo/vector-icons"
import * as Clipboard from "expo-clipboard"
import { useRouter } from "expo-router"
import React, { useEffect, useState } from "react"
import { ActivityIndicator, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native"
import { getBalance, getWallet } from "../../../src/utils/wallet"

export default function WalletDashboard() {
  const [address, setAddress] = useState<string>("")
  const [balance, setBalance] = useState<number | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const fetchWallet = async () => {
      try {
        const account = await getWallet()
        if (account) {
          setAddress(account.addr)

          const bal = await getBalance(account.addr)
          setBalance(bal)
        }
      } catch (err) {
        console.error("Error fetching wallet:", err)
      } finally {
        setLoading(false)
      }
    }

    fetchWallet()
  }, [])

  const copyAddress = async () => {
    await Clipboard.setStringAsync(address)
    alert("Address copied to clipboard!")
  }

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#2563eb" />
        <Text style={{ marginTop: 10 }}>Loading wallet...</Text>
      </View>
    )
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Wallet Info */}
      <View style={styles.card}>
        <Text style={styles.label}>Public Address</Text>
        <Text style={styles.address}>{address}</Text>
        <TouchableOpacity style={styles.copyBtn} onPress={copyAddress}>
          <Ionicons name="copy-outline" size={18} color="#fff" />
          <Text style={styles.copyText}>Copy</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.card}>
        <Text style={styles.label}>Balance</Text>
        <Text style={styles.balance}>
          {balance !== null ? `${balance} ALGO` : "Fetching..."}
        </Text>
      </View>

      {/* Actions */}
      <View style={styles.actions}>
        <TouchableOpacity
          style={styles.actionBtn}
          onPress={() => router.push("/tabs/wallet/send")}
        >
          <Ionicons name="arrow-up-circle" size={24} color="#fff" />
          <Text style={styles.actionText}>Send</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.actionBtn}
          onPress={() => router.push("/tabs/wallet/receive")}
        >
          <Ionicons name="arrow-down-circle" size={24} color="#fff" />
          <Text style={styles.actionText}>Receive</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.actionBtn}
          onPress={() => router.push("/tabs/assets")}
        >
          <Ionicons name="layers-outline" size={24} color="#fff" />
          <Text style={styles.actionText}>Assets</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: "#f9fafb",
    flexGrow: 1,
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  card: {
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 2,
  },
  label: {
    fontSize: 14,
    color: "#6b7280",
    marginBottom: 6,
  },
  address: {
    fontSize: 14,
    fontWeight: "600",
    color: "#111827",
    marginBottom: 8,
  },
  copyBtn: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#2563eb",
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 8,
    alignSelf: "flex-start",
  },
  copyText: {
    color: "#fff",
    marginLeft: 6,
    fontSize: 12,
    fontWeight: "600",
  },
  balance: {
    fontSize: 20,
    fontWeight: "700",
    color: "#111827",
  },
  actions: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
  },
  actionBtn: {
    flex: 1,
    backgroundColor: "#2563eb",
    padding: 14,
    borderRadius: 12,
    alignItems: "center",
    marginHorizontal: 6,
  },
  actionText: {
    color: "#fff",
    marginTop: 6,
    fontWeight: "600",
  },
})
