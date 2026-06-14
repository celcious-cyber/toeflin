import { TestPackagesService } from './test-packages.service';
import { TestPackage } from '../entities/test-package.entity';
export declare class TestPackagesController {
    private readonly testPackagesService;
    constructor(testPackagesService: TestPackagesService);
    findAll(): Promise<TestPackage[]>;
    findOne(id: string): Promise<TestPackage | null>;
    create(data: Partial<TestPackage>): Promise<TestPackage>;
    update(id: string, data: Partial<TestPackage>): Promise<TestPackage | null>;
    remove(id: string): Promise<void>;
}
