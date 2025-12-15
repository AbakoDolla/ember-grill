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
    image: '/images/grilled-tilapia.jpg',
    category: 'fish',
    spiceLevel: 2,
    popular: true,
  },
  {
    id: 'smoked-catfish',
    name: 'Smoked Catfish Deluxe',
    description: 'Slow-smoked catfish infused with hickory and palm wood, glazed with a tangy pepper sauce.',
    price: 22.99,
    image: '/images/smoked-catfish.jpg',
    category: 'fish',
    spiceLevel: 2,
  },
  {
    id: 'grilled-mackerel',
    name: 'Flame-Kissed Mackerel',
    description: 'Whole mackerel charred with herbs and citrus, served with spicy green pepper sauce.',
    price: 19.99,
    image: '/images/grilled-mackerel.jpg',
    category: 'fish',
    spiceLevel: 3,
    new: true,
  },
  {
    id: 'suya-beef',
    name: 'Suya Beef Skewers',
    description: 'Tender beef strips coated in ground peanut spice mix, grilled on charcoal. A Nigerian street food classic.',
    price: 18.99,
    image: '/images/suya-beef.jpg',
    category: 'beef',
    spiceLevel: 3,
    popular: true,
  },
  {
    id: 'beef-brochette',
    name: 'Premium Beef Brochettes',
    description: 'Cubed prime beef marinated in ginger and garlic, flame-grilled with bell peppers and onions.',
    price: 26.99,
    image: '/images/beef-brochette.jpg',
    category: 'beef',
    spiceLevel: 1,
  },
  {
    id: 'grilled-ribeye',
    name: 'African Spiced Ribeye',
    description: 'Thick-cut ribeye rubbed with our secret blend of 12 African spices, seared and rested to perfection.',
    price: 34.99,
    image: '/images/grilled-ribeye.jpg',
    category: 'beef',
    spiceLevel: 2,
    new: true,
  },
  {
    id: 'poulet-braise',
    name: 'Poulet Braisé Supreme',
    description: 'Cameroonian braised chicken, crispy on the outside, juicy inside. Marinated for 24 hours in African aromatics.',
    price: 21.99,
    image: '/images/poulet-braise.jpg',
    category: 'braise',
    spiceLevel: 2,
    popular: true,
  },
  {
    id: 'porc-braise',
    name: 'Porc Braisé Gold',
    description: 'Succulent pork pieces slow-braised with scotch bonnet peppers and palm oil until caramelized.',
    price: 23.99,
    image: '/images/porc-braise.jpg',
    category: 'braise',
    spiceLevel: 3,
  },
  {
    id: 'plantain-fries',
    name: 'Crispy Plantain Frites',
    description: 'Golden fried ripe plantains, perfectly caramelized. A sweet and savory side.',
    price: 6.99,
    image: '/images/plantain-fries.jpg',
    category: 'sides',
    spiceLevel: 1,
  },
  {
    id: 'attieke',
    name: 'Premium Attiéké',
    description: 'Traditional Ivorian fermented cassava couscous, light and fluffy.',
    price: 5.99,
    image: '/images/attieke.jpg',
    category: 'sides',
    spiceLevel: 1,
  },
  {
    id: 'jollof-rice',
    name: 'Signature Jollof Rice',
    description: 'Our award-winning tomato rice, slow-cooked with smoky party flavor.',
    price: 8.99,
    image: '/images/jollof-rice.jpg',
    category: 'sides',
    spiceLevel: 2,
    popular: true,
  },
  {
    id: 'grilled-corn',
    name: 'Fire-Roasted Corn',
    description: 'Sweet corn grilled over charcoal, brushed with spiced butter and lime.',
    price: 4.99,
    image: '/images/grilled-corn.jpg',
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
