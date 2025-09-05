// screens/AssetDetailScreen.tsx
import { Stack } from "expo-router"
import React, { useState } from "react"
import {
  Alert,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native"
import Header from "../../../src/components/header"

interface AssetDetailScreenProps {
  route: any
}

export default function AssetDetailScreen({ route }: AssetDetailScreenProps) {
  const { asset } = route.params || {
    asset: {
      id: "123456",
      name: "Hospital Infrastructure Token",
      description: "Tokenized healthcare asset for modern hospital facilities",
      totalSupply: "1,000,000",
      unitName: "HOSP",
      image:
        "https://via.placeholder.com/300x200.png?text=Healthcare+Asset", // fallback if no image passed
    },
  }

  const [loading, setLoading] = useState(false)

  const handleOptIn = async () => {
    try {
      setLoading(true)
      // 🔗 TODO: Replace with real Algorand SDK opt-in logic
      // Example:
      // const txn = algosdk.makeAssetTransferTxnWithSuggestedParamsFromObject({...})
      // sign and send txn with wallet
      setTimeout(() => {
        setLoading(false)
        Alert.alert("Success", `You opted in to asset ID: ${asset.id}`)
      }, 1500)
    } catch (error) {
      setLoading(false)
      Alert.alert("Error", "Failed to opt in to asset")
      console.error(error)
    }
  }

  return (
    <View style={{ flex: 1 }}>
       <Stack.Screen options={{ headerShown: false }} />
      <Header />
    <ScrollView style={styles.container}>
      {/* Asset Image */}
      <Image source={{ uri: asset.image }} style={styles.assetImage} />

      {/* Asset Info */}
      <View style={styles.infoCard}>
        <Text style={styles.assetName}>{asset.name}</Text>
        <Text style={styles.assetUnit}>Unit: {asset.unitName}</Text>
        <Text style={styles.assetDescription}>{asset.description}</Text>

        <View style={styles.row}>
          <Text style={styles.label}>Asset ID:</Text>
          <Text style={styles.value}>{asset.id}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Total Supply:</Text>
          <Text style={styles.value}>{asset.totalSupply}</Text>
        </View>
      </View>

      {/* Opt-In Button */}
      <TouchableOpacity
        style={styles.optInBtn}
        onPress={handleOptIn}
        disabled={loading}
      >
        <Text style={styles.optInText}>
          {loading ? "Opting In..." : "Opt-In to Asset"}
        </Text>
      </TouchableOpacity>
    </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f9fafb",
  },
  assetImage: {
    width: "100%",
    height: 200,
    resizeMode: "cover",
  },
  infoCard: {
    padding: 20,
    backgroundColor: "#fff",
    borderRadius: 12,
    margin: 16,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  assetName: {
    fontSize: 22,
    fontWeight: "700",
    marginBottom: 6,
    color: "#111827",
  },
  assetUnit: {
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 8,
    color: "#2563eb",
  },
  assetDescription: {
    fontSize: 14,
    marginBottom: 16,
    color: "#4b5563",
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 6,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    color: "#374151",
  },
  value: {
    fontSize: 14,
    color: "#6b7280",
  },
  optInBtn: {
    backgroundColor: "#2563eb",
    marginHorizontal: 20,
    marginBottom: 30,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
  },
  optInText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 16,
  },
})
