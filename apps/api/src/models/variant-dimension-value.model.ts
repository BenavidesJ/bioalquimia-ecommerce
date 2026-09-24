import {
  AllowNull,
  AutoIncrement,
  Column,
  DataType,
  Default,
  Model,
  PrimaryKey,
  Table,
  Unique,
} from 'sequelize-typescript';

@Table({
  tableName: 'variant_dimension_values',
  underscored: true,
  timestamps: false,
})
export class VariantDimensionValue extends Model {
  @AutoIncrement
  @PrimaryKey
  @Column({ type: DataType.INTEGER })
  id!: number;

  @AllowNull(false)
  @Unique('uq_variant_dimension_values_value')
  @Column({ type: DataType.INTEGER })
  dimensionId!: number;

  @AllowNull(false)
  @Unique('uq_variant_dimension_values_value')
  @Column({ type: DataType.STRING })
  value!: string;

  @AllowNull(false)
  @Default(0)
  @Column({ type: DataType.INTEGER })
  sortOrder!: number;

  @AllowNull(false)
  @Default(true)
  @Column({ type: DataType.BOOLEAN })
  isActive!: boolean;
}