export interface Image {
  src: string;
}

export interface Product {
  id: number;
  name: string;
  price: number;
  description: string;
  img: Image;
}

export const products = [
  {
    id: 1,
    name: 'Deluxe double room',
    price: 299,
    description: 'A large bedroom with one of the best view over the city',
    img: {
      src: 'https://danaberez.com/wp-content/uploads/2019/01/Where-to-Stay-in-NYC-Hotel-Indigo-Lower-East-Side.jpg',
    },
  },
  {
    id: 2,
    name: 'Deluxe simple loft',
    price: 449,
    description: 'A double bedroom in a loft environment with view',
    img: {
      src: 'https://media-cdn.tripadvisor.com/media/photo-s/1c/d7/6e/56/interior-view-of-lounge.jpg',
    },
  },
  {
    id: 3,
    name: 'Deluxe double loft',
    price: 499,
    description: '2 double bedroom in a loft environment with ocean view',
    img: {
      src: 'https://cdn.concreteplayground.com/content/uploads/2022/04/bondi-view_airbnb-1-1920x1080.jpg',
    },
  },
];
