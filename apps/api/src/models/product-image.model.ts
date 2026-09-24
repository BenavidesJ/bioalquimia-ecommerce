import {
  AllowNull,
  AutoIncrement,
  Column,
  DataType,
  Default,
  Model,
  PrimaryKey,
  Table,
} from 'sequelize-typescript';

@Table({
  tableName: 'product_images',
  underscored: true,
  timestamps: false,
})
export class ProductImage extends Model {
  @AutoIncrement
  @PrimaryKey
  @Column({ type: DataType.INTEGER })
  id!: number;

  @AllowNull(false)
  @Column({ type: DataType.INTEGER })
  productId!: number;

  @AllowNull(false)
  @Column({ type: DataType.TEXT })
  url!: string;

  @AllowNull(false)
  @Default(0)
  @Column({ type: DataType.INTEGER })
  sortOrder!: number;
}