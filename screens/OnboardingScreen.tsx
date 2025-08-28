// app/onboarding.tsx
import React, { useState } from "react"
import {
    Dimensions,
    FlatList,
    Image,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native"

const { width } = Dimensions.get("window")

const slides = [
  {
    id: "1",
    title: "Secure Health Records",
    description: "Manage and access your EHR securely with Algorand blockchain.",
    image: require("../assets/onboarding1.png"),
  },
  {
    id: "2",
    title: "Wallet & Investments",
    description:
      "Use Algorand wallet for healthcare payments and invest in assets.",
    image: require("../assets/onboarding2.png"),
  },
  {
    id: "3",
    title: "Emergency Response",
    description:
      "IoT-enabled drones, ambulances, helicopters, and private jets for emergencies.",
    image: require("../assets/onboarding3.png"),
  },
]

export default function OnboardingScreen({ navigation }) {
  const [currentIndex, setCurrentIndex] = useState(0)

  const handleScroll = (event) => {
    const index = Math.round(
      event.nativeEvent.contentOffset.x / width
    )
    setCurrentIndex(index)
  }

  const handleNext = () => {
    if (currentIndex < slides.length - 1) {
      setCurrentIndex(currentIndex + 1)
    } else {
      navigation.replace("Login") // 👈 go to login after onboarding
    }
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={slides}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.slide}>
            <Image source={item.image} style={styles.image} />
            <Text style={styles.title}>{item.title}</Text>
            <Text style={styles.description}>{item.description}</Text>
          </View>
        )}
        onScroll={handleScroll}
      />

      {/* Dots */}
      <View style={styles.dotsContainer}>
        {slides.map((_, index) => (
          <View
            key={index}
            style={[
              styles.dot,
              { opacity: index === currentIndex ? 1 : 0.3 },
            ]}
          />
        ))}
      </View>

      {/* Next / Get Started button */}
      <TouchableOpacity style={styles.button} onPress={handleNext}>
        <Text style={styles.buttonText}>
          {currentIndex === slides.length - 1 ? "Get Started" : "Next"}
        </Text>
      </TouchableOpacity>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f9fafb",
    alignItems: "center",
    justifyContent: "center",
  },
  slide: {
    width,
    alignItems: "center",
    padding: 20,
  },
  image: { width: 250, height: 250, resizeMode: "contain", marginBottom: 20 },
  title: { fontSize: 24, fontWeight: "700", textAlign: "center" },
  description: {
    fontSize: 14,
    color: "#6b7280",
    textAlign: "center",
    marginTop: 8,
  },
  dotsContainer: {
    flexDirection: "row",
    marginTop: 16,
    marginBottom: 20,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#2563eb",
    marginHorizontal: 4,
  },
  button: {
    backgroundColor: "#2563eb",
    paddingVertical: 14,
    paddingHorizontal: 40,
    borderRadius: 12,
  },
  buttonText: { color: "#fff", fontWeight: "700", fontSize: 16 },
})
