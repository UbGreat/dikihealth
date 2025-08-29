import { useRouter } from "expo-router"
import { Button, Text, View } from "react-native"

export default function ProfilePage() {
  const router = useRouter()

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text>User Profile</Text>
      <Text>Name: John Doe</Text>
      <Text>Email: john@example.com</Text>
      <Button title="Edit Profile" onPress={() => router.push("/(auth)/complete-profile")} />
    </View>
  )
}
