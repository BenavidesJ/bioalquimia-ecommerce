import {
  AllowNull,
  AutoIncrement,
  Column,
  DataType,
  Model,
  PrimaryKey,
  Table,
  Unique,
} from 'sequelize-typescript';

@Table({
  tableName: 'package_items',
  underscored: true,
  timestamps: false,
})
export class PackageItem extends Model {
  @AutoIncrement
  @PrimaryKey
  @Column({ type: DataType.INTEGER })
  id!: number;

  @AllowNull(false)
  @Unique('uq_package_items')
  @Column({ type: DataType.INTEGER })
  packageId!: number;

  @AllowNull(false)
  @Unique('uq_package_items')
  @Column({ type: DataType.INTEGER })
  presentationId!: number;

  @AllowNull(false)
  @Column({
    type: DataType.INTEGER,
    validate: {
      isPositive(value: number) {
        if (value <= 0) {
          throw new Error('quantity must be greater than zero');
        }
      },
    },
  })
  quantity!: number;
}