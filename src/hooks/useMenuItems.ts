import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { Database } from '@/types/database'

type MenuItem = Database['public']['Tables']['menu_items']['Row']

export function useMenuItems() {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchMenuItems()
  }, [])

  const fetchMenuItems = async () => {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('menu_items')
        .select('*')
        .eq('available', true)
        .order('category', { ascending: true })
        .order('name', { ascending: true })

      if (error) throw error
      setMenuItems(data || [])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  const getMenuItemsByCategory = (category: string) => {
    return menuItems.filter(item => item.category === category)
  }

  const getPopularItems = () => {
    return menuItems.filter(item => item.popular)
  }

  return {
    menuItems,
    loading,
    error,
    getMenuItemsByCategory,
    getPopularItems,
    refetch: fetchMenuItems
  }
}