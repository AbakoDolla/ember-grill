import grilledTilapia from '@/assets/food/grilled-tilapia.jpg';
import smokedCatfish from '@/assets/food/smoked-catfish.jpg';
import grilledMackerel from '@/assets/food/grilled-mackerel.jpg';
import suyaBeef from '@/assets/food/suya-beef.jpg';
import beefBrochette from '@/assets/food/beef-brochette.jpg';
import grilledRibeye from '@/assets/food/grilled-ribeye.jpg';
import pouletBraise from '@/assets/food/poulet-braise.jpg';
import porcBraise from '@/assets/food/porc-braise.jpg';
import plantainFries from '@/assets/food/plantain-fries.jpg';
import attieke from '@/assets/food/attieke.jpg';
import jollofRice from '@/assets/food/jollof-rice.jpg';
import grilledCorn from '@/assets/food/grilled-corn.jpg';

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
    name: 'Grilled Tilapia Royale',
    description: 'Fresh tilapia marinated in our signature African spice blend, grilled to perfection over open flames. Served with plantains and attiéké.',
    price: 24.99,
    image: grilledTilapia,
    category: 'fish',
    spiceLevel: 2,
    popular: true,
  },
  {
    id: 'smoked-catfish',
    name: 'Smoked Catfish Deluxe',
    description: 'Slow-smoked catfish infused with hickory and palm wood, glazed with a tangy pepper sauce.',
    price: 22.99,
    image: smokedCatfish,
    category: 'fish',
    spiceLevel: 2,
  },
  {
    id: 'grilled-mackerel',
    name: 'Flame-Kissed Mackerel',
    description: 'Whole mackerel charred with herbs and citrus, served with spicy green pepper sauce.',
    price: 19.99,
    image: grilledMackerel,
    category: 'fish',
    spiceLevel: 3,
    new: true,
  },
  {
    id: 'suya-beef',
    name: 'Suya Beef Skewers',
    description: 'Tender beef strips coated in ground peanut spice mix, grilled on charcoal. A Nigerian street food classic.',
    price: 18.99,
    image: suyaBeef,
    category: 'beef',
    spiceLevel: 3,
    popular: true,
  },
  {
    id: 'beef-brochette',
    name: 'Premium Beef Brochettes',
    description: 'Cubed prime beef marinated in ginger and garlic, flame-grilled with bell peppers and onions.',
    price: 26.99,
    image: beefBrochette,
    category: 'beef',
    spiceLevel: 1,
  },
  {
    id: 'grilled-ribeye',
    name: 'African Spiced Ribeye',
    description: 'Thick-cut ribeye rubbed with our secret blend of 12 African spices, seared and rested to perfection.',
    price: 34.99,
    image: grilledRibeye,
    category: 'beef',
    spiceLevel: 2,
    new: true,
  },
  {
    id: 'poulet-braise',
    name: 'Poulet Braisé Supreme',
    description: 'Cameroonian braised chicken, crispy on the outside, juicy inside. Marinated for 24 hours in African aromatics.',
    price: 21.99,
    image: pouletBraise,
    category: 'braise',
    spiceLevel: 2,
    popular: true,
  },
  {
    id: 'porc-braise',
    name: 'Porc Braisé Gold',
    description: 'Succulent pork pieces slow-braised with scotch bonnet peppers and palm oil until caramelized.',
    price: 23.99,
    image: porcBraise,
    category: 'braise',
    spiceLevel: 3,
  },
  {
    id: 'plantain-fries',
    name: 'Crispy Plantain Frites',
    description: 'Golden fried ripe plantains, perfectly caramelized. A sweet and savory side.',
    price: 6.99,
    image: plantainFries,
    category: 'sides',
    spiceLevel: 1,
  },
  {
    id: 'attieke',
    name: 'Premium Attiéké',
    description: 'Traditional Ivorian fermented cassava couscous, light and fluffy.',
    price: 5.99,
    image: attieke,
    category: 'sides',
    spiceLevel: 1,
  },
  {
    id: 'jollof-rice',
    name: 'Signature Jollof Rice',
    description: 'Our award-winning tomato rice, slow-cooked with smoky party flavor.',
    price: 8.99,
    image: jollofRice,
    category: 'sides',
    spiceLevel: 2,
    popular: true,
  },
  {
    id: 'grilled-corn',
    name: 'Fire-Roasted Corn',
    description: 'Sweet corn grilled over charcoal, brushed with spiced butter and lime.',
    price: 4.99,
    image: grilledCorn,
    category: 'sides',
    spiceLevel: 1,
  },
];

export const categories = [
  { id: 'all', label: 'All Dishes', icon: '🔥' },
  { id: 'fish', label: 'Grilled Fish', icon: '🐟' },
  { id: 'beef', label: 'Premium Beef', icon: '🥩' },
  { id: 'braise', label: 'African Braise', icon: '🍗' },
  { id: 'sides', label: 'Sides', icon: '🍚' },
];
