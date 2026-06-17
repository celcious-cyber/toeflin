"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TestEngineController = void 0;
const common_1 = require("@nestjs/common");
const test_engine_service_1 = require("./test-engine.service");
const test_request_entity_1 = require("../entities/test-request.entity");
let TestEngineController = class TestEngineController {
    testEngineService;
    constructor(testEngineService) {
        this.testEngineService = testEngineService;
    }
    startTest(body) {
        return this.testEngineService.startTest(body.userId, body.packageId);
    }
    saveAnswers(id, body) {
        return this.testEngineService.saveAnswers(id, body.answers, body.durationSeconds);
    }
    submitTest(id) {
        return this.testEngineService.submitTest(id);
    }
    requestAttempt(body) {
        return this.testEngineService.requestAttempt(body.userId, body.packageId);
    }
    getUserAttempts(userId) {
        return this.testEngineService.getUserAttempts(userId);
    }
    getRequests() {
        return this.testEngineService.getRequests();
    }
    updateRequestStatus(id, status) {
        return this.testEngineService.updateRequestStatus(id, status);
    }
};
exports.TestEngineController = TestEngineController;
__decorate([
    (0, common_1.Post)('start'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], TestEngineController.prototype, "startTest", null);
__decorate([
    (0, common_1.Post)(':id/save'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], TestEngineController.prototype, "saveAnswers", null);
__decorate([
    (0, common_1.Post)(':id/submit'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], TestEngineController.prototype, "submitTest", null);
__decorate([
    (0, common_1.Post)('request-attempt'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], TestEngineController.prototype, "requestAttempt", null);
__decorate([
    (0, common_1.Get)('attempts/user/:userId'),
    __param(0, (0, common_1.Param)('userId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], TestEngineController.prototype, "getUserAttempts", null);
__decorate([
    (0, common_1.Get)('requests'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], TestEngineController.prototype, "getRequests", null);
__decorate([
    (0, common_1.Put)('requests/:id/status'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)('status')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], TestEngineController.prototype, "updateRequestStatus", null);
exports.TestEngineController = TestEngineController = __decorate([
    (0, common_1.Controller)('test-engine'),
    __metadata("design:paramtypes", [test_engine_service_1.TestEngineService])
], TestEngineController);
//# sourceMappingURL=test-engine.controller.js.map