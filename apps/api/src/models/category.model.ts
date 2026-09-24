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
  tableName: 'categories',
  underscored: true,
})
export class Category extends Model {
  @AutoIncrement
  @PrimaryKey
  @Column({ type: DataType.INTEGER })
  id!: number;

  @AllowNull(false)
  @Unique
  @Column({ type: DataType.STRING })
  name!: string;

  @AllowNull(false)
  @Unique
  @Column({ type: DataType.STRING })
  skuPrefix!: string;

  @AllowNull(false)
  @Default('')
  @Column({ type: DataType.TEXT })
  description!: string;

  @AllowNull(false)
  @Default(0)
  @Column({ type: DataType.INTEGER })
  lastSkuSeq!: number;

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