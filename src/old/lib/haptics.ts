import { Haptics, ImpactStyle } from '@capacitor/haptics';
import { storage } from './storage';

export class HapticsManager {
  private static isSupported: boolean | null = null;

  static async isHapticsSupported(): Promise<boolean> {
    if (this.isSupported !== null) return this.isSupported;
    
    try {
      // Check if we're on a device that supports haptics
      const userAgent = navigator.userAgent;
      const isIOS = /iPad|iPhone|iPod/.test(userAgent);
      const isAndroid = /Android/.test(userAgent);
      
      this.isSupported = (isIOS || isAndroid) && 'vibrate' in navigator;
      return this.isSupported;
    } catch {
      this.isSupported = false;
      return false;
    }
  }

  static async triggerImpact(style: 'light' | 'medium' | 'heavy' = 'medium') {
    try {
      const preferences = storage.getPreferences();
      if (!preferences.hapticFeedback) return;

      const isSupported = await this.isHapticsSupported();
      if (!isSupported) return;

      const impactStyle = style === 'light' ? ImpactStyle.Light : 
                         style === 'heavy' ? ImpactStyle.Heavy : 
                         ImpactStyle.Medium;

      await Haptics.impact({ style: impactStyle });
    } catch (error) {
      // Fallback to vibration API
      this.fallbackVibrate(style);
    }
  }

  static async triggerNotification(type: 'success' | 'warning' | 'error' = 'success') {
    try {
      const preferences = storage.getPreferences();
      if (!preferences.hapticFeedback) return;

      const isSupported = await this.isHapticsSupported();
      if (!isSupported) return;

      await Haptics.notification({ 
        type: type.toUpperCase() as any 
      });
    } catch (error) {
      // Fallback vibration patterns
      const patterns = {
        success: [100, 50, 100],
        warning: [200, 100, 200],
        error: [300, 100, 300, 100, 300]
      };
      this.fallbackVibrate(patterns[type]);
    }
  }

  static async triggerSelection() {
    try {
      const preferences = storage.getPreferences();
      if (!preferences.hapticFeedback) return;

      const isSupported = await this.isHapticsSupported();
      if (!isSupported) return;

      await Haptics.selectionStart();
      setTimeout(() => Haptics.selectionEnd(), 50);
    } catch (error) {
      this.fallbackVibrate('light');
    }
  }

  private static fallbackVibrate(pattern: string | number[]) {
    try {
      if ('vibrate' in navigator) {
        if (typeof pattern === 'string') {
          const duration = pattern === 'light' ? 50 : pattern === 'heavy' ? 200 : 100;
          navigator.vibrate(duration);
        } else {
          navigator.vibrate(pattern);
        }
      }
    } catch (error) {
      // Silently fail if vibration is not supported
    }
  }
}

// Convenience functions
export const hapticLight = () => HapticsManager.triggerImpact('light');
export const hapticMedium = () => HapticsManager.triggerImpact('medium');
export const hapticHeavy = () => HapticsManager.triggerImpact('heavy');
export const hapticSuccess = () => HapticsManager.triggerNotification('success');
export const hapticError = () => HapticsManager.triggerNotification('error');
export const hapticSelection = () => HapticsManager.triggerSelection();