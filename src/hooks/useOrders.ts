import { useState, useEffect, useCallback } from 'react'
import supabase from '@/lib/supabase'
import { Database } from '@/types/database'

type OrderItemInsert = Database['public']['Tables']['order_items']['Insert']

interface CartItem {
  id: string
  name: string
  price: number
  image: string
  quantity: number
}

export interface OrderData {
  id: string
  total_amount: number
  status: string
  delivery_address: string
  delivery_fee: number
  special_instructions?: string
  estimated_delivery_time: string
  created_at: string
  customer_id: string
  paid_at?: string
  payment_method?: string
  payment_transaction_id?: string
  order_items: Array<{
    id: string
    quantity: number
    unit_price: number
    special_requests?: string
    menu_items: {
      id: string
      name: string
      description: string
      price: number
      image_url?: string
      category: string
    }
  }>
  customers: {
    id: string
    email: string
    first_name: string
    last_name: string
    phone: string
  }
}

export function useOrders(customerId?: string) {
  const [orders, setOrders] = useState<OrderData[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchOrders = useCallback(async () => {
    if (!customerId) return

    try {
      setLoading(true)
      setError(null)

      const { data, error } = await supabase.functions.invoke('api', {
        body: {
          action: 'get_orders',
          data: { customerId }
        }
      })

      if (error) throw error

      setOrders(data || [])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch orders')
    } finally {
      setLoading(false)
    }
  }, [customerId])

  const createOrder = async (
    customerData: { email: string; firstName?: string; lastName?: string; phone?: string },
    cartItems: CartItem[],
    deliveryAddress: string,
    specialInstructions?: string,
    promotionCode?: string
  ) => {
    try {
      setLoading(true)
      setError(null)

      const { data, error } = await supabase.functions.invoke('create-order', {
        body: {
          customerData,
          cartItems,
          deliveryAddress,
          specialInstructions,
          promotionCode
        }
      })

      if (error) throw error

      // Refresh orders after creating new one
      await fetchOrders()

      return data
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to create order'
      setError(errorMessage)
      throw new Error(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  const processPayment = async (orderId: string, paymentMethod: string, paymentDetails: Record<string, unknown>) => {
    try {
      setLoading(true)
      setError(null)

      const { data, error } = await supabase.functions.invoke('process-payment', {
        body: {
          orderId,
          paymentMethod,
          paymentDetails
        }
      })

      if (error) throw error

      // Refresh orders after payment
      await fetchOrders()

      return data
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Payment processing failed'
      setError(errorMessage)
      throw new Error(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  const getOrderStatus = async (orderId: string) => {
    try {
      const { data, error } = await supabase
        .from('orders')
        .select('status, estimated_delivery_time')
        .eq('id', orderId)
        .single()

      if (error) throw error
      return data
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to get order status')
      return null
    }
  }

  useEffect(() => {
    if (customerId) {
      fetchOrders()
    }
  }, [customerId, fetchOrders])

  return {
    orders,
    loading,
    error,
    refetch: fetchOrders,
    createOrder,
    processPayment,
    getOrderStatus
  }
}