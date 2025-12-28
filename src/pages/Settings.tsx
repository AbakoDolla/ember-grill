import { useState } from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { useAuth } from '@/contexts/AuthContext';
import { User, Bell, Shield, Palette, Globe } from 'lucide-react';

export default function Settings() {
  const { t } = useTranslation();
  const { user } = useAuth();
  const [notifications, setNotifications] = useState({
    email: true,
    push: false,
    sms: false,
  });
  const [preferences, setPreferences] = useState({
    language: 'fr',
    theme: 'dark',
    currency: 'EUR',
  });

  const handleSave = () => {
    // TODO: Implement save functionality
    console.log('Settings saved');
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="mb-8">
            <h1 className="text-3xl font-display font-bold text-foreground mb-2">
              {t('settings.title')}
            </h1>
            <p className="text-muted-foreground">
              {t('settings.subtitle')}
            </p>
          </div>

          <div className="space-y-6">
            {/* Profile Settings */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="w-5 h-5" />
                  {t('settings.profile.title')}
                </CardTitle>
                <CardDescription>
                  {t('settings.profile.description')}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">{t('settings.profile.firstName')}</Label>
                    <Input
                      id="firstName"
                      defaultValue={user?.user_metadata?.name?.split(' ')[0] || ''}
                      placeholder={t('settings.profile.firstName')}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">{t('settings.profile.lastName')}</Label>
                    <Input
                      id="lastName"
                      defaultValue={user?.user_metadata?.name?.split(' ').slice(1).join(' ') || ''}
                      placeholder={t('settings.profile.lastName')}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">{t('settings.profile.email')}</Label>
                  <Input
                    id="email"
                    type="email"
                    defaultValue={user?.email || ''}
                    placeholder={t('settings.profile.email')}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">{t('settings.profile.phone')}</Label>
                  <Input
                    id="phone"
                    type="tel"
                    placeholder={t('settings.profile.phone')}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Preferences */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Palette className="w-5 h-5" />
                  {t('settings.preferences.title')}
                </CardTitle>
                <CardDescription>
                  {t('settings.preferences.description')}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>{t('settings.preferences.language')}</Label>
                    <Select value={preferences.language} onValueChange={(value) => setPreferences({...preferences, language: value})}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="fr">Français</SelectItem>
                        <SelectItem value="nl">Nederlands</SelectItem>
                        <SelectItem value="en">English</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>{t('settings.preferences.theme')}</Label>
                    <Select value={preferences.theme} onValueChange={(value) => setPreferences({...preferences, theme: value})}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="light">{t('settings.preferences.light')}</SelectItem>
                        <SelectItem value="dark">{t('settings.preferences.dark')}</SelectItem>
                        <SelectItem value="system">{t('settings.preferences.system')}</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>{t('settings.preferences.currency')}</Label>
                  <Select value={preferences.currency} onValueChange={(value) => setPreferences({...preferences, currency: value})}>
                    <SelectTrigger className="w-full md:w-48">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="EUR">EUR (€)</SelectItem>
                      <SelectItem value="USD">USD ($)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            {/* Notifications */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bell className="w-5 h-5" />
                  {t('settings.notifications.title')}
                </CardTitle>
                <CardDescription>
                  {t('settings.notifications.description')}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>{t('settings.notifications.email')}</Label>
                    <p className="text-sm text-muted-foreground">
                      {t('settings.notifications.emailDescription')}
                    </p>
                  </div>
                  <Switch
                    checked={notifications.email}
                    onCheckedChange={(checked) => setNotifications({...notifications, email: checked})}
                  />
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>{t('settings.notifications.push')}</Label>
                    <p className="text-sm text-muted-foreground">
                      {t('settings.notifications.pushDescription')}
                    </p>
                  </div>
                  <Switch
                    checked={notifications.push}
                    onCheckedChange={(checked) => setNotifications({...notifications, push: checked})}
                  />
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>{t('settings.notifications.sms')}</Label>
                    <p className="text-sm text-muted-foreground">
                      {t('settings.notifications.smsDescription')}
                    </p>
                  </div>
                  <Switch
                    checked={notifications.sms}
                    onCheckedChange={(checked) => setNotifications({...notifications, sms: checked})}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Privacy & Security */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="w-5 h-5" />
                  {t('settings.privacy.title')}
                </CardTitle>
                <CardDescription>
                  {t('settings.privacy.description')}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button variant="outline" className="w-full md:w-auto">
                  {t('settings.privacy.changePassword')}
                </Button>
                <Separator />
                <Button variant="outline" className="w-full md:w-auto">
                  {t('settings.privacy.downloadData')}
                </Button>
                <Separator />
                <Button variant="destructive" className="w-full md:w-auto">
                  {t('settings.privacy.deleteAccount')}
                </Button>
              </CardContent>
            </Card>

            {/* Save Button */}
            <div className="flex justify-end">
              <Button onClick={handleSave} className="px-8">
                {t('settings.save')}
              </Button>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}