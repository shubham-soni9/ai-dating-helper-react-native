import React, { useState, useEffect } from 'react';
import { Text, TouchableOpacity, StyleSheet, View } from 'react-native';
import { authColors } from '../../theme/authColors';

interface ResendTimerProps {
  initialSeconds: number;
  onResend: () => void;
}

export const ResendTimer: React.FC<ResendTimerProps> = ({
  initialSeconds,
  onResend,
}) => {
  const [seconds, setSeconds] = useState(initialSeconds);

  useEffect(() => {
    if (seconds > 0) {
      const timer = setInterval(() => {
        setSeconds((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [seconds]);

  // Reset timer when initialSeconds changes (if we want to restart it from parent)
  useEffect(() => {
     if (initialSeconds > 0) {
         setSeconds(initialSeconds);
     }
  }, [initialSeconds]);


  if (seconds > 0) {
    return (
      <View style={styles.container}>
        <Text style={styles.text}>Resend in {seconds}s</Text>
      </View>
    );
  }

  return (
    <TouchableOpacity onPress={onResend} style={styles.container}>
      <Text style={styles.link}>Resend code</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    marginVertical: 16,
  },
  text: {
    color: authColors.secondaryText,
    fontSize: 14,
  },
  link: {
    color: authColors.text, // White text for the link as per screenshot? Or blue? Spec says "clickable link". Screenshot shows "Resend in 26s" (grey). Let's make the link stand out or be consistent.
    fontSize: 14,
    textDecorationLine: 'underline',
  },
});
