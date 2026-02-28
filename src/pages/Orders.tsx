import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  ShoppingBag,
  Clock,
  MapPin,
  Phone,
  CheckCircle,
  XCircle,
  Truck,
  ChefHat,
  Star,
  RefreshCw
} from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'
import { useTranslation } from 'react-i18next'
import { useOrders } from '@/hooks/useOrders'

import { OrderData } from '@/hooks/useOrders'

export default function OrdersPage() {
  const { user } = useAuth()
  const { t } = useTranslation()
  const { orders, loading, error } = useOrders(user?.id)
  const [activeTab, setActiveTab] = useState('all')

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending': return <Clock className="h-4 w-4 sm:h-5 sm:w-5 text-yellow-500" />
      case 'confirmed': return <CheckCircle className="h-4 w-4 sm:h-5 sm:w-5 text-blue-500" />
      case 'preparing': return <ChefHat className="h-4 w-4 sm:h-5 sm:w-5 text-orange-500" />
      case 'ready': return <CheckCircle className="h-4 w-4 sm:h-5 sm:w-5 text-green-500" />
      case 'delivered': return <Truck className="h-4 w-4 sm:h-5 sm:w-5 text-emerald-500" />
      case 'cancelled': return <XCircle className="h-4 w-4 sm:h-5 sm:w-5 text-red-500" />
      default: return <Clock className="h-4 w-4 sm:h-5 sm:w-5 text-gray-500" />
    }
  }

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

  const filteredOrders = orders.filter(order => {
    if (activeTab === 'all') return true
    return order.status === activeTab
  })

  const statusTabs = [
    { value: 'all', label: 'Toutes', count: orders.length },
    { value: 'pending', label: 'En attente', count: orders.filter(o => o.status === 'pending').length },
    { value: 'preparing', label: 'En préparation', count: orders.filter(o => o.status === 'preparing').length },
    { value: 'delivered', label: 'Livrées', count: orders.filter(o => o.status === 'delivered').length },
  ]

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <RefreshCw className="h-12 w-12 animate-spin text-primary mx-auto mb-4" />
          <p className="text-muted-foreground">Chargement de vos commandes...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/20">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-6 sm:py-8 pt-20 sm:pt-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 sm:mb-8"
        >
          <h1 className="text-2xl xs:text-3xl sm:text-4xl font-bold mb-2">Mes Commandes</h1>
          <p className="text-muted-foreground text-sm sm:text-base">
            Suivez l'état de vos commandes BrazzaFlame
          </p>
        </motion.div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4 sm:space-y-6">
          <TabsList className="grid grid-cols-2 xs:grid-cols-4 gap-2 sm:gap-3">
            {statusTabs.map((tab) => (
              <TabsTrigger key={tab.value} value={tab.value} className="flex items-center gap-1 sm:gap-2 h-10 sm:h-11 text-xs sm:text-sm">
                <span className="hidden xs:inline">{tab.label}</span>
                <span className="xs:hidden">
                  {tab.label === 'Toutes' ? 'Toutes' : 
                   tab.label === 'En attente' ? 'Attente' :
                   tab.label === 'En préparation' ? 'Prép.' :
                   tab.label === 'Livrées' ? 'Livrées' : tab.label}
                </span>
                <Badge variant="secondary" className="ml-1 text-xs">
                  {tab.count}
                </Badge>
              </TabsTrigger>
            ))}
          </TabsList>

          <TabsContent value={activeTab} className="space-y-3 sm:space-y-4">
            <AnimatePresence mode="popLayout">
              {filteredOrders.length === 0 ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="text-center py-8 sm:py-12"
                >
                  <ShoppingBag className="h-12 w-12 sm:h-16 sm:w-16 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg sm:text-xl font-medium mb-2">Aucune commande trouvée</h3>
                  <p className="text-muted-foreground text-sm sm:text-base mb-4 sm:mb-6">
                    {activeTab === 'all'
                      ? t('orders.emptyDescription')
                      : `Aucune commande ${getStatusText(activeTab).toLowerCase()}`
                    }
                  </p>
                  <Button asChild className="h-10 sm:h-11 px-4 sm:px-6">
                    <a href="/menu">{t('orders.orderNow')}</a>
                  </Button>
                </motion.div>
              ) : (
                <div className="grid gap-4 sm:gap-6">
                  {filteredOrders.map((order, index) => (
                    <motion.div
                      key={order.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <Card className="overflow-hidden hover:shadow-lg transition-shadow">
                        <CardHeader className="bg-gradient-to-r from-primary/5 to-secondary/5 px-3 sm:px-4 py-3 sm:py-4">
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 sm:gap-4">
                            <div className="flex items-center gap-2 sm:gap-3">
                              {getStatusIcon(order.status)}
                              <div>
                                <CardTitle className="text-base sm:text-lg">
                                  Commande #{order.id.slice(-8)}
                                </CardTitle>
                                <CardDescription className="text-xs sm:text-sm">
                                  {new Date(order.created_at).toLocaleDateString('fr-FR', {
                                    weekday: 'short',
                                    year: 'numeric',
                                    month: 'short',
                                    day: 'numeric',
                                    hour: '2-digit',
                                    minute: '2-digit'
                                  })}
                                </CardDescription>
                              </div>
                            </div>
                            <Badge className={`${getStatusColor(order.status)} text-white text-xs sm:text-sm px-2 py-1`}>
                              <span className="hidden sm:inline">{getStatusText(order.status)}</span>
                              <span className="sm:hidden">
                                {order.status === 'pending' ? 'Attente' :
                                 order.status === 'confirmed' ? 'Confirm.' :
                                 order.status === 'preparing' ? 'Prép.' :
                                 order.status === 'ready' ? 'Prête' :
                                 order.status === 'delivered' ? 'Livrée' :
                                 order.status === 'cancelled' ? 'Annulée' : order.status}
                              </span>
                            </Badge>
                          </div>
                        </CardHeader>

                        <CardContent className="p-4 sm:p-6">
                          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
                            {/* Order Items */}
                            <div>
                              <h4 className="font-medium mb-2 sm:mb-3 flex items-center gap-2 text-sm sm:text-base">
                                <ShoppingBag className="w-4 h-4 sm:w-5 sm:h-5" />
                                Articles commandés
                              </h4>
                              <div className="space-y-2 sm:space-y-3">
                                {order.order_items?.map((item, idx) => (
                                  <div key={idx} className="flex items-center gap-2 sm:gap-3 p-2 sm:p-3 bg-muted/50 rounded-lg">
                                    <div className="w-6 h-6 sm:w-8 sm:h-8 bg-primary/10 rounded-full flex items-center justify-center text-xs sm:text-sm font-medium">
                                      {item.quantity}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                      <span className="text-sm sm:text-base truncate">{item.menu_items?.name}</span>
                                      <span className="font-medium text-sm sm:text-base block">{(item.unit_price * item.quantity).toFixed(2)}€</span>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>

                            {/* Order Details */}
                            <div className="space-y-4">
                              <div>
                                <h4 className="font-medium mb-2 flex items-center gap-2 text-sm sm:text-base">
                                  <MapPin className="w-4 h-4 sm:w-5 sm:h-5" />
                                  Adresse de livraison
                                </h4>
                                <p className="text-sm sm:text-base text-muted-foreground break-words">
                                  {order.delivery_address}
                                </p>
                              </div>

                              {order.requested_delivery_date && (
                                <div>
                                  <h4 className="font-medium mb-2 flex items-center gap-2 text-sm sm:text-base">
                                    <Clock className="w-4 h-4 sm:w-5 sm:h-5" />
                                    Livraison demandée
                                  </h4>
                                  <p className="text-sm sm:text-base text-muted-foreground">
                                    {new Date(order.requested_delivery_date).toLocaleDateString('fr-FR', {
                                      weekday: 'short',
                                      year: 'numeric',
                                      month: 'short',
                                      day: 'numeric'
                                    })}
                                    {order.estimated_delivery_time && ` à ${order.estimated_delivery_time}`}
                                  </p>
                                </div>
                              )}
                            </div>

                            {/* Action Buttons */}
                            <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 mt-4 sm:mt-6 pt-4 border-t">
                              <Button variant="outline" size="sm" className="h-9 sm:h-10 px-3 sm:px-4">
                                <Star className="h-4 w-4 mr-1 sm:mr-2" />
                                <span className="hidden sm:inline">Noter la commande</span>
                                <span className="sm:hidden">Noter</span>
                              </Button>
                              <Button variant="outline" size="sm" className="h-9 sm:h-10 px-3 sm:px-4">
                                <span className="hidden sm:inline">{t('orders.orderAgain')}</span>
                                <span className="sm:hidden">Recommander</span>
                              </Button>
                              {order.status === 'delivered' && (
                                <Button variant="outline" size="sm" className="h-9 sm:h-10 px-3 sm:px-4">
                                  <span className="hidden sm:inline">Signaler un problème</span>
                                  <span className="sm:hidden">Signaler</span>
                                </Button>
                              )}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              )}
            </AnimatePresence>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}