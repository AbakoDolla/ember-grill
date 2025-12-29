import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  LineChart, 
  Line, 
  AreaChart, 
  Area, 
  BarChart, 
  Bar, 
  PieChart, 
  Pie, 
  Cell,
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer 
} from 'recharts';
import { format, subDays, startOfDay } from 'date-fns';
import { TrendingUp, Users, ShoppingCart, DollarSign, Package } from 'lucide-react';

interface ChartData {
  date: string;
  orders: number;
  revenue: number;
  users: number;
}

interface CategoryData {
  name: string;
  value: number;
  color: string;
}

interface AdminChartsProps {
  data: {
    orders: any[];
    users: any[];
    products: any[];
    stats: {
      totalUsers: number;
      totalOrders: number;
      totalRevenue: number;
      totalProducts: number;
      todayOrders: number;
      monthlyRevenue: number;
      averageOrderValue: number;
    };
  };
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D'];

export default function AdminCharts({ data }: AdminChartsProps) {
  // Generate chart data for the last 7 days
  const generateChartData = (): ChartData[] => {
    const today = startOfDay(new Date());
    return Array.from({ length: 7 }, (_, i) => {
      const date = subDays(today, 6 - i);
      const dateStr = format(date, 'yyyy-MM-dd');
      
      // Filter orders for this date
      const dayOrders = data.orders.filter(order => 
        order.created_at?.startsWith(dateStr)
      );
      
      const dayRevenue = dayOrders
        .filter(order => order.status === 'delivered')
        .reduce((sum, order) => sum + (order.total || 0), 0);
      
      const dayUsers = data.users.filter(user => 
        user.created_at?.startsWith(dateStr)
      ).length;

      return {
        date: format(date, 'dd/MM'),
        orders: dayOrders.length,
        revenue: dayRevenue,
        users: dayUsers
      };
    });
  };

  // Generate category data for pie chart
  const generateCategoryData = (): CategoryData[] => {
    const categoryCount: Record<string, number> = {};
    
    data.products.forEach(product => {
      const category = product.category || 'Autres';
      categoryCount[category] = (categoryCount[category] || 0) + 1;
    });

    return Object.entries(categoryCount).map(([name, value], index) => ({
      name: name.charAt(0).toUpperCase() + name.slice(1),
      value,
      color: COLORS[index % COLORS.length]
    }));
  };

  // Generate order status data
  const generateStatusData = (): CategoryData[] => {
    const statusCount: Record<string, number> = {
      pending: 0,
      preparing: 0,
      ready: 0,
      delivered: 0,
      cancelled: 0
    };

    data.orders.forEach(order => {
      const status = order.status || 'pending';
      statusCount[status] = (statusCount[status] || 0) + 1;
    });

    const statusLabels: Record<string, string> = {
      pending: 'En attente',
      preparing: 'Préparation',
      ready: 'Prêt',
      delivered: 'Livré',
      cancelled: 'Annulé'
    };

    return Object.entries(statusCount)
      .filter(([_, value]) => value > 0)
      .map(([name, value], index) => ({
        name: statusLabels[name] || name,
        value,
        color: COLORS[index % COLORS.length]
      }));
  };

  const chartData = generateChartData();
  const categoryData = generateCategoryData();
  const statusData = generateStatusData();

  const StatCard = ({ title, value, icon: Icon, change, color = 'primary' }: any) => (
    <Card variant="glass" className="p-6 hover:scale-105 transition-all duration-300">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-muted-foreground text-sm">{title}</p>
          <p className="text-2xl font-bold text-foreground">{value}</p>
          {change !== undefined && (
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
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Utilisateurs totaux"
          value={data.stats.totalUsers.toLocaleString()}
          icon={Users}
          change={12.5}
          color="blue"
        />
        <StatCard
          title="Commandes totales"
          value={data.stats.totalOrders.toLocaleString()}
          icon={ShoppingCart}
          change={8.2}
          color="green"
        />
        <StatCard
          title="Revenu mensuel"
          value={`€${data.stats.monthlyRevenue.toLocaleString()}`}
          icon={DollarSign}
          change={15.3}
          color="amber"
        />
        <StatCard
          title="Produits"
          value={data.stats.totalProducts}
          icon={Package}
          color="purple"
        />
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue & Orders Chart */}
        <Card variant="glass">
          <CardHeader>
            <CardTitle>Évolution des commandes et revenus</CardTitle>
            <CardDescription>Derniers 7 jours</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                <XAxis dataKey="date" />
                <YAxis yAxisId="left" />
                <YAxis yAxisId="right" orientation="right" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'hsl(var(--card))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px'
                  }}
                />
                <Legend />
                <Line
                  yAxisId="left"
                  type="monotone"
                  dataKey="orders"
                  stroke="#8884d8"
                  strokeWidth={2}
                  name="Commandes"
                  dot={{ fill: '#8884d8', strokeWidth: 2, r: 4 }}
                  activeDot={{ r: 6 }}
                />
                <Line
                  yAxisId="right"
                  type="monotone"
                  dataKey="revenue"
                  stroke="#82ca9d"
                  strokeWidth={2}
                  name="Revenu (€)"
                  dot={{ fill: '#82ca9d', strokeWidth: 2, r: 4 }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* User Registration Chart */}
        <Card variant="glass">
          <CardHeader>
            <CardTitle>Nouveaux utilisateurs</CardTitle>
            <CardDescription>Derniers 7 jours</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'hsl(var(--card))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px'
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="users"
                  stroke="#8884d8"
                  fill="#8884d8"
                  fillOpacity={0.3}
                  strokeWidth={2}
                  name="Nouveaux utilisateurs"
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Pie Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Product Categories */}
        <Card variant="glass">
          <CardHeader>
            <CardTitle>Répartition des produits par catégorie</CardTitle>
            <CardDescription>Nombre de produits par catégorie</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Order Status */}
        <Card variant="glass">
          <CardHeader>
            <CardTitle>Statut des commandes</CardTitle>
            <CardDescription>Répartition par statut</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={statusData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {statusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Revenue Bar Chart */}
      <Card variant="glass">
        <CardHeader>
          <CardTitle>Revenu quotidien</CardTitle>
          <CardDescription>Derniers 7 jours</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'hsl(var(--card))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '8px'
                }}
              />
              <Bar 
                dataKey="revenue" 
                fill="#82ca9d" 
                name="Revenu (€)"
                radius={[8, 8, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
}
