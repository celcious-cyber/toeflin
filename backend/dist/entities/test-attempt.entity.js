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
Object.defineProperty(exports, "__esModule", { value: true });
exports.TestAttempt = void 0;
const typeorm_1 = require("typeorm");
const user_entity_1 = require("./user.entity");
const test_package_entity_1 = require("./test-package.entity");
let TestAttempt = class TestAttempt {
    id;
    user;
    userId;
    testPackage;
    packageId;
    date;
    durationSeconds;
    answers;
    rawScores;
    scaledScores;
    totalScore;
};
exports.TestAttempt = TestAttempt;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], TestAttempt.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.User),
    (0, typeorm_1.JoinColumn)({ name: 'userId' }),
    __metadata("design:type", user_entity_1.User)
], TestAttempt.prototype, "user", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], TestAttempt.prototype, "userId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => test_package_entity_1.TestPackage),
    (0, typeorm_1.JoinColumn)({ name: 'packageId' }),
    __metadata("design:type", test_package_entity_1.TestPackage)
], TestAttempt.prototype, "testPackage", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], TestAttempt.prototype, "packageId", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], TestAttempt.prototype, "date", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], TestAttempt.prototype, "durationSeconds", void 0);
__decorate([
    (0, typeorm_1.Column)('simple-json'),
    __metadata("design:type", Object)
], TestAttempt.prototype, "answers", void 0);
__decorate([
    (0, typeorm_1.Column)('simple-json', { nullable: true }),
    __metadata("design:type", Object)
], TestAttempt.prototype, "rawScores", void 0);
__decorate([
    (0, typeorm_1.Column)('simple-json', { nullable: true }),
    __metadata("design:type", Object)
], TestAttempt.prototype, "scaledScores", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", Number)
], TestAttempt.prototype, "totalScore", void 0);
exports.TestAttempt = TestAttempt = __decorate([
    (0, typeorm_1.Entity)('test_attempts')
], TestAttempt);
//# sourceMappingURL=test-attempt.entity.js.map