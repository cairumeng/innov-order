import { CACHE_MANAGER, Inject, Injectable, Logger } from '@nestjs/common';
import axios, { AxiosResponse } from 'axios';
import { Cache } from 'cache-manager';
import { NetworkError } from './errors/network.error';
import { ProductNotFoundError } from './errors/product-not-found.error';
import { OpenFoodResponse } from './interfaces/openfood-response.interface';
import { Product } from './interfaces/product.interface';

const oneDay = 1000 * 60 * 60 * 24;
@Injectable()
export class ProductsService {
  constructor(@Inject(CACHE_MANAGER) private cacheManager: Cache) {}
  public async findOneById(id: number): Promise<Product> {
    let product: Product;
    product = await this.cacheManager.get(`product-${id}`);
    if (product) return product;

    let response: AxiosResponse<OpenFoodResponse>;
    try {
      response = await axios.get<OpenFoodResponse>(
        `https://world.openfoodfacts.org/api/v0/product/${id}.json`,
      );
    } catch (error) {
      Logger.error(error);
      throw new NetworkError();
    }
    if (response.data.status === 0) {
      throw new ProductNotFoundError();
    }
    product = response.data.product;
    await this.cacheManager.set(`product-${id}`, product, {
      ttl: oneDay,
    });
    return product;
  }
}
