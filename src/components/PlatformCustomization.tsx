import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { toast } from 'sonner';
import { 
  Palette, 
  Globe, 
  DollarSign, 
  Mail, 
  Smartphone, 
  Bell, 
  Shield, 
  Settings as SettingsIcon,
  Save,
  RotateCcw,
  Download,
  Upload
} from 'lucide-react';

interface PlatformSettings {
  // General
  siteName: string;
  siteDescription: string;
  logo: string;
  favicon: string;
  
  // Theme
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  darkMode: boolean;
  
  // Localization
  defaultLanguage: string;
  defaultCurrency: string;
  timezone: string;
  
  // Contact
  contactEmail: string;
  contactPhone: string;
  contactAddress: string;
  
  // Notifications
  emailNotifications: boolean;
  smsNotifications: boolean;
  pushNotifications: boolean;
  
  // Payment
  paypalEnabled: boolean;
  stripeEnabled: boolean;
  cashOnDelivery: boolean;
  
  // Security
  twoFactorAuth: boolean;
  sessionTimeout: number;
  passwordMinLength: number;
  
  // Features
  registrationEnabled: boolean;
  guestCheckout: boolean;
  reviewsEnabled: boolean;
  wishlistEnabled: boolean;
}

const defaultSettings: PlatformSettings = {
  siteName: 'Ember Grill',
  siteDescription: 'Restaurant camerounais moderne avec grillades authentiques',
  logo: '/logo.png',
  favicon: '/favicon.ico',
  primaryColor: '#000000',
  secondaryColor: '#ffffff',
  accentColor: '#ff6b35',
  darkMode: true,
  defaultLanguage: 'fr',
  defaultCurrency: 'EUR',
  timezone: 'Europe/Brussels',
  contactEmail: 'contact@ember-grill.be',
  contactPhone: '+32 2 123 45 67',
  contactAddress: 'Rue des Grillades 123, 1000 Bruxelles',
  emailNotifications: true,
  smsNotifications: false,
  pushNotifications: true,
  paypalEnabled: true,
  stripeEnabled: false,
  cashOnDelivery: true,
  twoFactorAuth: false,
  sessionTimeout: 24,
  passwordMinLength: 8,
  registrationEnabled: true,
  guestCheckout: true,
  reviewsEnabled: true,
  wishlistEnabled: true
};

export default function PlatformCustomization() {
  const [settings, setSettings] = useState<PlatformSettings>(defaultSettings);
  const [isLoading, setIsLoading] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  useEffect(() => {
    // Load settings from localStorage or API
    const savedSettings = localStorage.getItem('platform_settings');
    if (savedSettings) {
      try {
        setSettings(JSON.parse(savedSettings));
      } catch (error) {
        console.error('Error loading settings:', error);
      }
    }
  }, []);

  useEffect(() => {
    // Check if settings have changed
    const hasChanges = JSON.stringify(settings) !== JSON.stringify(defaultSettings);
    setHasChanges(hasChanges);
  }, [settings]);

  const handleSave = async () => {
    setIsLoading(true);
    try {
      // Save to localStorage (in production, save to API/database)
      localStorage.setItem('platform_settings', JSON.stringify(settings));
      
      // Apply theme changes immediately
      document.documentElement.style.setProperty('--primary', settings.primaryColor);
      document.documentElement.style.setProperty('--accent', settings.accentColor);
      
      toast.success('Paramètres de la plateforme enregistrés avec succès');
    } catch (error) {
      toast.error('Erreur lors de l\'enregistrement des paramètres');
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setSettings(defaultSettings);
    toast.info('Paramètres réinitialisés aux valeurs par défaut');
  };

  const handleExport = () => {
    const dataStr = JSON.stringify(settings, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    const exportFileDefaultName = `platform_settings_${new Date().toISOString().split('T')[0]}.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
    
    toast.success('Paramètres exportés avec succès');
  };

  const handleImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const importedSettings = JSON.parse(e.target?.result as string);
        setSettings({ ...defaultSettings, ...importedSettings });
        toast.success('Paramètres importés avec succès');
      } catch (error) {
        toast.error('Erreur lors de l\'importation des paramètres');
      }
    };
    reader.readAsText(file);
  };

  const updateSetting = (key: keyof PlatformSettings, value: any) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Personnalisation de la plateforme</h2>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleExport} className="interactive-scale">
            <Download className="w-4 h-4 mr-2" />
            Exporter
          </Button>
          <Button variant="outline" onClick={handleReset} className="interactive-scale">
            <RotateCcw className="w-4 h-4 mr-2" />
            Réinitialiser
          </Button>
          <Button 
            onClick={handleSave} 
            disabled={!hasChanges || isLoading}
            className="interactive-scale"
          >
            <Save className="w-4 h-4 mr-2" />
            {isLoading ? 'Enregistrement...' : 'Enregistrer'}
          </Button>
        </div>
      </div>

      {/* General Settings */}
      <Card variant="glass">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <SettingsIcon className="w-5 h-5" />
            Informations générales
          </CardTitle>
          <CardDescription>Configuration de base de la plateforme</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="siteName">Nom du site</Label>
              <Input
                id="siteName"
                value={settings.siteName}
                onChange={(e) => updateSetting('siteName', e.target.value)}
                placeholder="Nom de votre site"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="contactEmail">Email de contact</Label>
              <Input
                id="contactEmail"
                type="email"
                value={settings.contactEmail}
                onChange={(e) => updateSetting('contactEmail', e.target.value)}
                placeholder="contact@exemple.com"
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="siteDescription">Description du site</Label>
            <Textarea
              id="siteDescription"
              value={settings.siteDescription}
              onChange={(e) => updateSetting('siteDescription', e.target.value)}
              placeholder="Description de votre plateforme"
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="contactAddress">Adresse</Label>
            <Input
              id="contactAddress"
              value={settings.contactAddress}
              onChange={(e) => updateSetting('contactAddress', e.target.value)}
              placeholder="Adresse complète"
            />
          </div>
        </CardContent>
      </Card>

      {/* Theme Settings */}
      <Card variant="glass">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Palette className="w-5 h-5" />
            Personnalisation du thème
          </CardTitle>
          <CardDescription>Couleurs et apparence de la plateforme</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="primaryColor">Couleur principale</Label>
              <div className="flex gap-2">
                <Input
                  id="primaryColor"
                  type="color"
                  value={settings.primaryColor}
                  onChange={(e) => updateSetting('primaryColor', e.target.value)}
                  className="w-20 h-10"
                />
                <Input
                  value={settings.primaryColor}
                  onChange={(e) => updateSetting('primaryColor', e.target.value)}
                  placeholder="#000000"
                  className="flex-1"
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="secondaryColor">Couleur secondaire</Label>
              <div className="flex gap-2">
                <Input
                  id="secondaryColor"
                  type="color"
                  value={settings.secondaryColor}
                  onChange={(e) => updateSetting('secondaryColor', e.target.value)}
                  className="w-20 h-10"
                />
                <Input
                  value={settings.secondaryColor}
                  onChange={(e) => updateSetting('secondaryColor', e.target.value)}
                  placeholder="#ffffff"
                  className="flex-1"
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="accentColor">Couleur d'accent</Label>
              <div className="flex gap-2">
                <Input
                  id="accentColor"
                  type="color"
                  value={settings.accentColor}
                  onChange={(e) => updateSetting('accentColor', e.target.value)}
                  className="w-20 h-10"
                />
                <Input
                  value={settings.accentColor}
                  onChange={(e) => updateSetting('accentColor', e.target.value)}
                  placeholder="#ff6b35"
                  className="flex-1"
                />
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              id="darkMode"
              checked={settings.darkMode}
              onCheckedChange={(checked) => updateSetting('darkMode', checked)}
            />
            <Label htmlFor="darkMode">Mode sombre par défaut</Label>
          </div>
        </CardContent>
      </Card>

      {/* Localization Settings */}
      <Card variant="glass">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Globe className="w-5 h-5" />
            Localisation
          </CardTitle>
          <CardDescription>Langue, devise et paramètres régionaux</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label>Langue par défaut</Label>
              <Select 
                value={settings.defaultLanguage} 
                onValueChange={(value) => updateSetting('defaultLanguage', value)}
              >
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
              <Label>Devise par défaut</Label>
              <Select 
                value={settings.defaultCurrency} 
                onValueChange={(value) => updateSetting('defaultCurrency', value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="EUR">EUR (€)</SelectItem>
                  <SelectItem value="USD">USD ($)</SelectItem>
                  <SelectItem value="GBP">GBP (£)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label>Fuseau horaire</Label>
              <Select 
                value={settings.timezone} 
                onValueChange={(value) => updateSetting('timezone', value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Europe/Brussels">Europe/Bruxelles</SelectItem>
                  <SelectItem value="Europe/Paris">Europe/Paris</SelectItem>
                  <SelectItem value="Europe/London">Europe/Londres</SelectItem>
                  <SelectItem value="America/New_York">America/New_York</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Feature Settings */}
      <Card variant="glass">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="w-5 h-5" />
            Fonctionnalités
          </CardTitle>
          <CardDescription>Activer ou désactiver les fonctionnalités de la plateforme</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Inscription des utilisateurs</Label>
                  <p className="text-sm text-muted-foreground">
                    Permettre aux nouveaux utilisateurs de créer un compte
                  </p>
                </div>
                <Switch
                  checked={settings.registrationEnabled}
                  onCheckedChange={(checked) => updateSetting('registrationEnabled', checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Commande invité</Label>
                  <p className="text-sm text-muted-foreground">
                    Permettre les commandes sans création de compte
                  </p>
                </div>
                <Switch
                  checked={settings.guestCheckout}
                  onCheckedChange={(checked) => updateSetting('guestCheckout', checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Avis clients</Label>
                  <p className="text-sm text-muted-foreground">
                    Permettre aux clients de laisser des avis
                  </p>
                </div>
                <Switch
                  checked={settings.reviewsEnabled}
                  onCheckedChange={(checked) => updateSetting('reviewsEnabled', checked)}
                />
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Liste de souhaits</Label>
                  <p className="text-sm text-muted-foreground">
                    Activer la fonctionnalité de liste de souhaits
                  </p>
                </div>
                <Switch
                  checked={settings.wishlistEnabled}
                  onCheckedChange={(checked) => updateSetting('wishlistEnabled', checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Notifications email</Label>
                  <p className="text-sm text-muted-foreground">
                    Envoyer des notifications par email
                  </p>
                </div>
                <Switch
                  checked={settings.emailNotifications}
                  onCheckedChange={(checked) => updateSetting('emailNotifications', checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Notifications push</Label>
                  <p className="text-sm text-muted-foreground">
                    Activer les notifications push
                  </p>
                </div>
                <Switch
                  checked={settings.pushNotifications}
                  onCheckedChange={(checked) => updateSetting('pushNotifications', checked)}
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Payment Settings */}
      <Card variant="glass">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <DollarSign className="w-5 h-5" />
            Méthodes de paiement
          </CardTitle>
          <CardDescription>Configurer les options de paiement disponibles</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>PayPal</Label>
                <p className="text-sm text-muted-foreground">
                  Accepter les paiements PayPal
                </p>
              </div>
              <Switch
                checked={settings.paypalEnabled}
                onCheckedChange={(checked) => updateSetting('paypalEnabled', checked)}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Stripe</Label>
                <p className="text-sm text-muted-foreground">
                  Accepter les paiements par carte
                </p>
              </div>
              <Switch
                checked={settings.stripeEnabled}
                onCheckedChange={(checked) => updateSetting('stripeEnabled', checked)}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Paiement à la livraison</Label>
                <p className="text-sm text-muted-foreground">
                  Accepter le paiement en espèces à la livraison
                </p>
              </div>
              <Switch
                checked={settings.cashOnDelivery}
                onCheckedChange={(checked) => updateSetting('cashOnDelivery', checked)}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Import/Export */}
      <Card variant="glass">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Upload className="w-5 h-5" />
            Import/Export
          </CardTitle>
          <CardDescription>Sauvegarder ou restaurer la configuration</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-4">
            <div className="flex-1">
              <Label htmlFor="importSettings">Importer des paramètres</Label>
              <Input
                id="importSettings"
                type="file"
                accept=".json"
                onChange={handleImport}
                className="mt-2"
              />
            </div>
            <Button 
              variant="outline" 
              onClick={handleExport}
              className="interactive-scale mt-6"
            >
              <Download className="w-4 h-4 mr-2" />
              Exporter la configuration
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
