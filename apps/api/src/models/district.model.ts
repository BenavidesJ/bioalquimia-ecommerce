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
  tableName: 'districts',
  underscored: true,
  timestamps: false,
})
export class District extends Model {
  @AutoIncrement
  @PrimaryKey
  @Column({ type: DataType.INTEGER })
  id!: number;

  @AllowNull(false)
  @Unique('uq_districts_name')
  @Column({ type: DataType.INTEGER })
  cantonId!: number;

  @AllowNull(false)
  @Unique('uq_districts_name')
  @Column({ type: DataType.STRING })
  name!: string;

  @AllowNull(false)
  @Default(true)
  @Column({ type: DataType.BOOLEAN })
  isActive!: boolean;
}