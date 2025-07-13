import { useTheme } from '@/contexts/ThemeContext';
import { LightColors, DarkColors } from '@/constants/Colors';

export function useColors() {
  const { isDark } = useTheme();
  return isDark ? DarkColors : LightColors;
}