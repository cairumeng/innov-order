import { Product } from './product.interface';

export interface OpenFoodResponse {
  code: string;
  product?: Product;
  status: number;
  status_verbose: string;
}
