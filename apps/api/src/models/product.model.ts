import {
  AllowNull,
  AutoIncrement,
  Column,
  CreatedAt,
  DataType,
  Default,
  Model,
  PrimaryKey,
  Table,
  Unique,
  UpdatedAt,
} from 'sequelize-typescript';
import type { Aroma } from './aroma.model';
import type { Category } from './category.model';
import type { Presentation } from './presentation.model';
import type { ProductImage } from './product-image.model';

@Table({
  tableName: 'products',
  underscored: true,
})
export class Product extends Model {
  @AutoIncrement
  @PrimaryKey
  @Column({ type: DataType.INTEGER })
  id!: number;

  @AllowNull(false)
  @Unique
  @Column({ type: DataType.STRING })
  parentSku!: string;

  @AllowNull(false)
  @Unique('uq_products_category_name')
  @Column({ type: DataType.INTEGER })
  categoryId!: number;

  @AllowNull(false)
  @Unique('uq_products_category_name')
  @Column({ type: DataType.STRING })
  name!: string;

  @AllowNull(false)
  @Default('')
  @Column({ type: DataType.TEXT })
  description!: string;

  @AllowNull(false)
  @Default(true)
  @Column({ type: DataType.BOOLEAN })
  isActive!: boolean;

  declare category: Category;
  declare presentations: Presentation[];
  declare images: ProductImage[];
  declare aromas: Aroma[];

  @CreatedAt
  @Column({ type: DataType.DATE })
  createdAt!: Date;

  @UpdatedAt
  @Column({ type: DataType.DATE })
  updatedAt!: Date;
}