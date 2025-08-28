// app/wallet.tsx
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons"
import React, { useState } from "react"
import {
    FlatList,
    Modal,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native"

export default function WalletScreen() {
  const [connected, setConnected] = useState(false)
  const [fundModalVisible, setFundModalVisible] = useState(false)
  const [fundAmount, setFundAmount] = useState("")

  const walletInfo = {
    address: "DHK6...JX92",
    balance: "245.67 ALGO",
  }

  const assets = [
    { id: "1", name: "Hospital Token", unit: "HSPT", amount: 1200 },
    { id: "2", name: "Medical Equip Shares", unit: "MEDQ", amount: 350 },
    { id: "3", name: "Ambulance Lease Token", unit: "AMBX", amount: 45 },
  ]

  const handleFundWallet = () => {
    console.log("Funding wallet with: ₦", fundAmount)
    setFundModalVisible(false)
    setFundAmount("")
    // Later: integrate Flutterwave / Paystack API here
    alert(`₦${fundAmount} funding request sent!`)
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Algorand Wallet</Text>
      <Text style={styles.subtitle}>Manage funds & healthcare assets</Text>

      {!connected ? (
        <TouchableOpacity style={styles.connectBtn} onPress={() => setConnected(true)}>
          <Ionicons name="wallet-outline" size={20} color="#fff" style={{ marginRight: 6 }} />
          <Text style={styles.connectText}>Connect Wallet</Text>
        </TouchableOpacity>
      ) : (
        <>
          {/* Wallet Info */}
          <View style={styles.card}>
            <Text style={styles.walletLabel}>Wallet Address</Text>
            <Text style={styles.walletAddress}>{walletInfo.address}</Text>
            <Text style={styles.balance}>{walletInfo.balance}</Text>
          </View>

          {/* Assets */}
          <View style={styles.card}>
            <Text style={styles.sectionTitle}>My Healthcare Assets (ASA)</Text>
            <FlatList
              data={assets}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <View style={styles.assetItem}>
                  <MaterialCommunityIcons name="hospital-building" size={22} color="#2563eb" />
                  <View style={{ flex: 1, marginLeft: 10 }}>
                    <Text style={styles.assetName}>{item.name}</Text>
                    <Text style={styles.assetUnit}>{item.unit}</Text>
                  </View>
                  <Text style={styles.assetAmount}>{item.amount}</Text>
                </View>
              )}
            />
          </View>

          {/* Actions */}
          <View style={styles.actionsRow}>
            <TouchableOpacity style={styles.actionBtn}>
              <Ionicons name="arrow-up-circle" size={22} color="#fff" />
              <Text style={styles.actionText}>Send</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionBtn}>
              <Ionicons name="arrow-down-circle" size={22} color="#fff" />
              <Text style={styles.actionText}>Receive</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionBtn}>
              <Ionicons name="refresh-circle" size={22} color="#fff" />
              <Text style={styles.actionText}>Swap</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.actionBtn, { backgroundColor: "#059669" }]}
              onPress={() => setFundModalVisible(true)}
            >
              <Ionicons name="cash" size={22} color="#fff" />
              <Text style={styles.actionText}>Fund</Text>
            </TouchableOpacity>
          </View>

          {/* Blockchain Status */}
          <View style={styles.blockchainCard}>
            <Ionicons name="checkmark-circle" size={20} color="#10b981" />
            <Text style={styles.blockchainText}>Connected to Algorand TestNet</Text>
          </View>
        </>
      )}

      {/* Fund Wallet Modal */}
      <Modal
        visible={fundModalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setFundModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>Fund Wallet</Text>
            <Text style={styles.modalSubtitle}>Enter amount in NGN (₦) to fund wallet</Text>

            <TextInput
              style={styles.input}
              placeholder="e.g. 5000"
              keyboardType="numeric"
              value={fundAmount}
              onChangeText={setFundAmount}
            />

            <TouchableOpacity style={styles.modalBtn} onPress={handleFundWallet}>
              <Text style={styles.modalBtnText}>Proceed to Payment</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.modalBtn, { backgroundColor: "#e5e7eb" }]}
              onPress={() => setFundModalVisible(false)}
            >
              <Text style={[styles.modalBtnText, { color: "#111827" }]}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f9fafb", padding: 16 },
  title: { fontSize: 22, fontWeight: "700", color: "#111827" },
  subtitle: { fontSize: 14, color: "#6b7280", marginBottom: 20 },

  connectBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#2563eb",
    paddingVertical: 14,
    borderRadius: 12,
  },
  connectText: { color: "#fff", fontWeight: "600", fontSize: 16 },

  card: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 2,
  },
  walletLabel: { fontSize: 14, color: "#6b7280" },
  walletAddress: { fontSize: 13, fontWeight: "600", color: "#2563eb", marginVertical: 4 },
  balance: { fontSize: 18, fontWeight: "700", color: "#111827" },

  sectionTitle: { fontSize: 16, fontWeight: "600", marginBottom: 10, color: "#111827" },
  assetItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#e5e7eb",
  },
  assetName: { fontWeight: "600", color: "#111827" },
  assetUnit: { fontSize: 12, color: "#6b7280" },
  assetAmount: { fontWeight: "700", color: "#2563eb" },

  actionsRow: { flexDirection: "row", justifyContent: "space-between", marginTop: 10, flexWrap: "wrap" },
  actionBtn: {
    backgroundColor: "#2563eb",
    paddingVertical: 14,
    borderRadius: 12,
    flex: 1,
    alignItems: "center",
    margin: 4,
  },
  actionText: { color: "#fff", marginTop: 4, fontSize: 12, fontWeight: "600" },

  blockchainCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#ecfdf5",
    borderRadius: 12,
    padding: 12,
    marginTop: 16,
  },
  blockchainText: { marginLeft: 8, color: "#065f46", fontSize: 13, flex: 1 },

  // Modal
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalCard: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 16,
    width: "85%",
    alignItems: "center",
  },
  modalTitle: { fontSize: 18, fontWeight: "700", marginBottom: 8, color: "#111827" },
  modalSubtitle: { fontSize: 13, color: "#6b7280", marginBottom: 16, textAlign: "center" },
  input: {
    width: "100%",
    borderWidth: 1,
    borderColor: "#d1d5db",
    borderRadius: 12,
    padding: 12,
    marginBottom: 16,
    fontSize: 16,
  },
  modalBtn: {
    width: "100%",
    backgroundColor: "#2563eb",
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
    marginBottom: 10,
  },
  modalBtnText: { color: "#fff", fontWeight: "600", fontSize: 16 },
})
