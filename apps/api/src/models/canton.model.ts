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
  tableName: 'cantons',
  underscored: true,
  timestamps: false,
})
export class Canton extends Model {
  @AutoIncrement
  @PrimaryKey
  @Column({ type: DataType.INTEGER })
  id!: number;

  @AllowNull(false)
  @Unique('uq_cantons_name')
  @Column({ type: DataType.INTEGER })
  provinceId!: number;

  @AllowNull(false)
  @Unique('uq_cantons_name')
  @Column({ type: DataType.STRING })
  name!: string;

  @AllowNull(false)
  @Default(true)
  @Column({ type: DataType.BOOLEAN })
  isActive!: boolean;
}