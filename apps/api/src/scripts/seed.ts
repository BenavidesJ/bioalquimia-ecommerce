import { sequelize } from '../config/database';
import crGeo from './data/cr-geo';
import {
  Aroma,
  Canton,
  Category,
  District,
  Province,
  Role,
  Unit,
  VariantDimension,
  VariantDimensionValue,
} from '../models';

sequelize.options.logging = false;

interface DistrictMap {
  [code: string]: string;
}

interface CantonData {
  nombre: string;
  distritos: DistrictMap;
}

interface Cantons {
  [code: string]: CantonData;
}

interface ProvinceData {
  nombre: string;
  cantones: Cantons;
}

interface GeoData {
  provincias: { [code: string]: ProvinceData };
}

const ROLES = [
  { code: 'CLIENT', name: 'Cliente' },
  { code: 'ADMIN', name: 'Admin' },
];

const CATEGORIES = [
  { name: 'Hogar', skuPrefix: 'HOG', description: '' },
  { name: 'Automotriz', skuPrefix: 'AUT', description: '' },
];

const UNITS = [
  { code: 'LIT', name: 'Litro', symbol: 'L' },
  { code: 'GAL', name: 'Galón', symbol: 'gal' },
  { code: 'PIC', name: 'Pichinga', symbol: 'pic' },
  { code: 'KG', name: 'Kilo', symbol: 'kg' },
  { code: 'U', name: 'Unidad', symbol: 'ud' },
  { code: 'ML', name: 'Mililitro', symbol: 'ml' },
  { code: 'BOT', name: 'Botella', symbol: 'bot' },
];

const VARIANT_DIMENSIONS = [
  { code: 'concentracion', name: 'Concentración' },
  { code: 'accesorio', name: 'Accesorio' },
  { code: 'envase', name: 'Envase' },
  { code: 'tipo_venta', name: 'Tipo de venta' },
];

const VARIANT_DIMENSION_VALUES: Record<string, string[]> = {
  concentracion: ['4%', '6%', '12%'],
  accesorio: ['Pistola', 'Atomizador'],
  envase: ['Botella'],
  tipo_venta: ['Kit', 'Aroma reforzado'],
};

const AROMAS = [
  'FRUTOS ROJOS',
  'CARRO NUEVO',
  'CIPRÉS',
  'CEREZZA',
  'MELOCOTÓN',
  'LAVANDA',
  'CITRONELA',
  'MANZANA CANELA',
  'HIERBAS ALOE',
  'TIERNO ABRIL',
  'BEBÉ',
  'LIMÓN',
  'SANDÍA',
  'BAMBÚ',
  'VAINILLA',
  'PIÑA COLADA',
  'MANZANA VERDE',
  'UVA',
  'FRESA MORA',
];

async function seedRoles(): Promise<void> {
  await Role.bulkCreate(ROLES, { ignoreDuplicates: true });
  console.log(`Seeded ${ROLES.length} roles`);
}

async function seedCategories(): Promise<void> {
  await Category.bulkCreate(CATEGORIES, { ignoreDuplicates: true });
  console.log(`Seeded ${CATEGORIES.length} categories`);
}

async function seedUnits(): Promise<void> {
  await Unit.bulkCreate(UNITS, { ignoreDuplicates: true });
  console.log(`Seeded ${UNITS.length} units`);
}

async function seedVariantDimensions(): Promise<void> {
  await VariantDimension.bulkCreate(VARIANT_DIMENSIONS, { ignoreDuplicates: true });
  let totalValues = 0;
  for (const [code, values] of Object.entries(VARIANT_DIMENSION_VALUES)) {
    const dimension = await VariantDimension.findOne({ where: { code } });
    if (!dimension) {
      throw new Error(`Variant dimension not found: ${code}`);
    }
    const rows = values.map((value, index) => ({
      dimensionId: dimension.id,
      value,
      sortOrder: index,
    }));
    await VariantDimensionValue.bulkCreate(rows, { ignoreDuplicates: true });
    totalValues += values.length;
  }
  console.log(`Seeded ${VARIANT_DIMENSIONS.length} variant dimensions and ${totalValues} values`);
}

async function seedGeo(): Promise<void> {
  const data: GeoData = crGeo as unknown as GeoData;

  let cantonCount = 0;
  let districtCount = 0;

  for (const provinceCode of Object.keys(data.provincias)) {
    const provinceData = data.provincias[provinceCode];
    const [province] = await Province.findOrCreate({
      where: { name: provinceData.nombre },
      defaults: { name: provinceData.nombre },
    });

    for (const cantonCode of Object.keys(provinceData.cantones)) {
      const cantonData = provinceData.cantones[cantonCode];
      const [canton] = await Canton.findOrCreate({
        where: { provinceId: province.id, name: cantonData.nombre },
        defaults: { provinceId: province.id, name: cantonData.nombre },
      });

      const districts = Object.values(cantonData.distritos).map((name) => ({
        cantonId: canton.id,
        name,
      }));
      await District.bulkCreate(districts, { ignoreDuplicates: true });

      cantonCount += 1;
      districtCount += districts.length;
    }
  }

  console.log(`Seeded ${Object.keys(data.provincias).length} provinces, ${cantonCount} cantons, ${districtCount} districts`);
}

async function seedAromas(): Promise<void> {
  await Aroma.bulkCreate(AROMAS.map((name) => ({ name })), { ignoreDuplicates: true });
  console.log(`Seeded ${AROMAS.length} aromas`);
}

async function main(): Promise<void> {
  try {
    await sequelize.authenticate();
    console.log('Database connection established');

    await seedRoles();
    await seedCategories();
    await seedUnits();
    await seedVariantDimensions();
    await seedGeo();
    await seedAromas();

    console.log('Seed completed successfully');
  } catch (error) {
    console.error('Failed to seed database:', error);
    process.exitCode = 1;
  } finally {
    await sequelize.close();
  }
}

void main();