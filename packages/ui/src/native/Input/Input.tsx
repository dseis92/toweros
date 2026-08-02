import * as React from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  type TextInputProps,
  type StyleProp,
  type ViewStyle,
} from 'react-native';

export interface InputProps extends TextInputProps {
  /**
   * Label text displayed above input
   */
  label?: string;
  /**
   * Helper text displayed below input
   */
  helperText?: string;
  /**
   * Error message - automatically sets border to red
   */
  error?: string;
  /**
   * Success message - automatically sets border to green
   */
  success?: string;
  /**
   * Icon to display on the left side of input
   */
  iconLeft?: React.ReactNode;
  /**
   * Icon to display on the right side of input
   */
  iconRight?: React.ReactNode;
  /**
   * Custom container style
   */
  containerStyle?: StyleProp<ViewStyle>;
  /**
   * Whether the input is required (adds asterisk to label)
   */
  required?: boolean;
}

/**
 * Input Component - React Native
 *
 * Text input field with label, helper text, and validation states.
 * Implements TowerOS design system input specifications for mobile.
 *
 * Optimized for:
 * - 48px minimum touch target
 * - Large text for sunlight readability
 * - Glove-friendly interaction
 *
 * @example
 * ```tsx
 * <Input
 *   label="Site Name"
 *   placeholder="Enter site name"
 *   required
 * />
 *
 * <Input
 *   label="Email"
 *   keyboardType="email-address"
 *   error="Invalid email address"
 * />
 *
 * <Input
 *   label="Search"
 *   iconLeft={<SearchIcon />}
 *   placeholder="Search equipment..."
 * />
 * ```
 */
export const Input = React.forwardRef<TextInput, InputProps>(
  (
    {
      label,
      helperText,
      error,
      success,
      iconLeft,
      iconRight,
      containerStyle,
      required,
      style,
      editable = true,
      ...props
    },
    ref
  ) => {
    const [isFocused, setIsFocused] = React.useState(false);

    const inputContainerStyles = [
      styles.inputContainer,
      error && styles.inputContainerError,
      success && !error && styles.inputContainerSuccess,
      isFocused && !error && styles.inputContainerFocused,
      !editable && styles.inputContainerDisabled,
    ];

    return (
      <View style={[styles.container, containerStyle]}>
        {label && (
          <Text style={styles.label}>
            {label}
            {required && <Text style={styles.required}> *</Text>}
          </Text>
        )}

        <View style={inputContainerStyles}>
          {iconLeft && <View style={styles.iconLeft}>{iconLeft}</View>}

          <TextInput
            ref={ref}
            style={[
              styles.input,
              iconLeft && styles.inputWithIconLeft,
              iconRight && styles.inputWithIconRight,
              style,
            ]}
            placeholderTextColor="#9E9E9E"
            editable={editable}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            {...props}
          />

          {iconRight && <View style={styles.iconRight}>{iconRight}</View>}
        </View>

        {error && <Text style={styles.errorText}>{error}</Text>}
        {success && !error && <Text style={styles.successText}>{success}</Text>}
        {helperText && !error && !success && (
          <Text style={styles.helperText}>{helperText}</Text>
        )}
      </View>
    );
  }
);

Input.displayName = 'Input';

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: '#616161',
    marginBottom: 4,
  },
  required: {
    color: '#FF3B30',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 48,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 8,
    backgroundColor: '#FFFFFF',
  },
  inputContainerFocused: {
    borderColor: '#0066CC',
    borderWidth: 2,
  },
  inputContainerError: {
    borderColor: '#FF3B30',
    borderWidth: 2,
  },
  inputContainerSuccess: {
    borderColor: '#00B050',
    borderWidth: 2,
  },
  inputContainerDisabled: {
    backgroundColor: '#F5F5F5',
    opacity: 0.5,
  },
  input: {
    flex: 1,
    height: '100%',
    paddingHorizontal: 16,
    fontSize: 16,
    color: '#212121',
  },
  inputWithIconLeft: {
    paddingLeft: 0,
  },
  inputWithIconRight: {
    paddingRight: 0,
  },
  iconLeft: {
    marginLeft: 12,
    marginRight: 8,
  },
  iconRight: {
    marginRight: 12,
    marginLeft: 8,
  },
  errorText: {
    marginTop: 4,
    fontSize: 12,
    color: '#FF3B30',
  },
  successText: {
    marginTop: 4,
    fontSize: 12,
    color: '#00B050',
  },
  helperText: {
    marginTop: 4,
    fontSize: 12,
    color: '#9E9E9E',
  },
});
