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

@Table({
  tableName: 'packages',
  underscored: true,
})
export class Package extends Model {
  @AutoIncrement
  @PrimaryKey
  @Column({ type: DataType.INTEGER })
  id!: number;

  @AllowNull(false)
  @Unique
  @Column({ type: DataType.STRING })
  sku!: string;

  @AllowNull(false)
  @Unique
  @Column({ type: DataType.STRING })
  name!: string;

  @AllowNull(false)
  @Default('')
  @Column({ type: DataType.TEXT })
  description!: string;

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
  @Default(true)
  @Column({ type: DataType.BOOLEAN })
  isActive!: boolean;

  @CreatedAt
  @Column({ type: DataType.DATE })
  createdAt!: Date;

  @UpdatedAt
  @Column({ type: DataType.DATE })
  updatedAt!: Date;
}