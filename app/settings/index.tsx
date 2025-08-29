import { useRouter } from "expo-router"
import { Button, Text, View } from "react-native"

export default function SettingsHome() {
  const router = useRouter()

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text>App Settings</Text>
      <Button title="Profile" onPress={() => router.push("/tabs/profile/index")} />
      <Button title="Preferences" onPress={() => router.push("/tabs/settings/preferences")} />
    </View>
  )
}
