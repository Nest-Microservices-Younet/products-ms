import { Type } from 'class-transformer';
import { IsNumber, IsString, max, Min } from 'class-validator';

export class CreateProductDto {
  @IsString()
  public name: string;

  @IsNumber(
    {
      maxDecimalPlaces: 4,
    },
    { message: 'El precio debe ser un número y tener maximo 4 decimales' },
  )
  @Min(0)
  @Type(() => Number)
  public price: number;
}
