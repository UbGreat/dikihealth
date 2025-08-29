import { useRouter } from "expo-router"
import { useState } from "react"
import { Button, Text, TextInput, View } from "react-native"

export default function CompleteProfile() {
  const router = useRouter()
  const [name, setName] = useState("")
  const [role, setRole] = useState("")

  const handleComplete = () => {
    // Save user profile data to backend or context
    // router.replace("/(tabs)")
  }

  return (
    <View style={{ padding: 20 }}>
      <Text style={{ fontSize: 18, marginBottom: 10 }}>Complete Your Profile</Text>
      <TextInput placeholder="Full Name" value={name} onChangeText={setName} />
      <TextInput placeholder="Role (Doctor, Patient, Investor)" value={role} onChangeText={setRole} />
      <Button title="Continue" onPress={handleComplete} />
    </View>
  )
}
