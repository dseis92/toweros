import * as React from 'react';
import {
  View,
  Pressable,
  StyleSheet,
  type ViewProps,
  type StyleProp,
  type ViewStyle,
} from 'react-native';

export interface CardProps extends ViewProps {
  /**
   * Card content
   */
  children: React.ReactNode;
  /**
   * Card variant
   */
  variant?: 'default' | 'elevated' | 'interactive';
  /**
   * Card padding
   */
  padding?: 'none' | 'sm' | 'md' | 'lg';
  /**
   * Custom style
   */
  style?: StyleProp<ViewStyle>;
  /**
   * Press handler (automatically sets variant to 'interactive')
   */
  onPress?: () => void;
}

/**
 * Card Component - React Native
 *
 * Container component for grouping related content.
 * Implements TowerOS design system card specifications for mobile.
 *
 * @example
 * ```tsx
 * <Card variant="default" padding="md">
 *   <Text>Site Information</Text>
 *   <Text>North Tower Alpha</Text>
 * </Card>
 *
 * <Card variant="interactive" onPress={handlePress}>
 *   <Text>Work Order #123</Text>
 *   <Text>5G NR Installation</Text>
 * </Card>
 * ```
 */
export const Card = React.forwardRef<View, CardProps>(
  (
    {
      children,
      variant = 'default',
      padding = 'md',
      style,
      onPress,
      ...props
    },
    ref
  ) => {
    const cardStyles = [
      styles.base,
      styles[variant],
      styles[`padding_${padding}`],
      style,
    ];

    if (onPress) {
      return (
        <Pressable
          onPress={onPress}
          style={({ pressed }) => [
            ...cardStyles,
            pressed && styles.pressed,
          ]}
          {...props}
        >
          {children}
        </Pressable>
      );
    }

    return (
      <View ref={ref} style={cardStyles} {...props}>
        {children}
      </View>
    );
  }
);

Card.displayName = 'Card';

const styles = StyleSheet.create({
  base: {
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
  },
  default: {
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  elevated: {
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  interactive: {
    borderWidth: 1,
    borderColor: '#E0E0E0',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 2,
    elevation: 1,
  },
  pressed: {
    opacity: 0.9,
    transform: [{ scale: 0.98 }],
    borderColor: '#0066CC',
  },
  padding_none: {
    padding: 0,
  },
  padding_sm: {
    padding: 12,
  },
  padding_md: {
    padding: 16,
  },
  padding_lg: {
    padding: 24,
  },
});
