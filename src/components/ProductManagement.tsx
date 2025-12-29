import { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { toast } from 'sonner';
import { 
  Plus, 
  Edit, 
  Trash2, 
  Save, 
  X, 
  Upload,
  Image as ImageIcon,
  DollarSign,
  Package,
  Clock,
  ChefHat
} from 'lucide-react';

interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  image: string;
  available: boolean;
  preparationTime: number;
  ingredients: string[];
  allergens: string[];
  spicy: boolean;
}

export default function ProductManagement() {
  const [products, setProducts] = useState<MenuItem[]>([
    {
      id: '1',
      name: 'Poisson Braisé Royal',
      description: 'Notre spécialité signature, mariné aux épices camerounaises et grillé à la perfection',
      price: 24.90,
      category: 'plats-principaux',
      image: '/api/placeholder/food/1',
      available: true,
      preparationTime: 25,
      ingredients: ['Poisson', 'Épices camerounaises', 'Herbes aromatiques'],
      allergens: ['Poisson'],
      spicy: false
    },
    {
      id: '2',
      name: 'Brochettes Mixtes',
      description: 'Assortiment de brochettes de bœuf, poulet et légumes grillés',
      price: 18.50,
      category: 'grillades',
      image: '/api/placeholder/food/2',
      available: true,
      preparationTime: 20,
      ingredients: ['Bœuf', 'Poulet', 'Légumes', 'Marinade'],
      allergens: [],
      spicy: true
    },
    {
      id: '3',
      name: 'Riz Jollof',
      description: 'Riz parfumé cuisiné traditionnellement avec des légumes',
      price: 8.50,
      category: 'accompagnements',
      image: '/api/placeholder/food/3',
      available: true,
      preparationTime: 15,
      ingredients: ['Riz', 'Oignons', 'Tomates', 'Épices'],
      allergens: ['Gluten'],
      spicy: false
    }
  ]);

  const [editingProduct, setEditingProduct] = useState<MenuItem | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);

  const handleSaveProduct = (product: MenuItem) => {
    if (editingProduct) {
      // Update existing product
      setProducts(products.map(p => p.id === product.id ? product : p));
      toast.success('Produit mis à jour avec succès');
    } else {
      // Add new product
      const newProduct = {
        ...product,
        id: Date.now().toString()
      };
      setProducts([...products, newProduct]);
      toast.success('Produit ajouté avec succès');
    }
    setIsFormOpen(false);
    setEditingProduct(null);
  };

  const handleDeleteProduct = (id: string) => {
    setProducts(products.filter(p => p.id !== id));
    toast.success('Produit supprimé avec succès');
  };

  const handleEditProduct = (product: MenuItem) => {
    setEditingProduct(product);
    setIsFormOpen(true);
  };

  const ProductForm = () => {
    const [formData, setFormData] = useState<Partial<MenuItem>>(
      editingProduct || {
        name: '',
        description: '',
        price: 0,
        category: 'plats-principaux',
        image: '',
        available: true,
        preparationTime: 20,
        ingredients: [],
        allergens: [],
        spicy: false
      }
    );

    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      handleSaveProduct(formData as MenuItem);
    };

    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
        onClick={() => setIsFormOpen(false)}
      >
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          onClick={(e) => e.stopPropagation()}
          className="bg-card rounded-2xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto"
        >
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>
                {editingProduct ? 'Modifier le produit' : 'Ajouter un produit'}
              </CardTitle>
              <Button variant="ghost" size="sm" onClick={() => setIsFormOpen(false)}>
                <X className="w-4 h-4" />
              </Button>
            </div>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Nom du produit *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    placeholder="Nom du produit"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="price">Prix (€) *</Label>
                  <Input
                    id="price"
                    type="number"
                    step="0.01"
                    value={formData.price}
                    onChange={(e) => setFormData({...formData, price: parseFloat(e.target.value)})}
                    placeholder="0.00"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description *</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  placeholder="Description du produit"
                  rows={3}
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="category">Catégorie *</Label>
                  <Select value={formData.category} onValueChange={(value) => setFormData({...formData, category: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionner une catégorie" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="plats-principaux">Plats principaux</SelectItem>
                      <SelectItem value="grillades">Grillades</SelectItem>
                      <SelectItem value="accompagnements">Accompagnements</SelectItem>
                      <SelectItem value="boissons">Boissons</SelectItem>
                      <SelectItem value="desserts">Desserts</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="preparationTime">Temps de préparation (min)</Label>
                  <Input
                    id="preparationTime"
                    type="number"
                    value={formData.preparationTime}
                    onChange={(e) => setFormData({...formData, preparationTime: parseInt(e.target.value)})}
                    placeholder="20"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="image">URL de l'image</Label>
                  <Input
                    id="image"
                    value={formData.image}
                    onChange={(e) => setFormData({...formData, image: e.target.value})}
                    placeholder="/api/placeholder/food/1"
                  />
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Switch
                    id="available"
                    checked={formData.available}
                    onCheckedChange={(checked) => setFormData({...formData, available: checked})}
                  />
                  <Label htmlFor="available">Disponible</Label>
                </div>

                <div className="flex items-center space-x-2">
                  <Switch
                    id="spicy"
                    checked={formData.spicy}
                    onCheckedChange={(checked) => setFormData({...formData, spicy: checked})}
                  />
                  <Label htmlFor="spicy">Épicé</Label>
                </div>
              </div>

              <div className="flex justify-end gap-2">
                <Button type="button" variant="outline" onClick={() => setIsFormOpen(false)}>
                  Annuler
                </Button>
                <Button type="submit">
                  <Save className="w-4 h-4 mr-2" />
                  {editingProduct ? 'Mettre à jour' : 'Ajouter'}
                </Button>
              </div>
            </form>
          </CardContent>
        </motion.div>
      </motion.div>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Gestion des produits</h2>
        <Button onClick={() => setIsFormOpen(true)} className="interactive-scale">
          <Plus className="w-4 h-4 mr-2" />
          Ajouter un produit
        </Button>
      </div>

      {isFormOpen && <ProductForm />}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((product) => (
          <motion.div
            key={product.id}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
            whileHover={{ scale: 1.02 }}
          >
            <Card variant="glass" className="overflow-hidden hover:shadow-lg transition-all duration-300">
              <div className="aspect-video bg-gradient-to-br from-primary/20 to-secondary/20 relative">
                <div className="absolute inset-0 flex items-center justify-center">
                  <Package className="w-12 h-12 text-muted-foreground" />
                </div>
              </div>
              
              <CardContent className="p-4">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg">{product.name}</h3>
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {product.description}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-xl font-bold text-primary">€{product.price}</p>
                  </div>
                </div>

                <div className="flex items-center justify-between text-sm text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    {product.preparationTime} min
                  </span>
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    product.available ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}>
                    {product.available ? 'Disponible' : 'Indisponible'}
                  </span>
                </div>

                {product.spicy && (
                  <div className="flex items-center gap-2 text-sm text-amber-600">
                    <ChefHat className="w-4 h-4" />
                    <span>Épicé</span>
                  </div>
                )}

                <div className="flex gap-2 pt-4">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleEditProduct(product)}
                    className="flex-1"
                  >
                    <Edit className="w-4 h-4 mr-1" />
                    Modifier
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleDeleteProduct(product.id)}
                    className="flex-1"
                  >
                    <Trash2 className="w-4 h-4 mr-1" />
                    Supprimer
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
