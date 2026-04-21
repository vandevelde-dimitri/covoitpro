import { Register } from "@/src/domain/entities/auth/Register";
import { Ionicons } from "@expo/vector-icons";
import { yupResolver } from "@hookform/resolvers/yup";
import { useRouter } from "expo-router";
import React from "react";
import { useForm } from "react-hook-form";
import {
  KeyboardAvoidingView,
  Linking,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import * as yup from "yup";
import { FormInput } from "../../components/ui/FormInput";
import { ScreenWrapper } from "../../components/ui/ScreenWrapper";
import { useRegister } from "../../hooks/mutations/useRegister";
import { usePasswordValidation } from "../../hooks/usePasswordValidation";

const ValidationRow = ({ label, valid }: { label: string; valid: boolean }) => (
  <View style={styles.row}>
    <Ionicons
      name={valid ? "checkmark-circle" : "ellipse-outline"}
      size={16}
      color={valid ? "rgba(255, 255, 255, 0.08)" : "rgba(255,255,255,0.3)"}
    />
    <Text
      style={[
        styles.criteriaText,
        { color: valid ? "#FFF" : "rgba(255,255,255,0.4)" },
      ]}
    >
      {label}
    </Text>
  </View>
);

export default function RegisterScreen() {
  const router = useRouter();
  const { mutate: register, isPending } = useRegister();

  const schema = yup.object({
    email: yup.string().email("Email invalide").required("Email requis"),
    password: yup.string().required("Mot de passe requis"),
    confirmPassword: yup
      .string()
      .oneOf([yup.ref("password")], "Les mots de passe ne correspondent pas")
      .required("Confirmation requise"),
  });

  const { control, handleSubmit, watch } = useForm({
    resolver: yupResolver(schema),
  });

  const passwordValue = watch("password") || "";
  const criteria = usePasswordValidation(passwordValue);
  const isFormValid = Object.values(criteria).every(Boolean);

  const onSubmit = (data: Register) => {
    register(data, {
      onSuccess: () => router.replace("/(auth)/login"),
    });
  };

  return (
    <ScreenWrapper title="Inscription" showBackButton={true}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <Text style={styles.welcomeTitle}>Rejoignez l'aventure</Text>
          <Text style={styles.welcomeSubtitle}>
            Créez votre compte Covoit'Pro en 1 minute.
          </Text>

          <View style={{ marginTop: 30 }}>
            <FormInput
              iconName="mail-outline"
              control={control}
              name="email"
              label="Email"
              placeholder="john@doe.fr"
              type="email"
            />
            <FormInput
              iconName="lock-closed-outline"
              control={control}
              name="password"
              label="Mot de passe"
              placeholder="*******"
              type="password"
            />

            <View style={styles.criteriaGrid}>
              <View style={styles.criteriaColumn}>
                <ValidationRow label="8+ carac." valid={criteria.length} />
                <ValidationRow label="1 majuscule" valid={criteria.uppercase} />
              </View>
              <View style={styles.criteriaColumn}>
                <ValidationRow label="1 chiffre" valid={criteria.number} />
                <ValidationRow label="1 symbole" valid={criteria.specialChar} />
              </View>
            </View>

            <FormInput
              iconName="lock-closed-outline"
              control={control}
              name="confirmPassword"
              label="Confirmer le mot de passe"
              placeholder="*******"
              type="password"
            />
          </View>
          <View style={styles.termsContainer}>
            <Text style={styles.footerText}>
              En vous inscrivant, vous acceptez nos{" "}
              <Text
                style={styles.linkText}
                onPress={() =>
                  Linking.openURL("https://www.covoit.app/mentions-legales")
                }
              >
                Mentions Légales
              </Text>{" "}
              et notre{" "}
              <Text
                style={styles.linkText}
                onPress={() =>
                  Linking.openURL("https://www.covoit.app/confidentialite")
                }
              >
                Politique de Confidentialité
              </Text>
            </Text>
          </View>
          <TouchableOpacity
            style={[
              styles.registerButton,
              (isPending || !isFormValid) && { opacity: 0.5 },
            ]}
            onPress={handleSubmit(onSubmit)}
            disabled={isPending || !isFormValid}
          >
            <Text style={styles.registerButtonText}>
              {isPending ? "Inscription..." : "S'inscrire"}
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  scrollContent: { padding: 20, paddingBottom: 150 },
  welcomeTitle: {
    fontSize: 28,
    fontWeight: "800",
    color: "#FFF",
    marginBottom: 10,
  },
  welcomeSubtitle: { fontSize: 16, color: "#B9B9B9" },
  criteriaGrid: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 5,
    marginBottom: 20,
    paddingHorizontal: 5,
  },
  criteriaColumn: {
    width: "48%",
    gap: 8,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  criteriaText: {
    fontSize: 12,
    fontWeight: "500",
  },
  registerButton: {
    backgroundColor: "#FFF",
    height: 60,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 20,
  },
  registerButtonText: { color: "#141E30", fontSize: 18, fontWeight: "700" },
  termsContainer: { marginTop: 15 },
  footerText: { color: "#B9B9B9", fontSize: 12, textAlign: "center" },
  linkText: { color: "#FFF", textDecorationLine: "underline" },
});
