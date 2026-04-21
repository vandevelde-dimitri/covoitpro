import { ContactMessage } from "@/src/domain/entities/contact/ContactMessage";
import { AppButton } from "@/src/presentation/components/ui/AppButton";
import { FormInput } from "@/src/presentation/components/ui/FormInput";
import { ScreenWrapper } from "@/src/presentation/components/ui/ScreenWrapper";
import { useAuth } from "@/src/presentation/hooks/authContext";
import { useSendContact } from "@/src/presentation/hooks/mutations/useSendContact";
import { useCurrentUser } from "@/src/presentation/hooks/queries/useCurrentUser";
import { yupResolver } from "@hookform/resolvers/yup";
import { useRouter } from "expo-router";
import React from "react";
import { useForm } from "react-hook-form";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import * as yup from "yup";

const schema = yup.object({
  subject: yup
    .string()
    .min(3, "Minimum 3 caractères")
    .max(100, "Maximum 100 caractères")
    .required("Sujet requis"),
  message: yup
    .string()
    .min(10, "Minimum 10 caractères")
    .max(5000, "Maximum 5000 caractères")
    .required("Message requis"),
});

export default function ContactScreen() {
  const router = useRouter();
  const { session } = useAuth();
  const { data: user } = useCurrentUser();
  const { mutate: sendContact, isPending } = useSendContact();

  const { control, handleSubmit } = useForm({
    resolver: yupResolver(schema as any),
    defaultValues: {
      subject: "",
      message: "",
    },
  });

  const onSubmit = (formData: { subject: string; message: string }) => {
    const contactMessage: ContactMessage = {
      name: user?.firstName
        ? `${user.firstName} ${user.lastName || ""}`.trim()
        : "Utilisateur",
      email: session?.user?.email || "",
      subject: formData.subject,
      message: formData.message,
      siteName: user?.fcName || undefined,
    };

    sendContact(contactMessage, {
      onSuccess: () => {
        setTimeout(() => {
          router.back();
        }, 1500);
      },
    });
  };

  return (
    <ScreenWrapper title="Contacter le support" showBackButton>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <ScrollView
          contentContainerStyle={styles.container}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.header}>
            <Text style={styles.title}>Nous sommes à votre écoute</Text>
            <Text style={styles.subtitle}>
              Envoyez-nous votre demande et notre équipe vous répondra au plus
              vite.
            </Text>
          </View>

          <View style={styles.form}>
            <FormInput
              control={control}
              name="subject"
              label="Sujet"
              placeholder="Sujet de votre demande"
              type="text"
              iconName="chatbox-outline"
            />

            <FormInput
              control={control}
              name="message"
              label="Message"
              placeholder="Décrivez votre demande en détail..."
              type="textarea"
              iconName="document-text-outline"
            />

            <AppButton
              title={isPending ? "Envoi en cours..." : "Envoyer le message"}
              onPress={handleSubmit(onSubmit)}
              disabled={isPending}
              variant="primary"
              style={{ marginTop: 10 }}
            />
          </View>

          <View style={styles.infoBox}>
            <Text style={styles.infoText}>💡 Temps de réponse moyen : 24h</Text>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    paddingBottom: 50,
  },
  header: {
    marginBottom: 30,
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    color: "#FFFFFF",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: "rgba(255, 255, 255, 0.6)",
    lineHeight: 20,
  },
  form: {
    marginBottom: 30,
  },
  infoBox: {
    backgroundColor: "rgba(79, 172, 254, 0.1)",
    borderRadius: 12,
    padding: 16,
    borderLeftWidth: 4,
    borderLeftColor: "#4FACFE",
  },
  infoText: {
    fontSize: 13,
    color: "rgba(255, 255, 255, 0.7)",
    lineHeight: 18,
  },
});
