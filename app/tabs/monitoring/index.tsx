// app/monitoring.tsx
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons"
import React, { useEffect, useRef, useState } from "react"
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Modal,
  SafeAreaView,
  StyleSheet,
  Switch,
  Text,
  TouchableOpacity,
  View,
} from "react-native"

import Header from "../../../src/components/header"

// ---------- CONFIG ----------
const WS_URL = "" // e.g. "wss://your-iot-backend.example/ws" — leave empty to use mock data

type Vital = {
  ts: number
  heartRate?: number
  spo2?: number
  systolic?: number
  diastolic?: number
  temperature?: number
}

type Device = {
  id: string
  name: string
  type: "wearable" | "ambulance" | "drone" | "helicopter" | "jet"
  location?: { lat: number; lng: number } | null
  lastSeen?: number
  vitals: Vital[]
  muted?: boolean
  status?: "online" | "offline"
}

// ---------- MOCK / INITIAL DEVICES ----------
const INITIAL_DEVICES: Device[] = [
  {
    id: "dev-001",
    name: "Wearable - John Doe",
    type: "wearable",
    location: { lat: 6.5244, lng: 3.3792 },
    vitals: [],
    status: "offline",
    muted: false,
  },
  {
    id: "dev-ambulance-01",
    name: "Ambulance - Lagos Central",
    type: "ambulance",
    location: { lat: 6.4500, lng: 3.3990 },
    vitals: [],
    status: "offline",
    muted: false,
  },
  {
    id: "dev-drone-01",
    name: "Response Drone - Sector 5",
    type: "drone",
    location: { lat: 6.5300, lng: 3.3600 },
    vitals: [],
    status: "offline",
    muted: false,
  },
]

// ---------- HELPERS ----------
const now = () => Date.now()

function generateVitalSnapshot(deviceId: string): { id: string; payload: Vital } {
  // Simple random vitals generator for demo/testing.
  const hr = Math.round(60 + Math.random() * 40) // 60-100
  const spo2 = Math.round(92 + Math.random() * 8) // 92-100
  const sys = Math.round(110 + Math.random() * 30) // 110-140
  const dia = Math.round(70 + Math.random() * 20) // 70-90
  const temp = Math.round((36 + Math.random() * 1.8) * 10) / 10 // 36.0-37.8
  return {
    id: deviceId,
    payload: {
      ts: now(),
      heartRate: hr,
      spo2,
      systolic: sys,
      diastolic: dia,
      temperature: temp,
    },
  }
}

// ---------- MAIN SCREEN ----------
export default function RemoteMonitoringScreen() {
  const [devices, setDevices] = useState<Device[]>(INITIAL_DEVICES)
  const [selectedDevice, setSelectedDevice] = useState<Device | null>(null)
  const wsRef = useRef<WebSocket | null>(null)
  const [connected, setConnected] = useState(false)
  const [useMock, setUseMock] = useState(WS_URL === "")

  // keep a circular buffer of vitals per device (max 20)
  const pushVital = (deviceId: string, vital: Vital) => {
    setDevices((prev) =>
      prev.map((d) =>
        d.id === deviceId
          ? {
              ...d,
              lastSeen: vital.ts,
              status: "online",
              vitals: [...(d.vitals || []).slice(-19), vital],
            }
          : d
      )
    )
  }

  // Initialize devices if empty
  useEffect(() => {
    if (!devices || devices.length === 0) {
      setDevices(INITIAL_DEVICES)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // WebSocket connection (if provided)
  useEffect(() => {
    if (!WS_URL || useMock) {
      setConnected(false)
      return
    }

    const ws = new WebSocket(WS_URL)
    wsRef.current = ws

    ws.onopen = () => {
      console.log("WS connected")
      setConnected(true)
      // Optionally subscribe to topics:
      // ws.send(JSON.stringify({ action: "subscribe", topic: "vitals.*" }))
    }

    ws.onmessage = (ev) => {
      try {
        const msg = JSON.parse(ev.data)
        // Expected message shape: { deviceId: "dev-001", ts: 123, vitals: { heartRate: 80, spo2: 98 } }
        if (msg?.deviceId && msg?.vitals) {
          pushVital(msg.deviceId, { ts: msg.ts || now(), ...msg.vitals })
        }
      } catch (err) {
        console.warn("Invalid WS message", err)
      }
    }

    ws.onerror = (err) => {
      console.warn("WS error", err)
    }

    ws.onclose = () => {
      console.log("WS closed")
      setConnected(false)
    }

    return () => {
      ws.close()
      wsRef.current = null
      setConnected(false)
    }
     
  }, [useMock])

  // Mock generator: emits periodic vitals for each device
  useEffect(() => {
    if (!useMock) return
    const interval = setInterval(() => {
      INITIAL_DEVICES.forEach((d) => {
        const snapshot = generateVitalSnapshot(d.id)
        pushVital(snapshot.id, snapshot.payload)
      })
    }, 3000) // every 3s
    return () => clearInterval(interval)
     
  }, [useMock])

  // Mark devices offline if not seen recently (e.g., 15s)
  useEffect(() => {
    const t = setInterval(() => {
      setDevices((prev) =>
        prev.map((d) => {
          if (!d.lastSeen) return { ...d, status: "offline" }
          return now() - (d.lastSeen || 0) > 15000 ? { ...d, status: "offline" } : d
        })
      )
    }, 5000)
    return () => clearInterval(t)
  }, [])

  const handleToggleMute = (deviceId: string) => {
    setDevices((prev) => prev.map((d) => (d.id === deviceId ? { ...d, muted: !d.muted } : d)))
  }

  const handlePairDevice = () => {
    // Simple pairing flow for demo: create a new mock device
    const id = `dev-${Math.random().toString(36).slice(2, 8)}`
    const newDev: Device = {
      id,
      name: `New Device ${id}`,
      type: "wearable",
      location: null,
      vitals: [],
      status: "offline",
      muted: false,
    }
    setDevices((prev) => [newDev, ...prev])
    Alert.alert("Paired", `Device ${id} paired locally. Configure provisioning to register with backend.`)
  }

  const renderDevice = ({ item }: { item: Device }) => {
    const latest = item.vitals[item.vitals.length - 1]
    return (
      <TouchableOpacity style={styles.deviceCard} onPress={() => setSelectedDevice(item)}>
        <View style={styles.deviceInfo}>
          <MaterialCommunityIcons
            name={
              item.type === "wearable"
                ? "watch"
                : item.type === "ambulance"
                ? "ambulance"
                : item.type === "drone"
                ? "drone"
                : "airplane"
            }
            size={28}
            color="#2563eb"
          />
          <View style={{ marginLeft: 12 }}>
            <Text style={styles.deviceName}>{item.name}</Text>
            <Text style={styles.deviceId}>{item.id}</Text>
          </View>
        </View>

        <View style={styles.deviceStats}>
          {latest ? (
            <>
              <Text style={styles.statText}>HR: {latest.heartRate} bpm</Text>
              <Text style={styles.statText}>SpO₂: {latest.spo2}%</Text>
              <Text style={[styles.statusBadge, item.status === "online" ? styles.online : styles.offline]}>
                {item.status}
              </Text>
            </>
          ) : (
            <Text style={styles.noDataText}>No telemetry</Text>
          )}
        </View>
      </TouchableOpacity>
    )
  }

  const deviceCount = devices.length
  const onlineCount = devices.filter((d) => d.status === "online").length

  return (
    
     <View style={{ flex: 1 }}>
       {/* <Stack.Screen options={{ headerShown: false }} /> */}
      <Header />
      <SafeAreaView style={styles.container}>
        <View style={styles.headerRow}>
          <Text style={styles.title}>Remote Health Monitoring</Text>
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <Text style={styles.smallText}>
              {onlineCount}/{deviceCount} online
            </Text>
            <TouchableOpacity
              style={styles.mockToggle}
              onPress={() => {
                setUseMock((s) => !s)
                Alert.alert("Data Source", useMock ? "Switching to real WS (if configured)" : "Using mock data")
              }}
            >
              <Text style={styles.mockToggleText}>{useMock ? "Mock" : "WS"}</Text>
            </TouchableOpacity>
          </View>
        </View>

        {!connected && !useMock ? (
          <View style={styles.wsStatus}>
            <ActivityIndicator />
            <Text style={{ marginLeft: 8 }}>Connecting to WebSocket...</Text>
          </View>
        ) : null}

        <FlatList
          data={devices}
          renderItem={renderDevice}
          keyExtractor={(it) => it.id}
          contentContainerStyle={{ paddingBottom: 120 }}
          ListEmptyComponent={<Text style={{ textAlign: "center", marginTop: 20 }}>No devices found</Text>}
        />

        <View style={styles.footerActions}>
          <TouchableOpacity style={styles.primaryBtn} onPress={handlePairDevice}>
            <Ionicons name="add" size={18} color="#fff" />
            <Text style={styles.primaryBtnText}>Pair Device</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.primaryBtn, { backgroundColor: "#059669" }]}
            onPress={() => Alert.alert("Export", "Export telemetry (CSV/JSON) - implement backend export")}
          >
            <Ionicons name="download" size={18} color="#fff" />
            <Text style={styles.primaryBtnText}>Export Data</Text>
          </TouchableOpacity>
        </View>

        {/* Device Detail Modal */}
        <Modal visible={!!selectedDevice} animationType="slide" onRequestClose={() => setSelectedDevice(null)}>
          {selectedDevice && (
            <SafeAreaView style={styles.modalContainer}>
              <View style={styles.modalHeader}>
                <TouchableOpacity onPress={() => setSelectedDevice(null)}>
                  <Ionicons name="chevron-back" size={28} color="#111827" />
                </TouchableOpacity>
                <Text style={styles.modalTitle}>{selectedDevice.name}</Text>
                <View style={{ width: 28 }} />
              </View>

              <View style={styles.modalBody}>
                <Text style={styles.sectionTitle}>Latest Vitals</Text>
                {selectedDevice.vitals.length === 0 ? (
                  <Text style={{ color: "#6b7280" }}>No telemetry yet</Text>
                ) : (
                  selectedDevice.vitals
                    .slice()
                    .reverse()
                    .slice(0, 8)
                    .map((v, i) => (
                      <View key={i} style={styles.vitalRow}>
                        <Text style={styles.vitalTs}>{new Date(v.ts).toLocaleTimeString()}</Text>
                        <Text style={styles.vitalText}>HR: {v.heartRate ?? "-"} bpm</Text>
                        <Text style={styles.vitalText}>SpO₂: {v.spo2 ?? "-"}%</Text>
                        <Text style={styles.vitalText}>T: {v.temperature ?? "-"}°C</Text>
                      </View>
                    ))
                )}

                <View style={styles.modalActions}>
                  <View style={styles.switchRow}>
                    <Text style={{ color: "#111827", fontWeight: "600" }}>Mute Alerts</Text>
                    <Switch
                      value={selectedDevice.muted}
                      onValueChange={() => {
                        handleToggleMute(selectedDevice.id)
                        // update local selectedDevice too
                        setSelectedDevice((prev) => (prev ? { ...prev, muted: !prev.muted } : prev))
                      }}
                    />
                  </View>

                  <TouchableOpacity
                    style={[styles.primaryBtn, { alignSelf: "stretch" }]}
                    onPress={() => Alert.alert("Telemetry", "Show live telemetry stream (implement streaming view)")}
                  >
                    <Ionicons name="tv" size={16} color="#fff" />
                    <Text style={styles.primaryBtnText}>View Live Telemetry</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={[styles.actionOutline]}
                    onPress={() => Alert.alert("Send Command", "Send command to device - implement RPC over MQTT/WS")}
                  >
                    <Text style={{ color: "#2563eb", fontWeight: "600" }}>Send Remote Command</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </SafeAreaView>
          )}
        </Modal>
      </SafeAreaView>
    </View>
  )
}

// ---------- STYLES ----------
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f9fafb" },
  headerRow: {
    padding: 16,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  title: { fontSize: 20, fontWeight: "700", color: "#111827" },
  smallText: { color: "#6b7280", marginRight: 8 },

  wsStatus: {
    paddingHorizontal: 16,
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 6,
  },

  deviceCard: {
    backgroundColor: "#fff",
    marginHorizontal: 16,
    marginVertical: 8,
    padding: 12,
    borderRadius: 12,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 2,
  },
  deviceInfo: { flexDirection: "row", alignItems: "center" },
  deviceName: { fontSize: 15, fontWeight: "700", color: "#111827" },
  deviceId: { fontSize: 12, color: "#6b7280" },

  deviceStats: { alignItems: "flex-end" },
  statText: { fontSize: 12, fontWeight: "600", color: "#111827" },
  noDataText: { color: "#6b7280" },

  statusBadge: {
    marginTop: 6,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    fontSize: 12,
    fontWeight: "700",
    overflow: "hidden",
  },
  online: { backgroundColor: "#ecfdf5", color: "#065f46, #065f46" /* not used */ },
  offline: { backgroundColor: "#f3f4f6" },

  footerActions: {
    position: "absolute",
    left: 16,
    right: 16,
    bottom: 24,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  primaryBtn: {
    backgroundColor: "#2563eb",
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderRadius: 12,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  primaryBtnText: { color: "#fff", marginLeft: 8, fontWeight: "700" },

  mockToggle: {
    marginLeft: 12,
    backgroundColor: "#e5e7eb",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
  },
  mockToggleText: { color: "#111827", fontWeight: "700" },

  // modal
  modalContainer: { flex: 1, backgroundColor: "#fff" },
  modalHeader: {
    paddingHorizontal: 12,
    paddingVertical: 14,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderBottomWidth: 1,
    borderBottomColor: "#e5e7eb",
  },
  modalTitle: { fontSize: 18, fontWeight: "700", color: "#111827" },
  modalBody: { padding: 16 },
  sectionTitle: { fontSize: 16, fontWeight: "700", marginBottom: 10, color: "#111827" },
  vitalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 8,
    borderBottomColor: "#f3f4f6",
    borderBottomWidth: 1,
  },
  vitalTs: { color: "#6b7280", width: 90 },
  vitalText: { color: "#111827", fontWeight: "600" },

  modalActions: { marginTop: 16 },
  switchRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 12 },

  actionOutline: {
    marginTop: 12,
    borderWidth: 1,
    borderColor: "#2563eb",
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: "center",
  },
})
