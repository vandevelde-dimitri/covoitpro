import React, { useEffect, useRef } from "react";
import {
  LayoutAnimation,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  UIManager,
  View,
} from "react-native";
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from "react-native-reanimated";
import { scheduleOnRN } from "react-native-worklets";
import { useToast } from "./context/ToastContext";
import type {
  Toast as ToastType,
  ToastType as ToastVariant,
} from "./Toast.types";

interface ToastProps {
  toast: ToastType;
  index: number;
  onHeightChange?: (id: string, height: number) => void;
}

const getAccentColor = (type: ToastVariant) => {
  switch (type) {
    case "success":
      return "#22C55E";
    case "error":
      return "#FF453A";
    case "info":
      return "#3B82F6";
    case "warning":
      return "#F59E0B";
    default:
      return "#rgba(255,255,255,0.5)";
  }
};

const getIconForType = (type: ToastVariant) => {
  switch (type) {
    case "success":
      return "✓";
    case "error":
      return "✗";
    case "warning":
      return "⚠";
    case "info":
      return "ℹ";
    default:
      return "";
  }
};
export const Toast: React.FC<ToastProps> = ({ toast, index }) => {
  const prevContentRef = useRef<string | React.ReactNode | null>(null);
  const prevTypeRef = useRef<ToastVariant | null>(null);
  const prevIndexRef = useRef<number>(-1);

  const { dismiss, expandedToasts, expandToast, collapseToast } = useToast();
  const opacity = useSharedValue<number>(1);
  const translateY = useSharedValue<number>(
    toast.options.position === "top" ? -100 : 100,
  );
  const scale = useSharedValue<number>(0.9);
  const rotateZ = useSharedValue<number>(0);
  const height = useSharedValue<number>(0);
  const expandHeight = useSharedValue<number>(0);
  const viewRef = useRef<View>(null);

  const isExpanded = expandedToasts.has(toast.id);
  const hasExpandedContent = !!toast.options.expandedContent;

  const getStackOffset = () => {
    const baseOffset = 4;
    const maxOffset = 12;
    const offset = Math.min(index * baseOffset, maxOffset);
    return toast.options.position === "top" ? offset : -offset;
  };

  const getStackScale = () => {
    const scaleReduction = 0.02;
    const minScale = 0.92;
    return Math.max(1 - index * scaleReduction, minScale);
  };

  useEffect(() => {
    if (prevIndexRef.current !== index && opacity.value > 0) {
      const soonerOffset = toast.options.position === "top" ? 2 : -2;

      translateY.value = withTiming(getStackOffset() + soonerOffset, {
        duration: 400,
        easing: Easing.bezier(0.25, 0.46, 0.45, 0.94),
      });

      scale.value = withTiming(getStackScale() * 0.98, {
        duration: 400,
        easing: Easing.bezier(0.25, 0.46, 0.45, 0.94),
      });

      setTimeout(() => {
        translateY.value = withSpring(getStackOffset(), {
          damping: 25,
          stiffness: 120,
          mass: 0.8,
          velocity: 0,
        });

        scale.value = withSpring(getStackScale(), {
          damping: 25,
          stiffness: 120,
          mass: 0.8,
          velocity: 0,
        });
      }, 200);
    }

    prevIndexRef.current = index;
  }, [index, toast.options.position, translateY, scale, opacity]);

  const handleDismiss = () => {
    dismiss(toast.id);
    toast.options.onClose?.();
  };

  const animatedDismiss = () => {
    opacity.value = withTiming(0, {
      duration: 300,
      easing: Easing.bezier(0.25, 0.46, 0.45, 0.94),
    });

    translateY.value = withTiming(toast.options.position === "top" ? -50 : 50, {
      duration: 300,
      easing: Easing.bezier(0.25, 0.46, 0.45, 0.94),
    });

    scale.value = withTiming(0.85, {
      duration: 300,
      easing: Easing.bezier(0.25, 0.46, 0.45, 0.94),
    });

    setTimeout(() => {
      handleDismiss();
    }, 300);
  };

  useEffect(() => {
    const delay = index * 50;

    LayoutAnimation.configureNext({
      duration: 300,
      create: {
        type: LayoutAnimation.Types.easeInEaseOut,
        property: LayoutAnimation.Properties.opacity,
      },
      update: {
        type: LayoutAnimation.Types.easeInEaseOut,
      },
    });

    setTimeout(() => {
      translateY.value = withSpring(getStackOffset(), {
        damping: 28,
        stiffness: 140,
        mass: 0.8,
        velocity: 0,
      });

      scale.value = withSpring(getStackScale(), {
        damping: 28,
        stiffness: 140,
        mass: 0.8,
        velocity: 0,
      });

      rotateZ.value = withTiming(0, {
        duration: 500,
        easing: Easing.bezier(0.25, 0.46, 0.45, 0.94),
      });
    }, delay);

    if (toast.options.duration > 0) {
      const exitDelay = Math.max(0, toast.options.duration - 500);

      const exitAnimations = () => {
        opacity.value = withTiming(0, {
          duration: 400,
          easing: Easing.bezier(0.25, 0.46, 0.45, 0.94),
        });

        translateY.value = withTiming(
          toast.options.position === "top" ? 20 : 20,
          {
            duration: 400,
            easing: Easing.bezier(0.25, 0.46, 0.45, 0.94),
          },
        );

        scale.value = withTiming(0.95, {
          duration: 400,
          easing: Easing.bezier(0.25, 0.46, 0.45, 0.94),
        });

        setTimeout(() => {
          scheduleOnRN(handleDismiss);
        }, 400);
      };

      setTimeout(exitAnimations, exitDelay);
    }
  }, [toast, opacity, translateY, scale, rotateZ, index]);

  useEffect(() => {
    if (isExpanded && hasExpandedContent) {
      expandHeight.value = withSpring(1, {
        damping: 20,
        stiffness: 100,
      });
    } else {
      expandHeight.value = withSpring(0, {
        damping: 20,
        stiffness: 100,
      });
    }
  }, [isExpanded, hasExpandedContent, expandHeight]);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      opacity: opacity.value,
      transform: [
        { translateY: translateY.value },
        { scale: scale.value },
        { rotateZ: `${rotateZ.value}deg` },
      ],
      zIndex: 1000 - index,
    };
  });

  const expandedContentStyle = useAnimatedStyle(() => {
    return {
      maxHeight: expandHeight.value * 300,
      opacity: expandHeight.value,
    };
  });

  const handlePress = () => {
    if (!hasExpandedContent) {
      return;
    }

    if (isExpanded) {
      collapseToast(toast.id);
    } else {
      expandToast(toast.id);
    }
  };

  const customBackgroundColor = toast.options.backgroundColor?.trim();
  const backgroundColor =
    customBackgroundColor && customBackgroundColor.length > 0
      ? customBackgroundColor
      : getAccentColor(toast.options.type);

  const accentColor = getAccentColor(toast.options.type);

  const _styles = toast.options?.style || {};

  const icon = getIconForType(toast.options.type);

  const renderExpandedContent = () => {
    if (!hasExpandedContent) return null;

    const content = toast.options.expandedContent;

    if (typeof content === "function") {
      return content({ dismiss: animatedDismiss });
    }

    return content;
  };

  return (
    <Animated.View
      style={[
        styles.toastContainer,
        animatedStyle,
        {
          marginTop: 0,
          marginBottom: 0,
          position: "absolute",
          top: toast.options.position === "top" ? 80 : undefined,
          bottom: toast.options.position === "bottom" ? 0 : undefined,
        },
        _styles,
      ]}
    >
      <Pressable onPress={handlePress} style={styles.toast}>
        {/* Barre d'accentuation à gauche */}
        <View style={[styles.accentBar, { backgroundColor: accentColor }]} />

        <View style={styles.mainContent}>
          {/* Icône stylisée */}
          <View
            style={[
              styles.iconWrapper,
              { backgroundColor: `${accentColor}20` },
            ]}
          >
            <Text style={[styles.icon, { color: accentColor }]}>{icon}</Text>
          </View>

          <View style={styles.contentContainer}>
            <Text style={styles.text}>{toast.content}</Text>
            {/* Si tu as un message/titre séparé, tu peux l'ajouter ici */}
          </View>

          {/* Ton bouton d'action existant */}
          {toast.options.action && (
            <TouchableOpacity
              style={styles.actionButton}
              onPress={animatedDismiss}
            >
              <Text style={styles.actionText}>
                {toast.options.action.label}
              </Text>
            </TouchableOpacity>
          )}
        </View>
        {hasExpandedContent && (
          <Animated.View style={[styles.expandedContent, expandedContentStyle]}>
            {renderExpandedContent()}
          </Animated.View>
        )}
      </Pressable>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  toastContainer: {
    width: "92%",
    alignSelf: "center",
    borderRadius: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 10,
    backgroundColor: "rgba(25, 25, 25, 0.92)",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.1)",
    overflow: "hidden",
  },
  toast: {
    flexDirection: "row",
    alignItems: "center",
    minHeight: 70,
  },
  accentBar: {
    width: 4,
    height: "60%",
    borderRadius: 2,
    marginLeft: 2,
  },
  mainContent: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 16,
    flex: 1,
  },
  iconWrapper: {
    width: 36,
    height: 36,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  icon: {
    fontSize: 18,
    fontWeight: "bold",
  },
  contentContainer: {
    flex: 1,
  },
  text: {
    color: "#ffffff",
    fontSize: 15,
    fontWeight: "600",
    letterSpacing: -0.3,
  },
  actionButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    marginLeft: 8,
  },
  actionText: {
    color: "#fff",
    fontSize: 13,
    fontWeight: "bold",
  },
  expandedContent: {
    overflow: "hidden",
  },
});
