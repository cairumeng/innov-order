import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-guard';
import { Product } from './interfaces/product.interface';
import { ProductsService } from './products.service';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  async show(@Param() params): Promise<Product> {
    return await this.productsService.findOneById(params.id);
  }
}
