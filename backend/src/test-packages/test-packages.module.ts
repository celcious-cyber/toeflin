import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TestPackage } from '../entities/test-package.entity';
import { TestPackagesService } from './test-packages.service';
import { TestPackagesController } from './test-packages.controller';

@Module({
  imports: [TypeOrmModule.forFeature([TestPackage])],
  providers: [TestPackagesService],
  controllers: [TestPackagesController],
})
export class TestPackagesModule {}
