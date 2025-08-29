// app/ehr.tsx
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons"
import { router } from "expo-router"
import React from "react"
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native"

export default function EHRScreen() {
  const patient = {
    name: "John Doe",
    age: 42,
    patientId: "DHK-10293",
    bloodGroup: "O+",
  }

  const vitals = [
    { id: 1, label: "Heart Rate", value: "76 bpm", icon: "heart-outline" },
    { id: 2, label: "Blood Pressure", value: "120/80", icon: "pulse-outline" },
    { id: 3, label: "Temperature", value: "36.8 °C", icon: "thermometer-outline" },
  ]

  const records = [
    { id: 1, type: "Lab Test", desc: "CBC & Blood Sugar", date: "2025-08-12" },
    { id: 2, type: "Prescription", desc: "Amoxicillin 500mg, Paracetamol", date: "2025-07-30" },
    { id: 3, type: "Consultation", desc: "Cardiology Follow-up", date: "2025-07-10" },
  ]

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 40 }}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Electronic Health Records</Text>
        <Text style={styles.subtitle}>Verified on Algorand Blockchain</Text>
      </View>

      {/* Patient Info */}
      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Patient Profile</Text>
        <Text style={styles.patientName}>{patient.name}</Text>
        <Text style={styles.patientDetails}>Age: {patient.age} • Blood Group: {patient.bloodGroup}</Text>
        <Text style={styles.patientId}>Patient ID: {patient.patientId}</Text>
      </View>

      {/* Vitals */}
      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Vital Signs</Text>
        <View style={styles.vitalGrid}>
          {vitals.map((v) => (
            <View key={v.id} style={styles.vitalCard}>
              <Ionicons name={v.icon as any} size={28} color="#2563eb" />
              <Text style={styles.vitalValue}>{v.value}</Text>
              <Text style={styles.vitalLabel}>{v.label}</Text>
            </View>
          ))}
        </View>
      </View>

      {/* Medical Records */}
      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Recent Records</Text>
        {records.map((r) => (
          <View key={r.id} style={styles.recordItem}>
            <MaterialCommunityIcons
              name={r.type === "Lab Test" ? "flask-outline" : r.type === "Prescription" ? "pill" : "stethoscope"}
              size={22}
              color="#2563eb"
              style={{ marginRight: 8 }}
            />
            <View style={{ flex: 1 }}>
              <Text style={styles.recordType}>{r.type}</Text>
              <Text style={styles.recordDesc}>{r.desc}</Text>
            </View>
            <Text style={styles.recordDate}>{r.date}</Text>
          </View>
        ))}
      </View>

      {/* Blockchain Proof */}
      <View style={styles.blockchainCard}>
        <Ionicons name="checkmark-circle" size={22} color="#10b981" />
        <Text style={styles.blockchainText}>All records secured & verified on Algorand</Text>
      </View>

      {/* Actions */}
      <TouchableOpacity style={styles.primaryBtn} onPress={() => router.push("/tabs/ehr/create")}>
        <Text style={styles.primaryBtnText}>Add New Record</Text>
      </TouchableOpacity>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f9fafb",
    paddingHorizontal: 16,
    paddingTop: 20,
  },
  header: { marginBottom: 20 },
  title: { fontSize: 22, fontWeight: "700", color: "#111827" },
  subtitle: { color: "#6b7280", marginTop: 4 },

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
  sectionTitle: { fontSize: 16, fontWeight: "600", marginBottom: 10, color: "#111827" },

  patientName: { fontSize: 18, fontWeight: "700", color: "#2563eb" },
  patientDetails: { marginTop: 4, color: "#374151" },
  patientId: { marginTop: 4, fontSize: 12, color: "#6b7280" },

  vitalGrid: { flexDirection: "row", justifyContent: "space-between" },
  vitalCard: { alignItems: "center", width: "30%" },
  vitalValue: { marginTop: 6, fontSize: 16, fontWeight: "600", color: "#111827" },
  vitalLabel: { fontSize: 12, color: "#6b7280" },

  recordItem: {
    flexDirection: "row",
    alignItems: "flex-start",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#e5e7eb",
  },
  recordType: { fontWeight: "600", color: "#111827" },
  recordDesc: { fontSize: 12, color: "#374151" },
  recordDate: { fontSize: 12, color: "#6b7280" },

  blockchainCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#ecfdf5",
    borderRadius: 12,
    padding: 12,
    marginBottom: 20,
  },
  blockchainText: { marginLeft: 8, color: "#065f46", fontSize: 13, flex: 1 },

  primaryBtn: {
    backgroundColor: "#2563eb",
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: "center",
  },
  primaryBtnText: { color: "#fff", fontWeight: "600", fontSize: 16 },
})
