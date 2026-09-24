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
  tableName: 'inventory_movements',
  underscored: true,
  updatedAt: false,
})
export class InventoryMovement extends Model {
  @AutoIncrement
  @PrimaryKey
  @Column({ type: DataType.INTEGER })
  id!: number;

  @AllowNull(false)
  @Column({ type: DataType.INTEGER })
  presentationId!: number;

  @AllowNull(false)
  @Column({
    type: DataType.STRING,
    validate: {
      isIn: {
        args: [['IN', 'OUT', 'ADJUST']],
        msg: 'movement_type must be one of IN, OUT, ADJUST',
      },
    },
  })
  movementType!: 'IN' | 'OUT' | 'ADJUST';

  @AllowNull(false)
  @Column({
    type: DataType.INTEGER,
    validate: {
      isNotZero(value: number) {
        if (value === 0) {
          throw new Error('qty_delta must not be zero');
        }
      },
    },
  })
  qtyDelta!: number;

  @AllowNull(false)
  @Column({
    type: DataType.INTEGER,
    validate: {
      isNotNegative(value: number) {
        if (value < 0) {
          throw new Error('stock_after must be greater than or equal to zero');
        }
      },
    },
  })
  stockAfter!: number;

  @AllowNull(false)
  @Column({ type: DataType.INTEGER })
  userId!: number;

  @AllowNull(false)
  @Default('')
  @Column({ type: DataType.TEXT })
  reference!: string;

  @CreatedAt
  @Column({ type: DataType.DATE })
  createdAt!: Date;
}