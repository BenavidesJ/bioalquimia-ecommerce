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
import type { Unit } from './unit.model';
import type { VariantDimensionValue } from './variant-dimension-value.model';

@Table({
  tableName: 'presentations',
  underscored: true,
})
export class Presentation extends Model {
  @AutoIncrement
  @PrimaryKey
  @Column({ type: DataType.INTEGER })
  id!: number;

  @AllowNull(false)
  @Column({ type: DataType.INTEGER })
  productId!: number;

  @AllowNull(false)
  @Unique
  @Column({ type: DataType.STRING })
  sku!: string;

  @AllowNull(false)
  @Column({
    type: DataType.DECIMAL(10, 3),
    validate: {
      isPositive(value: string | number) {
        if (Number(value) <= 0) {
          throw new Error('quantity must be greater than zero');
        }
      },
    },
  })
  quantity!: number;

  @AllowNull(false)
  @Column({ type: DataType.INTEGER })
  unitId!: number;

  @AllowNull(false)
  @Column({
    type: DataType.INTEGER,
    validate: {
      isPositive(value: number) {
        if (value <= 0) {
          throw new Error('price_crc must be greater than zero');
        }
      },
    },
  })
  priceCrc!: number;

  @AllowNull(false)
  @Default(0)
  @Column({ type: DataType.INTEGER })
  sortOrder!: number;

  @AllowNull(false)
  @Default(true)
  @Column({ type: DataType.BOOLEAN })
  isActive!: boolean;

  declare unit: Unit;
  declare dimensionValues: VariantDimensionValue[];

  @CreatedAt
  @Column({ type: DataType.DATE })
  createdAt!: Date;

  @UpdatedAt
  @Column({ type: DataType.DATE })
  updatedAt!: Date;
}