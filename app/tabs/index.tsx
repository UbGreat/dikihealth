// app/index.tsx
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons"
import { useRouter } from "expo-router"
import React from "react"
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native"

type CardProps = {
  title: string
  subtitle?: string
  onPress?: () => void
  leftIcon?: React.ReactNode
  testID?: string
}

const FeatureCard: React.FC<CardProps> = ({ title, subtitle, onPress, leftIcon, testID }) => (
  <TouchableOpacity
    onPress={onPress}
    style={styles.featureCard}
    accessibilityRole="button"
    accessibilityLabel={title}
    testID={testID}
  >
    <View style={styles.iconWrapper}>{leftIcon}</View>
    <Text style={styles.featureTitle}>{title}</Text>
    {subtitle ? <Text style={styles.featureSubtitle}>{subtitle}</Text> : null}
  </TouchableOpacity>
)

export default function Home() {
  const router = useRouter()

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 40 }}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.appName}>DikyHealth</Text>
      

        <Text style={styles.subtitle}>Digital healthcare platform</Text>
      </View>

      {/* Primary highlight: EHR */}
      <TouchableOpacity
        style={styles.highlightCard}
        onPress={() => router.push("/tabs/ehr")}
        accessibilityRole="button"
        accessibilityLabel="Electronic Health Records"
        testID="ehr-highlight"
      >
        <View style={styles.highlightContent}>
          <View style={{ flex: 1 }}>
            <Text style={styles.highlightTitle}>Electronic Health Records</Text>
            <Text style={styles.highlightSubtitle}>Secure, portable, verifiable</Text>
          </View>
          <Ionicons name="document-text" size={40} color="#fff" />
        </View>
      </TouchableOpacity>

      {/* Core modules */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Features</Text>
        <View style={styles.grid}>
          <FeatureCard
            title="Wallet"
            subtitle="Manage keys & sign"
            onPress={() => router.push("/tabs/wallet")}
            leftIcon={<MaterialCommunityIcons name="wallet" size={28} color="#2563eb" />}
            testID="wallet-card"
          />
          <FeatureCard
            title="Healthcare Assets (ASA)"
            subtitle="Invest • Lease • Track"
            onPress={() => router.push("/tabs/assets")}
            leftIcon={<MaterialCommunityIcons name="cube-outline" size={28} color="#2563eb" />}
            testID="asa-card"
          />
          <FeatureCard
            title="Remote Monitoring (IoT)"
            subtitle="Vitals • Wearables • Alerts"
            onPress={() => router.push("/tabs/monitoring")}
            leftIcon={<Ionicons name="pulse-outline" size={28} color="#2563eb" />}
            testID="iot-card"
          />
          <FeatureCard
            title="EHR"
            subtitle="Care history & labs"
            onPress={() => router.push("/tabs/ehr")}
            leftIcon={<Ionicons name="document-text-outline" size={28} color="#2563eb" />}
            testID="ehr-card"
          />
        </View>
      </View>

      {/* Emergency response */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Emergency Response</Text>
        <View style={styles.grid}>
          <FeatureCard
            title="IoT Drone"
            subtitle="Rapid AED & meds"
            onPress={() => router.push("/tabs/emergency")}
            leftIcon={<MaterialCommunityIcons name="drone" size={28} color="#2563eb" />}
            testID="drone-card"
          />
          <FeatureCard
            title="Ambulance"
            subtitle="Ground transport"
            onPress={() => router.push("/tabs/emergency")}
            leftIcon={<MaterialCommunityIcons name="ambulance" size={28} color="#2563eb" />}
            testID="ambulance-card"
          />
          <FeatureCard
            title="Helicopter"
            subtitle="Air medevac"
            onPress={() => router.push("/tabs/emergency")}
            leftIcon={<MaterialCommunityIcons name="helicopter" size={28} color="#2563eb" />}
            testID="helicopter-card"
          />
          <FeatureCard
            title="Private Jet"
            subtitle="Long-range medevac"
            onPress={() => router.push("/tabs/emergency")}
            leftIcon={<MaterialCommunityIcons name="airplane" size={28} color="#2563eb" />}
            testID="jet-card"
          />
        </View>
      </View>

      {/* Investment CTA */}
      <TouchableOpacity
        style={styles.ctaCard}
        onPress={() => router.push("/tabs/assets/invest")}
        accessibilityRole="button"
        accessibilityLabel="Invest in healthcare assets"
        testID="invest-cta"
      >
        <View style={styles.highlightContent}>
          <View style={{ flex: 1 }}>
            <Text style={styles.ctaTitle}>Invest in Healthcare Infrastructure</Text>
            <Text style={styles.ctaSubtitle}>Algorand ASAs: facilities, equipment & platforms</Text>
          </View>
          <MaterialCommunityIcons name="chart-areaspline" size={36} color="#1f2937" />
        </View>
      </TouchableOpacity>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f9fafb",
    paddingHorizontal: 16,
    paddingTop: 24,
  },
  header: { marginBottom: 20 },
  appName: { fontSize: 26, fontWeight: "bold", color: "#111827" },
  subtitle: { color: "#6b7280", marginTop: 4 },

  highlightCard: {
    backgroundColor: "#2563eb",
    borderRadius: 20,
    padding: 20,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 6,
    elevation: 4,
  },
  highlightContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  highlightTitle: { color: "#fff", fontSize: 18, fontWeight: "700" },
  highlightSubtitle: { color: "#e0e7ff", marginTop: 4 },

  section: { marginTop: 8 },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#111827",
    marginBottom: 12,
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  featureCard: {
    backgroundColor: "#fff",
    width: "48%",
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 3,
  },
  iconWrapper: {
    backgroundColor: "#eff6ff",
    padding: 10,
    borderRadius: 12,
    alignSelf: "flex-start",
  },
  featureTitle: {
    marginTop: 8,
    fontSize: 15,
    fontWeight: "600",
    color: "#111827",
  },
  featureSubtitle: {
    marginTop: 4,
    fontSize: 12,
    color: "#6b7280",
  },

  ctaCard: {
    backgroundColor: "#e5e7eb",
    borderRadius: 16,
    padding: 18,
    marginTop: 8,
  },
  ctaTitle: { fontSize: 16, fontWeight: "700", color: "#111827" },
  ctaSubtitle: { marginTop: 4, color: "#374151" },
})
