import { useState, useEffect, useCallback } from 'react'
import { motion } from 'framer-motion'
import { useAuth } from '@/contexts/AuthContext'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  User,
  ShoppingBag,
  Heart,
  Settings,
  Flame,
  Clock,
  MapPin,
  Phone,
  Mail,
  Calendar,
  Star,
  TrendingUp
} from 'lucide-react'
import { useTranslation } from 'react-i18next'
import supabase from '@/lib/supabase'

interface Order {
  id: string
  status: string
  total_amount: number
  created_at: string
  delivery_address?: string
}

interface Favorite {
  id: string
  menu_item: {
    name: string
    price: number
    image_url?: string
  }
}

export default function Dashboard() {
  const { user } = useAuth()
  const { t } = useTranslation()
  const [orders, setOrders] = useState<Order[]>([])
  const [favorites, setFavorites] = useState<Favorite[]>([])
  const [stats, setStats] = useState({
    totalOrders: 0,
    totalSpent: 0,
    favoriteCategory: 'Poisson'
  })
  const [loading, setLoading] = useState(true)

  const fetchUserData = useCallback(async () => {
    try {
      setLoading(true)

      // Récupérer les commandes récentes
      const { data: ordersData } = await supabase
        .from('orders')
        .select('*')
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false })
        .limit(5)

      if (ordersData) {
        setOrders(ordersData as Order[])
        setStats(prev => ({
          ...prev,
          totalOrders: ordersData.length,
          totalSpent: ordersData.reduce((sum, order) => sum + (order as Order).total_amount, 0)
        }))
      }

      // Simuler des favoris (à implémenter avec une vraie table)
      setFavorites([
        { id: '1', menu_item: { name: 'Tilapia Grillé', price: 25.99, image_url: '' } },
        { id: '2', menu_item: { name: 'Suya Beef', price: 18.99, image_url: '' } },
        { id: '3', menu_item: { name: 'Poulet Braisé', price: 22.99, image_url: '' } }
      ])

    } catch (error) {
      console.error('Error fetching user data:', error)
    } finally {
      setLoading(false)
    }
  }, [user?.id])

  useEffect(() => {
    if (user) {
      fetchUserData()
    }
  }, [user, fetchUserData])

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-500'
      case 'confirmed': return 'bg-blue-500'
      case 'preparing': return 'bg-orange-500'
      case 'ready': return 'bg-green-500'
      case 'delivered': return 'bg-emerald-500'
      case 'cancelled': return 'bg-red-500'
      default: return 'bg-gray-500'
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'pending': return 'En attente'
      case 'confirmed': return 'Confirmée'
      case 'preparing': return 'En préparation'
      case 'ready': return 'Prête'
      case 'delivered': return 'Livrée'
      case 'cancelled': return 'Annulée'
      default: return status
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Chargement de votre tableau de bord...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/20">
      <div className="container mx-auto px-4 py-8 pt-24">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center gap-4 mb-6">
            <Avatar className="h-20 w-20">
              <AvatarImage src={user?.user_metadata?.avatar_url} />
              <AvatarFallback className="bg-gradient-to-br from-primary to-secondary text-2xl">
                {(user?.user_metadata?.name || user?.email || 'U')[0].toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div>
              <h1 className="text-3xl font-bold">
                {t('dashboard.welcome')}, {user?.user_metadata?.name || 'Cher Client'} ! 👋
              </h1>
              <p className="text-muted-foreground">
                Gérez vos commandes et découvrez nos plats préférés
              </p>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Commandes Totales</CardTitle>
                <ShoppingBag className="h-4 w-4 text-blue-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-blue-600">{stats.totalOrders}</div>
                <p className="text-xs text-blue-600/70">Depuis votre inscription</p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950 dark:to-green-900">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Dépensé</CardTitle>
                <TrendingUp className="h-4 w-4 text-green-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">{stats.totalSpent.toFixed(2)}€</div>
                <p className="text-xs text-green-600/70">Chez BrazzaFlame</p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-950 dark:to-orange-900">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Plat Préféré</CardTitle>
                <Flame className="h-4 w-4 text-orange-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-orange-600">{stats.favoriteCategory}</div>
                <p className="text-xs text-orange-600/70">Votre catégorie favorite</p>
              </CardContent>
            </Card>
          </div>
        </motion.div>

        {/* Main Content */}
        <Tabs defaultValue="orders" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="orders" className="flex items-center gap-2">
              <ShoppingBag className="h-4 w-4" />
              {t('orders.title')}
            </TabsTrigger>
            <TabsTrigger value="favorites" className="flex items-center gap-2">
              <Heart className="h-4 w-4" />
              {t('favorites.title')}
            </TabsTrigger>
            <TabsTrigger value="profile" className="flex items-center gap-2">
              <User className="h-4 w-4" />
              Profil
            </TabsTrigger>
            <TabsTrigger value="settings" className="flex items-center gap-2">
              <Settings className="h-4 w-4" />
              Paramètres
            </TabsTrigger>
          </TabsList>

          {/* Orders Tab */}
          <TabsContent value="orders" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ShoppingBag className="h-5 w-5" />
                  {t('dashboard.recentOrders')}
                </CardTitle>
                <CardDescription>
                  Vos dernières commandes chez BrazzaFlame
                </CardDescription>
              </CardHeader>
              <CardContent>
                {orders.length === 0 ? (
                  <div className="text-center py-8">
                    <ShoppingBag className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">{t('orders.empty')}</p>
                    <Button className="mt-4" asChild>
                      <a href="/menu">{t('dashboard.quickOrder')}</a>
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {orders.map((order) => (
                      <motion.div
                        key={order.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="flex items-center justify-between p-4 border rounded-lg"
                      >
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                            <ShoppingBag className="h-6 w-6 text-primary" />
                          </div>
                          <div>
                            <p className="font-medium">Commande #{order.id.slice(-8)}</p>
                            <p className="text-sm text-muted-foreground">
                              {new Date(order.created_at).toLocaleDateString('fr-FR')}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-4">
                          <Badge className={`${getStatusColor(order.status)} text-white`}>
                            {getStatusText(order.status)}
                          </Badge>
                          <span className="font-bold">{order.total_amount.toFixed(2)}€</span>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Favorites Tab */}
          <TabsContent value="favorites" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Heart className="h-5 w-5" />
                  {t('dashboard.favoritesTitle')}
                </CardTitle>
                <CardDescription>
                  {t('dashboard.favoritesSubtitle')}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {favorites.map((favorite) => (
                    <motion.div
                      key={favorite.id}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="border rounded-lg p-4 hover:shadow-md transition-shadow"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                          <Flame className="h-6 w-6 text-primary" />
                        </div>
                        <div>
                          <p className="font-medium">{favorite.menu_item.name}</p>
                          <p className="text-sm text-muted-foreground">{favorite.menu_item.price.toFixed(2)}€</p>
                        </div>
                      </div>
                      <Button size="sm" className="w-full mt-3">
                        {t('dashboard.orderAgain')}
                      </Button>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Profile Tab */}
          <TabsContent value="profile" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Informations Personnelles
                </CardTitle>
                <CardDescription>
                  Gérez vos informations de compte
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <Mail className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <p className="text-sm font-medium">Email</p>
                        <p className="text-sm text-muted-foreground">{user?.email}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <User className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <p className="text-sm font-medium">Nom complet</p>
                        <p className="text-sm text-muted-foreground">
                          {user?.user_metadata?.name || 'Non spécifié'}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <Calendar className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <p className="text-sm font-medium">Membre depuis</p>
                        <p className="text-sm text-muted-foreground">
                          {user?.created_at ? new Date(user.created_at).toLocaleDateString('fr-FR') : 'N/A'}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Star className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <p className="text-sm font-medium">Statut</p>
                        <Badge variant="secondary">Client fidèle</Badge>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex gap-4 pt-4">
                  <Button variant="outline">
                    <Settings className="h-4 w-4 mr-2" />
                    Modifier le profil
                  </Button>
                  <Button variant="outline">
                    <MapPin className="h-4 w-4 mr-2" />
                    Adresses de livraison
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Settings Tab */}
          <TabsContent value="settings" className="space-y-6">
            {/* Account Settings */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="h-5 w-5" />
                  Paramètres du Compte
                </CardTitle>
                <CardDescription>
                  Gérez vos préférences et paramètres de compte
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Notifications */}
                <div className="space-y-4">
                  <h4 className="font-medium">Notifications</h4>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Commandes</p>
                        <p className="text-sm text-muted-foreground">Notifications sur l'état de vos commandes</p>
                      </div>
                      <Button variant="outline" size="sm">Activé</Button>
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Promotions</p>
                        <p className="text-sm text-muted-foreground">Offres spéciales et réductions</p>
                      </div>
                      <Button variant="outline" size="sm">Activé</Button>
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Nouveaux plats</p>
                        <p className="text-sm text-muted-foreground">Découvrez nos nouveaux plats</p>
                      </div>
                      <Button variant="outline" size="sm">Activé</Button>
                    </div>
                  </div>
                </div>

                {/* Privacy */}
                <div className="space-y-4">
                  <h4 className="font-medium">Confidentialité</h4>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Données personnelles</p>
                        <p className="text-sm text-muted-foreground">Gérez vos données personnelles</p>
                      </div>
                      <Button variant="outline" size="sm">Voir</Button>
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Historique des commandes</p>
                        <p className="text-sm text-muted-foreground">Téléchargez votre historique</p>
                      </div>
                      <Button variant="outline" size="sm">Télécharger</Button>
                    </div>
                  </div>
                </div>

                {/* Language & Region */}
                <div className="space-y-4">
                  <h4 className="font-medium">Langue et Région</h4>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Langue</p>
                        <p className="text-sm text-muted-foreground">Langue de l'interface</p>
                      </div>
                      <Button variant="outline" size="sm">Français</Button>
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Région</p>
                        <p className="text-sm text-muted-foreground">Votre région de livraison</p>
                      </div>
                      <Button variant="outline" size="sm">Bruxelles</Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Security Settings */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Sécurité
                </CardTitle>
                <CardDescription>
                  Gérez la sécurité de votre compte
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Mot de passe</p>
                      <p className="text-sm text-muted-foreground">Dernière modification il y a 3 mois</p>
                    </div>
                    <Button variant="outline" size="sm">Changer</Button>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Authentification à deux facteurs</p>
                      <p className="text-sm text-muted-foreground">Ajoutez une couche de sécurité</p>
                    </div>
                    <Button variant="outline" size="sm">Activer</Button>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Sessions actives</p>
                      <p className="text-sm text-muted-foreground">Gérez vos sessions connectées</p>
                    </div>
                    <Button variant="outline" size="sm">Voir</Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Danger Zone */}
            <Card className="border-red-200">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-red-600">
                  <Flame className="h-5 w-5" />
                  Zone de Danger
                </CardTitle>
                <CardDescription>
                  Actions irréversibles pour votre compte
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between p-4 border border-red-200 rounded-lg">
                  <div>
                    <p className="font-medium text-red-600">Supprimer le compte</p>
                    <p className="text-sm text-muted-foreground">Suppression permanente de votre compte et données</p>
                  </div>
                  <Button variant="destructive" size="sm">Supprimer</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}