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
exports.ScoreConversionsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const score_conversion_entity_1 = require("../entities/score-conversion.entity");
let ScoreConversionsService = class ScoreConversionsService {
    scoreConversionRepository;
    constructor(scoreConversionRepository) {
        this.scoreConversionRepository = scoreConversionRepository;
    }
    findAll() {
        return this.scoreConversionRepository.find();
    }
    async createOrUpdate(data) {
        const existing = await this.scoreConversionRepository.findOne({
            where: { section: data.section, rawScore: data.rawScore }
        });
        if (existing) {
            await this.scoreConversionRepository.update(existing.id, { scaledScore: data.scaledScore });
            return this.scoreConversionRepository.findOne({ where: { id: existing.id } });
        }
        else {
            const conversion = this.scoreConversionRepository.create(data);
            return this.scoreConversionRepository.save(conversion);
        }
    }
    async remove(id) {
        await this.scoreConversionRepository.delete(id);
    }
};
exports.ScoreConversionsService = ScoreConversionsService;
exports.ScoreConversionsService = ScoreConversionsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(score_conversion_entity_1.ScoreConversion)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], ScoreConversionsService);
//# sourceMappingURL=score-conversions.service.js.map