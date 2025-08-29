import { Picker } from "@react-native-picker/picker"
import algosdk from "algosdk"
import * as ImagePicker from "expo-image-picker"
import { useRouter } from "expo-router"
import { getAuth } from "firebase/auth"
import { doc, getFirestore, setDoc } from "firebase/firestore"
import React, { useState } from "react"
import { ActivityIndicator, Alert, Button, Image, StyleSheet, Text, TextInput, View } from "react-native"

// 🔐 In production, encrypt mnemonics before saving them
const encryptMnemonic = (mnemonic: string) => {
  return mnemonic // TODO: replace with real encryption
}

const CompleteProfile: React.FC = () => {
  const [surname, setSurname] = useState("")
  const [firstname, setFirstname] = useState("")
  const [othernames, setOthernames] = useState("")
  const [phone, setPhone] = useState("")
  const [countryCode, setCountryCode] = useState("+234")
  const [idType, setIdType] = useState("National ID")
  const [idNumber, setIdNumber] = useState("")
  const [idImage, setIdImage] = useState<string | null>(null)
  const [profilePhoto, setProfilePhoto] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const auth = getAuth()
  const db = getFirestore()
  const router = useRouter()

  const pickImage = async (setter: React.Dispatch<React.SetStateAction<string | null>>) => {
    try {
      const result = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      })

      if (!result.canceled) {
        setter(result.assets[0].uri)
      }
    } catch (err) {
      console.error("ImagePicker error:", err)
      Alert.alert("Error", "Failed to open camera")
    }
  }

  const handleSubmit = async () => {
    if (!surname || !firstname || !phone || !idType || !idNumber || !profilePhoto) {
      Alert.alert("Error", "Please fill all required fields including profile photo")
      return
    }

    try {
      setLoading(true)

      const user = auth.currentUser
      if (!user) {
        Alert.alert("Error", "No authenticated user")
        return
      }

      // 🔹 Step 1. Generate Algorand Account
      const account = algosdk.generateAccount()
      const mnemonic = algosdk.secretKeyToMnemonic(account.sk)


      

      // 🔹 Step 2. Save profile + wallet to Firestore
      await setDoc(
        doc(db, "users", user.uid),
        {
          profile: {
            surname,
            firstname,
            othernames,
            phone: `${countryCode}${phone}`,
            idType,
            idNumber,
            idImage,
            profilePhoto,
          },
          wallet: {
            address: `${account.addr}`,
            // mnemonic: encryptMnemonic(mnemonic),
            mnemonic: `${mnemonic}`,
          },
        },
        { merge: true }
      )

      setLoading(false)
      Alert.alert("Success", "Profile completed successfully!")

      // 🔹 Step 3. Redirect to dashboard
      router.replace("/tabs/profile")
    } catch (error) {
      console.error("CompleteProfile submission error:", error)
      setLoading(false)
      Alert.alert("Error", "Something went wrong while saving profile. Check console logs.")
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Complete Your Profile</Text>

      <TextInput
        style={styles.input}
        placeholder="Surname"
        value={surname}
        onChangeText={setSurname}
      />
      <TextInput
        style={styles.input}
        placeholder="First Name"
        value={firstname}
        onChangeText={setFirstname}
      />
      <TextInput
        style={styles.input}
        placeholder="Other Names"
        value={othernames}
        onChangeText={setOthernames}
      />

      <View style={styles.row}>
        <Picker
          selectedValue={countryCode}
          style={styles.picker}
          onValueChange={(itemValue) => setCountryCode(itemValue)}
        >
          <Picker.Item label="+234 (Nigeria)" value="+234" />
          <Picker.Item label="+1 (USA)" value="+1" />
          <Picker.Item label="+44 (UK)" value="+44" />
        </Picker>
        <TextInput
          style={[styles.input, { flex: 1 }]}
          placeholder="Phone Number"
          keyboardType="phone-pad"
          value={phone}
          onChangeText={setPhone}
        />
      </View>

      <Picker
        selectedValue={idType}
        style={styles.picker}
        onValueChange={(itemValue) => setIdType(itemValue)}
      >
        <Picker.Item label="National ID" value="National ID" />
        <Picker.Item label="Driver's License" value="Driver's License" />
        <Picker.Item label="Passport" value="Passport" />
      </Picker>

      <TextInput
        style={styles.input}
        placeholder="Identification Number"
        value={idNumber}
        onChangeText={setIdNumber}
      />

      {/* Profile Photo */}
      <Text style={styles.label}>Profile Photo</Text>
      {profilePhoto && <Image source={{ uri: profilePhoto }} style={styles.preview} />}
      <Button title="Take Profile Photo" onPress={() => pickImage(setProfilePhoto)} />

      {/* ID Photo */}
      <Text style={styles.label}>Means of Identification</Text>
      {idImage && <Image source={{ uri: idImage }} style={styles.preview} />}
      <Button title="Take Photo of ID" onPress={() => pickImage(setIdImage)} />

      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" style={{ marginTop: 20 }} />
      ) : (
        <Button title="Submit Profile" onPress={handleSubmit} />
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 20,
  },
  label: {
    marginTop: 10,
    marginBottom: 5,
    fontWeight: "600",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    marginBottom: 15,
    borderRadius: 8,
  },
  picker: {
    flex: 1,
    marginBottom: 15,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
  },
  preview: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 10,
  },
})

export default CompleteProfile
