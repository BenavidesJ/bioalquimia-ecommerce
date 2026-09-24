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
} from 'sequelize-typescript';

@Table({
  tableName: 'addresses',
  underscored: true,
  updatedAt: false,
})
export class Address extends Model {
  @AutoIncrement
  @PrimaryKey
  @Column({ type: DataType.INTEGER })
  id!: number;

  @AllowNull(false)
  @Column({ type: DataType.INTEGER })
  userId!: number;

  @AllowNull(false)
  @Column({ type: DataType.INTEGER })
  provinceId!: number;

  @AllowNull(false)
  @Column({ type: DataType.INTEGER })
  cantonId!: number;

  @AllowNull(false)
  @Column({ type: DataType.INTEGER })
  districtId!: number;

  @AllowNull(false)
  @Default('')
  @Column({ type: DataType.TEXT })
  details!: string;

  @AllowNull(false)
  @Default(false)
  @Column({ type: DataType.BOOLEAN })
  isDefault!: boolean;

  @AllowNull(false)
  @Default(true)
  @Column({ type: DataType.BOOLEAN })
  isActive!: boolean;

  @CreatedAt
  @Column({ type: DataType.DATE })
  createdAt!: Date;
}