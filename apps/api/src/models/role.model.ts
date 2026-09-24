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
  tableName: 'roles',
  underscored: true,
  timestamps: false,
})
export class Role extends Model {
  @AutoIncrement
  @PrimaryKey
  @Column({ type: DataType.INTEGER })
  id!: number;

  @AllowNull(false)
  @Unique
  @Column({ type: DataType.STRING })
  code!: string;

  @AllowNull(false)
  @Unique
  @Column({ type: DataType.STRING })
  name!: string;

  @AllowNull(false)
  @Default(true)
  @Column({ type: DataType.BOOLEAN })
  isActive!: boolean;
}