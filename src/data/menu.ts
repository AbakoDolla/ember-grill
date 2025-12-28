import grilledTilapia from '@/assets/food/grilled-tilapia.jpg';
import smokedCatfish from '@/assets/food/smoked-catfish.jpg';
import grilledMackerel from '@/assets/food/grilled-mackerel.jpg';
import asset1 from '@/assets/food/asset-461481331362410496.jpg';
import asset2 from '@/assets/food/asset-461481331362410497.jpg';
import asset3 from '@/assets/food/asset-461481331362410498.jpg';
import asset4 from '@/assets/food/asset-461481331362410499.jpg';
import asset5 from '@/assets/food/asset-461482020239118341.jpg';
import asset6 from '@/assets/food/asset-461482020239118342.jpg';
import asset7 from '@/assets/food/asset-461482020239118343.png';
import asset8 from '@/assets/food/asset-461482020239118344.jpg';

export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: 'fish' | 'beef' | 'braise' | 'sides';
  spiceLevel: 1 | 2 | 3;
  popular?: boolean;
  new?: boolean;
}

export const menuItems: MenuItem[] = [
  {
    id: 'grilled-tilapia',
    name: 'Tilapia Braisé Camerounais',
    description: 'Tilapia frais du Cameroun, braisé lentement selon les méthodes traditionnelles ancestrales. Une tendreté incomparable et un goût authentique des eaux camerounaises.',
    price: 24.99,
    image: grilledTilapia,
    category: 'fish',
    spiceLevel: 2,
    popular: true,
  },
  {
    id: 'smoked-catfish',
    name: 'Capitaine Braisé Camerounais',
    description: 'Capitaine frais du Cameroun, braisé avec un mélange secret d\'épices africaines traditionnelles. Une explosion de saveurs ancestrales et une texture fondante.',
    price: 22.99,
    image: smokedCatfish,
    category: 'fish',
    spiceLevel: 2,
  },
  {
    id: 'grilled-mackerel',
    name: 'Maquereau Braisé Camerounais',
    description: 'Maquereau frais du Cameroun, braisé avec des herbes aromatiques et du citron selon les recettes ancestrales. Une fraîcheur garantie et un goût authentique.',
    price: 19.99,
    image: grilledMackerel,
    category: 'fish',
    spiceLevel: 3,
    new: true,
  },
  {
    id: 'braised-capitaine-royal',
    name: 'Capitaine Braisé Royal',
    description: 'Capitaine premium du Cameroun, braisé lentement avec un mélange secret d\'épices traditionnelles. Une texture fondante et des saveurs ancestrales exceptionnelles.',
    price: 26.99,
    image: asset1,
    category: 'fish',
    spiceLevel: 2,
    popular: true,
  },
  {
    id: 'braised-tilapia-gourmet',
    name: 'Tilapia Braisé Gourmet',
    description: 'Tilapia d\'élevage camerounais de qualité supérieure, braisé avec des aromates locaux. Une chair tendre et juteuse, parfaite pour les palais raffinés.',
    price: 23.99,
    image: asset2,
    category: 'fish',
    spiceLevel: 1,
  },
  {
    id: 'braised-mackerel-spicy',
    name: 'Maquereau Braisé Épicé',
    description: 'Maquereau sauvage du Cameroun, braisé avec des piments locaux et des épices traditionnelles. Un équilibre parfait entre douceur et piquant.',
    price: 21.99,
    image: asset3,
    category: 'fish',
    spiceLevel: 3,
  },
  {
    id: 'braised-catfish-deluxe',
    name: 'Capitaine Braisé Deluxe',
    description: 'Capitaine de rivière camerounais, braisé avec une marinade aux herbes sauvages. Une expérience gustative authentique des traditions culinaires locales.',
    price: 27.99,
    image: asset4,
    category: 'fish',
    spiceLevel: 2,
  },
  {
    id: 'braised-tilapia-traditional',
    name: 'Tilapia Braisé Traditionnel',
    description: 'Tilapia préparé selon les méthodes ancestrales camerounaises, braisé lentement pour préserver tous les arômes naturels. Un classique revisité.',
    price: 24.99,
    image: asset5,
    category: 'fish',
    spiceLevel: 2,
  },
  {
    id: 'braised-mackerel-herbs',
    name: 'Maquereau Braisé aux Herbes',
    description: 'Maquereau frais braisé avec un bouquet d\'herbes aromatiques camerounaises. Une préparation légère et savoureuse, respectueuse des traditions.',
    price: 22.99,
    image: asset6,
    category: 'fish',
    spiceLevel: 1,
  },
  {
    id: 'braised-catfish-signature',
    name: 'Capitaine Braisé Signature',
    description: 'Notre recette signature de capitaine braisé, inspirée des meilleures traditions culinaires camerounaises. Une explosion de saveurs authentiques.',
    price: 28.99,
    image: asset7,
    category: 'fish',
    spiceLevel: 2,
    popular: true,
  },
  {
    id: 'braised-tilapia-premium',
    name: 'Tilapia Braisé Premium',
    description: 'Tilapia de qualité premium du Cameroun, braisé avec soin selon les méthodes traditionnelles. Une texture parfaite et un goût incomparable.',
    price: 25.99,
    image: asset8,
    category: 'fish',
    spiceLevel: 2,
  },
];

export const categories = [
  { id: 'all', label: 'Tous les Poissons', icon: '🐟' },
  { id: 'fish', label: 'Poissons Braisés', icon: '🐟' },
];
