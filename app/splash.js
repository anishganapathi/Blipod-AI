import { useEffect } from "react";
import { View, Text, StyleSheet } from "react-native";
import { useRouter } from "expo-router";

export default function SplashScreen() {
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      router.replace("/");  // Navigate to home
    }, 2000);

    return () => clearTimeout(timer);
  }, [router]);

  return (
    <View style={styles.container}>
      <Text style={styles.logo}>🚀 My App</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  logo: {
    fontSize: 28,
    fontWeight: "bold",
  },
});
