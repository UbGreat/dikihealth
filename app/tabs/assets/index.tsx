// app/assets.tsx
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons"
import { router } from "expo-router"
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

export default function AssetsScreen() {
  const [modalVisible, setModalVisible] = useState(false)
  const [assetAction, setAssetAction] = useState<"create" | "optin" | "buy" | "lease" | "delete" | null>(null)
  const [assetName, setAssetName] = useState("")
  const [assetAmount, setAssetAmount] = useState("")

  const assets = [
    { id: "1", name: "Hospital Facility Token", unit: "HSPT", amount: 120 },
    { id: "2", name: "Medical Equipment Token", unit: "MEDQ", amount: 450 },
    { id: "3", name: "Ambulance Lease Token", unit: "AMBX", amount: 20 },
    { id: "4", name: "Medical Consumables Token", unit: "MEDC", amount: 980 },
  ]

  const handleAction = () => {
    console.log(`Action: ${assetAction} | Asset: ${assetName} | Amount: ${assetAmount}`)
    setModalVisible(false)
    setAssetName("")
    setAssetAmount("")
    // Later: connect with Algorand SDK
    alert(`${assetAction?.toUpperCase()} request submitted!`)
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Healthcare Assets</Text>
      <Text style={styles.subtitle}>Manage Algorand ASA tokens for healthcare infrastructure</Text>

      {/* Assets List */}
      <FlatList
        data={assets}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.assetCard}>
            <MaterialCommunityIcons name="hospital-building" size={28} color="#2563eb" />
            <View style={{ flex: 1, marginLeft: 12 }}>
              <Text style={styles.assetName}>{item.name}</Text>
              <Text style={styles.assetUnit}>{item.unit}</Text>
            </View>
            <Text style={styles.assetAmount}>{item.amount}</Text>
          </View>
        )}
      />

      {/* Actions */}
      <View style={styles.actionsRow}>
        <TouchableOpacity
          style={styles.actionBtn}
          onPress={() => router.push("/tabs/assets/create")}
        //   onPress={() => {
        //     setAssetAction("create")
        //     setModalVisible(true)
        //   }}
        >
          <Ionicons name="add-circle" size={22} color="#fff" />
          <Text style={styles.actionText}>Create</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.actionBtn}
          onPress={() => router.push("/tabs/assets/optin")}
        //   onPress={() => {
        //     setAssetAction("optin")
        //     setModalVisible(true)
        //   }}
        >
          <Ionicons name="log-in" size={22} color="#fff" />
          <Text style={styles.actionText}>Opt-in</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.actionBtn}
          onPress={() => {
            setAssetAction("buy")
            setModalVisible(true)
          }}
        >
          <Ionicons name="cart" size={22} color="#fff" />
          <Text style={styles.actionText}>Buy</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.actionBtn}
          onPress={() => {
            setAssetAction("lease")
            setModalVisible(true)
          }}
        >
          <Ionicons name="car" size={22} color="#fff" />
          <Text style={styles.actionText}>Lease</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.actionBtn, { backgroundColor: "#dc2626" }]}
          onPress={() => {
            setAssetAction("delete")
            setModalVisible(true)
          }}
        >
          <Ionicons name="trash" size={22} color="#fff" />
          <Text style={styles.actionText}>Delete</Text>
        </TouchableOpacity>
      </View>

      {/* Modal for Asset Actions */}
      <Modal
        visible={modalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>{assetAction?.toUpperCase()} Asset</Text>

            {assetAction !== "delete" && (
              <>
                <TextInput
                  style={styles.input}
                  placeholder="Asset Name"
                  value={assetName}
                  onChangeText={setAssetName}
                />
                <TextInput
                  style={styles.input}
                  placeholder="Amount"
                  keyboardType="numeric"
                  value={assetAmount}
                  onChangeText={setAssetAmount}
                />
              </>
            )}

            <TouchableOpacity style={styles.modalBtn} onPress={handleAction}>
              <Text style={styles.modalBtnText}>Confirm</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.modalBtn, { backgroundColor: "#e5e7eb" }]}
              onPress={() => setModalVisible(false)}
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

  assetCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 14,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 2,
  },
  assetName: { fontSize: 16, fontWeight: "600", color: "#111827" },
  assetUnit: { fontSize: 12, color: "#6b7280" },
  assetAmount: { fontSize: 16, fontWeight: "700", color: "#2563eb" },

  actionsRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginTop: 20,
  },
  actionBtn: {
    backgroundColor: "#2563eb",
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    flexBasis: "30%",
    marginVertical: 6,
  },
  actionText: { color: "#fff", marginTop: 4, fontSize: 12, fontWeight: "600" },

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
  modalTitle: { fontSize: 18, fontWeight: "700", marginBottom: 16, color: "#111827" },
  input: {
    width: "100%",
    borderWidth: 1,
    borderColor: "#d1d5db",
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
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
