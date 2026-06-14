import { Controller, Get, Post, Body, Param, Put, Delete } from '@nestjs/common';
import { TestPackagesService } from './test-packages.service';
import { TestPackage } from '../entities/test-package.entity';

@Controller('test-packages')
export class TestPackagesController {
  constructor(private readonly testPackagesService: TestPackagesService) {}

  @Get()
  findAll() {
    return this.testPackagesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.testPackagesService.findOne(id);
  }

  @Post()
  create(@Body() data: Partial<TestPackage>) {
    return this.testPackagesService.create(data);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() data: Partial<TestPackage>) {
    return this.testPackagesService.update(id, data);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.testPackagesService.remove(id);
  }
}
