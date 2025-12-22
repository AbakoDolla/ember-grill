import { useState, useEffect } from 'react'
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
import supabase from '@/lib/supabase'

interface Order {
  id: string
  status: string
  total_amount: number
  created_at: string
  delivery_address?: string
  estimated_delivery_time?: string
  order_items: Array<{
    quantity: number
    unit_price: number
    menu_item: {
      name: string
      image_url?: string
    }
  }>
}

export default function OrdersPage() {
  const { user } = useAuth()
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('all')

  useEffect(() => {
    if (user) {
      fetchOrders()
    }
  }, [user])

  const fetchOrders = async () => {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('orders')
        .select(`
          *,
          order_items (
            quantity,
            unit_price,
            menu_item:menu_items (
              name,
              image_url
            )
          )
        `)
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false })

      if (error) throw error
      setOrders(data || [])
    } catch (error) {
      console.error('Error fetching orders:', error)
    } finally {
      setLoading(false)
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending': return <Clock className="h-5 w-5 text-yellow-500" />
      case 'confirmed': return <CheckCircle className="h-5 w-5 text-blue-500" />
      case 'preparing': return <ChefHat className="h-5 w-5 text-orange-500" />
      case 'ready': return <CheckCircle className="h-5 w-5 text-green-500" />
      case 'delivered': return <Truck className="h-5 w-5 text-emerald-500" />
      case 'cancelled': return <XCircle className="h-5 w-5 text-red-500" />
      default: return <Clock className="h-5 w-5 text-gray-500" />
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
      <div className="container mx-auto px-4 py-8 pt-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold mb-2">Mes Commandes</h1>
          <p className="text-muted-foreground">
            Suivez l'état de vos commandes BrazzaFlame
          </p>
        </motion.div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            {statusTabs.map((tab) => (
              <TabsTrigger key={tab.value} value={tab.value} className="flex items-center gap-2">
                {tab.label}
                <Badge variant="secondary" className="ml-1">
                  {tab.count}
                </Badge>
              </TabsTrigger>
            ))}
          </TabsList>

          <TabsContent value={activeTab} className="space-y-4">
            <AnimatePresence mode="popLayout">
              {filteredOrders.length === 0 ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="text-center py-12"
                >
                  <ShoppingBag className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-medium mb-2">Aucune commande trouvée</h3>
                  <p className="text-muted-foreground mb-6">
                    {activeTab === 'all'
                      ? "Vous n'avez pas encore passé de commande"
                      : `Aucune commande ${getStatusText(activeTab).toLowerCase()}`
                    }
                  </p>
                  <Button asChild>
                    <a href="/menu">Commander maintenant</a>
                  </Button>
                </motion.div>
              ) : (
                <div className="grid gap-6">
                  {filteredOrders.map((order, index) => (
                    <motion.div
                      key={order.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <Card className="overflow-hidden hover:shadow-lg transition-shadow">
                        <CardHeader className="bg-gradient-to-r from-primary/5 to-secondary/5">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              {getStatusIcon(order.status)}
                              <div>
                                <CardTitle className="text-lg">
                                  Commande #{order.id.slice(-8)}
                                </CardTitle>
                                <CardDescription>
                                  {new Date(order.created_at).toLocaleDateString('fr-FR', {
                                    weekday: 'long',
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric',
                                    hour: '2-digit',
                                    minute: '2-digit'
                                  })}
                                </CardDescription>
                              </div>
                            </div>
                            <Badge className={`${getStatusColor(order.status)} text-white`}>
                              {getStatusText(order.status)}
                            </Badge>
                          </div>
                        </CardHeader>

                        <CardContent className="p-6">
                          <div className="grid md:grid-cols-2 gap-6">
                            {/* Order Items */}
                            <div>
                              <h4 className="font-medium mb-3 flex items-center gap-2">
                                <ShoppingBag className="h-4 w-4" />
                                Articles commandés
                              </h4>
                              <div className="space-y-2">
                                {order.order_items?.map((item, idx) => (
                                  <div key={idx} className="flex items-center gap-3 p-2 bg-muted/50 rounded">
                                    <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center text-xs font-medium">
                                      {item.quantity}
                                    </div>
                                    <span className="flex-1">{item.menu_item?.name}</span>
                                    <span className="font-medium">{(item.unit_price * item.quantity).toFixed(2)}€</span>
                                  </div>
                                ))}
                              </div>
                            </div>

                            {/* Order Details */}
                            <div className="space-y-4">
                              <div>
                                <h4 className="font-medium mb-2">Détails de la commande</h4>
                                <div className="space-y-2 text-sm">
                                  <div className="flex justify-between">
                                    <span className="text-muted-foreground">Sous-total:</span>
                                    <span>{(order.total_amount * 0.85).toFixed(2)}€</span>
                                  </div>
                                  <div className="flex justify-between">
                                    <span className="text-muted-foreground">Livraison:</span>
                                    <span>2.50€</span>
                                  </div>
                                  <div className="flex justify-between font-medium border-t pt-2">
                                    <span>Total:</span>
                                    <span className="text-lg">{order.total_amount.toFixed(2)}€</span>
                                  </div>
                                </div>
                              </div>

                              {order.delivery_address && (
                                <div>
                                  <h4 className="font-medium mb-2 flex items-center gap-2">
                                    <MapPin className="h-4 w-4" />
                                    Adresse de livraison
                                  </h4>
                                  <p className="text-sm text-muted-foreground">
                                    {order.delivery_address}
                                  </p>
                                </div>
                              )}

                              {order.estimated_delivery_time && (
                                <div>
                                  <h4 className="font-medium mb-2 flex items-center gap-2">
                                    <Clock className="h-4 w-4" />
                                    Livraison estimée
                                  </h4>
                                  <p className="text-sm text-muted-foreground">
                                    {new Date(order.estimated_delivery_time).toLocaleTimeString('fr-FR', {
                                      hour: '2-digit',
                                      minute: '2-digit'
                                    })}
                                  </p>
                                </div>
                              )}
                            </div>
                          </div>

                          {/* Action Buttons */}
                          <div className="flex gap-3 mt-6 pt-4 border-t">
                            <Button variant="outline" size="sm">
                              <Star className="h-4 w-4 mr-2" />
                              Noter la commande
                            </Button>
                            <Button variant="outline" size="sm">
                              Commander à nouveau
                            </Button>
                            {order.status === 'delivered' && (
                              <Button variant="outline" size="sm">
                                Signaler un problème
                              </Button>
                            )}
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