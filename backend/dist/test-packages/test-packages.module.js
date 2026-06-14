"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TestPackagesModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const test_package_entity_1 = require("../entities/test-package.entity");
const test_packages_service_1 = require("./test-packages.service");
const test_packages_controller_1 = require("./test-packages.controller");
let TestPackagesModule = class TestPackagesModule {
};
exports.TestPackagesModule = TestPackagesModule;
exports.TestPackagesModule = TestPackagesModule = __decorate([
    (0, common_1.Module)({
        imports: [typeorm_1.TypeOrmModule.forFeature([test_package_entity_1.TestPackage])],
        providers: [test_packages_service_1.TestPackagesService],
        controllers: [test_packages_controller_1.TestPackagesController],
    })
], TestPackagesModule);
//# sourceMappingURL=test-packages.module.js.map