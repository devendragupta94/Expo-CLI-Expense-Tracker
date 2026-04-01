import { Show, useUser } from '@clerk/expo'
import { useClerk } from '@clerk/expo'
import { Link, router, useRouter } from 'expo-router'
import { Text, View, Pressable, StyleSheet, Image, TouchableOpacity, Alert, FlatList, RefreshControl } from 'react-native'
import { useTransactions } from '../../hooks/useTransactions'
import { useEffect, useState } from 'react'
import PageLoader from '../../components/PageLoader'
import { styles } from '../../assets/styles/home.styles'
import { Ionicons } from '@expo/vector-icons';
// import { SignOutButton } from '../../components/SignOutButton.jsx'
import { COLORS } from '../../constants/colors.js'
import { BalanceCard } from '../../components/BalanceCard.jsx'
import { TransactionItem } from '../../components/TransactionItem.jsx'
import NoTransactionsFound from '../../components/NoTransactionsFound.jsx'

export default function Page() {
  const { user } = useUser();
  const router  = useRouter();
  const [refreshing, setRefreshing] = useState(false);
  const { transactions, summary, isLoading, loadData, deleteTransaction } = useTransactions(user.id);
  
  const onRefresh = async()=>{
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  }
  
  useEffect(() => {
    loadData();
  }, [loadData]);

  if (isLoading && !refreshing) return <PageLoader />
  console.log(user.id);

  const handleDelete = (id) =>{
    Alert.alert("Delete Transaction", "Are you sure to delete this transaction?",[
      {text : "Cancel", style: "cancel"},
      {text : "Delete", style: "destructive", onPress: ()=> deleteTransaction(id) },
    ]);
  };


  const { signOut } = useClerk();
  const handleSignOut = async () => {
    Alert.alert("Logout", "Are you sure you want to logout?", [
      { text: "Cancel", style: "cancel" },
      { text: "Logout", style: "destructive", onPress: signOut },
    ]);
  };

  // const { signOut } = useClerk()
  return (
    <View style={styles.container}>
      <View style={styles.content}>
        {/* Header */}
        <View style={styles.header}>
          {/* LEFT */}
          <View style={styles.headerLeft}>
            <Image
              source={require("../../assets/images/logo.png")}
              style={styles.headerLogo}
              resizeMode="contain"
            />
            <View style={styles.welcomeContainer}>
              <Text style={styles.welcomeText}>Welcome,</Text>
              <Text style={styles.usernameText}>
                {user?.emailAddresses[0]?.emailAddress.split("@")[0]}
              </Text>
            </View>
          </View>
          {/* RIGHT */}
          <View style={styles.headerRight}>
            <TouchableOpacity style={styles.addButton} onPress={() => router.push("/create")}>
              <Ionicons name="add" size={20} color="#FFF" />
              <Text style={styles.addButtonText}>Add</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.logoutButton} onPress={handleSignOut}>
              <Ionicons name="log-out-outline" size={22} color={COLORS.text}/>
            </TouchableOpacity>
          </View>
        </View>
        <BalanceCard summary={summary}/>
        <View style={styles.transactionsHeaderContainer}>
          <Text style={styles.sectionTitle}>Recent Transactions</Text>
        </View>
      </View>
      <FlatList
        style={styles.transactionsList}
        contentContainerStyle={styles.transactionsListContent}
        data={transactions}
        renderItem={({item}) => (
          <TransactionItem item={item} onDelete={handleDelete} />
        )}
        ListEmptyComponent={<NoTransactionsFound/>}
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh}/>}
      />
    </View>
  )
}

