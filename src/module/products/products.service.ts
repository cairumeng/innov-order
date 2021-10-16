import { Injectable, Logger } from '@nestjs/common';
import axios from 'axios';
import { NetworkError } from './errors/network.error';
import { ProductNotFoundError } from './errors/product-not-found.error';
import { OpenFoodResponse } from './interfaces/openfood-response.interface';
import { Product } from './interfaces/product.interface';

@Injectable()
export class ProductsService {
  constructor() {}
  public async findOneById(id: number): Promise<Product> {
    try {
      const response = await axios.get<OpenFoodResponse>(
        `https://world.openfoodfacts.org/api/v0/product/${id}.json`,
      );
      if (response.data.status === 0) {
        throw new ProductNotFoundError();
      }
      return response.data.product;
    } catch (error) {
      Logger.error(error);
      throw new NetworkError();
    }
  }
}
