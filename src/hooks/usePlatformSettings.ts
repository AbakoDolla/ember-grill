import { useState, useEffect } from 'react';
import supabase from '@/lib/supabase';
import { toast } from 'sonner';

export interface PlatformSetting {
  key: string;
  value: any;
  description?: string;
  created_at: string;
  updated_at: string;
}

export const usePlatformSettings = () => {
  const [settings, setSettings] = useState<PlatformSetting[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSettings = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('platform_settings')
        .select('*')
        .order('key');

      if (error) throw error;
      setSettings(data || []);
    } catch (error) {
      console.error('Error fetching platform settings:', error);
      setError('Erreur lors du chargement des paramètres');
    } finally {
      setLoading(false);
    }
  };

  const updateSetting = async (key: string, value: any) => {
    try {
      const { data, error } = await supabase
        .from('platform_settings')
        .upsert({
          key,
          value,
          updated_at: new Date().toISOString()
        })
        .select()
        .single();

      if (error) throw error;

      // Update local state
      setSettings(prev => {
        const index = prev.findIndex(s => s.key === key);
        if (index >= 0) {
          const newSettings = [...prev];
          newSettings[index] = data;
          return newSettings;
        } else {
          return [...prev, data];
        }
      });

      return { success: true, data };
    } catch (error) {
      console.error('Error updating platform setting:', error);
      return { success: false, error: 'Erreur lors de la mise à jour' };
    }
  };

  const getSetting = (key: string, defaultValue: any = null) => {
    const setting = settings.find(s => s.key === key);
    return setting ? setting.value : defaultValue;
  };

  const getSettingsObject = () => {
    const obj: Record<string, any> = {};
    settings.forEach(setting => {
      obj[setting.key] = setting.value;
    });
    return obj;
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  return {
    settings,
    loading,
    error,
    updateSetting,
    getSetting,
    getSettingsObject,
    refreshSettings: fetchSettings
  };
};
