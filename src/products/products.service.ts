import {
  Injectable,
  Logger,
  NotFoundException,
  OnModuleInit,
} from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { PrismaClient } from 'generated/prisma';
import { PaginationDto } from 'src/common';

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
      throw new NotFoundException(`Product with id ${id} not found`);
    }

    return elproduct;
  }

  async update(id: number, updateProductDto: UpdateProductDto) {

    const { id:__, ...data} = updateProductDto;
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
}
