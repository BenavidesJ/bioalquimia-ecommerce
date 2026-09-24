import { Address } from './address.model';
import { AddressGeolocation } from './address-geolocation.model';
import { Aroma } from './aroma.model';
import { Campaign } from './campaign.model';
import { Canton } from './canton.model';
import { Category } from './category.model';
import { District } from './district.model';
import { InventoryMovement } from './inventory-movement.model';
import { Package } from './package.model';
import { PackageCampaign } from './package-campaign.model';
import { PackageItem } from './package-item.model';
import { Presentation } from './presentation.model';
import { PresentationAttribute } from './presentation-attribute.model';
import { Product } from './product.model';
import { ProductAroma } from './product-aroma.model';
import { ProductImage } from './product-image.model';
import { Province } from './province.model';
import { Role } from './role.model';
import { Unit } from './unit.model';
import { User } from './user.model';
import { VariantDimension } from './variant-dimension.model';
import { VariantDimensionValue } from './variant-dimension-value.model';

export {
  Address,
  AddressGeolocation,
  Aroma,
  Campaign,
  Canton,
  Category,
  District,
  InventoryMovement,
  Package,
  PackageCampaign,
  PackageItem,
  Presentation,
  PresentationAttribute,
  Product,
  ProductAroma,
  ProductImage,
  Province,
  Role,
  Unit,
  User,
  VariantDimension,
  VariantDimensionValue,
};

export const models = [
  Address,
  AddressGeolocation,
  Aroma,
  Campaign,
  Canton,
  Category,
  District,
  InventoryMovement,
  Package,
  PackageCampaign,
  PackageItem,
  Presentation,
  PresentationAttribute,
  Product,
  ProductAroma,
  ProductImage,
  Province,
  Role,
  Unit,
  User,
  VariantDimension,
  VariantDimensionValue,
];

/**
 * Registra todas las asociaciones entre modelos.
 */
export function setupAssociations(): void {
  // categories 1-N products
  Category.hasMany(Product, { foreignKey: 'categoryId', as: 'products' });
  Product.belongsTo(Category, { foreignKey: 'categoryId', as: 'category' });

  // units 1-N presentations
  Unit.hasMany(Presentation, { foreignKey: 'unitId', as: 'presentations' });
  Presentation.belongsTo(Unit, { foreignKey: 'unitId', as: 'unit' });

  // products 1-N presentations
  Product.hasMany(Presentation, { foreignKey: 'productId', as: 'presentations' });
  Presentation.belongsTo(Product, { foreignKey: 'productId', as: 'product' });

  // products 1-N product_images
  Product.hasMany(ProductImage, { foreignKey: 'productId', as: 'images' });
  ProductImage.belongsTo(Product, { foreignKey: 'productId', as: 'product' });

  // variant_dimensions 1-N variant_dimension_values
  VariantDimension.hasMany(VariantDimensionValue, { foreignKey: 'dimensionId', as: 'values' });
  VariantDimensionValue.belongsTo(VariantDimension, { foreignKey: 'dimensionId', as: 'dimension' });

  // presentations N-M variant_dimension_values (via presentation_attributes)
  Presentation.belongsToMany(VariantDimensionValue, {
    through: { model: PresentationAttribute },
    foreignKey: 'presentationId',
    otherKey: 'dimensionValueId',
    as: 'dimensionValues',
  });
  VariantDimensionValue.belongsToMany(Presentation, {
    through: { model: PresentationAttribute },
    foreignKey: 'dimensionValueId',
    otherKey: 'presentationId',
    as: 'presentations',
  });
  Presentation.hasMany(PresentationAttribute, { foreignKey: 'presentationId', as: 'presentationAttributes' });
  PresentationAttribute.belongsTo(Presentation, { foreignKey: 'presentationId', as: 'presentation' });
  VariantDimensionValue.hasMany(PresentationAttribute, { foreignKey: 'dimensionValueId', as: 'presentationAttributes' });
  PresentationAttribute.belongsTo(VariantDimensionValue, { foreignKey: 'dimensionValueId', as: 'dimensionValue' });

  // products N-M aromas (via product_aromas)
  Product.belongsToMany(Aroma, {
    through: { model: ProductAroma },
    foreignKey: 'productId',
    otherKey: 'aromaId',
    as: 'aromas',
  });
  Aroma.belongsToMany(Product, {
    through: { model: ProductAroma },
    foreignKey: 'aromaId',
    otherKey: 'productId',
    as: 'products',
  });
  Product.hasMany(ProductAroma, { foreignKey: 'productId', as: 'productAromas' });
  ProductAroma.belongsTo(Product, { foreignKey: 'productId', as: 'product' });
  Aroma.hasMany(ProductAroma, { foreignKey: 'aromaId', as: 'productAromas' });
  ProductAroma.belongsTo(Aroma, { foreignKey: 'aromaId', as: 'aroma' });

  // roles 1-N users
  Role.hasMany(User, { foreignKey: 'roleId', as: 'users' });
  User.belongsTo(Role, { foreignKey: 'roleId', as: 'role' });

  // users 1-N addresses
  User.hasMany(Address, { foreignKey: 'userId', as: 'addresses' });
  Address.belongsTo(User, { foreignKey: 'userId', as: 'user' });

  // users 1-N inventory_movements
  User.hasMany(InventoryMovement, { foreignKey: 'userId', as: 'inventoryMovements' });
  InventoryMovement.belongsTo(User, { foreignKey: 'userId', as: 'user' });

  // provinces 1-N cantons
  Province.hasMany(Canton, { foreignKey: 'provinceId', as: 'cantons' });
  Canton.belongsTo(Province, { foreignKey: 'provinceId', as: 'province' });

  // cantons 1-N districts
  Canton.hasMany(District, { foreignKey: 'cantonId', as: 'districts' });
  District.belongsTo(Canton, { foreignKey: 'cantonId', as: 'canton' });

  // districts 1-N addresses (+ province/canton directos para el query de geo)
  District.hasMany(Address, { foreignKey: 'districtId', as: 'addresses' });
  Address.belongsTo(District, { foreignKey: 'districtId', as: 'district' });
  Province.hasMany(Address, { foreignKey: 'provinceId', as: 'addresses' });
  Address.belongsTo(Province, { foreignKey: 'provinceId', as: 'province' });
  Canton.hasMany(Address, { foreignKey: 'cantonId', as: 'addresses' });
  Address.belongsTo(Canton, { foreignKey: 'cantonId', as: 'canton' });

  // addresses 1-1 address_geolocations (0..1)
  Address.hasOne(AddressGeolocation, { foreignKey: 'addressId', as: 'geolocation' });
  AddressGeolocation.belongsTo(Address, { foreignKey: 'addressId', as: 'address' });

  // packages 1-N package_items + presentations 1-N package_items
  Package.hasMany(PackageItem, { foreignKey: 'packageId', as: 'items' });
  PackageItem.belongsTo(Package, { foreignKey: 'packageId', as: 'package' });
  Presentation.hasMany(PackageItem, { foreignKey: 'presentationId', as: 'packageItems' });
  PackageItem.belongsTo(Presentation, { foreignKey: 'presentationId', as: 'presentation' });

  // packages N-M campaigns (via package_campaigns)
  Package.belongsToMany(Campaign, {
    through: { model: PackageCampaign },
    foreignKey: 'packageId',
    otherKey: 'campaignId',
    as: 'campaigns',
  });
  Campaign.belongsToMany(Package, {
    through: { model: PackageCampaign },
    foreignKey: 'campaignId',
    otherKey: 'packageId',
    as: 'packages',
  });
  Package.hasMany(PackageCampaign, { foreignKey: 'packageId', as: 'packageCampaigns' });
  PackageCampaign.belongsTo(Package, { foreignKey: 'packageId', as: 'package' });
  Campaign.hasMany(PackageCampaign, { foreignKey: 'campaignId', as: 'packageCampaigns' });
  PackageCampaign.belongsTo(Campaign, { foreignKey: 'campaignId', as: 'campaign' });

  // presentations 1-N inventory_movements
  Presentation.hasMany(InventoryMovement, { foreignKey: 'presentationId', as: 'inventoryMovements' });
  InventoryMovement.belongsTo(Presentation, { foreignKey: 'presentationId', as: 'presentation' });
}