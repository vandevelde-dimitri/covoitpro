import { Ionicons } from "@expo/vector-icons";
import React, { useEffect, useState } from "react";
import { Control, Controller } from "react-hook-form";
import { Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import { useDebounce } from "../../hooks/useDebounce";

interface FormInputProps {
  control: Control<any>;
  label: string;
  placeholder?: string;
  rules?: object;
  iconName?: React.ComponentProps<typeof Ionicons>["name"];
}

export const FormInputCity = ({
  control,
  iconName,

  label,
  placeholder,
  rules,
}: FormInputProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const debouncedSearchTerm = useDebounce(searchTerm, 400);

  useEffect(() => {
    const fetchCities = async () => {
      if (debouncedSearchTerm.length < 3) {
        setSuggestions([]);
        setShowDropdown(false);
        return;
      }

      try {
        const response = await fetch(
          `https://api-adresse.data.gouv.fr/search/?q=${encodeURIComponent(debouncedSearchTerm)}&type=municipality&limit=5`,
        );
        const data = await response.json();
        setSuggestions(data.features || []);
        setShowDropdown(data.features?.length > 0);
      } catch (error) {
        console.error("Erreur API Ville:", error);
      }
    };

    fetchCities();
  }, [debouncedSearchTerm]);

  return (
    <Controller
      control={control}
      name="city"
      rules={rules}
      render={({
        field: { onChange, onBlur, value },
        fieldState: { error },
      }) => (
        <View style={[styles.wrapper, { zIndex: showDropdown ? 1000 : 1 }]}>
          <Text style={styles.label}>{label}</Text>

          <View style={[styles.inputContainer, error && styles.inputError]}>
            <Ionicons
              name={iconName}
              size={20}
              color="#6C757D"
              style={styles.icon}
            />
            <TextInput
              style={styles.input}
              placeholder={placeholder}
              placeholderTextColor="#ADB5BD"
              onBlur={() => {
                onBlur();
                setTimeout(() => setShowDropdown(false), 200);
              }}
              value={value}
              onChangeText={(text) => {
                onChange(text);
                setSearchTerm(text);
              }}
            />
          </View>

          {showDropdown && (
            <View style={styles.dropdown}>
              {suggestions.map((item) => (
                <Pressable
                  key={item.properties.id}
                  style={styles.suggestionItem}
                  onPress={() => {
                    const cityName = `${item.properties.name} (${item.properties.postcode})`;
                    onChange(cityName);
                    setSearchTerm("");
                    setShowDropdown(false);
                  }}
                >
                  <Text style={styles.suggestionText}>
                    {item.properties.name}{" "}
                    <Text style={styles.postcode}>
                      ({item.properties.postcode})
                    </Text>
                  </Text>
                </Pressable>
              ))}
            </View>
          )}

          {error && <Text style={styles.errorText}>{error.message}</Text>}
        </View>
      )}
    />
  );
};

const styles = StyleSheet.create({
  wrapper: { marginBottom: 20 },
  label: {
    color: "#FFF",
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 8,
    marginLeft: 4,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.08)",
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.1)",
    paddingHorizontal: 15,
    height: 60,
  },
  inputError: { borderColor: "#991B1B" },
  icon: { marginRight: 10 },
  input: { flex: 1, color: "#FFF", fontSize: 16 },
  errorText: { color: "#991B1B", marginTop: 4, fontSize: 12 },
  dropdown: {
    position: "absolute",
    top: 90,
    left: 0,
    right: 0,
    backgroundColor: "#1E293B",
    borderRadius: 15,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.1)",
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    zIndex: 2000,
  },
  suggestionItem: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255, 255, 255, 0.05)",
  },
  suggestionText: { color: "#FFF", fontSize: 15 },
  postcode: { color: "#6C757D", fontSize: 13 },
});
