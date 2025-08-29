// import algosdk from "algosdk"
// import React, { useEffect, useState } from "react"
// import { ActivityIndicator, FlatList, StyleSheet, Text, TouchableOpacity, View } from "react-native"
// import { algodClient } from "../../../src/utils/algoClient"
// import { connectWallet, disconnectWallet, reconnectWallet } from "../../../src/utils/wallet"

// export default function WalletPage() {
//   const [accounts, setAccounts] = useState<string[]>([])
//   const [balances, setBalances] = useState<{ [key: string]: number }>({})
//   const [loading, setLoading] = useState(false)

//   const mnemonic = ""
//   const account = algosdk.mnemonicToSecretKey(mnemonic)

// console.log("Address:", account.addr)
// // Use account.sk (secret key) for signing txns


//   useEffect(() => {
//     const restoreSession = async () => {
//       const accs = await reconnectWallet()
//       if (accs) {
//         setAccounts(accs)
//         fetchBalances(accs)
//       }
//     }
//     restoreSession()
//   }, [])

//   const handleConnect = async () => {
//     const accs = await connectWallet()
//     if (accs) {
//       setAccounts(accs)
//       fetchBalances(accs)
//     }
//   }

//   const handleDisconnect = () => {
//     disconnectWallet()
//     setAccounts([])
//     setBalances({})
//   }

//   const fetchBalances = async (accs: string[]) => {
//     setLoading(true)
//     try {
//       const newBalances: { [key: string]: number } = {}
//       for (let addr of accs) {
//         const accountInfo = await algodClient.accountInformation(addr).do()
//         // Algo balance is in microAlgos, so divide by 1e6
//         newBalances[addr] = accountInfo.amount / 1e6
//       }
//       setBalances(newBalances)
//     } catch (err) {
//       console.error("Error fetching balance:", err)
//     } finally {
//       setLoading(false)
//     }
//   }

//   return (
//     <View style={styles.container}>
//       <Text style={styles.title}>Algorand Wallet</Text>

//       {accounts.length === 0 ? (
//         <TouchableOpacity style={styles.button} onPress={handleConnect}>
//           <Text style={styles.buttonText}>Connect Wallet</Text>
//         </TouchableOpacity>
//       ) : (
//         <>
//           <Text style={styles.subtitle}>Connected Accounts:</Text>
//           {loading && <ActivityIndicator size="large" color="#4285F4" />}
//           <FlatList
//             data={accounts}
//             keyExtractor={(item) => item}
//             renderItem={({ item }) => (
//               <View style={styles.accountBox}>
//                 <Text style={styles.accountText}>{item}</Text>
//                 <Text style={styles.balanceText}>
//                   Balance: {balances[item] !== undefined ? balances[item].toFixed(6) : "..."} ALGO
//                 </Text>
//               </View>
//             )}
//           />

//           <TouchableOpacity style={[styles.button, styles.disconnect]} onPress={handleDisconnect}>
//             <Text style={styles.buttonText}>Disconnect</Text>
//           </TouchableOpacity>
//         </>
//       )}
//     </View>
//   )
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     padding: 20,
//     backgroundColor: "#f9f9f9",
//   },
//   title: {
//     fontSize: 24,
//     fontWeight: "bold",
//     marginBottom: 16,
//   },
//   subtitle: {
//     fontSize: 18,
//     marginBottom: 8,
//   },
//   button: {
//     backgroundColor: "#4285F4",
//     padding: 14,
//     borderRadius: 8,
//     alignItems: "center",
//     marginTop: 12,
//   },
//   disconnect: {
//     backgroundColor: "red",
//     marginTop: 20,
//   },
//   buttonText: {
//     color: "#fff",
//     fontWeight: "bold",
//   },
//   accountBox: {
//     padding: 12,
//     marginVertical: 6,
//     backgroundColor: "#eee",
//     borderRadius: 8,
//   },
//   accountText: {
//     fontSize: 14,
//     fontWeight: "600",
//   },
//   balanceText: {
//     fontSize: 14,
//     marginTop: 4,
//     color: "#333",
//   },
// })
