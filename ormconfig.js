const databasePaths = {
    development: {
        entities: ['./src/modules/**/infra/typeorm/entities/*.ts'],
        migrations: ['./src/shared/infra/typeorm/migrations/*.ts'],
        migrationsDir: './src/shared/infra/typeorm/migrations',
        schemas: ['./src/modules/**/infra/typeorm/schemas/*.ts'],
    },
    production: {
        entities: ['./dist/modules/**/infra/typeorm/entities/*.js'],
        migrations: ['./dist/shared/infra/typeorm/migrations/*.js'],
        migrationsDir: './dist/shared/infra/typeorm/migrations',
        schemas: ['./dist/modules/**/infra/typeorm/schemas/*.js'],
    },
};

module.exports = [
    {
        name: 'default',
        type: 'postgres',
        host: process.env.DATABASE_HOST,
        port: process.env.DATABASE_PORT,
        username: process.env.DATABASE_USER,
        password: process.env.DATABASE_PASSWORD,
        database: process.env.DATABASE_NAME,
        entities: databasePaths[process.env.APP_ENV].entities,
        migrations: databasePaths[process.env.APP_ENV].migrations,
        cli: {
            migrationsDir: databasePaths[process.env.APP_ENV].migrationsDir,
        },
    },
    {
        name: 'mongo',
        type: 'mongodb',
        host: process.env.MONGO_HOST,
        port: process.env.MONGO_PORT,
        database: process.env.MONGO_DATABASE,
        username: process.env.MONGO_USERNAME,
        password: process.env.MONGO_PASSWORD,
        useUnifiedTopology: true,
        entities: databasePaths[process.env.APP_ENV].schemas,
    },
];
