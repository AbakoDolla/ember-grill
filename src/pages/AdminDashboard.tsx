import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAdmin } from '@/contexts/AdminContext';
import { useAdminData } from '@/hooks/useAdminData';
import ProductManagement from '@/components/ProductManagement';
import AdminCharts from '@/components/AdminCharts';
import PlatformCustomization from '@/components/PlatformCustomization';
import { 
  Users, 
  ShoppingCart, 
  TrendingUp, 
  DollarSign, 
  Package, 
  Settings, 
  LogOut, 
  Eye,
  Edit,
  Trash2,
  Plus,
  BarChart3,
  Clock,
  AlertCircle,
  Shield,
  RefreshCw
} from 'lucide-react';
import { toast } from 'sonner';

// Mock data - en production, ceci viendra de Supabase
const mockStats = {
  totalUsers: 1247,
  totalOrders: 892,
  totalRevenue: 45678.90,
  totalProducts: 24,
  pendingOrders: 12,
  todayOrders: 34
};

const mockRecentOrders = [
  { id: 'ORD-001', customer: 'Jean Dupont', amount: 89.90, status: 'pending', time: '10:30' },
  { id: 'ORD-002', customer: 'Marie Curie', amount: 124.50, status: 'delivered', time: '09:45' },
  { id: 'ORD-003', customer: 'Pierre Martin', amount: 67.30, status: 'preparing', time: '08:20' },
  { id: 'ORD-004', customer: 'Sophie Lemaire', amount: 156.80, status: 'pending', time: '07:55' },
];

const mockUsers = [
  { id: 1, name: 'Jean Dupont', email: 'jean.dupont@email.com', orders: 12, spent: 890.50, joined: '2024-01-15' },
  { id: 2, name: 'Marie Curie', email: 'marie.curie@email.com', orders: 8, spent: 1245.30, joined: '2024-02-20' },
  { id: 3, name: 'Pierre Martin', email: 'pierre.martin@email.com', orders: 15, spent: 2340.80, joined: '2023-12-10' },
];

export default function AdminDashboard() {
  const { logoutAdmin } = useAdmin();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');
  
  // Use real admin data
  const {
    stats,
    orders,
    users,
    products,
    loading,
    error,
    updateOrderStatus,
    deleteOrder,
    deleteUser,
    createProduct,
    updateProduct,
    deleteProduct,
    refreshData
  } = useAdminData();

  const handleLogout = () => {
    logoutAdmin();
    navigate('/admin/login');
    toast.info('Déconnexion administrateur');
  };

  const StatCard = ({ title, value, icon: Icon, change, color = 'primary' }: any) => (
    <Card variant="glass" className="p-6 hover:scale-105 transition-all duration-300">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-muted-foreground text-sm">{title}</p>
          <p className="text-2xl font-bold text-foreground">{value}</p>
          {change && (
            <p className={`text-sm ${change > 0 ? 'text-green-600' : 'text-red-600'}`}>
              {change > 0 ? '+' : ''}{change}%
            </p>
          )}
        </div>
        <div className={`w-12 h-12 rounded-full bg-${color}/10 flex items-center justify-center`}>
          <Icon className={`w-6 h-6 text-${color}`} />
        </div>
      </div>
    </Card>
  );

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                <Shield className="w-4 h-4 text-primary-foreground" />
              </div>
              <h1 className="font-display font-bold text-xl">Ember Grill Admin</h1>
            </div>
            <Button variant="outline" onClick={handleLogout} className="interactive-scale">
              <LogOut className="w-4 h-4 mr-2" />
              Déconnexion
            </Button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Navigation Tabs */}
        <div className="flex gap-2 mb-8 overflow-x-auto">
          {[
            { id: 'overview', label: 'Aperçu', icon: BarChart3 },
            { id: 'orders', label: 'Commandes', icon: ShoppingCart },
            { id: 'users', label: 'Utilisateurs', icon: Users },
            { id: 'products', label: 'Produits', icon: Package },
            { id: 'customization', label: 'Personnalisation', icon: Settings },
            { id: 'settings', label: 'Paramètres', icon: Settings }
          ].map((tab) => (
            <Button
              key={tab.id}
              variant={activeTab === tab.id ? 'default' : 'outline'}
              onClick={() => setActiveTab(tab.id)}
              className="flex items-center gap-2 whitespace-nowrap"
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </Button>
          ))}
        </div>

        {/* Content */}
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          {activeTab === 'overview' && (
            <div className="space-y-8">
              {loading ? (
                <div className="flex items-center justify-center py-12">
                  <RefreshCw className="w-8 h-8 animate-spin text-primary" />
                  <span className="ml-2">Chargement des données...</span>
                </div>
              ) : error ? (
                <Card variant="glass">
                  <CardContent className="text-center py-12">
                    <AlertCircle className="w-16 h-16 mx-auto mb-4 text-destructive" />
                    <p className="text-destructive mb-4">Erreur lors du chargement des données</p>
                    <Button onClick={refreshData} variant="outline">
                      <RefreshCw className="w-4 h-4 mr-2" />
                      Réessayer
                    </Button>
                  </CardContent>
                </Card>
              ) : (
                <>
                  <AdminCharts data={{ orders, users, products, stats }} />
                  
                  {/* Recent Orders */}
                  <Card variant="glass">
                    <CardHeader>
                      <CardTitle>Commandes récentes</CardTitle>
                      <CardDescription>Dernières commandes passées</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {orders.slice(0, 5).map((order) => (
                          <div key={order.id} className="flex items-center justify-between p-4 bg-muted/30 rounded-lg">
                            <div className="flex items-center gap-4">
                              <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                                <ShoppingCart className="w-5 h-5 text-primary" />
                              </div>
                              <div>
                                <p className="font-medium">
                                  {order.user?.user_metadata?.name || order.user?.email || 'Client anonyme'}
                                </p>
                                <p className="text-sm text-muted-foreground">{order.id}</p>
                              </div>
                            </div>
                            <div className="text-right">
                              <p className="font-medium">€{order.total || 0}</p>
                              <p className="text-sm text-muted-foreground">
                                {new Date(order.created_at).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
                              </p>
                              <span className={`inline-block px-2 py-1 text-xs rounded-full ${
                                order.status === 'delivered' ? 'bg-green-100 text-green-800' :
                                order.status === 'preparing' ? 'bg-blue-100 text-blue-800' :
                                order.status === 'ready' ? 'bg-yellow-100 text-yellow-800' :
                                'bg-red-100 text-red-800'
                              }`}>
                                {order.status === 'delivered' ? 'Livré' :
                                 order.status === 'preparing' ? 'Préparation' :
                                 order.status === 'ready' ? 'Prêt' :
                                 order.status === 'cancelled' ? 'Annulé' : 'En attente'}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </>
              )}
            </div>
          )}

          {activeTab === 'orders' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold">Gestion des commandes</h2>
                <Button className="interactive-scale">
                  <Plus className="w-4 h-4 mr-2" />
                  Ajouter une commande
                </Button>
              </div>
              <Card variant="glass">
                <CardContent className="p-0">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-border">
                          <th className="text-left p-4">ID Commande</th>
                          <th className="text-left p-4">Client</th>
                          <th className="text-left p-4">Montant</th>
                          <th className="text-left p-4">Statut</th>
                          <th className="text-left p-4">Date</th>
                          <th className="text-left p-4">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {orders.slice(0, 10).map((order) => (
                          <tr key={order.id} className="border-b border-border hover:bg-muted/50">
                            <td className="p-4">{order.id}</td>
                            <td className="p-4">{order.user?.user_metadata?.name || order.user?.email || 'Client anonyme'}</td>
                            <td className="p-4">€{order.total || 0}</td>
                            <td className="p-4">
                              <span className={`px-2 py-1 text-xs rounded-full cursor-pointer hover:opacity-80 ${
                                order.status === 'delivered' ? 'bg-green-100 text-green-800' :
                                order.status === 'preparing' ? 'bg-blue-100 text-blue-800' :
                                order.status === 'ready' ? 'bg-yellow-100 text-yellow-800' :
                                order.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                                'bg-yellow-100 text-yellow-800'
                              }`}
                              onClick={async () => {
                                const statusOptions = ['pending', 'preparing', 'ready', 'delivered', 'cancelled'];
                                const currentIndex = statusOptions.indexOf(order.status);
                                const nextStatus = statusOptions[(currentIndex + 1) % statusOptions.length];
                                
                                const result = await updateOrderStatus(order.id, nextStatus as any);
                                if (result.success) {
                                  toast.success(`Statut mis à jour: ${nextStatus}`);
                                } else {
                                  toast.error(result.error || 'Erreur lors de la mise à jour');
                                }
                              }}
                              title="Cliquez pour changer le statut">
                                {order.status === 'delivered' ? 'Livré' :
                                 order.status === 'preparing' ? 'Préparation' :
                                 order.status === 'ready' ? 'Prêt' :
                                 order.status === 'cancelled' ? 'Annulé' : 'En attente'}
                              </span>
                            </td>
                            <td className="p-4">{new Date(order.created_at).toLocaleDateString('fr-FR')}</td>
                            <td className="p-4">
                              <div className="flex gap-2">
                                <Button 
                                  variant="outline" 
                                  size="sm"
                                  onClick={() => {
                                    toast.info(`Détails de la commande ${order.id}`);
                                  }}
                                >
                                  <Eye className="w-3 h-3" />
                                </Button>
                                <Button 
                                  variant="outline" 
                                  size="sm"
                                  onClick={() => {
                                    toast.info(`Modification de la commande ${order.id}`);
                                  }}
                                >
                                  <Edit className="w-3 h-3" />
                                </Button>
                                <Button 
                                  variant="destructive" 
                                  size="sm"
                                  onClick={async () => {
                                    if (window.confirm(`Supprimer la commande ${order.id} ?`)) {
                                      const result = await deleteOrder(order.id);
                                      if (result.success) {
                                        toast.success('Commande supprimée avec succès');
                                      } else {
                                        toast.error(result.error || 'Erreur lors de la suppression');
                                      }
                                    }
                                  }}
                                >
                                  <Trash2 className="w-3 h-3" />
                                </Button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {activeTab === 'users' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold">Gestion des utilisateurs</h2>
                <Button className="interactive-scale">
                  <Plus className="w-4 h-4 mr-2" />
                  Ajouter un utilisateur
                </Button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {users.slice(0, 9).map((user) => (
                  <Card variant="glass" key={user.id} className="hover:scale-105 transition-all duration-300">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between mb-4">
                        <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                          <Users className="w-6 h-6 text-primary" />
                        </div>
                        <div className="text-right">
                          <p className="text-sm text-muted-foreground">
                            {orders.filter(o => o.user_id === user.id).length} commandes
                          </p>
                          <p className="font-bold">
                            €{orders.filter(o => o.user_id === user.id).reduce((sum, o) => sum + (o.total || 0), 0).toFixed(2)}
                          </p>
                        </div>
                      </div>
                      <h3 className="font-semibold">
                        {user.user_metadata?.name || user.email}
                      </h3>
                      <p className="text-sm text-muted-foreground">{user.email}</p>
                      <p className="text-xs text-muted-foreground mt-2">
                        Inscrit le {new Date(user.created_at).toLocaleDateString('fr-FR')}
                      </p>
                      <div className="flex gap-2 mt-4">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="flex-1"
                          onClick={() => {
                            toast.info(`Détails de l'utilisateur ${user.email}`);
                          }}
                        >
                          <Eye className="w-3 h-3 mr-1" />
                          Voir
                        </Button>
                        <Button 
                          variant="destructive" 
                          size="sm" 
                          className="flex-1"
                          onClick={async () => {
                            if (window.confirm(`Supprimer l'utilisateur ${user.email} ?`)) {
                              const result = await deleteUser(user.id);
                              if (result.success) {
                                toast.success('Utilisateur supprimé avec succès');
                              } else {
                                toast.error(result.error || 'Erreur lors de la suppression');
                              }
                            }
                          }}
                        >
                          <Trash2 className="w-3 h-3 mr-1" />
                          Supprimer
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'products' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold">Gestion des produits</h2>
                <Button 
                  className="interactive-scale"
                  onClick={() => {
                    toast.info('Ajouter un nouveau produit');
                  }}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Ajouter un produit
                </Button>
              </div>
              <ProductManagement 
                products={products}
                onCreateProduct={createProduct}
                onUpdateProduct={updateProduct}
                onDeleteProduct={deleteProduct}
              />
            </div>
          )}

          {activeTab === 'customization' && (
            <div className="space-y-6">
              <PlatformCustomization />
            </div>
          )}

          {activeTab === 'settings' && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold">Paramètres de la plateforme</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card variant="glass">
                  <CardHeader>
                    <CardTitle>Configuration générale</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span>Maintenance mode</span>
                      <Button variant="outline" size="sm">Désactiver</Button>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Notifications système</span>
                      <Button variant="outline" size="sm">Configurer</Button>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Backup automatique</span>
                      <Button variant="outline" size="sm">Activer</Button>
                    </div>
                  </CardContent>
                </Card>

                <Card variant="glass">
                  <CardHeader>
                    <CardTitle>Sécurité</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span>Authentification admin</span>
                      <Button variant="outline" size="sm">Sécuriser</Button>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Logs d'activité</span>
                      <Button variant="outline" size="sm">Afficher</Button>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Nettoyage des données</span>
                      <Button variant="destructive" size="sm">Nettoyer</Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
