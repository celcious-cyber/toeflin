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
exports.TestEngineService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const test_attempt_entity_1 = require("../entities/test-attempt.entity");
const test_package_entity_1 = require("../entities/test-package.entity");
const score_conversion_entity_1 = require("../entities/score-conversion.entity");
const test_request_entity_1 = require("../entities/test-request.entity");
const question_entity_1 = require("../entities/question.entity");
let TestEngineService = class TestEngineService {
    attemptRepo;
    pkgRepo;
    scoreRepo;
    reqRepo;
    questionRepo;
    constructor(attemptRepo, pkgRepo, scoreRepo, reqRepo, questionRepo) {
        this.attemptRepo = attemptRepo;
        this.pkgRepo = pkgRepo;
        this.scoreRepo = scoreRepo;
        this.reqRepo = reqRepo;
        this.questionRepo = questionRepo;
    }
    async startTest(userId, packageId) {
        const pkg = await this.pkgRepo.findOne({ where: { id: packageId } });
        if (!pkg)
            throw new common_1.BadRequestException('Package not found');
        if (pkg.type === 'Full Test') {
            const lastAttempt = await this.attemptRepo.findOne({
                where: { userId, packageId },
                order: { date: 'DESC' },
            });
            if (lastAttempt) {
                const diffMs = Date.now() - new Date(lastAttempt.date).getTime();
                if (diffMs < 7 * 24 * 60 * 60 * 1000) {
                    const approvedReq = await this.reqRepo.findOne({
                        where: { userId, packageId, status: test_request_entity_1.RequestStatus.APPROVED },
                    });
                    if (approvedReq) {
                        approvedReq.status = test_request_entity_1.RequestStatus.USED;
                        await this.reqRepo.save(approvedReq);
                    }
                    else {
                        throw new common_1.BadRequestException({
                            message: 'Uuups! Kesempatan kamu sudah habis, silakan mencoba minggu depan yahh 😊',
                            code: 'WEEKLY_LIMIT_REACHED'
                        });
                    }
                }
            }
        }
        const attempt = this.attemptRepo.create({
            userId,
            packageId,
            answers: {},
            durationSeconds: 0,
        });
        return this.attemptRepo.save(attempt);
    }
    async saveAnswers(attemptId, answers, durationSeconds) {
        await this.attemptRepo.update(attemptId, { answers, durationSeconds });
        return { success: true };
    }
    async submitTest(attemptId) {
        const attempt = await this.attemptRepo.findOne({ where: { id: attemptId } });
        if (!attempt)
            throw new common_1.BadRequestException('Attempt not found');
        const allQuestions = await this.questionRepo.find();
        const questionsMap = new Map();
        allQuestions.forEach(q => {
            questionsMap.set(q.id, q);
        });
        const answers = attempt.answers || {};
        let correctListening = 0;
        let correctStructure = 0;
        let correctReading = 0;
        let totalListening = 0;
        let totalStructure = 0;
        let totalReading = 0;
        allQuestions.forEach(q => {
            const sec = q.section.toLowerCase();
            if (sec === 'listening')
                totalListening++;
            else if (sec === 'structure')
                totalStructure++;
            else if (sec === 'reading')
                totalReading++;
        });
        Object.entries(answers).forEach(([qId, val]) => {
            const question = questionsMap.get(qId);
            if (question) {
                const isCorrect = val && question.answerKey && val.toString().trim().toLowerCase() === question.answerKey.toString().trim().toLowerCase();
                const sec = question.section.toLowerCase();
                if (sec === 'listening') {
                    if (isCorrect)
                        correctListening++;
                }
                else if (sec === 'structure') {
                    if (isCorrect)
                        correctStructure++;
                }
                else if (sec === 'reading') {
                    if (isCorrect)
                        correctReading++;
                }
            }
        });
        attempt.rawScores = {
            listening: correctListening,
            structure: correctStructure,
            reading: correctReading,
        };
        const getScaled = async (sectionName, rawScore, totalQuestions, isReading) => {
            const dbConversion = await this.scoreRepo.findOne({
                where: { section: sectionName, rawScore: rawScore }
            });
            if (dbConversion) {
                return dbConversion.scaledScore;
            }
            if (totalQuestions <= 0)
                return 31;
            const maxScaled = isReading ? 67 : 68;
            const minScaled = 31;
            return Math.round(minScaled + (rawScore / totalQuestions) * (maxScaled - minScaled));
        };
        const scaledListening = await getScaled('Listening', correctListening, totalListening, false);
        const scaledStructure = await getScaled('Structure', correctStructure, totalStructure, false);
        const scaledReading = await getScaled('Reading', correctReading, totalReading, true);
        attempt.scaledScores = {
            listening: scaledListening,
            structure: scaledStructure,
            reading: scaledReading,
        };
        attempt.totalScore = Math.round(((scaledListening + scaledStructure + scaledReading) / 3) * 10);
        await this.attemptRepo.save(attempt);
        return attempt;
    }
    async requestAttempt(userId, packageId) {
        const existingReq = await this.reqRepo.findOne({
            where: { userId, packageId, status: test_request_entity_1.RequestStatus.PENDING },
        });
        if (existingReq) {
            throw new common_1.BadRequestException('Anda sudah memiliki permohonan yang sedang menunggu persetujuan.');
        }
        const newReq = this.reqRepo.create({ userId, packageId });
        return this.reqRepo.save(newReq);
    }
    async getRequests() {
        return this.reqRepo.find({ order: { createdAt: 'DESC' } });
    }
    async updateRequestStatus(id, status) {
        const req = await this.reqRepo.findOne({ where: { id } });
        if (!req)
            throw new common_1.BadRequestException('Request not found');
        req.status = status;
        return this.reqRepo.save(req);
    }
};
exports.TestEngineService = TestEngineService;
exports.TestEngineService = TestEngineService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(test_attempt_entity_1.TestAttempt)),
    __param(1, (0, typeorm_1.InjectRepository)(test_package_entity_1.TestPackage)),
    __param(2, (0, typeorm_1.InjectRepository)(score_conversion_entity_1.ScoreConversion)),
    __param(3, (0, typeorm_1.InjectRepository)(test_request_entity_1.TestRequest)),
    __param(4, (0, typeorm_1.InjectRepository)(question_entity_1.Question)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository])
], TestEngineService);
//# sourceMappingURL=test-engine.service.js.map