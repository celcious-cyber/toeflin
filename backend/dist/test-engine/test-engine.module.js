"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TestEngineModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const test_attempt_entity_1 = require("../entities/test-attempt.entity");
const test_package_entity_1 = require("../entities/test-package.entity");
const score_conversion_entity_1 = require("../entities/score-conversion.entity");
const test_request_entity_1 = require("../entities/test-request.entity");
const question_entity_1 = require("../entities/question.entity");
const test_engine_service_1 = require("./test-engine.service");
const test_engine_controller_1 = require("./test-engine.controller");
let TestEngineModule = class TestEngineModule {
};
exports.TestEngineModule = TestEngineModule;
exports.TestEngineModule = TestEngineModule = __decorate([
    (0, common_1.Module)({
        imports: [typeorm_1.TypeOrmModule.forFeature([test_attempt_entity_1.TestAttempt, test_package_entity_1.TestPackage, score_conversion_entity_1.ScoreConversion, test_request_entity_1.TestRequest, question_entity_1.Question])],
        providers: [test_engine_service_1.TestEngineService],
        controllers: [test_engine_controller_1.TestEngineController],
    })
], TestEngineModule);
//# sourceMappingURL=test-engine.module.js.map