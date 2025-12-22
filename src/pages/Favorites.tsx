import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { useToast } from '@/hooks/use-toast'
import {
  Heart,
  Flame,
  Star,
  ShoppingCart,
  Clock,
  Plus,
  Trash2
} from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'
import { useCart } from '@/contexts/CartContext'
import supabase from '@/lib/supabase'

interface FavoriteItem {
  id: string
  menu_item: {
    id: string
    name: string
    description?: string
    price: number
    image_url?: string
    category: string
    spice_level: number
    popular: boolean
    available: boolean
    preparation_time: number
  }
  created_at: string
}

export default function FavoritesPage() {
  const { user } = useAuth()
  const { addItem } = useCart()
  const { toast } = useToast()
  const [favorites, setFavorites] = useState<FavoriteItem[]>([])
  const [loading, setLoading] = useState(true)
  const [animatingItems, setAnimatingItems] = useState<Set<string>>(new Set())

  useEffect(() => {
    if (user) {
      fetchFavorites()
    }
  }, [user])

  const fetchFavorites = async () => {
    try {
      setLoading(true)
      // Pour l'instant, simulons des favoris car la table n'existe pas encore
      // En production, ceci viendrait d'une table user_favorites
      const mockFavorites: FavoriteItem[] = [
        {
          id: '1',
          menu_item: {
            id: '1',
            name: 'Tilapia Grillé au Four',
            description: 'Tilapia frais grillé avec une marinade spéciale aux épices africaines',
            price: 25.99,
            image_url: '',
            category: 'fish',
            spice_level: 2,
            popular: true,
            available: true,
            preparation_time: 20
          },
          created_at: new Date().toISOString()
        },
        {
          id: '2',
          menu_item: {
            id: '2',
            name: 'Suya Beef Brochette',
            description: 'Tendres brochettes de bœuf marinées dans notre sauce suya secrète',
            price: 18.99,
            image_url: '',
            category: 'beef',
            spice_level: 3,
            popular: true,
            available: true,
            preparation_time: 15
          },
          created_at: new Date().toISOString()
        },
        {
          id: '3',
          menu_item: {
            id: '3',
            name: 'Poulet Braisé aux Légumes',
            description: 'Poulet tendre braisé lentement avec des légumes frais de saison',
            price: 22.99,
            image_url: '',
            category: 'braise',
            spice_level: 1,
            popular: false,
            available: true,
            preparation_time: 25
          },
          created_at: new Date().toISOString()
        }
      ]

      setFavorites(mockFavorites)
    } catch (error) {
      console.error('Error fetching favorites:', error)
      toast({
        title: "Erreur",
        description: "Impossible de charger vos favoris",
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }

  const handleAddToCart = (item: FavoriteItem['menu_item']) => {
    addItem({
      id: item.id,
      name: item.name,
      price: item.price,
      image: item.image_url || '',
      quantity: 1
    })

    // Animation
    setAnimatingItems(prev => new Set(prev).add(item.id))
    setTimeout(() => {
      setAnimatingItems(prev => {
        const newSet = new Set(prev)
        newSet.delete(item.id)
        return newSet
      })
    }, 1000)

    toast({
      title: "Ajouté au panier !",
      description: `${item.name} a été ajouté à votre panier`,
    })
  }

  const handleRemoveFavorite = (favoriteId: string) => {
    setFavorites(prev => prev.filter(fav => fav.id !== favoriteId))
    toast({
      title: "Retiré des favoris",
      description: "Le plat a été retiré de vos favoris",
    })
  }

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'fish': return 'bg-blue-500'
      case 'beef': return 'bg-red-500'
      case 'braise': return 'bg-orange-500'
      case 'sides': return 'bg-green-500'
      default: return 'bg-gray-500'
    }
  }

  const getCategoryName = (category: string) => {
    switch (category) {
      case 'fish': return 'Poisson'
      case 'beef': return 'Viande'
      case 'braise': return 'Braisé'
      case 'sides': return 'Accompagnement'
      default: return category
    }
  }

  const renderSpiceLevel = (level: number) => {
    return (
      <div className="flex items-center gap-1">
        {[...Array(3)].map((_, i) => (
          <Flame
            key={i}
            className={`h-3 w-3 ${i < level ? 'text-red-500' : 'text-gray-300'}`}
          />
        ))}
      </div>
    )
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Heart className="h-12 w-12 animate-pulse text-red-500 mx-auto mb-4" />
          <p className="text-muted-foreground">Chargement de vos favoris...</p>
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
          <div className="flex items-center gap-3 mb-4">
            <Heart className="h-8 w-8 text-red-500" />
            <h1 className="text-3xl font-bold">Mes Plats Favoris</h1>
          </div>
          <p className="text-muted-foreground">
            Vos plats préférés pour commander en un clic
          </p>
        </motion.div>

        <AnimatePresence mode="popLayout">
          {favorites.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="text-center py-16"
            >
              <Heart className="h-20 w-20 text-muted-foreground mx-auto mb-6" />
              <h3 className="text-xl font-medium mb-2">Aucun favori encore</h3>
              <p className="text-muted-foreground mb-8 max-w-md mx-auto">
                Ajoutez vos plats préférés depuis le menu pour les retrouver facilement ici
              </p>
              <Button asChild size="lg">
                <a href="/menu">
                  <Plus className="h-5 w-5 mr-2" />
                  Explorer le menu
                </a>
              </Button>
            </motion.div>
          ) : (
            <motion.div
              layout
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {favorites.map((favorite, index) => (
                <motion.div
                  key={favorite.id}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="group hover:shadow-xl transition-all duration-300 overflow-hidden">
                    {/* Image placeholder avec effet cool */}
                    <div className="relative h-48 bg-gradient-to-br from-primary/20 to-secondary/20 overflow-hidden">
                      <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                      <div className="absolute top-4 left-4">
                        <Badge className={`${getCategoryColor(favorite.menu_item.category)} text-white`}>
                          {getCategoryName(favorite.menu_item.category)}
                        </Badge>
                      </div>
                      <div className="absolute top-4 right-4">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 bg-black/20 hover:bg-black/40 text-white"
                          onClick={() => handleRemoveFavorite(favorite.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                      <div className="absolute bottom-4 left-4 right-4">
                        <div className="flex items-center justify-between">
                          {renderSpiceLevel(favorite.menu_item.spice_level)}
                          <div className="flex items-center gap-1">
                            <Clock className="h-3 w-3 text-white/80" />
                            <span className="text-xs text-white/80">
                              {favorite.menu_item.preparation_time}min
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <CardTitle className="text-lg line-clamp-2 group-hover:text-primary transition-colors">
                            {favorite.menu_item.name}
                          </CardTitle>
                          {favorite.menu_item.description && (
                            <CardDescription className="line-clamp-2 mt-1">
                              {favorite.menu_item.description}
                            </CardDescription>
                          )}
                        </div>
                        <div className="flex items-center gap-1 ml-2">
                          <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                          <span className="text-sm font-medium">4.8</span>
                        </div>
                      </div>
                    </CardHeader>

                    <CardContent className="pt-0">
                      <div className="flex items-center justify-between mb-4">
                        <span className="text-2xl font-bold text-primary">
                          {favorite.menu_item.price.toFixed(2)}€
                        </span>
                        {favorite.menu_item.popular && (
                          <Badge variant="secondary" className="bg-orange-100 text-orange-800">
                            <Flame className="h-3 w-3 mr-1" />
                            Populaire
                          </Badge>
                        )}
                      </div>

                      <Button
                        className={`w-full transition-all duration-300 ${
                          animatingItems.has(favorite.menu_item.id)
                            ? 'scale-105 bg-green-500 hover:bg-green-600'
                            : ''
                        }`}
                        onClick={() => handleAddToCart(favorite.menu_item)}
                        disabled={!favorite.menu_item.available}
                      >
                        <ShoppingCart className="h-4 w-4 mr-2" />
                        {animatingItems.has(favorite.menu_item.id)
                          ? 'Ajouté !'
                          : favorite.menu_item.available
                            ? 'Ajouter au panier'
                            : 'Indisponible'
                        }
                      </Button>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Section recommandations */}
        {favorites.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="mt-16"
          >
            <Card className="bg-gradient-to-r from-primary/5 to-secondary/5 border-primary/20">
              <CardHeader className="text-center">
                <CardTitle className="flex items-center justify-center gap-2">
                  <Star className="h-5 w-5 text-yellow-500" />
                  Vous pourriez aussi aimer
                </CardTitle>
                <CardDescription>
                  Découvrez d'autres plats populaires que nos clients adorent
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {[
                    { name: 'Attiéké', emoji: '🍛' },
                    { name: 'Alloco', emoji: '🍌' },
                    { name: 'Sauce Graine', emoji: '🌶️' },
                    { name: 'Kedjenou', emoji: '🍲' }
                  ].map((item, index) => (
                    <motion.div
                      key={item.name}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.7 + index * 0.1 }}
                      className="text-center p-4 bg-white/50 rounded-lg hover:bg-white/80 transition-colors cursor-pointer"
                    >
                      <div className="text-2xl mb-2">{item.emoji}</div>
                      <p className="text-sm font-medium">{item.name}</p>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </div>
    </div>
  )
}