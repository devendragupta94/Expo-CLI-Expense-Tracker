import { useAuth } from '@clerk/expo'
import { Redirect, Stack } from 'expo-router'

export default function Layout() {
  const { isSignedIn, isLoaded } = useAuth()

  // This is for a better user Experience (UX)
  if (!isLoaded) {
    return null
  }

  if (!isSignedIn) {
    return <Redirect href="/(auth)/sign-in" />
  }

  return <Stack screenOptions={{headerShown:false}}/>
}