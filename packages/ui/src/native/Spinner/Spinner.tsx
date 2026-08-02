import * as React from 'react';
import { View, ActivityIndicator, StyleSheet, type ViewProps } from 'react-native';

export interface SpinnerProps extends ViewProps {
  /**
   * Spinner size
   */
  size?: 'small' | 'large';
  /**
   * Spinner color variant
   */
  variant?: 'primary' | 'white' | 'gray';
}

/**
 * Spinner Component - React Native
 *
 * Loading indicator for async operations.
 * Implements TowerOS design system loading state specifications for mobile.
 *
 * @example
 * ```tsx
 * <Spinner size="large" variant="primary" />
 * <Spinner size="small" variant="white" />
 * ```
 */
export const Spinner = React.forwardRef<View, SpinnerProps>(
  ({ size = 'large', variant = 'primary', style, ...props }, ref) => {
    const colors = {
      primary: '#0066CC',
      white: '#FFFFFF',
      gray: '#9E9E9E',
    };

    return (
      <View ref={ref} style={[styles.container, style]} {...props}>
        <ActivityIndicator size={size} color={colors[variant]} />
      </View>
    );
  }
);

Spinner.displayName = 'Spinner';

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});
