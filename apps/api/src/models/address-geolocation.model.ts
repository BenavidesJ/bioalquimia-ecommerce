import {
  AllowNull,
  Column,
  DataType,
  Model,
  PrimaryKey,
  Table,
  UpdatedAt,
} from 'sequelize-typescript';

@Table({
  tableName: 'address_geolocations',
  underscored: true,
  createdAt: false,
})
export class AddressGeolocation extends Model {
  @AllowNull(false)
  @PrimaryKey
  @Column({ type: DataType.INTEGER })
  addressId!: number;

  @AllowNull(false)
  @Column({
    type: DataType.DECIMAL(9, 6),
    validate: {
      isInRange(value: string | number) {
        const lat = Number(value);
        if (lat < -90 || lat > 90) {
          throw new Error('latitude must be between -90 and 90');
        }
      },
    },
  })
  latitude!: number;

  @AllowNull(false)
  @Column({
    type: DataType.DECIMAL(9, 6),
    validate: {
      isInRange(value: string | number) {
        const lng = Number(value);
        if (lng < -180 || lng > 180) {
          throw new Error('longitude must be between -180 and 180');
        }
      },
    },
  })
  longitude!: number;

  @UpdatedAt
  @Column({ type: DataType.DATE })
  updatedAt!: Date;
}