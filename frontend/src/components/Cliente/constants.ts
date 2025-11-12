export interface Event {
  id: number;
  title: string;
  date: string;
  location: string;
  price: number;
  imageUrl: string;
  category: string;
  gridClass?: string; // For bento grid layout
}

export interface CarouselItem {
  id: number;
  imageUrl: string;
  date: string;
  location: string;
}


export const CAROUSEL_ITEMS: CarouselItem[] = [
  {
    id: 1,
    imageUrl: 'https://i.imgur.com/hri29d7.jpeg',
    date: '13 DE FEBRERO',
    location: 'ARENA 1 - LIMA, PERÚ',
  },
  {
    id: 2,
    imageUrl: 'https://i.imgur.com/hri29d7.jpeg',
    date: '15 DE MARZO',
    location: 'ESTADIO NACIONAL - LIMA, PERÚ',
  },
  {
    id: 3,
    imageUrl: 'https://i.imgur.com/hri29d7.jpeg',
    date: '22 DE ABRIL',
    location: 'JOCKEY CLUB - LIMA, PERÚ',
  }
];

export const EVENTS: Event[] = [
  {
    id: 1,
    title: 'TOUR MAVIE - DOJA CAT',
    date: '1 Octubre',
    location: 'Arena 1 - Lima',
    price: 180,
    imageUrl: 'https://i.imgur.com/hri29d7.jpeg',
    category: 'Conciertos',
    gridClass: '', // Block 1: Small, left column
  },
  {
    id: 2,
    title: 'REFLEXATOUR 2025',
    date: '20 Septiembre',
    location: 'Costa 21 - Lima',
    price: 200,
    imageUrl: 'https://i.imgur.com/hri29d7.jpeg',
    category: 'Conciertos',
    gridClass: 'md:row-span-2', // Block 1: Tall, right column
  },
  {
    id: 3,
    title: 'TOUR MAVIE - DOJA CAT',
    date: '1 Octubre',
    location: 'Arena 1 - Lima',
    price: 180,
    imageUrl: 'https://i.imgur.com/hri29d7.jpeg',
    category: 'Conciertos',
    gridClass: '', // Block 1: Small, left column
  },
  {
    id: 4,
    title: 'HABLANDO HUEVADAS',
    date: '10 Octubre',
    location: 'Teatro Canout - Lima',
    price: 150,
    imageUrl: 'https://i.imgur.com/hri29d7.jpeg',
    category: 'Entretenimiento',
    gridClass: 'md:row-span-2', // Block 2: Tall, left column
  },
  {
    id: 5,
    title: 'TOUR MAVIE - DOJA CAT',
    date: '1 Octubre',
    location: 'Arena 1 - Lima',
    price: 180,
    imageUrl: 'https://i.imgur.com/hri29d7.jpeg',
    category: 'Conciertos',
    gridClass: '', // Block 2: Small, right column
  },
  {
    id: 6,
    title: 'LOS DIOSES DEL TEATRO',
    date: '4 Septiembre',
    location: 'Teatro Mario Vargas Llosa - Lima',
    price: 180,
    imageUrl: 'https://i.imgur.com/hri29d7.jpeg',
    category: 'Teatro',
    gridClass: '', // Block 2: Small, right column
  },
   {
    id: 7,
    title: 'TOUR MAVIE - DOJA CAT',
    date: '1 Octubre',
    location: 'Arena 1 - Lima',
    price: 180,
    imageUrl: 'https://i.imgur.com/hri29d7.jpeg',
    category: 'Conciertos',
    gridClass: '',
  },
];