// screens/CreateEHRScreen.tsx
import React, { useState } from "react"
import {
    Alert,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity
} from "react-native"

export default function CreateEHRScreen() {
  const [form, setForm] = useState({
    patientName: "",
    age: "",
    diagnosis: "",
    treatment: "",
    notes: "",
  })

  const handleChange = (key: string, value: string) => {
    setForm({ ...form, [key]: value })
  }

  const handleSubmit = async () => {
    if (!form.patientName || !form.age || !form.diagnosis) {
      Alert.alert("Error", "Patient name, age, and diagnosis are required.")
      return
    }

    try {
      // 🔗 TODO: Store in Algorand blockchain or backend API
      console.log("EHR Data Submitted:", form)

      Alert.alert("Success", "EHR record created successfully!")
      setForm({
        patientName: "",
        age: "",
        diagnosis: "",
        treatment: "",
        notes: "",
      })
    } catch (err) {
      Alert.alert("Error", "Failed to create EHR record.")
      console.error(err)
    }
  }

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Create Electronic Health Record (EHR)</Text>

      <TextInput
        style={styles.input}
        placeholder="Patient Name"
        value={form.patientName}
        onChangeText={(val) => handleChange("patientName", val)}
      />

      <TextInput
        style={styles.input}
        placeholder="Age"
        keyboardType="numeric"
        value={form.age}
        onChangeText={(val) => handleChange("age", val)}
      />

      <TextInput
        style={styles.input}
        placeholder="Diagnosis"
        value={form.diagnosis}
        onChangeText={(val) => handleChange("diagnosis", val)}
      />

      <TextInput
        style={styles.input}
        placeholder="Treatment"
        value={form.treatment}
        onChangeText={(val) => handleChange("treatment", val)}
      />

      <TextInput
        style={[styles.input, { height: 100 }]}
        placeholder="Additional Notes"
        multiline
        value={form.notes}
        onChangeText={(val) => handleChange("notes", val)}
      />

      <TouchableOpacity style={styles.submitBtn} onPress={handleSubmit}>
        <Text style={styles.submitText}>Save EHR</Text>
      </TouchableOpacity>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#f9fafb",
  },
  title: {
    fontSize: 22,
    fontWeight: "700",
    marginBottom: 20,
    textAlign: "center",
    color: "#111827",
  },
  input: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#e5e7eb",
    borderRadius: 12,
    padding: 14,
    fontSize: 16,
    marginBottom: 16,
  },
  submitBtn: {
    backgroundColor: "#2563eb",
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 10,
    marginBottom: 40,
  },
  submitText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 16,
  },
})
