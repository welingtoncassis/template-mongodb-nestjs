import { IsOptional, IsNumber } from 'class-validator';
import { Transform, Type } from 'class-transformer';

const transformFields = ({ value }: any = { value: {} }) => {
  const swapFieldsObject = {};

  for (const keys in value) {
    const parsedAttribute = Number(value[keys]);
    swapFieldsObject[keys] = isNaN(parsedAttribute) ? 1 : parsedAttribute;
  }

  return swapFieldsObject;
};

const transformFilters = (value: any = {}) => {
  return JSON.parse(value);
};

const transformSort = (value: any = {}) => JSON.parse(value);

export class QueryDto {
  @IsOptional()
  @Transform(transformFields, { toClassOnly: true })
  fields?: { [key: string]: number };

  @IsOptional()
  @Transform(transformFilters, { toPlainOnly: true })
  filter?: { [key: string]: any };

  @IsOptional()
  @Transform(transformSort, { toPlainOnly: true })
  sort?: { [key: string]: number };

  @Type(() => Number)
  @IsOptional()
  @IsNumber()
  limit?: number;

  @Type(() => Number)
  @IsOptional()
  @IsNumber()
  skip?: number;
}
