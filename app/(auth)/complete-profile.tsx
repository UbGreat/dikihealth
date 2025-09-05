// CompleteProfile.tsx

// Place the polyfill import at the very top, before any other imports
import "react-native-get-random-values";

import { Picker } from "@react-native-picker/picker";
import algosdk from "algosdk";
import * as ImagePicker from "expo-image-picker";
import { useRouter } from "expo-router";
import { getAuth } from "firebase/auth";
import { doc, getFirestore, setDoc } from "firebase/firestore";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Button,
  Image,
  Modal,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

const encryptMnemonic = (mnemonic: string) => mnemonic;

const CompleteProfile: React.FC = () => {
  const [surname, setSurname] = useState("");
  const [firstname, setFirstname] = useState("");
  const [othernames, setOthernames] = useState("");
  const [phone, setPhone] = useState("");
  const [countryCode, setCountryCode] = useState("+234");
  const [idType, setIdType] = useState("National ID");
  const [idNumber, setIdNumber] = useState("");
  const [idImage, setIdImage] = useState<string | null>(null);
  const [profilePhoto, setProfilePhoto] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const [step, setStep] = useState(1); // Track modal step
  const totalSteps = 5;
  const [modalVisible, setModalVisible] = useState(true);

  const auth = getAuth();
  const db = getFirestore();
  const router = useRouter();

  const pickImage = async (
    setter: React.Dispatch<React.SetStateAction<string | null>>
  ) => {
    try {
      const result = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });

      if (!result.canceled) {
        setter(result.assets[0].uri);
      }
    } catch (err) {
      console.error("ImagePicker error:", err);
      Alert.alert("Error", "Failed to open camera");
    }
  };

  const handleSubmit = async () => {
    if (
      !surname ||
      !firstname ||
      !phone ||
      !idType ||
      !idNumber ||
      !profilePhoto
    ) {
      Alert.alert(
        "Error",
        "Please fill all required fields including profile photo"
      );
      return;
    }

    try {
      setLoading(true);
      const user = auth.currentUser;
      if (!user) {
        Alert.alert("Error", "No authenticated user");
        return;
      }

      // `algosdk.generateAccount()` will now use the correctly polyfilled
      // `crypto.getRandomValues` function to generate the account.
      const account = algosdk.generateAccount();
      const mnemonic = algosdk.secretKeyToMnemonic(account.sk);
      


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
            mnemonic: `${mnemonic}`,
          },
        },
        { merge: true }
      );

      setLoading(false);
      Alert.alert("Success", "Profile completed successfully!");
      router.replace("/tabs/profile");
    } catch (error) {
      console.error("CompleteProfile submission error:", error);
      setLoading(false);
      Alert.alert(
        "Error",
        "Something went wrong while saving profile. Check console logs."
      );
    }
  };

  const renderStepContent = () => {
    switch (step) {
      case 1:
        return (
          <>
            <Text style={styles.title}>Step 1: Personal Details</Text>
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
          </>
        );
      case 2:
        return (
          <>
            <Text style={styles.title}>Step 2: Phone Number</Text>
            <View style={styles.row}>
              <Picker
                selectedValue={countryCode}
                style={styles.picker}
                onValueChange={setCountryCode}
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
          </>
        );
      case 3:
        return (
          <>
            <Text style={styles.title}>Step 3: Identification</Text>
            <Picker
              selectedValue={idType}
              style={styles.picker}
              onValueChange={setIdType}
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
          </>
        );
      case 4:
        return (
          <>
            <Text style={styles.title}>Step 4: Upload Photos</Text>
            <Text style={styles.label}>Profile Photo</Text>
            {profilePhoto && (
              <Image source={{ uri: profilePhoto }} style={styles.preview} />
            )}
            <Button
              title="Take Profile Photo"
              onPress={() => pickImage(setProfilePhoto)}
            />
            <Text style={styles.label}>Means of Identification</Text>
            {idImage && (
              <Image source={{ uri: idImage }} style={styles.preview} />
            )}
            <Button title="Take Photo of ID" onPress={() => pickImage(setIdImage)} />
          </>
        );
      case 5:
        return (
          <>
            <Text style={styles.title}>Step 5: Review & Submit</Text>
            <Text>
              Full Name: {surname} {firstname} {othernames}
            </Text>
            <Text>
              Phone: {countryCode}
              {phone}
            </Text>
            <Text>
              ID: {idType} - {idNumber}
            </Text>
            <Text>Profile Photo: {profilePhoto ? "✅" : "❌"}</Text>
            <Text>ID Photo: {idImage ? "✅" : "❌"}</Text>
            {loading ? (
              <ActivityIndicator size="large" color="#0000ff" />
            ) : (
              <Button title="Submit Profile" onPress={handleSubmit} />
            )}
          </>
        );
      default:
        return null;
    }
  };

  return (
    <Modal visible={modalVisible} animationType="slide" transparent={false}>
      <View style={styles.container}>
        {/* Progress Bar */}
        <View style={styles.progressBar}>
          <View
            style={[styles.progress, { width: `${(step / totalSteps) * 100}%` }]}
          />
        </View>

        {renderStepContent()}

        {/* Navigation */}
        <View style={styles.navRow}>
          {step > 1 && <Button title="Back" onPress={() => setStep(step - 1)} />}
          {step < totalSteps && (
            <Button title="Next" onPress={() => setStep(step + 1)} />
          )}
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#fff",
    justifyContent: "center",
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 15,
  },
  label: {
    marginTop: 10,
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
  progressBar: {
    height: 8,
    backgroundColor: "#eee",
    borderRadius: 4,
    marginBottom: 20,
  },
  progress: {
    height: "100%",
    backgroundColor: "#007bff",
    borderRadius: 4,
  },
  navRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
  },
});

export default CompleteProfile;
