import { Repository } from 'typeorm';
import { TestPackage } from '../entities/test-package.entity';
export declare class TestPackagesService {
    private testPackageRepository;
    constructor(testPackageRepository: Repository<TestPackage>);
    findAll(): Promise<TestPackage[]>;
    findOne(id: string): Promise<TestPackage | null>;
    create(data: Partial<TestPackage>): Promise<TestPackage>;
    update(id: string, data: Partial<TestPackage>): Promise<TestPackage | null>;
    remove(id: string): Promise<void>;
}
