import {
  AllowNull,
  Column,
  DataType,
  Model,
  PrimaryKey,
  Table,
} from 'sequelize-typescript';

@Table({
  tableName: 'package_campaigns',
  underscored: true,
  timestamps: false,
})
export class PackageCampaign extends Model {
  @AllowNull(false)
  @PrimaryKey
  @Column({ type: DataType.INTEGER })
  packageId!: number;

  @AllowNull(false)
  @PrimaryKey
  @Column({ type: DataType.INTEGER })
  campaignId!: number;
}