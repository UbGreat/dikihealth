// screens/OptInAssetScreen.tsx
import React, { useState } from "react"
import {
    Alert,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native"

export default function OptInAssetScreen() {
  const [assetId, setAssetId] = useState("")

  const handleOptIn = async () => {
    if (!assetId) {
      Alert.alert("Error", "Please enter an Asset ID to opt in")
      return
    }

    try {
      // 🔗 TODO: Replace with real Algorand SDK opt-in logic
      // Example using algosdk:
      // const txn = algosdk.makeAssetTransferTxnWithSuggestedParamsFromObject({...})
      // sign + send txn

      Alert.alert("Success", `You have opted in to ASA ID: ${assetId}`)
      setAssetId("")
    } catch (error) {
      Alert.alert("Error", "Failed to opt in to asset")
      console.error(error)
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Opt-In to Asset</Text>
      <Text style={styles.subtitle}>
        Enter the Algorand ASA ID you want to opt into.
      </Text>

      <TextInput
        style={styles.input}
        placeholder="Enter Asset ID"
        keyboardType="numeric"
        value={assetId}
        onChangeText={setAssetId}
      />

      <TouchableOpacity style={styles.optInBtn} onPress={handleOptIn}>
        <Text style={styles.optInText}>Opt-In</Text>
      </TouchableOpacity>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f9fafb",
    padding: 20,
    justifyContent: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    textAlign: "center",
    marginBottom: 10,
    color: "#111827",
  },
  subtitle: {
    fontSize: 14,
    textAlign: "center",
    marginBottom: 20,
    color: "#6b7280",
  },
  input: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#e5e7eb",
    borderRadius: 12,
    padding: 14,
    fontSize: 16,
    marginBottom: 20,
  },
  optInBtn: {
    backgroundColor: "#2563eb",
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
  },
  optInText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 16,
  },
})
