import { useState, useEffect } from 'react';
import supabase from '@/lib/supabase';

export interface Order {
  id: string;
  user_id: string;
  total: number;
  status: 'pending' | 'preparing' | 'ready' | 'delivered' | 'cancelled';
  created_at: string;
  updated_at: string;
  user?: {
    email: string;
    user_metadata?: {
      name?: string;
    };
  };
  items?: OrderItem[];
}

export interface OrderItem {
  id: string;
  order_id: string;
  product_id: string;
  quantity: number;
  price: number;
  product?: {
    name: string;
    category: string;
  };
}

export interface User {
  id: string;
  email: string;
  created_at: string;
  last_sign_in_at: string;
  user_metadata?: {
    name?: string;
    phone?: string;
    address?: string;
  };
}

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  image: string;
  available: boolean;
  created_at: string;
  updated_at: string;
}

export interface DashboardStats {
  totalUsers: number;
  totalOrders: number;
  totalRevenue: number;
  totalProducts: number;
  pendingOrders: number;
  todayOrders: number;
  monthlyRevenue: number;
  averageOrderValue: number;
}

export const useAdminData = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStats = async () => {
    try {
      // Try to get counts, but handle missing tables gracefully
      let totalUsers = 0;
      let totalOrders = 0;
      let ordersData: any[] = [];
      let totalProducts = 0;
      let productsData: any[] = [];

      try {
        const { count } = await supabase
          .from('profiles')
          .select('*', { count: 'exact', head: true });
        totalUsers = count || 0;
      } catch (e) {
        console.log('Profiles table not found, using mock data');
      }

      try {
        const { count } = await supabase
          .from('orders')
          .select('*', { count: 'exact', head: true });
        totalOrders = count || 0;
      } catch (e) {
        console.log('Orders table not found, using mock data');
      }

      try {
        const { data } = await supabase
          .from('orders')
          .select('total, created_at')
          .eq('status', 'pending');
        ordersData = data || [];
      } catch (e) {
        console.log('Orders table not found for pending orders');
      }

      try {
        const { count } = await supabase
          .from('products')
          .select('*', { count: 'exact', head: true });
        totalProducts = count || 0;
      } catch (e) {
        console.log('Products table not found, using mock data');
      }

      try {
        const { data } = await supabase
          .from('products')
          .select('price');
        productsData = data || [];
      } catch (e) {
        console.log('Products table not found for prices');
      }

      // Calculate today's orders
      const today = new Date().toISOString().split('T')[0];
      let todayOrdersCount = 0;
      try {
        const { count } = await supabase
          .from('orders')
          .select('*', { count: 'exact', head: true })
          .gte('created_at', today);
        todayOrdersCount = count || 0;
      } catch (e) {
        console.log('Orders table not found for today orders');
      }

      // Calculate monthly revenue
      const currentMonth = new Date().toISOString().slice(0, 7);
      let monthlyOrders: any[] = [];
      try {
        const { data } = await supabase
          .from('orders')
          .select('total')
          .gte('created_at', currentMonth)
          .eq('status', 'delivered');
        monthlyOrders = data || [];
      } catch (e) {
        console.log('Orders table not found for monthly revenue');
      }

      const monthlyRevenue = monthlyOrders?.reduce((sum, order) => sum + (order.total || 0), 0) || 0;
      const averageOrderValue = totalOrders ? (monthlyRevenue / (monthlyOrders?.length || 1)) : 0;

      setStats({
        totalUsers,
        totalOrders,
        totalRevenue: monthlyRevenue,
        totalProducts,
        pendingOrders: ordersData?.length || 0,
        todayOrders: todayOrdersCount,
        monthlyRevenue,
        averageOrderValue
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
      setError('Erreur lors du chargement des statistiques');
    }
  };

  const fetchOrders = async () => {
    try {
      let ordersData: any[] = [];
      
      try {
        const { data, error } = await supabase
          .from('orders')
          .select(`
            *,
            user:profiles(email, user_metadata)
          `)
          .order('created_at', { ascending: false })
          .limit(50);

        if (error) throw error;
        ordersData = data || [];
      } catch (e) {
        console.log('Orders table not found, using mock data');
        // Use mock data when table doesn't exist
        ordersData = [
          {
            id: 'ORD-001',
            total: 89.90,
            status: 'pending',
            created_at: new Date().toISOString(),
            user: { email: 'jean.dupont@email.com', user_metadata: { name: 'Jean Dupont' } }
          },
          {
            id: 'ORD-002', 
            total: 124.50,
            status: 'delivered',
            created_at: new Date(Date.now() - 3600000).toISOString(),
            user: { email: 'marie.curie@email.com', user_metadata: { name: 'Marie Curie' } }
          }
        ];
      }
      
      setOrders(ordersData);
    } catch (error) {
      console.error('Error fetching orders:', error);
      setError('Erreur lors du chargement des commandes');
    }
  };

  const fetchUsers = async () => {
    try {
      let usersData: any[] = [];
      
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(50);

        if (error) throw error;
        usersData = data || [];
      } catch (e) {
        console.log('Profiles table not found, using mock data');
        // Use mock data when table doesn't exist
        usersData = [
          {
            id: '1',
            email: 'jean.dupont@email.com',
            created_at: '2024-01-15T10:00:00Z',
            last_sign_in_at: new Date().toISOString(),
            user_metadata: { name: 'Jean Dupont', phone: '+324567890' }
          },
          {
            id: '2',
            email: 'marie.curie@email.com',
            created_at: '2024-02-20T10:00:00Z',
            last_sign_in_at: new Date(Date.now() - 86400000).toISOString(),
            user_metadata: { name: 'Marie Curie', phone: '+323456789' }
          },
          {
            id: '3',
            email: 'pierre.martin@email.com',
            created_at: '2023-12-10T10:00:00Z',
            last_sign_in_at: new Date(Date.now() - 172800000).toISOString(),
            user_metadata: { name: 'Pierre Martin', phone: '+321234567' }
          }
        ];
      }
      
      setUsers(usersData);
    } catch (error) {
      console.error('Error fetching users:', error);
      setError('Erreur lors du chargement des utilisateurs');
    }
  };

  const fetchProducts = async () => {
    try {
      let productsData: any[] = [];
      
      try {
        const { data, error } = await supabase
          .from('products')
          .select('*')
          .order('created_at', { ascending: false });

        if (error) throw error;
        productsData = data || [];
      } catch (e) {
        console.log('Products table not found, using mock data');
        // Use mock data when table doesn't exist
        productsData = [
          {
            id: '1',
            name: 'Poisson Braisé Royal',
            description: 'Notre spécialité signature, mariné aux épices camerounaises',
            price: 24.90,
            category: 'plats-principaux',
            image: '/api/placeholder/food/1',
            available: true,
            created_at: '2024-01-01T10:00:00Z',
            updated_at: '2024-01-01T10:00:00Z'
          },
          {
            id: '2',
            name: 'Brochettes Mixtes',
            description: 'Assortiment de brochettes de bœuf, poulet et légumes',
            price: 18.50,
            category: 'grillades',
            image: '/api/placeholder/food/2',
            available: true,
            created_at: '2024-01-02T10:00:00Z',
            updated_at: '2024-01-02T10:00:00Z'
          },
          {
            id: '3',
            name: 'Riz Jollof',
            description: 'Riz parfumé cuisiné traditionnellement',
            price: 8.50,
            category: 'accompagnements',
            image: '/api/placeholder/food/3',
            available: true,
            created_at: '2024-01-03T10:00:00Z',
            updated_at: '2024-01-03T10:00:00Z'
          }
        ];
      }
      
      setProducts(productsData);
    } catch (error) {
      console.error('Error fetching products:', error);
      setError('Erreur lors du chargement des produits');
    }
  };

  const updateOrderStatus = async (orderId: string, newStatus: Order['status']) => {
    try {
      const { error } = await supabase
        .from('orders')
        .update({ status: newStatus, updated_at: new Date().toISOString() })
        .eq('id', orderId);

      if (error) throw error;

      // Update local state
      setOrders(prev => prev.map(order => 
        order.id === orderId ? { ...order, status: newStatus } : order
      ));

      // Refresh stats
      await fetchStats();
      
      return { success: true };
    } catch (error) {
      console.error('Error updating order status:', error);
      return { success: false, error: 'Erreur lors de la mise à jour du statut' };
    }
  };

  const deleteOrder = async (orderId: string) => {
    try {
      const { error } = await supabase
        .from('orders')
        .delete()
        .eq('id', orderId);

      if (error) throw error;

      // Update local state
      setOrders(prev => prev.filter(order => order.id !== orderId));
      
      // Refresh stats
      await fetchStats();
      
      return { success: true };
    } catch (error) {
      console.error('Error deleting order:', error);
      return { success: false, error: 'Erreur lors de la suppression de la commande' };
    }
  };

  const deleteUser = async (userId: string) => {
    try {
      const { error } = await supabase
        .from('profiles')
        .delete()
        .eq('id', userId);

      if (error) throw error;

      // Update local state
      setUsers(prev => prev.filter(user => user.id !== userId));
      
      // Refresh stats
      await fetchStats();
      
      return { success: true };
    } catch (error) {
      console.error('Error deleting user:', error);
      return { success: false, error: 'Erreur lors de la suppression de l\'utilisateur' };
    }
  };

  const createProduct = async (productData: Omit<Product, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      const { data, error } = await supabase
        .from('products')
        .insert([{
          ...productData,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }])
        .select()
        .single();

      if (error) throw error;

      // Update local state
      setProducts(prev => [data, ...prev]);
      
      // Refresh stats
      await fetchStats();
      
      return { success: true, data };
    } catch (error) {
      console.error('Error creating product:', error);
      return { success: false, error: 'Erreur lors de la création du produit' };
    }
  };

  const updateProduct = async (productId: string, productData: Partial<Product>) => {
    try {
      const { data, error } = await supabase
        .from('products')
        .update({
          ...productData,
          updated_at: new Date().toISOString()
        })
        .eq('id', productId)
        .select()
        .single();

      if (error) throw error;

      // Update local state
      setProducts(prev => prev.map(product => 
        product.id === productId ? { ...product, ...data } : product
      ));
      
      return { success: true, data };
    } catch (error) {
      console.error('Error updating product:', error);
      return { success: false, error: 'Erreur lors de la mise à jour du produit' };
    }
  };

  const deleteProduct = async (productId: string) => {
    try {
      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', productId);

      if (error) throw error;

      // Update local state
      setProducts(prev => prev.filter(product => product.id !== productId));
      
      // Refresh stats
      await fetchStats();
      
      return { success: true };
    } catch (error) {
      console.error('Error deleting product:', error);
      return { success: false, error: 'Erreur lors de la suppression du produit' };
    }
  };

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      setError(null);
      
      try {
        await Promise.all([
          fetchStats(),
          fetchOrders(),
          fetchUsers(),
          fetchProducts()
        ]);
      } catch (error) {
        console.error('Error loading admin data:', error);
        setError('Erreur lors du chargement des données');
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const refreshData = async () => {
    setLoading(true);
    try {
      await Promise.all([
        fetchStats(),
        fetchOrders(),
        fetchUsers(),
        fetchProducts()
      ]);
    } catch (error) {
      console.error('Error refreshing admin data:', error);
    } finally {
      setLoading(false);
    }
  };

  return {
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
  };
};
