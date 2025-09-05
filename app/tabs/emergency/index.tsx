// app/emergency.tsx
import { FontAwesome5, Ionicons, MaterialCommunityIcons } from "@expo/vector-icons"
import React, { useState } from "react"
import {
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native"
import Header from "../../../src/components/header"

export default function EmergencyScreen() {
  const [location, setLocation] = useState("6.5244° N, 3.3792° E") // dummy Lagos coords
  const [visible, setVisible] = useState(false)
  const [details, setDetails] = useState("")
  const [activeType, setActiveType] = useState("General")

  const triggerEmergency = () => {
    setVisible(false)
    alert(
      `${activeType} emergency dispatched!\nDetails: ${details}\nLocation: ${location}`
    )
    setDetails("")
  }

  return (
    <View style={{ flex: 1 }}>
      <Header />
      <View style={styles.container}>
        <Text style={styles.title}>Emergency Response</Text>
        <Text style={styles.subtitle}>Quick access for urgent healthcare needs</Text>

        {/* Big Red Emergency Button */}
        <TouchableOpacity
          style={styles.emergencyBtn}
          onPress={() => {
            setActiveType("General")
            setVisible(true)
          }}
        >
          <Ionicons name="alert-circle" size={50} color="#fff" />
          <Text style={styles.emergencyBtnText}>Trigger Emergency</Text>
        </TouchableOpacity>

        {/* Scrollable Options */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={{ marginBottom: 20 }}
        >
          <View style={styles.optionsRow}>
            <TouchableOpacity
              style={styles.optionCard}
              onPress={() => {
                setActiveType("Ambulance")
                setVisible(true)
              }}
            >
              <MaterialCommunityIcons name="ambulance" size={36} color="#ef4444" />
              <Text style={styles.optionText}>Ambulance</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.optionCard}
              onPress={() => {
                setActiveType("Drone")
                setVisible(true)
              }}
            >
              <MaterialCommunityIcons name="drone" size={36} color="#2563eb" />
              <Text style={styles.optionText}>Drone</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.optionCard}
              onPress={() => {
                setActiveType("Helicopter")
                setVisible(true)
              }}
            >
              <FontAwesome5 name="helicopter" size={34} color="#f59e0b" />
              <Text style={styles.optionText}>Helicopter</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.optionCard}
              onPress={() => {
                setActiveType("Private Jet")
                setVisible(true)
              }}
            >
              <FontAwesome5 name="plane" size={34} color="#9333ea" />
              <Text style={styles.optionText}>Private Jet</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>

        {/* Active Status */}
        <View style={styles.statusCard}>
          <Ionicons name="location" size={18} color="#2563eb" />
          <Text style={styles.statusText}>Live Location: {location}</Text>
        </View>

        {/* Modal for details */}
        <Modal
          visible={visible}
          transparent={true}
          animationType="slide"
          onRequestClose={() => setVisible(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalCard}>
              <Text style={styles.modalTitle}>{activeType} Emergency</Text>
              <Text style={styles.modalSubtitle}>
                Provide short info (e.g., chest pain, accident, bleeding)
              </Text>

              <TextInput
                style={styles.input}
                placeholder="Enter details..."
                value={details}
                onChangeText={setDetails}
              />

              <TouchableOpacity style={styles.modalBtn} onPress={triggerEmergency}>
                <Text style={styles.modalBtnText}>Send Emergency Request</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.modalBtn, { backgroundColor: "#e5e7eb" }]}
                onPress={() => setVisible(false)}
              >
                <Text style={[styles.modalBtnText, { color: "#111827" }]}>
                  Cancel
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f9fafb", padding: 16 },
  title: { fontSize: 22, fontWeight: "700", color: "#111827" },
  subtitle: { fontSize: 14, color: "#6b7280", marginBottom: 20 },

  emergencyBtn: {
    backgroundColor: "#dc2626",
    padding: 30,
    borderRadius: 100,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 30,
    alignSelf: "center",
    width: 180,
    height: 180,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 6,
    elevation: 4,
  },
  emergencyBtnText: { color: "#fff", fontSize: 18, fontWeight: "700", marginTop: 8 },

  optionsRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingHorizontal: 4,
  },
  optionCard: {
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 16,
    alignItems: "center",
    width: 110,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 2,
  },
  optionText: { marginTop: 8, fontSize: 13, fontWeight: "600", color: "#111827" },

  statusCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#e0f2fe",
    borderRadius: 12,
    padding: 12,
    marginTop: "auto",
  },
  statusText: { marginLeft: 8, color: "#075985", fontSize: 13, flex: 1 },

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
    backgroundColor: "#dc2626",
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
    marginBottom: 10,
  },
  modalBtnText: { color: "#fff", fontWeight: "600", fontSize: 16 },
})
