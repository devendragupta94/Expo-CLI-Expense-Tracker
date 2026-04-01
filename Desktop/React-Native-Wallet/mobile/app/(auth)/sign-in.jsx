import { useSignIn } from '@clerk/expo'
import { Link, useRouter } from 'expo-router'
import React, { useState } from 'react'
import { Pressable, TextInput, View, Text, Image, TouchableOpacity } from 'react-native'
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { styles } from '@/assets/styles/auth.styles.js';
import { COLORS } from '../../constants/colors';
import { Ionicons } from '@expo/vector-icons';


export default function Page() {
  const { signIn, errors, fetchStatus } = useSignIn()
  const router = useRouter()

  const [emailAddress, setEmailAddress] = useState('')
  const [password, setPassword] = useState('')
  const [code, setCode] = useState('')
  const [error, setError] = useState('')

  const handleSubmit = async () => {
    const { error } = await signIn.password({
      emailAddress,
      password,
    })
    // if (error) {
    //   console.error(JSON.stringify(error, null, 2))
    //   return
    // }

    if (signIn.status === 'complete') {
      await signIn.finalize({
        navigate: ({ session, decorateUrl }) => {
          if (session?.currentTask) {
            // Handle pending session tasks
            // See https://clerk.com/docs/guides/development/custom-flows/authentication/session-tasks
            console.log(session?.currentTask)
            return
          }

          const url = decorateUrl('/')
          if (url.startsWith('http')) {
            window.location.href = url
          } else {
            router.push(url)
          }
        },
      })
    // } else if (signIn.status === 'needs_second_factor') {
    //   // See https://clerk.com/docs/guides/development/custom-flows/authentication/multi-factor-authentication
    // } else if (signIn.status === 'needs_client_trust') {
    //   // For other second factor strategies,
    //   // see https://clerk.com/docs/guides/development/custom-flows/authentication/client-trust
    //   const emailCodeFactor = signIn.supportedSecondFactors.find(
    //     (factor) => factor.strategy === 'email_code',
    //   )

    //   if (emailCodeFactor) {
    //     await signIn.mfa.sendEmailCode()
    //   }
    // }
    }
    else {
      // Check why the sign-in is not complete
      if (error) {
        console.log(error.errors?.[0]?.meta?.paramName);
        // error.errors?.[0]?.meta?.[0]?.paramName === "password"
        if (error.errors?.[0]?.meta?.paramName === "email_address") {
          setError(error.errors?.[0]?.message);
        }
        else if (error.errors?.[0]?.meta?.paramName === "password") {
          setError(error.errors?.[0]?.message);
        }
        else{
          setError(error.errors?.[0]?.message);
        }
      }

    }
  }

  // const handleVerify = async () => {
  //   await signIn.mfa.verifyEmailCode({ code })

  //   if (signIn.status === 'complete') {
  //     await signIn.finalize({
  //       navigate: ({ session, decorateUrl }) => {
  //         if (session?.currentTask) {
  //           // Handle pending session tasks
  //           // See https://clerk.com/docs/guides/development/custom-flows/authentication/session-tasks
  //           console.log(session?.currentTask)
  //           return
  //         }

  //         const url = decorateUrl('/')
  //         if (url.startsWith('http')) {
  //           window.location.href = url
  //         } else {
  //           router.push(url)
  //         }
  //       },
  //     })
  //   } else {
  //     // Check why the sign-in is not complete
  //     console.error('Sign-in attempt not complete:', signIn)
  //   }
  // }

  // if (signIn.status === 'needs_client_trust') {
  //   return (
  //     <View style={styles.container}>
  //       <Text style={[styles.title, { fontSize: 24, fontWeight: 'bold' }]}>
  //         Verify your account
  //       </Text>
  //       <TextInput
  //         style={styles.input}
  //         value={code}
  //         placeholder="Enter your verification code"
  //         placeholderTextColor="#666666"
  //         onChangeText={(code) => setCode(code)}
  //         keyboardType="numeric"
  //       />
  //       {errors.fields.code && (
  //         <Text style={styles.error}>{errors.fields.code.message}</Text>
  //       )}
  //       <Pressable
  //         style={({ pressed }) => [
  //           styles.button,
  //           fetchStatus === 'fetching' && styles.buttonDisabled,
  //           pressed && styles.buttonPressed,
  //         ]}
  //         onPress={handleVerify}
  //         disabled={fetchStatus === 'fetching'}
  //       >
  //         <Text style={styles.buttonText}>Verify</Text>
  //       </Pressable>
  //       <Pressable
  //         style={({ pressed }) => [styles.secondaryButton, pressed && styles.buttonPressed]}
  //         onPress={() => signIn.mfa.sendEmailCode()}
  //       >
  //         <Text style={styles.secondaryButtonText}>I need a new code</Text>
  //       </Pressable>
  //       <Pressable
  //         style={({ pressed }) => [styles.secondaryButton, pressed && styles.buttonPressed]}
  //         onPress={() => signIn.reset()}
  //       >
  //         <Text style={styles.secondaryButtonText}>Start over</Text>
  //       </Pressable>
  //     </View>
  //   )
  // }

  return (
    <KeyboardAwareScrollView
      style={{ flex: 1 }}
      contentContainerStyle={{ flexGrow: 1 }}
      enableOnAndroid={true}
      enableAutomaticScroll={true}
      extraScrollHeight={30}
    >
      <View style={styles.container}>
        <Image source={require("..//..//assets/images/revenue-i4.png")} style={styles.illustration}
        />
        <Text style={styles.title}>Welcome Back!</Text>

        {error ? (
          <View style={styles.errorBox}>
            <Ionicons name="alert-circle" size={20} color={COLORS.expense} />
            <Text style={styles.errorText}>{error}</Text>
            <TouchableOpacity onPress={() => setError("")}>
              <Ionicons name="close" size={20} color={COLORS.textLight} />
            </TouchableOpacity>
          </View>
        ) : null}


        <TextInput
          style={[styles.input, error && styles.errorInput]}
          autoCapitalize="none"
          value={emailAddress}
          placeholder="Enter email"
          placeholderTextColor="#666666"
          onChangeText={(emailAddress) => setEmailAddress(emailAddress)}
          keyboardType="email-address"
        />

        <TextInput
          style={[styles.input, error && styles.errorInput]}
          value={password}
          placeholder="Enter password"
          placeholderTextColor="#666666"
          secureTextEntry={true}
          onChangeText={(password) => setPassword(password)}
        />
        <TouchableOpacity
          style={styles.button}
          onPress={handleSubmit}
          disabled={!emailAddress || !password || fetchStatus === 'fetching'}
        >
          <Text style={styles.buttonText}>Sign In</Text>
        </TouchableOpacity>
        {/* For your debugging purposes. You can just console.log errors, but we put them in the UI for convenience */}
        {/* {errors && <Text style={styles.debug}>{JSON.stringify(errors, null, 2)}</Text>} */}

        <View style={styles.footerContainer}>
          <Text style={styles.footerText}>Don't have an account?</Text>
          <Link href="/sign-up" asChild>
            <TouchableOpacity>
              <Text style={styles.linkText}>Sign up</Text>
            </TouchableOpacity>
          </Link>
        </View>
      </View>
    </KeyboardAwareScrollView>
  )
}

