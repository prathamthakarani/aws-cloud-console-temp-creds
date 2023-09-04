"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DbConnection = void 0;
const config_1 = require("@nestjs/config");
const entites_1 = require("../entites");
const audit_log_1 = require("../entites/audit.log");
const audit_log_entity_1 = require("../entites/audit.log.entity");
const typeorm_1 = require("typeorm");
exports.DbConnection = [
    {
        provide: 'DataSource',
        useFactory: async () => {
            const datasource = new typeorm_1.DataSource({
                type: 'postgres',
                host: process.env.DB_HOST,
                port: +process.env.DB_PORT,
                username: process.env.DB_USERNAME,
                password: process.env.DB_PASSWORD,
                database: process.env.DB_NAME,
                synchronize: true,
                entities: [entites_1.User, audit_log_entity_1.Log, audit_log_1.AuditLog],
                logging: true,
                ssl: { rejectUnauthorized: false },
            });
            const db = await datasource.initialize();
            console.log('Connected with', process.env.DB_PORT);
            return db;
        },
        inject: [config_1.ConfigService],
    },
];
//# sourceMappingURL=db.service.js.map