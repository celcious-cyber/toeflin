import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TestPackage } from '../entities/test-package.entity';

@Injectable()
export class TestPackagesService {
  constructor(
    @InjectRepository(TestPackage)
    private testPackageRepository: Repository<TestPackage>,
  ) {}

  findAll() {
    return this.testPackageRepository.find();
  }

  findOne(id: string) {
    return this.testPackageRepository.findOne({ where: { id } });
  }

  create(data: Partial<TestPackage>) {
    const pkg = this.testPackageRepository.create(data);
    return this.testPackageRepository.save(pkg);
  }

  async update(id: string, data: Partial<TestPackage>) {
    await this.testPackageRepository.update(id, data);
    return this.findOne(id);
  }

  async remove(id: string) {
    await this.testPackageRepository.delete(id);
  }
}
