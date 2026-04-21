import { Ionicons } from "@expo/vector-icons";
import Constants from "expo-constants";
import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React from "react";
import {
  Dimensions,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const { width } = Dimensions.get("window");

export default function WelcomeScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <StatusBar style="light" />

      <View style={styles.backgroundOverlay}>
        <View style={styles.topCircle} />
      </View>

      <View style={styles.content}>
        <View style={styles.logoContainer}>
          <View style={styles.iconCircle}>
            <Ionicons name="car-sport" size={60} color="#FFF" />
          </View>
        </View>

        <View style={styles.textSection}>
          <Text style={styles.title}>Covoit'Pro</Text>
          <Text style={styles.subtitle}>
            Simplifiez vos trajets entre collègues.{"\n"}
            Économisez, partagez, roulez.
          </Text>
        </View>

        <View style={styles.buttonSection}>
          <TouchableOpacity
            style={styles.primaryButton}
            onPress={() => router.push("/(auth)/login")}
          >
            <Text style={styles.primaryButtonText}>Se connecter</Text>
            <Ionicons name="arrow-forward" size={20} color="#141E30" />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.secondaryButton}
            onPress={() => router.push("/(auth)/register")}
          >
            <Text style={styles.secondaryButtonText}>Créer un compte</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.footerContainer}>
          <Text style={styles.versionText}>
            {`Version ${Constants.expoConfig?.version}`}
          </Text>
          <Text style={styles.copyrightText}>© 2026 Covoit'Pro Inc.</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#141E30",
  },
  backgroundOverlay: {
    ...StyleSheet.absoluteFillObject,
    overflow: "hidden",
  },
  topCircle: {
    width: width * 1.5,
    height: width * 1.5,
    borderRadius: width * 0.75,
    backgroundColor: "#243B55",
    position: "absolute",
    top: -width * 0.8,
    left: -width * 0.25,
  },
  content: {
    flex: 1,
    justifyContent: "space-between",
    paddingHorizontal: 30,
    paddingTop: 100,
    paddingBottom: 40,
  },
  logoContainer: {
    alignItems: "center",
    marginTop: 40,
  },
  iconCircle: {
    width: 120,
    height: 120,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderRadius: 40,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.2)",
  },
  textSection: {
    alignItems: "center",
  },
  title: {
    fontSize: 40,
    fontWeight: "900",
    color: "#FFF",
    letterSpacing: 1,
  },
  subtitle: {
    fontSize: 16,
    color: "#B9B9B9",
    textAlign: "center",
    marginTop: 15,
    lineHeight: 24,
  },
  buttonSection: {
    gap: 15,
  },
  primaryButton: {
    backgroundColor: "#FFF",
    height: 60,
    borderRadius: 20,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 10,
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
  },
  primaryButtonText: {
    color: "#141E30",
    fontSize: 18,
    fontWeight: "700",
  },
  secondaryButton: {
    height: 60,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.3)",
  },
  secondaryButtonText: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "600",
  },
  footerContainer: {
    alignItems: "center",
    gap: 4,
  },
  versionText: {
    color: "rgba(255, 255, 255, 0.3)",
    fontSize: 12,
    fontWeight: "600",
    letterSpacing: 0.5,
  },
  copyrightText: {
    color: "rgba(255, 255, 255, 0.2)",
    fontSize: 10,
    textTransform: "uppercase",
  },
});
