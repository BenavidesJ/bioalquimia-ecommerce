import {
  AllowNull,
  Column,
  DataType,
  Default,
  Model,
  PrimaryKey,
  Table,
} from 'sequelize-typescript';

@Table({
  tableName: 'product_aromas',
  underscored: true,
  timestamps: false,
})
export class ProductAroma extends Model {
  @AllowNull(false)
  @PrimaryKey
  @Column({ type: DataType.INTEGER })
  productId!: number;

  @AllowNull(false)
  @PrimaryKey
  @Column({ type: DataType.INTEGER })
  aromaId!: number;

  @AllowNull(false)
  @Default(0)
  @Column({ type: DataType.INTEGER })
  sortOrder!: number;
}