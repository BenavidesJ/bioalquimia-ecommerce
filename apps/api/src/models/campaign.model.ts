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
  tableName: 'campaigns',
  underscored: true,
})
export class Campaign extends Model {
  @AutoIncrement
  @PrimaryKey
  @Column({ type: DataType.INTEGER })
  id!: number;

  @AllowNull(false)
  @Unique
  @Column({ type: DataType.STRING })
  name!: string;

  @AllowNull(false)
  @Column({ type: DataType.DATE })
  startsAt!: Date;

  @AllowNull(false)
  @Column({
    type: DataType.DATE,
    validate: {
      isAfterStart(this: Campaign) {
        if (this.endsAt && this.startsAt && this.endsAt.getTime() <= this.startsAt.getTime()) {
          throw new Error('ends_at must be after starts_at');
        }
      },
    },
  })
  endsAt!: Date;

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