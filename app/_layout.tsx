import { Stack } from 'expo-router';


export default function RootLayout() {
  return (
    <Stack screenOptions={{ 
        headerShown: false, // Hides the header for all screens in this tab navigator
      }}>
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
    </Stack>
  );
}
