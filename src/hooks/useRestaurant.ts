import { useState, useEffect } from 'react'
import supabase from '@/lib/supabase'

export interface Promotion {
  id: string
  code: string
  description: string
  discount_type: 'percentage' | 'fixed'
  discount_value: number
  minimum_order?: number
  active: boolean
  expires_at?: string
  created_at: string
}

export interface DeliveryZone {
  id: string
  name: string
  coordinates: Record<string, unknown> // GeoJSON or coordinate data
  delivery_fee: number
  minimum_order: number
  active: boolean
}

export interface RestaurantSettings {
  id: string
  name: string
  address: string
  phone: string
  email: string
  opening_hours: Record<string, { open: string; close: string }> // JSON object with days and hours
  delivery_radius: number
  free_delivery_threshold: number
  currency: string
  timezone: string
}

export function usePromotions() {
  const [promotions, setPromotions] = useState<Promotion[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchPromotions = async () => {
    try {
      setLoading(true)
      setError(null)

      const { data, error } = await supabase.functions.invoke('api', {
        body: { action: 'get_promotions' }
      })

      if (error) throw error

      setPromotions(data || [])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch promotions')
    } finally {
      setLoading(false)
    }
  }

  const validatePromotion = async (code: string, orderTotal: number) => {
    try {
      const promotion = promotions.find(p => p.code.toLowerCase() === code.toLowerCase())

      if (!promotion) {
        return { valid: false, message: 'Code promo invalide' }
      }

      if (!promotion.active) {
        return { valid: false, message: 'Ce code promo n\'est plus actif' }
      }

      if (promotion.expires_at && new Date(promotion.expires_at) < new Date()) {
        return { valid: false, message: 'Ce code promo a expiré' }
      }

      if (promotion.minimum_order && orderTotal < promotion.minimum_order) {
        return {
          valid: false,
          message: `Commande minimum de ${promotion.minimum_order}€ requise`
        }
      }

      return {
        valid: true,
        promotion,
        discount: promotion.discount_type === 'percentage'
          ? orderTotal * (promotion.discount_value / 100)
          : promotion.discount_value
      }
    } catch (err) {
      return { valid: false, message: 'Erreur lors de la validation du code promo' }
    }
  }

  useEffect(() => {
    fetchPromotions()
  }, [])

  return {
    promotions,
    loading,
    error,
    refetch: fetchPromotions,
    validatePromotion
  }
}

export function useDeliveryZones() {
  const [zones, setZones] = useState<DeliveryZone[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchZones = async () => {
    try {
      setLoading(true)
      setError(null)

      const { data, error } = await supabase.functions.invoke('api', {
        body: { action: 'get_delivery_zones' }
      })

      if (error) throw error

      setZones(data || [])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch delivery zones')
    } finally {
      setLoading(false)
    }
  }

  const checkDeliveryAvailability = (address: string, orderTotal: number) => {
    // This would typically use geocoding to check if address is within delivery zones
    // For now, we'll assume delivery is available
    const zone = zones.find(z => z.active)
    if (!zone) return { available: false, message: 'Livraison non disponible dans votre zone' }

    if (orderTotal < zone.minimum_order) {
      return {
        available: false,
        message: `Commande minimum de ${zone.minimum_order}€ pour la livraison`
      }
    }

    return {
      available: true,
      fee: zone.delivery_fee,
      zone: zone.name
    }
  }

  useEffect(() => {
    fetchZones()
  }, [])

  return {
    zones,
    loading,
    error,
    refetch: fetchZones,
    checkDeliveryAvailability
  }
}

export function useRestaurantSettings() {
  const [settings, setSettings] = useState<RestaurantSettings | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchSettings = async () => {
    try {
      setLoading(true)
      setError(null)

      const { data, error } = await supabase.functions.invoke('api', {
        body: { action: 'get_restaurant_settings' }
      })

      if (error) throw error

      setSettings(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch restaurant settings')
    } finally {
      setLoading(false)
    }
  }

  const isOpen = () => {
    if (!settings) return false

    const now = new Date()
    const dayOfWeek = now.toLocaleLowerCase('en-US', { weekday: 'long' })
    const currentTime = now.getHours() * 100 + now.getMinutes()

    const hours = settings.opening_hours?.[dayOfWeek]
    if (!hours) return false

    const openTime = parseInt(hours.open.replace(':', ''))
    const closeTime = parseInt(hours.close.replace(':', ''))

    return currentTime >= openTime && currentTime <= closeTime
  }

  useEffect(() => {
    fetchSettings()
  }, [])

  return {
    settings,
    loading,
    error,
    refetch: fetchSettings,
    isOpen
  }
}