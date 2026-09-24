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
  tableName: 'presentation_attributes',
  underscored: true,
  timestamps: false,
})
export class PresentationAttribute extends Model {
  @AutoIncrement
  @PrimaryKey
  @Column({ type: DataType.INTEGER })
  id!: number;

  @AllowNull(false)
  @Unique('uq_presentation_attributes')
  @Column({ type: DataType.INTEGER })
  presentationId!: number;

  @AllowNull(false)
  @Unique('uq_presentation_attributes')
  @Column({ type: DataType.INTEGER })
  dimensionValueId!: number;
}