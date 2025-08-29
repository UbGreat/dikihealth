import { useRouter } from "expo-router"
import { Dimensions, Image, StyleSheet, Text, TouchableOpacity, View } from "react-native"

const { width, height } = Dimensions.get("window")

export default function Step2() {
  const router = useRouter()

  return (
    <View style={styles.container}>
      {/* Illustration */}
      <Image
        source={require("../../assets/images/onboarding2.png")}
        style={styles.image}
      />

      {/* Title & Description */}
      <Text style={styles.title}>Emergency Response</Text>
      <Text style={styles.description}>
        Get rapid access to IoT and GPS enabled ambulances, drones, helicopters, and private jets 
        when every second counts.
      </Text>

      {/* Navigation Buttons */}
      <View style={styles.footer}>
        <TouchableOpacity onPress={() => router.replace("/(auth)/signup")}>
          <Text style={styles.skip}>Skip</Text>
        </TouchableOpacity>
        {/* /(auth)/onboarding/step3 */}
        <TouchableOpacity
          style={styles.nextButton}
          onPress={() => router.push("/(onboarding)/step3")}
        >
          <Text style={styles.nextText}>Next</Text>
        </TouchableOpacity>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  image: {
    width: width * 0.8,
    height: height * 0.4,
    resizeMode: "contain",
    marginBottom: 30,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 10,
  },
  description: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    paddingHorizontal: 20,
    marginBottom: 40,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    paddingHorizontal: 20,
  },
  skip: {
    fontSize: 16,
    color: "#999",
  },
  nextButton: {
    backgroundColor: "#4caf50",
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 8,
  },
  nextText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
})
