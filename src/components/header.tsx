import { useRouter } from "expo-router"
import * as SecureStore from "expo-secure-store"
import { getAuth, onAuthStateChanged, signOut } from "firebase/auth"
import { doc, getDoc, getFirestore } from "firebase/firestore"
import React, { useEffect, useState } from "react"
import { Alert, Image, StyleSheet, Text, TouchableOpacity, View } from "react-native"

const DISPENSER_KEY = "dikihealth_dispenser_mnemonic"

const Header: React.FC = () => {
  const [profile, setProfile] = useState<any>(null)
  const [user, setUser] = useState<any>(null)
  const auth = getAuth()
  const db = getFirestore()
  const router = useRouter()

  // 🔹 Watch for login/logout changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser)
      if (currentUser) {
        const snap = await getDoc(doc(db, "users", currentUser.uid))
        if (snap.exists()) {
          const data = snap.data()
          setProfile(data.profile)
        }
      } else {
        setProfile(null)
      }
    })

    return () => unsubscribe()
  }, [])

  const handleLogout = async () => {
    try {
      await SecureStore.deleteItemAsync(DISPENSER_KEY)
      await signOut(auth)
      router.replace("/tabs") // 👈 Redirect to homepage
    } catch (err) {
      console.error("Logout error:", err)
      Alert.alert("Error", "Could not log out, please try again.")
    }
  }

  return (
    <View style={styles.header}>
      {/* App Logo + Title as a link to homepage */}
      <TouchableOpacity
        style={styles.logoContainer}
        onPress={() => router.replace("/tabs")}
        activeOpacity={0.7}
      >
        <Image
          source={require("../../assets/images/logo.png")}
          style={styles.logo}
          resizeMode="contain"
        />
        <Text style={styles.title}>DikiHealth</Text>
      </TouchableOpacity>

      {/* User Profile + Auth Actions */}
      {user ? (
        <View style={styles.userSection}>
          {profile?.profilePhoto && (
            <Image source={{ uri: profile.profilePhoto }} style={styles.avatar} />
          )}
          <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
            <Text style={styles.logoutText}>Logout</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <TouchableOpacity
          style={styles.loginBtn}
          onPress={() => router.push("/(auth)/login")}
        >
          <Text style={styles.loginText}>Login</Text>
        </TouchableOpacity>
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#fff",
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  logoContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  logo: {
    width: 40,
    height: 40,
    marginRight: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#2a2a2a",
  },
  userSection: {
    flexDirection: "row",
    alignItems: "center",
  },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    marginRight: 10,
  },
  logoutBtn: {
    backgroundColor: "#ff4d4d",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
  },
  logoutText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 14,
  },
  loginBtn: {
    backgroundColor: "#4caf50",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  loginText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 14,
  },
})

export default Header
