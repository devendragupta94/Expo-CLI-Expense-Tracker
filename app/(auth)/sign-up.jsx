import { useAuth, useSignUp } from '@clerk/expo'
import { Link, useRouter } from 'expo-router'
import { useState } from 'react'
import { Pressable, TextInput, View, Text, TouchableOpacity } from 'react-native'
import { styles } from '@/assets/styles/auth.styles.js'
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from "../../constants/colors";
import { Image } from "expo-image";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";


export default function Page() {
  const { signUp, errors, fetchStatus } = useSignUp();
  const { isSignedIn } = useAuth();
  const router = useRouter();

  const [emailAddress, setEmailAddress] = useState('');
  const [password, setPassword] = useState('');
  const [code, setCode] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async () => {
    const { error } = await signUp.password({
      emailAddress,
      password,
    })
    errors.fields.emailAddress.message
    if (error) {
      console.log(error.errors?.[0]?.meta?.paramName);
      // error.errors?.[0]?.meta?.[0]?.paramName === "password"
      if(error.errors?.[0]?.meta?.paramName === "email_address"){
        setError(error.errors?.[0]?.message);
      }
      else if (error.errors?.[0]?.meta?.paramName === "password"){
        setError(error.errors?.[0]?.message);
      }
      // console.log(error);
    }

    if (!error) await signUp.verifications.sendEmailCode()
  }

  const handleVerify = async () => {
    await signUp.verifications.verifyEmailCode({
      code,
    })
    if (signUp.status === 'complete') {
      await signUp.finalize({
        // Redirect the user to the home page after signing up
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
    } else {
      // Check why the sign-up is not complete
      console.error('Sign-up attempt not complete:', signUp)
    }
  }

  if (signUp.status === 'complete' || isSignedIn) {
    return null
  }



  if (
    signUp.status === 'missing_requirements' &&
    signUp.unverifiedFields.includes('email_address') &&
    signUp.missingFields.length === 0
  ) {
    return (
      <View style={styles.verificationContainer}>
        <Text style={styles.verificationTitle}>
          Verify your account
        </Text>

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
          style={[styles.verificationInput, error && styles.errorInput]}
          value={code}
          placeholder="Enter your verification code"
          placeholderTextColor="#666666"
          onChangeText={(code) => setCode(code)}
          keyboardType="numeric"
        />
        {errors.fields.code && (
          <Text>{errors.fields.code.message}</Text>
        )}
        <TouchableOpacity
          style={styles.button}
          onPress={handleVerify}
          disabled={fetchStatus === 'fetching'}
        >
          <Text style={styles.buttonText}>Verify</Text>
        </TouchableOpacity>
        <Pressable
          onPress={() => signUp.verifications.sendEmailCode()}
        >
          <Text>I need a new code</Text>
        </Pressable>
      </View>
    )
  }

  return (
    <KeyboardAwareScrollView
      style={{ flex: 1 }}
      contentContainerStyle={{ flexGrow: 1 }}
      enableOnAndroid={true}
      enableAutomaticScroll={true}
    >
      <View style={styles.container}>
        <Image source={require("../../assets/images/revenue-i2.png")} style={styles.illustration}
        />

        <Text style={styles.title}>Create Account</Text>

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
        {/* {errors.fields.emailAddress && (
          <Text>{errors.fields.emailAddress.message}</Text>
        )} */}

        <TextInput
          style={[styles.input, error && styles.errorInput]}
          value={password}
          placeholder="Enter password"
          placeholderTextColor="#666666"
          secureTextEntry={true}
          onChangeText={(password) => setPassword(password)}
        />
        {/* {errors.fields.password && (
          <Text>{errors.fields.password.message}</Text>
        )} */}
        <TouchableOpacity
          style={styles.button}
          onPress={handleSubmit}
          disabled={!emailAddress || !password || fetchStatus === 'fetching'}
        >
          <Text style={styles.buttonText}>Sign up</Text>
        </TouchableOpacity>
        {/* For your debugging purposes. You can just console.log errors, but we put them in the UI for convenience */}
        {/* {errors && <Text style={styles.debug}>{JSON.stringify(errors, null, 2)}</Text>} */}

        <View style={styles.footerContainer}>
          <Text style={styles.footerText}>Already have an account?</Text>
          <TouchableOpacity onPress={() => router.back()}>
            <Text style={styles.linkText}>Sign in</Text>
          </TouchableOpacity>
        </View>

        {/* Required for sign-up flows. Clerk's bot sign-up protection is enabled by default */}
        <View nativeID="clerk-captcha" />
      </View>
    </KeyboardAwareScrollView>
  )
}
