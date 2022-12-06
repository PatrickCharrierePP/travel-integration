export interface Product {
  id: number;
  name: string;
  price: number;
  description: string;
}

export const products = [
  {
    id: 1,
    name: 'Deluxe double room',
    price: 299,
    description: 'A large bedroom with one of the best view over the city'
  },
  {
    id: 2,
    name: 'Deluxe simple loft',
    price: 449,
    description: '1 Double bedroom in a loft environment with view'
  },
  {
    id: 3,
    name: 'Deluxe double loft',
    price: 499,
    description: '2 Double bedroom in a loft environment with ocean view'
  }
];