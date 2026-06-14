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
exports.ScoreConversionsController = void 0;
const common_1 = require("@nestjs/common");
const score_conversions_service_1 = require("./score-conversions.service");
let ScoreConversionsController = class ScoreConversionsController {
    scoreConversionsService;
    constructor(scoreConversionsService) {
        this.scoreConversionsService = scoreConversionsService;
    }
    findAll() {
        return this.scoreConversionsService.findAll();
    }
    createOrUpdate(data) {
        return this.scoreConversionsService.createOrUpdate(data);
    }
    remove(id) {
        return this.scoreConversionsService.remove(+id);
    }
};
exports.ScoreConversionsController = ScoreConversionsController;
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], ScoreConversionsController.prototype, "findAll", null);
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], ScoreConversionsController.prototype, "createOrUpdate", null);
__decorate([
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ScoreConversionsController.prototype, "remove", null);
exports.ScoreConversionsController = ScoreConversionsController = __decorate([
    (0, common_1.Controller)('score-conversions'),
    __metadata("design:paramtypes", [score_conversions_service_1.ScoreConversionsService])
], ScoreConversionsController);
//# sourceMappingURL=score-conversions.controller.js.map