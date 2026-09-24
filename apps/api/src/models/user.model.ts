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
  tableName: 'users',
  underscored: true,
})
export class User extends Model {
  @AutoIncrement
  @PrimaryKey
  @Column({ type: DataType.INTEGER })
  id!: number;

  @AllowNull(false)
  @Unique
  @Column({ type: DataType.STRING })
  phoneE164!: string;

  @AllowNull(true)
  @Unique
  @Column({ type: DataType.STRING })
  email!: string | null;

  @AllowNull(false)
  @Column({ type: DataType.STRING })
  fullName!: string;

  @AllowNull(false)
  @Column({ type: DataType.STRING })
  passwordHash!: string;

  @AllowNull(false)
  @Column({ type: DataType.INTEGER })
  roleId!: number;

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