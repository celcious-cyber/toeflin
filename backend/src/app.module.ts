import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { QuestionsModule } from './questions/questions.module';
import { MediaModule } from './media/media.module';
import { TestPackagesModule } from './test-packages/test-packages.module';
import { ScoreConversionsModule } from './score-conversions/score-conversions.module';
import { TestEngineModule } from './test-engine/test-engine.module';
import { UsersModule } from './users/users.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'sqljs',
      location: 'toefl.sqlite',
      autoSave: true,
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      synchronize: true,
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
