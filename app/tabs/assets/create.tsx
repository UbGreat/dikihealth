// app/createAsset.tsx
import * as ImagePicker from "expo-image-picker"
import React, { useState } from "react"
import {
  Alert,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity
} from "react-native"

export default function CreateAssetScreen() {
  const [assetName, setAssetName] = useState("")
  const [unitName, setUnitName] = useState("")
  const [totalSupply, setTotalSupply] = useState("")
  const [decimals, setDecimals] = useState("0")
  const [description, setDescription] = useState("")
  const [mediaUri, setMediaUri] = useState<string | null>(null)
  const [mediaType, setMediaType] = useState<"image" | "video" | null>(null)

  const handlePickMedia = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All, // allow images & videos
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    })

    if (!result.canceled) {
      const asset = result.assets[0]
      setMediaUri(asset.uri)
      setMediaType(asset.type === "video" ? "video" : "image")
    }
  }

  const handleCreateAsset = () => {
    if (!assetName || !unitName || !totalSupply) {
      Alert.alert("Error", "Please fill all required fields")
      return
    }
    

    console.log("Creating ASA:", {
      assetName,
      unitName,
      totalSupply,
      decimals,
      description,
      mediaUri,
      mediaType,
    })

    // TODO: Upload mediaUri to IPFS or Algorand ARC3/ARC19 metadata
    // TODO: Connect with Algorand SDK for on-chain ASA creation

    Alert.alert("Success", `${assetName} asset created successfully!`)

    // Reset form
    setAssetName("")
    setUnitName("")
    setTotalSupply("")
    setDecimals("0")
    setDescription("")
    setMediaUri(null)
    setMediaType(null)
  }

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Create Healthcare Asset</Text>
      <Text style={styles.subtitle}>
        Issue a new Algorand ASA token for healthcare infrastructure, equipment, or consumables
      </Text>

      {/* Asset Name */}
      <Text style={styles.label}>Asset Name *</Text>
      <TextInput
        style={styles.input}
        placeholder="e.g. Hospital Facility Token"
        value={assetName}
        onChangeText={setAssetName}
      />

      {/* Unit Name */}
      <Text style={styles.label}>Unit Name *</Text>
      <TextInput
        style={styles.input}
        placeholder="e.g. HSPT"
        value={unitName}
        onChangeText={setUnitName}
      />

      {/* Total Supply */}
      <Text style={styles.label}>Total Supply *</Text>
      <TextInput
        style={styles.input}
        placeholder="e.g. 1000000"
        value={totalSupply}
        onChangeText={setTotalSupply}
        keyboardType="numeric"
      />

      {/* Decimals */}
      <Text style={styles.label}>Decimals</Text>
      <TextInput
        style={styles.input}
        placeholder="e.g. 0"
        value={decimals}
        onChangeText={setDecimals}
        keyboardType="numeric"
      />

      {/* Description */}
      <Text style={styles.label}>Description</Text>
      <TextInput
        style={[styles.input, { height: 100 }]}
        placeholder="Describe the purpose of this healthcare asset"
        value={description}
        onChangeText={setDescription}
        multiline
      />

      {/* Media Upload */}
      <Text style={styles.label}>Upload Asset Photo/Video (optional)</Text>
      <TouchableOpacity style={styles.uploadBtn} onPress={handlePickMedia}>
        <Text style={styles.uploadBtnText}>
          {mediaUri ? "Change File" : "Upload File"}
        </Text>
      </TouchableOpacity>

      {mediaUri && mediaType === "image" && (
        <Image source={{ uri: mediaUri }} style={styles.previewImage} />
      )}

      {/* {mediaUri && mediaType === "video" && (
        <Video
          source={{ uri: mediaUri }}
          style={styles.previewVideo}
          useNativeControls
          resizeMode="contain"
        />
      )} */}

      {/* Submit Button */}
      <TouchableOpacity style={styles.createBtn} onPress={handleCreateAsset}>
        <Text style={styles.createBtnText}>Create Asset</Text>
      </TouchableOpacity>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f9fafb", padding: 20 },
  title: { fontSize: 22, fontWeight: "700", color: "#111827", marginBottom: 8 },
  subtitle: { fontSize: 14, color: "#6b7280", marginBottom: 20 },

  label: { fontSize: 14, fontWeight: "600", color: "#374151", marginBottom: 6 },
  input: {
    backgroundColor: "#fff",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#d1d5db",
    padding: 14,
    fontSize: 16,
    marginBottom: 16,
  },

  uploadBtn: {
    backgroundColor: "#e5e7eb",
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
    marginBottom: 16,
  },
  uploadBtnText: { color: "#374151", fontWeight: "600", fontSize: 16 },

  previewImage: {
    width: "100%",
    height: 180,
    borderRadius: 12,
    marginBottom: 16,
  },
  previewVideo: {
    width: "100%",
    height: 200,
    borderRadius: 12,
    marginBottom: 16,
  },

  createBtn: {
    backgroundColor: "#2563eb",
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 20,
  },
  createBtnText: { color: "#fff", fontWeight: "700", fontSize: 16 },
})
