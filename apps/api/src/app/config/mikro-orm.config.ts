import {
  defineConfig,
  PopulateHint,
  PostgreSqlDriver,
  ReflectMetadataProvider,
  UnderscoreNamingStrategy,
} from '@mikro-orm/postgresql';
import { Migrator } from '@mikro-orm/migrations';
import { SeedManager } from '@mikro-orm/seeder';
import { Logger } from '@nestjs/common';
import { config as dotenvConfig } from 'dotenv';
import { entities } from '../entities';
import { migrations } from '../../migrations';

// Load env file when running via MikroORM CLI (MIKRO_ORM_ENV is set by the CLI commands).
// In the NestJS context, env vars are already set, so this is a no-op.
if (process.env.MIKRO_ORM_ENV) {
  dotenvConfig({ path: process.env.MIKRO_ORM_ENV });
}

const isProduction = process.env.NODE_ENV === 'production';

export default defineConfig({
  metadataProvider: ReflectMetadataProvider,
  driver: PostgreSqlDriver,

  host: process.env.API_DB_HOST || 'localhost',
  port: parseInt(process.env.API_DB_PORT || '35432'),
  dbName: process.env.API_DB_NAME || 'template',
  user: process.env.API_DB_USER || 'template',
  password: process.env.API_DB_PASSWORD || 'templatePWD',

  entities: entities,

  extensions: [Migrator, SeedManager],

  serialization: {
    forceObject: true,
    includePrimaryKeys: true,
  },

  migrations: {
    tableName: 'mikro_orm_migrations',
    pathTs: './apps/api/src/migrations',
    migrationsList: migrations,

    snapshot: true,
    emit: 'ts',

    allOrNothing: true,
    transactional: true,
  },

  seeder: {
    pathTs: './apps/api/src/seeders',
  },

  populateAfterFlush: true,
  preferTs: true,

  assign: {
    updateByPrimaryKey: true,
    merge: false,
    mergeEmbeddedProperties: true,
    mergeObjectProperties: true,
    updateNestedEntities: true,
    convertCustomTypes: false,
    onlyProperties: true,
  },
  autoJoinOneToOneOwner: true,
  forceUtcTimezone: true,
  charset: 'utf8',
  ignoreUndefinedInQuery: true,
  populateWhere: PopulateHint.ALL,

  validate: true,
  strict: true,

  logger: (message: string) => {
    // Avoid logging full refresh token arrays in production
    if (isProduction && message.includes('"refresh_tokens"')) {
      return;
    }
    Logger.log(message);
  },
  debug: !isProduction,
  colors: true,

  namingStrategy: UnderscoreNamingStrategy,
});
