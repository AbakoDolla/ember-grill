import { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { 
  Plus, 
  Edit, 
  Trash2, 
  Search, 
  Filter, 
  Package,
  Euro,
  Image,
  Check
} from 'lucide-react';

interface Product {
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

interface ProductManagementProps {
  products: Product[];
  onCreateProduct: (product: Omit<Product, 'id' | 'created_at' | 'updated_at'>) => Promise<{ success: boolean; data?: Product; error?: string }>;
  onUpdateProduct: (id: string, product: Partial<Product>) => Promise<{ success: boolean; data?: Product; error?: string }>;
  onDeleteProduct: (id: string) => Promise<{ success: boolean; error?: string }>;
}

export default function ProductManagement({ 
  products, 
  onCreateProduct, 
  onUpdateProduct, 
  onDeleteProduct 
}: ProductManagementProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [showAvailableOnly, setShowAvailableOnly] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: '',
    image: '',
    available: true
  });

  const categories = [
    { value: 'plats-principaux', label: 'Plats Principaux' },
    { value: 'grillades', label: 'Grillades' },
    { value: 'accompagnements', label: 'Accompagnements' },
    { value: 'boissons', label: 'Boissons' },
    { value: 'desserts', label: 'Desserts' }
  ];

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
    const matchesAvailability = !showAvailableOnly || product.available;
    
    return matchesSearch && matchesCategory && matchesAvailability;
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const productData = {
      name: formData.name,
      description: formData.description,
      price: parseFloat(formData.price),
      category: formData.category,
      image: formData.image || '/api/placeholder/food/default',
      available: formData.available
    };

    if (editingProduct) {
      const result = await onUpdateProduct(editingProduct.id, productData);
      if (result.success) {
        toast.success('Produit mis à jour avec succès');
        setEditingProduct(null);
        resetForm();
      } else {
        toast.error(result.error || 'Erreur lors de la mise à jour');
      }
    } else {
      const result = await onCreateProduct(productData);
      if (result.success) {
        toast.success('Produit ajouté avec succès');
        setShowAddForm(false);
        resetForm();
      } else {
        toast.error(result.error || 'Erreur lors de l\'ajout');
      }
    }
  };

  const handleDelete = async (productId: string) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer ce produit ?')) {
      const result = await onDeleteProduct(productId);
      if (result.success) {
        toast.success('Produit supprimé avec succès');
      } else {
        toast.error(result.error || 'Erreur lors de la suppression');
      }
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      price: '',
      category: '',
      image: '',
      available: true
    });
  };

  const startEdit = (product: Product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      description: product.description,
      price: product.price.toString(),
      category: product.category,
      image: product.image,
      available: product.available
    });
  };

  return (
    <div className="space-y-6">
      {/* Filters */}
      <Card variant="glass">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  placeholder="Rechercher un produit..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Catégorie" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Toutes les catégories</SelectItem>
                {categories.map((category) => (
                  <SelectItem key={category.value} value={category.value}>
                    {category.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <div className="flex items-center gap-2">
              <Switch
                id="available-only"
                checked={showAvailableOnly}
                onCheckedChange={setShowAvailableOnly}
              />
              <Label htmlFor="available-only">Disponibles seulement</Label>
            </div>

            <Button 
              onClick={() => setShowAddForm(true)}
              className="interactive-scale"
            >
              <Plus className="w-4 h-4 mr-2" />
              Ajouter
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Add/Edit Form */}
      {(showAddForm || editingProduct) && (
        <Card variant="glass">
          <CardHeader>
            <CardTitle>
              {editingProduct ? 'Modifier le produit' : 'Ajouter un nouveau produit'}
            </CardTitle>
            <CardDescription>
              {editingProduct ? 'Modifiez les informations du produit' : 'Remplissez les informations pour ajouter un nouveau produit'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Nom du produit</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="Ex: Poisson Braisé Royal"
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="price">Prix (€)</Label>
                  <Input
                    id="price"
                    type="number"
                    step="0.01"
                    min="0"
                    value={formData.price}
                    onChange={(e) => setFormData(prev => ({ ...prev, price: e.target.value }))}
                    placeholder="24.90"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="category">Catégorie</Label>
                <Select value={formData.category} onValueChange={(value) => setFormData(prev => ({ ...prev, category: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionnez une catégorie" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category.value} value={category.value}>
                        {category.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Décrivez le produit..."
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="image">URL de l'image</Label>
                <Input
                  id="image"
                  value={formData.image}
                  onChange={(e) => setFormData(prev => ({ ...prev, image: e.target.value }))}
                  placeholder="/api/placeholder/food/1"
                />
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="available"
                  checked={formData.available}
                  onCheckedChange={(checked) => setFormData(prev => ({ ...prev, available: checked }))}
                />
                <Label htmlFor="available">Produit disponible</Label>
              </div>

              <div className="flex gap-2">
                <Button type="submit" className="interactive-scale">
                  {editingProduct ? (
                    <>
                      <Check className="w-4 h-4 mr-2" />
                      Mettre à jour
                    </>
                  ) : (
                    <>
                      <Plus className="w-4 h-4 mr-2" />
                      Ajouter
                    </>
                  )}
                </Button>
                <Button 
                  type="button" 
                  variant="outline"
                  onClick={() => {
                    setShowAddForm(false);
                    setEditingProduct(null);
                    resetForm();
                  }}
                >
                  Annuler
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Products Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProducts.map((product) => (
          <Card variant="glass" key={product.id} className="hover:scale-105 transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                  <Package className="w-6 h-6 text-primary" />
                </div>
                <div className="flex items-center gap-2">
                  <div className={`w-3 h-3 rounded-full ${product.available ? 'bg-green-500' : 'bg-red-500'}`} />
                  <span className="text-xs text-muted-foreground">
                    {product.available ? 'Disponible' : 'Indisponible'}
                  </span>
                </div>
              </div>
              
              <h3 className="font-semibold mb-2">{product.name}</h3>
              <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                {product.description}
              </p>
              
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-1">
                  <Euro className="w-4 h-4 text-primary" />
                  <span className="font-bold text-lg">{product.price.toFixed(2)}</span>
                </div>
                <span className="text-xs bg-muted px-2 py-1 rounded">
                  {categories.find(c => c.value === product.category)?.label || product.category}
                </span>
              </div>
              
              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="flex-1"
                  onClick={() => startEdit(product)}
                >
                  <Edit className="w-3 h-3 mr-1" />
                  Modifier
                </Button>
                <Button 
                  variant="destructive" 
                  size="sm" 
                  className="flex-1"
                  onClick={() => handleDelete(product.id)}
                >
                  <Trash2 className="w-3 h-3 mr-1" />
                  Supprimer
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredProducts.length === 0 && (
        <Card variant="glass">
          <CardContent className="text-center py-12">
            <Package className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-lg font-semibold mb-2">Aucun produit trouvé</h3>
            <p className="text-muted-foreground">
              {searchTerm || selectedCategory !== 'all' || showAvailableOnly 
                ? 'Essayez de modifier vos filtres' 
                : 'Commencez par ajouter votre premier produit'}
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
