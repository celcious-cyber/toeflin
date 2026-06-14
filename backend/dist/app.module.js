"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const app_controller_1 = require("./app.controller");
const app_service_1 = require("./app.service");
const auth_module_1 = require("./auth/auth.module");
const questions_module_1 = require("./questions/questions.module");
const media_module_1 = require("./media/media.module");
const test_packages_module_1 = require("./test-packages/test-packages.module");
const score_conversions_module_1 = require("./score-conversions/score-conversions.module");
const test_engine_module_1 = require("./test-engine/test-engine.module");
const users_module_1 = require("./users/users.module");
const config_1 = require("@nestjs/config");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({
                isGlobal: true,
            }),
            typeorm_1.TypeOrmModule.forRootAsync({
                imports: [config_1.ConfigModule],
                inject: [config_1.ConfigService],
                useFactory: (configService) => {
                    const dbType = configService.get('DB_TYPE') || 'sqlite';
                    if (dbType === 'mysql') {
                        return {
                            type: 'mysql',
                            host: configService.get('DB_HOST') || 'localhost',
                            port: configService.get('DB_PORT') || 3306,
                            username: configService.get('DB_USERNAME') || 'root',
                            password: configService.get('DB_PASSWORD') || '',
                            database: configService.get('DB_DATABASE') || 'toeflin',
                            entities: [__dirname + '/**/*.entity{.ts,.js}'],
                            synchronize: true,
                        };
                    }
                    return {
                        type: 'sqljs',
                        location: 'toefl.sqlite',
                        autoSave: true,
                        entities: [__dirname + '/**/*.entity{.ts,.js}'],
                        synchronize: true,
                    };
                },
            }),
            auth_module_1.AuthModule,
            questions_module_1.QuestionsModule,
            media_module_1.MediaModule,
            test_packages_module_1.TestPackagesModule,
            score_conversions_module_1.ScoreConversionsModule,
            test_engine_module_1.TestEngineModule,
            users_module_1.UsersModule,
        ],
        controllers: [app_controller_1.AppController],
        providers: [app_service_1.AppService],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map