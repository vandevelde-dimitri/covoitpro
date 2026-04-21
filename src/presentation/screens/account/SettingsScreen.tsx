import { yupResolver } from "@hookform/resolvers/yup";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import {
  ActivityIndicator,
  Linking,
  ScrollView,
  StyleSheet,
  Text,
} from "react-native";
import * as yup from "yup";
import { View } from "../../components/Themed";
import { AppButton } from "../../components/ui/AppButton";
import ConfirmDialog from "../../components/ui/ConfirmDialog";
import { CustomToast } from "../../components/ui/CustomToast";
import { MenuDisclosureSection } from "../../components/ui/DisclosureMenu";
import { FormInput } from "../../components/ui/FormInput";
import { FormMenuSwitch } from "../../components/ui/FormSwitch";
import { MenuItem } from "../../components/ui/MenuItem";
import { MenuSection } from "../../components/ui/MenuSection";
import { useToast } from "../../components/ui/molecules/Toast";
import { ScreenWrapper } from "../../components/ui/ScreenWrapper";
import { useAuth } from "../../hooks/authContext";
import { useDeleteAccount } from "../../hooks/mutations/useDeleteAccount";
import { useUpdateEmail } from "../../hooks/mutations/useUpdateEmail";
import { useUpdatePassword } from "../../hooks/mutations/useUpdatePassword";
import { useUpdateSettings } from "../../hooks/mutations/useUpdateSettings";
import { useGetSettings } from "../../hooks/queries/useSettings";

export default function SettingsScreen() {
  const router = useRouter();
  const { session } = useAuth();
  const toast = useToast();

  const sessionEmail = session?.user?.email;

  const {
    data: settings,
    isLoading,
    isError,
    refetch: refetchSettings,
  } = useGetSettings();

  const [open, setOpen] = useState(false);
  const { mutate: deleteAccount } = useDeleteAccount();
  const { mutateAsync: updateSettings } = useUpdateSettings();
  const { mutate: updateEmail, isPending: isUpdatingEmail } = useUpdateEmail();
  const { mutate: updatePassword, isPending: isUpdatingPassword } =
    useUpdatePassword();

  const settingsSchema = yup.object({
    vibrations: yup.boolean(),
    notificationPush: yup.boolean(),
    toConvey: yup.boolean(),
    available: yup.boolean(),
  });

  const emailSchema = yup.object({
    email: yup.string().email("Email invalide").required("Email requis"),
  });

  const passwordSchema = yup.object({
    password: yup
      .string()
      .min(6, "6 caractères minimum")
      .required("Mot de passe requis"),
  });

  const emailForm = useForm({
    resolver: yupResolver(emailSchema),
    defaultValues: { email: sessionEmail ?? "" },
  });

  const passwordForm = useForm({
    resolver: yupResolver(passwordSchema),
    defaultValues: { password: "" },
  });

  const settingsForm = useForm({
    resolver: yupResolver(settingsSchema),
    defaultValues: {
      vibrations: false,
      notificationPush: true,
      toConvey: false,
      available: false,
    },
  });

  useEffect(() => {
    if (settings) {
      settingsForm.reset({
        vibrations: settings.vibrations,
        notificationPush: settings.notificationPush,
        toConvey: settings.toConvey,
        available: settings.available,
      });
    }
  }, [settings, settingsForm]);

  useEffect(() => {
    const currentFormValue = emailForm.getValues("email");

    if (
      sessionEmail &&
      sessionEmail !== currentFormValue &&
      !emailForm.formState.isDirty
    ) {
      emailForm.reset({ email: sessionEmail });
    }
  }, [sessionEmail, emailForm]);

  if (isError) {
    return (
      <ScreenWrapper showBackButton={true} title="Paramètres">
        <View style={styles.container}>
          <Text style={{ color: "red", marginBottom: 10 }}>
            Impossible de charger vos paramètres.
          </Text>
          <AppButton title="Réessayer" onPress={() => refetchSettings()} />
        </View>
      </ScreenWrapper>
    );
  }

  if (isLoading) {
    return (
      <ScreenWrapper showBackButton={true} title="Paramètres">
        <View style={styles.container}>
          <ActivityIndicator size="large" />
        </View>
      </ScreenWrapper>
    );
  }

  return (
    <ScreenWrapper showBackButton={true} title="Paramètres">
      <ScrollView
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
      >
        <MenuSection title="Mes informations">
          <MenuItem
            onPress={() => router.push("/(tabs)/account/edit")}
            icon="person"
            label="Modifier mon profil"
          />
        </MenuSection>

        <MenuSection title="Préférences">
          <FormMenuSwitch
            name="notificationPush"
            control={settingsForm.control}
            label="Notifications Push"
            description="Recevoir une alerte pour les nouveaux messages"
            icon="notifications"
            onAfterChange={(value) =>
              updateSettings({ notificationPush: value })
            }
          />
          <FormMenuSwitch
            name="vibrations"
            control={settingsForm.control}
            label="Vibrations"
            description="Activer les vibrations pour les notifications"
            icon="pulse"
            onAfterChange={(value) => updateSettings({ vibrations: value })}
          />
          <FormMenuSwitch
            name="toConvey"
            control={settingsForm.control}
            label="Véhiculer"
            icon="car"
            onAfterChange={(value) => updateSettings({ toConvey: value })}
          />
          <FormMenuSwitch
            name="available"
            control={settingsForm.control}
            label="Mode vacances"
            icon="airplane"
            onAfterChange={(value) => updateSettings({ available: !value })}
          />
        </MenuSection>

        <MenuDisclosureSection title="Sécurité">
          <FormInput
            control={emailForm.control}
            name="email"
            label="Email actuel"
            type="email"
            iconName="mail-outline"
            placeholder="votre@email.fr"
          />
          <AppButton
            title={isUpdatingEmail ? "Envoi en cours..." : "Modifier mon email"}
            variant="secondary"
            disabled={isUpdatingEmail}
            onPress={emailForm.handleSubmit((data) => {
              updateEmail(data.email, {
                onSuccess: () => {
                  toast.show(
                    <CustomToast
                      title="Vérification"
                      message="Lien envoyé sur votre nouvelle adresse !"
                    />,
                    { type: "info" },
                  );
                },
              });
            })}
          />

          <View style={{ height: 30, backgroundColor: "transparent" }} />

          <FormInput
            name="password"
            control={passwordForm.control}
            label="Nouveau mot de passe"
            placeholder="••••••••"
            type="password"
          />
          <AppButton
            title="Changer le mot de passe"
            variant="secondary"
            disabled={isUpdatingPassword}
            onPress={passwordForm.handleSubmit((data) => {
              updatePassword(data.password, {
                onSuccess: () => {
                  toast.show(
                    <CustomToast
                      title="Succès"
                      message="Mot de passe mis à jour !"
                    />,
                    { type: "success" },
                  );
                  passwordForm.reset();
                },
              });
            })}
          />
        </MenuDisclosureSection>

        <MenuDisclosureSection title="Zone de danger">
          <AppButton
            title="Supprimer mon compte"
            variant="danger"
            onPress={() => setOpen(true)}
          />
          <ConfirmDialog
            title="Voulez-vous vraiment supprimer votre compte ?"
            confirmLabel="oui"
            cancelLabel="non"
            onConfirm={deleteAccount}
            onCancel={() => setOpen(false)}
            visible={open}
            danger
          />
        </MenuDisclosureSection>

        <MenuDisclosureSection title="Informations Légales">
          <MenuItem
            onPress={() =>
              Linking.openURL(
                "https://coworkers-legal.vercel.app/politique_confidentialite",
              )
            }
            icon="shield-checkmark-outline"
            label="Politique de Confidentialité"
          />
          <MenuItem
            onPress={() =>
              Linking.openURL("https://coworkers-legal.vercel.app/")
            }
            icon="document-text-outline"
            label="Mentions Légales"
          />
        </MenuDisclosureSection>
      </ScrollView>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20, paddingBottom: 150 },
});
