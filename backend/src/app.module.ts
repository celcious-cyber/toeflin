import { Module } from '@nestjs/common';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { QuestionsModule } from './questions/questions.module';
import { MediaModule } from './media/media.module';
import { TestPackagesModule } from './test-packages/test-packages.module';
import { ScoreConversionsModule } from './score-conversions/score-conversions.module';
import { TestEngineModule } from './test-engine/test-engine.module';
import { UsersModule } from './users/users.module';

import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService): TypeOrmModuleOptions => {
        const dbType = configService.get<string>('DB_TYPE') || 'sqlite';
        
        if (dbType === 'mysql') {
          return {
            type: 'mysql',
            host: configService.get<string>('DB_HOST') || 'localhost',
            port: configService.get<number>('DB_PORT') || 3306,
            username: configService.get<string>('DB_USERNAME') || 'root',
            password: configService.get<string>('DB_PASSWORD') || '',
            database: configService.get<string>('DB_DATABASE') || 'toeflin',
            entities: [__dirname + '/**/*.entity{.ts,.js}'],
            synchronize: true, // Gunakan migration di production nyata, sync:true untuk kemudahan setup awal
          };
        }

        // Fallback default lokal ke SQLite
        return {
          type: 'sqlite', // Atau 'sqljs' jika sebelumnya pakai sqljs, tapi 'sqlite' lebih umum di Node
          database: 'toefl.sqlite',
          entities: [__dirname + '/**/*.entity{.ts,.js}'],
          synchronize: true,
        };
      },
    }),
    AuthModule,
    QuestionsModule,
    MediaModule,
    TestPackagesModule,
    ScoreConversionsModule,
    TestEngineModule,
    UsersModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
