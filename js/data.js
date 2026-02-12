/* ============================================
   AXOU BOUTIQUE — Demo Product Data
   ============================================ */

const DEMO_PRODUCTS = [
  // --- Beauté ---
  {
    id: 'beauty-1',
    name: 'Sérum Éclat Doré',
    description: 'Un sérum luxueux enrichi en particules d\'or 24K pour une peau lumineuse et éclatante. Formulé avec de l\'acide hyaluronique et de la vitamine C pour hydrater et revitaliser en profondeur.',
    price: 12500,
    category: 'beaute',
    image: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=600&h=600&fit=crop',
    featured: true,
  },
  {
    id: 'beauty-2',
    name: 'Crème Hydratante Rose',
    description: 'Crème hydratante riche à l\'extrait de rose de Damas. Nourrit la peau en profondeur et offre un teint frais et rosé tout au long de la journée.',
    price: 8900,
    category: 'beaute',
    image: 'https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=600&h=600&fit=crop',
    featured: false,
  },
  {
    id: 'beauty-3',
    name: 'Huile Précieuse Nuit',
    description: 'Huile de soin nocturne à base d\'argan et de jojoba. Régénère la peau pendant le sommeil pour un réveil avec une peau douce et souple.',
    price: 15000,
    category: 'beaute',
    image: 'https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?w=600&h=600&fit=crop',
    featured: true,
  },
  {
    id: 'beauty-4',
    name: 'Masque Purifiant Charbon',
    description: 'Masque détoxifiant au charbon actif et à l\'argile verte. Élimine les impuretés et resserre les pores pour une peau nette et purifiée.',
    price: 6500,
    category: 'beaute',
    image: 'https://images.unsplash.com/photo-1596755389378-c31d21fd1273?w=600&h=600&fit=crop',
    featured: false,
  },

  // --- Chaînes / Bijoux ---
  {
    id: 'chain-1',
    name: 'Collier Serpent Or',
    description: 'Collier chaîne serpent en plaqué or 18 carats. Un design élégant et moderne qui sublime toutes vos tenues, du quotidien aux soirées.',
    price: 18500,
    category: 'chaines',
    image: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=600&h=600&fit=crop',
    featured: true,
  },
  {
    id: 'chain-2',
    name: 'Bracelet Maille Cubaine',
    description: 'Bracelet maille cubaine en acier inoxydable doré. Robuste et tendance, il apporte une touche audacieuse à votre style.',
    price: 9500,
    category: 'chaines',
    image: 'https://images.unsplash.com/photo-1611652022419-a9419f74343d?w=600&h=600&fit=crop',
    featured: false,
  },
  {
    id: 'chain-3',
    name: 'Ensemble Bagues Luxe',
    description: 'Set de 5 bagues assorties en plaqué or avec pierres synthétiques. Portez-les ensemble ou séparément pour un look personnalisé.',
    price: 14000,
    category: 'chaines',
    image: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=600&h=600&fit=crop',
    featured: true,
  },
  {
    id: 'chain-4',
    name: 'Boucles d\'Oreilles Perle',
    description: 'Boucles d\'oreilles pendantes avec perle d\'eau douce et monture dorée. Un classique intemporel pour une élégance subtile.',
    price: 7500,
    category: 'chaines',
    image: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=600&h=600&fit=crop',
    featured: false,
  },

  // --- Pyjamas ---
  {
    id: 'pyjama-1',
    name: 'Pyjama Satin Rosé',
    description: 'Ensemble pyjama en satin de soie premium. Coupe fluide et confortable avec finitions luxueuses. Parfait pour des nuits douces et élégantes.',
    price: 22000,
    category: 'pyjamas',
    image: 'https://images.unsplash.com/photo-1631646109206-4e750a277f63?w=600&h=600&fit=crop',
    featured: true,
  },
  {
    id: 'pyjama-2',
    name: 'Nuisette Dentelle Noire',
    description: 'Nuisette en dentelle française avec doublure en soie. Design raffiné et sensuel pour des nuits inoubliables.',
    price: 16500,
    category: 'pyjamas',
    image: 'https://images.unsplash.com/photo-1616627977522-a342ad3ff768?w=600&h=600&fit=crop',
    featured: false,
  },
  {
    id: 'pyjama-3',
    name: 'Pyjama Velours Royal',
    description: 'Ensemble pyjama en velours doux et chaud. Idéal pour les soirées cocooning avec un style royal et un confort incomparable.',
    price: 25000,
    category: 'pyjamas',
    image: 'https://images.unsplash.com/photo-1590736969955-71cc94901144?w=600&h=600&fit=crop',
    featured: true,
  },
  {
    id: 'pyjama-4',
    name: 'Robe de Chambre Soie',
    description: 'Robe de chambre longue en soie légère. Design kimono avec ceinture assortie. Le summum du luxe et du confort à la maison.',
    price: 28000,
    category: 'pyjamas',
    image: 'https://images.unsplash.com/photo-1618354691373-d851c5c3a990?w=600&h=600&fit=crop',
    featured: false,
  },
];

const CATEGORIES = [
  {
    id: 'beaute',
    name: 'Beauté',
    description: 'Soins et cosmétiques premium',
    image: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=800&h=500&fit=crop',
    icon: '✨'
  },
  {
    id: 'chaines',
    name: 'Chaînes & Bijoux',
    description: 'Accessoires élégants et tendance',
    image: 'https://images.unsplash.com/photo-1515562141589-67f0d569b34e?w=800&h=500&fit=crop',
    icon: '💎'
  },
  {
    id: 'pyjamas',
    name: 'Pyjamas',
    description: 'Confort et luxe pour vos nuits',
    image: 'https://images.unsplash.com/photo-1590736969955-71cc94901144?w=800&h=500&fit=crop',
    icon: '🌙'
  },
];

function formatPrice(price) {
  return new Intl.NumberFormat('fr-FR').format(price) + ' FCFA';
}
