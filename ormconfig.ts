import { SnakeNamingStrategy } from 'typeorm-naming-strategies';

export = [
  {
    type: 'postgres',
    url: process.env.DB_URL,

    entities: ['./dist/**/*.entity{.ts,.js}'],
    migrations: ['./dist/migrations/*{.ts,.js}'],
    cli: {
      migrationsDir: 'migrations',
    },
    logging: false,
    synchronize: false,
    migrationsRun: false,
    namingStrategy: new SnakeNamingStrategy(),
  },
  {
    name: 'seed',
    type: 'postgres',
    url: process.env.DB_URL,

    entities: ['./dist/**/*.entity{.ts,.js}'],
    migrations: ['./dist/seeds/*{.ts,.js}'],
    cli: {
      migrationsDir: 'seeds',
    },
    logging: true,
    synchronize: false,
    migrationsRun: true,
    namingStrategy: new SnakeNamingStrategy(),
  },
];
