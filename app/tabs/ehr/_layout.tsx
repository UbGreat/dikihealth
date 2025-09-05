import { Stack } from 'expo-router';

export default function FeedLayout() {
  return <Stack screenOptions={{ 
        headerShown: false, // Hides the header for all screens in this tab navigator
      }} />;
}