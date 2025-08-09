import {
  HttpStatus,
  Injectable,
  Logger,
  NotFoundException,
  OnModuleInit,
} from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { PrismaClient } from '@prisma/client';
import { PaginationDto } from 'src/common';
import { RpcException } from '@nestjs/microservices';

@Injectable()
export class ProductsService extends PrismaClient implements OnModuleInit {
  private readonly logger = new Logger('ProductsService');

  async onModuleInit() {
    await this.$connect();
    this.logger.log(`Connected to database`);
  }

  create(createProductDto: CreateProductDto) {
    return this.product.create({
      data: createProductDto,
    });
  }

  async findAll(paginationDto: PaginationDto) {
    const { page, limit } = paginationDto;

    const totalPage = await this.product.count({ where: { available: true } });
    const lastPage = Math.ceil(totalPage / limit!);
    return {
      data: await this.product.findMany({
        where: {
          available: true,
        },
        take: limit,
        skip: (page! - 1) * limit!,
      }),
      meta: {
        page,
        total: totalPage,
        lastPage,
      },
    };
  }

  async findOne(id: number) {
    const elproduct = await this.product.findUnique({
      where: {
        id,
        available: true,
      },
    });

    if (!elproduct) {
      // throw new NotFoundException(`Product with id ${id} not found`);
      throw new RpcException({
        message: 'Product with id ' + id + ' not found',
        status: HttpStatus.BAD_REQUEST,
      });
    }

    return elproduct;
  }

  async update(id: number, updateProductDto: UpdateProductDto) {
    const { id: __, ...data } = updateProductDto;
    await this.findOne(id);

    return this.product.update({
      where: {
        id,
      },
      data,
    });
  }

  async remove(id: number) {
    await this.findOne(id);

    return this.product.update({
      where: {
        id,
      },
      data: { available: false },
    });
    // return this.product.delete({
    //   where: {
    //     id,
    //   },
    // });
  }

  async validateProducts(ids: number[]) {
    try {
      ids = Array.from(new Set(ids)); // se elimino los repetidos
      const products = await this.product.findMany({
        where: {
          id: { in: ids },
          // available: true,
        },
      });

      if (products.length !== ids.length) {
        console.log(products.length);
        console.log(ids.length);
        throw new RpcException({
          message: 'Product with id ' + ids + ' not found',
          status: HttpStatus.BAD_REQUEST,
        });
      }

      return products;
    } catch (err) {
      throw new RpcException({
        message: err.message,
        status: HttpStatus.BAD_REQUEST,
      });
    }
  }
}
