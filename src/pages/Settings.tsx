import { useState, useEffect } from 'react';
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
import { toast } from 'sonner';
import { User, Bell, Shield, Palette, Globe, Eye, EyeOff, Download, Trash2, Key, Smartphone, Mail } from 'lucide-react';

export default function Settings() {
  const { t, i18n } = useTranslation();
  const { user, updateUserProfile, updatePassword, deleteAccount } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  
  const [profileData, setProfileData] = useState({
    firstName: user?.user_metadata?.name?.split(' ')[0] || '',
    lastName: user?.user_metadata?.name?.split(' ').slice(1).join(' ') || '',
    email: user?.email || '',
    phone: user?.user_metadata?.phone || '',
    address: user?.user_metadata?.address || '',
  });
  
  const [notifications, setNotifications] = useState({
    email: user?.user_metadata?.notifications?.email ?? true,
    push: user?.user_metadata?.notifications?.push ?? false,
    sms: user?.user_metadata?.notifications?.sms ?? false,
    orderUpdates: user?.user_metadata?.notifications?.orderUpdates ?? true,
    promotions: user?.user_metadata?.notifications?.promotions ?? false,
  });
  
  const [preferences, setPreferences] = useState({
    language: user?.user_metadata?.language || 'fr',
    theme: user?.user_metadata?.theme || 'dark',
    currency: user?.user_metadata?.currency || 'EUR',
    autoSave: user?.user_metadata?.autoSave ?? true,
  });
  
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const handleSave = async () => {
    setIsLoading(true);
    try {
      // Update profile
      await updateUserProfile({
        name: `${profileData.firstName} ${profileData.lastName}`.trim(),
        phone: profileData.phone,
        address: profileData.address,
        notifications,
        preferences,
      });
      
      // Update language if changed
      if (preferences.language !== i18n.language) {
        i18n.changeLanguage(preferences.language);
      }
      
      toast.success('Paramètres enregistrés avec succès !');
    } catch (error) {
      toast.error('Erreur lors de l\'enregistrement des paramètres');
      console.error('Settings save error:', error);
    } finally {
      setIsLoading(false);
    }
  };
  
  const handlePasswordChange = async () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error('Les mots de passe ne correspondent pas');
      return;
    }
    
    if (passwordData.newPassword.length < 6) {
      toast.error('Le mot de passe doit contenir au moins 6 caractères');
      return;
    }
    
    setIsLoading(true);
    try {
      await updatePassword(passwordData.currentPassword, passwordData.newPassword);
      toast.success('Mot de passe mis à jour avec succès !');
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
      setShowPasswordForm(false);
    } catch (error) {
      toast.error('Erreur lors de la mise à jour du mot de passe');
      console.error('Password change error:', error);
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleDeleteAccount = async () => {
    if (!showDeleteConfirm) {
      setShowDeleteConfirm(true);
      return;
    }
    
    setIsLoading(true);
    try {
      await deleteAccount();
      toast.success('Compte supprimé avec succès');
      // Will be redirected to login page by AuthContext
    } catch (error) {
      toast.error('Erreur lors de la suppression du compte');
      console.error('Delete account error:', error);
      setShowDeleteConfirm(false);
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleDownloadData = () => {
    const userData = {
      profile: profileData,
      preferences,
      notifications,
      createdAt: user?.created_at,
      lastSignIn: user?.last_sign_in_at,
    };
    
    const dataStr = JSON.stringify(userData, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    const exportFileDefaultName = `user_data_${user?.id}_${new Date().toISOString().split('T')[0]}.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
    
    toast.success('Données téléchargées avec succès');
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-6 sm:py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="mb-6 sm:mb-8">
            <h1 className="text-2xl xs:text-3xl sm:text-4xl font-display font-bold text-foreground mb-2">
              {t('settings.title')}
            </h1>
            <p className="text-muted-foreground text-sm sm:text-base">
              {t('settings.subtitle')}
            </p>
          </div>

          <div className="space-y-4 sm:space-y-6">
            {/* Profile Settings */}
            <Card>
              <CardHeader className="pb-4 sm:pb-6">
                <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
                  <User className="w-4 h-4 sm:w-5 sm:h-5" />
                  {t('settings.profile.title')}
                </CardTitle>
                <CardDescription className="text-sm sm:text-base">
                  {t('settings.profile.description')}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3 sm:space-y-4 px-4 sm:px-6 pb-4 sm:pb-6">
                <div className="grid grid-cols-1 xs:grid-cols-2 gap-3 sm:gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName" className="text-sm sm:text-base">{t('settings.profile.firstName')}</Label>
                    <Input
                      id="firstName"
                      value={profileData.firstName}
                      onChange={(e) => setProfileData({...profileData, firstName: e.target.value})}
                      placeholder={t('settings.profile.firstName')}
                      className="h-10 sm:h-11 transition-all duration-200 focus:ring-2 focus:ring-primary/20"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName" className="text-sm sm:text-base">{t('settings.profile.lastName')}</Label>
                    <Input
                      id="lastName"
                      value={profileData.lastName}
                      onChange={(e) => setProfileData({...profileData, lastName: e.target.value})}
                      placeholder={t('settings.profile.lastName')}
                      className="h-10 sm:h-11 transition-all duration-200 focus:ring-2 focus:ring-primary/20"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-sm sm:text-base">{t('settings.profile.email')}</Label>
                  <Input
                    id="email"
                    type="email"
                    value={profileData.email}
                    onChange={(e) => setProfileData({...profileData, email: e.target.value})}
                    placeholder={t('settings.profile.email')}
                    className="h-10 sm:h-11 transition-all duration-200 focus:ring-2 focus:ring-primary/20"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone" className="text-sm sm:text-base">{t('settings.profile.phone')}</Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={profileData.phone}
                    onChange={(e) => setProfileData({...profileData, phone: e.target.value})}
                    placeholder={t('settings.profile.phone')}
                    className="h-10 sm:h-11 transition-all duration-200 focus:ring-2 focus:ring-primary/20"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="address" className="text-sm sm:text-base">Adresse de livraison</Label>
                  <Input
                    id="address"
                    value={profileData.address}
                    onChange={(e) => setProfileData({...profileData, address: e.target.value})}
                    placeholder="Votre adresse complète"
                    className="h-10 sm:h-11 transition-all duration-200 focus:ring-2 focus:ring-primary/20"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Preferences */}
            <Card>
              <CardHeader className="pb-4 sm:pb-6">
                <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
                  <Palette className="w-4 h-4 sm:w-5 sm:h-5" />
                  {t('settings.preferences.title')}
                </CardTitle>
                <CardDescription className="text-sm sm:text-base">
                  {t('settings.preferences.description')}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3 sm:space-y-4 px-4 sm:px-6 pb-4 sm:pb-6">
                <div className="grid grid-cols-1 xs:grid-cols-2 gap-3 sm:gap-4">
                  <div className="space-y-2">
                    <Label className="text-sm sm:text-base">{t('settings.preferences.language')}</Label>
                    <Select value={preferences.language} onValueChange={(value) => setPreferences({...preferences, language: value})}>
                      <SelectTrigger className="h-10 sm:h-11 transition-all duration-200 focus:ring-2 focus:ring-primary/20">
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
                    <Label className="text-sm sm:text-base">{t('settings.preferences.theme')}</Label>
                    <Select value={preferences.theme} onValueChange={(value) => setPreferences({...preferences, theme: value})}>
                      <SelectTrigger className="h-10 sm:h-11 transition-all duration-200 focus:ring-2 focus:ring-primary/20">
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
                <div className="grid grid-cols-1 xs:grid-cols-2 gap-3 sm:gap-4">
                  <div className="space-y-2">
                    <Label className="text-sm sm:text-base">{t('settings.preferences.currency')}</Label>
                    <Select value={preferences.currency} onValueChange={(value) => setPreferences({...preferences, currency: value})}>
                      <SelectTrigger className="h-10 sm:h-11 transition-all duration-200 focus:ring-2 focus:ring-primary/20">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="EUR">EUR (€)</SelectItem>
                        <SelectItem value="USD">USD ($)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm sm:text-base">Sauvegarde automatique</Label>
                    <Select value={preferences.autoSave ? 'enabled' : 'disabled'} onValueChange={(value) => setPreferences({...preferences, autoSave: value === 'enabled'})}>
                      <SelectTrigger className="h-10 sm:h-11 transition-all duration-200 focus:ring-2 focus:ring-primary/20">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="enabled">Activée</SelectItem>
                        <SelectItem value="disabled">Désactivée</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Notifications */}
            <Card>
              <CardHeader className="pb-4 sm:pb-6">
                <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
                  <Bell className="w-4 h-4 sm:w-5 sm:h-5" />
                  {t('settings.notifications.title')}
                </CardTitle>
                <CardDescription className="text-sm sm:text-base">
                  {t('settings.notifications.description')}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3 sm:space-y-4 px-4 sm:px-6 pb-4 sm:pb-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
                  <div className="space-y-1 sm:space-y-0.5 flex-1">
                    <div className="flex items-center gap-2">
                      <Mail className="w-4 h-4" />
                      <Label className="text-sm sm:text-base">{t('settings.notifications.email')}</Label>
                    </div>
                    <p className="text-xs sm:text-sm text-muted-foreground">
                      {t('settings.notifications.emailDescription')}
                    </p>
                  </div>
                  <Switch
                    checked={notifications.email}
                    onCheckedChange={(checked) => setNotifications({...notifications, email: checked})}
                    className="scale-90 sm:scale-100"
                  />
                </div>
                <Separator className="my-3 sm:my-4" />
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
                  <div className="space-y-1 sm:space-y-0.5 flex-1">
                    <div className="flex items-center gap-2">
                      <Smartphone className="w-4 h-4" />
                      <Label className="text-sm sm:text-base">{t('settings.notifications.push')}</Label>
                    </div>
                    <p className="text-xs sm:text-sm text-muted-foreground">
                      {t('settings.notifications.pushDescription')}
                    </p>
                  </div>
                  <Switch
                    checked={notifications.push}
                    onCheckedChange={(checked) => setNotifications({...notifications, push: checked})}
                    className="scale-90 sm:scale-100"
                  />
                </div>
                <Separator className="my-3 sm:my-4" />
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
                  <div className="space-y-1 sm:space-y-0.5 flex-1">
                    <Label className="text-sm sm:text-base">Mises à jour de commande</Label>
                    <p className="text-xs sm:text-sm text-muted-foreground">
                      Recevez des notifications sur le statut de vos commandes
                    </p>
                  </div>
                  <Switch
                    checked={notifications.orderUpdates}
                    onCheckedChange={(checked) => setNotifications({...notifications, orderUpdates: checked})}
                    className="scale-90 sm:scale-100"
                  />
                </div>
                <Separator className="my-3 sm:my-4" />
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
                  <div className="space-y-1 sm:space-y-0.5 flex-1">
                    <Label className="text-sm sm:text-base">Promotions et offres</Label>
                    <p className="text-xs sm:text-sm text-muted-foreground">
                      Recevez nos meilleures offres et promotions
                    </p>
                  </div>
                  <Switch
                    checked={notifications.promotions}
                    onCheckedChange={(checked) => setNotifications({...notifications, promotions: checked})}
                    className="scale-90 sm:scale-100"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Privacy & Security */}
            <Card>
              <CardHeader className="pb-4 sm:pb-6">
                <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
                  <Shield className="w-4 h-4 sm:w-5 sm:h-5" />
                  {t('settings.privacy.title')}
                </CardTitle>
                <CardDescription className="text-sm sm:text-base">
                  {t('settings.privacy.description')}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3 sm:space-y-4 px-4 sm:px-6 pb-4 sm:pb-6">
                {/* Password Change */}
                <div className="space-y-3 sm:space-y-4">
                  <Button 
                    variant="outline" 
                    onClick={() => setShowPasswordForm(!showPasswordForm)}
                    className="w-full sm:w-auto interactive-scale h-10 sm:h-11"
                  >
                    <Key className="w-4 h-4 mr-2" />
                    {showPasswordForm ? 'Annuler' : t('settings.privacy.changePassword')}
                  </Button>
                   
                  {showPasswordForm && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      className="space-y-3 sm:space-y-4 p-3 sm:p-4 bg-muted/50 rounded-lg"
                    >
                      <div className="space-y-2">
                        <Label className="text-sm sm:text-base">Mot de passe actuel</Label>
                        <div className="relative">
                          <Input
                            type={showCurrentPassword ? 'text' : 'password'}
                            value={passwordData.currentPassword}
                            onChange={(e) => setPasswordData({...passwordData, currentPassword: e.target.value})}
                            placeholder="Entrez votre mot de passe actuel"
                            className="h-10 sm:h-11 pr-10"
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="absolute right-0 top-0 h-full w-10 sm:w-11 px-2 sm:px-3 hover:bg-transparent"
                            onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                          >
                            {showCurrentPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                          </Button>
                        </div>
                      </div>
                       
                      <div className="space-y-2">
                        <Label className="text-sm sm:text-base">Nouveau mot de passe</Label>
                        <div className="relative">
                          <Input
                            type={showNewPassword ? 'text' : 'password'}
                            value={passwordData.newPassword}
                            onChange={(e) => setPasswordData({...passwordData, newPassword: e.target.value})}
                            placeholder="Entrez votre nouveau mot de passe"
                            className="h-10 sm:h-11 pr-10"
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="absolute right-0 top-0 h-full w-10 sm:w-11 px-2 sm:px-3 hover:bg-transparent"
                            onClick={() => setShowNewPassword(!showNewPassword)}
                          >
                            {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                          </Button>
                        </div>
                      </div>
                       
                      <div className="space-y-2">
                        <Label className="text-sm sm:text-base">Confirmer le mot de passe</Label>
                        <Input
                          type="password"
                          value={passwordData.confirmPassword}
                          onChange={(e) => setPasswordData({...passwordData, confirmPassword: e.target.value})}
                          placeholder="Confirmez votre nouveau mot de passe"
                          className="h-10 sm:h-11"
                        />
                      </div>
                       
                      <Button 
                        onClick={handlePasswordChange}
                        disabled={isLoading}
                        className="w-full h-10 sm:h-11"
                      >
                        {isLoading ? 'Mise à jour...' : 'Mettre à jour le mot de passe'}
                      </Button>
                    </motion.div>
                  )}
                </div>
                
                <Separator className="my-3 sm:my-4" />
                
                {/* Data Download */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
                  <div className="space-y-1 sm:space-y-0.5 flex-1">
                    <div className="flex items-center gap-2">
                      <Download className="w-4 h-4" />
                      <Label className="text-sm sm:text-base">{t('settings.privacy.downloadData')}</Label>
                    </div>
                    <p className="text-xs sm:text-sm text-muted-foreground">
                      Téléchargez toutes vos données personnelles
                    </p>
                  </div>
                  <Button variant="outline" onClick={handleDownloadData} className="interactive-scale h-10 sm:h-11 px-3 sm:px-4">
                    <Download className="w-4 h-4 mr-2" />
                    <span className="hidden sm:inline">Télécharger</span>
                    <span className="sm:hidden">Téléch.</span>
                  </Button>
                </div>
                
                <Separator className="my-3 sm:my-4" />
                
                {/* Delete Account */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
                  <div className="space-y-1 sm:space-y-0.5 flex-1">
                    <div className="flex items-center gap-2">
                      <Trash2 className="w-4 h-4 text-destructive" />
                      <Label className="text-sm sm:text-base text-destructive">{t('settings.privacy.deleteAccount')}</Label>
                    </div>
                    <p className="text-xs sm:text-sm text-muted-foreground">
                      {showDeleteConfirm ? 'Cliquez à nouveau pour confirmer' : 'Cette action est irréversible'}
                    </p>
                  </div>
                  <Button 
                    variant={showDeleteConfirm ? 'destructive' : 'outline'} 
                    onClick={handleDeleteAccount}
                    disabled={isLoading}
                    className={showDeleteConfirm ? 'h-10 sm:h-11' : 'h-10 sm:h-11 border-destructive text-destructive hover:bg-destructive hover:text-destructive-foreground'}
                  >
                    <span className="hidden sm:inline">{showDeleteConfirm ? 'Confirmer la suppression' : t('settings.privacy.deleteAccount')}</span>
                    <span className="sm:hidden">{showDeleteConfirm ? 'Supprimer' : 'Supprimer'}</span>
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Save Button */}
            <div className="flex flex-col sm:flex-row justify-end gap-3 sm:gap-4 pt-4 sm:pt-6">
              <Button 
                variant="outline" 
                onClick={() => window.history.back()}
                className="interactive-scale h-10 sm:h-11 px-4 sm:px-6 w-full sm:w-auto"
              >
                Annuler
              </Button>
              <Button 
                onClick={handleSave} 
                disabled={isLoading}
                className="px-4 sm:px-8 interactive-scale h-10 sm:h-11 w-full sm:w-auto"
              >
                {isLoading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                    <span className="hidden sm:inline">Enregistrement...</span>
                    <span className="sm:hidden">Enreg...</span>
                  </>
                ) : (
                  <>
                    <span className="hidden sm:inline">{t('settings.save')}</span>
                    <span className="sm:hidden">Enregistrer</span>
                  </>
                )}
              </Button>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}