"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.QuestionsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const question_entity_1 = require("../entities/question.entity");
const passage_entity_1 = require("../entities/passage.entity");
const ExcelJS = __importStar(require("exceljs"));
let QuestionsService = class QuestionsService {
    questionRepository;
    passageRepository;
    constructor(questionRepository, passageRepository) {
        this.questionRepository = questionRepository;
        this.passageRepository = passageRepository;
    }
    async findAll() {
        return this.questionRepository.find({ relations: { passage: true, audio: true } });
    }
    async findOne(id) {
        return this.questionRepository.findOne({ where: { id }, relations: { passage: true, audio: true } });
    }
    async create(data) {
        const question = this.questionRepository.create(data);
        return this.questionRepository.save(question);
    }
    async update(id, data) {
        await this.questionRepository.update(id, data);
        return this.findOne(id);
    }
    async remove(id) {
        await this.questionRepository.delete(id);
    }
    async importFromExcel(buffer) {
        const workbook = new ExcelJS.Workbook();
        await workbook.xlsx.load(buffer);
        const worksheet = workbook.worksheets[0];
        const questionsToSave = [];
        worksheet.eachRow((row, rowNumber) => {
            if (rowNumber === 1)
                return;
            const question = this.questionRepository.create({
                section: row.getCell(1).value?.toString() || '',
                skillCategory: row.getCell(2).value?.toString(),
                content: row.getCell(3).value?.toString() || '',
                choices: {
                    a: row.getCell(4).value?.toString(),
                    b: row.getCell(5).value?.toString(),
                    c: row.getCell(6).value?.toString(),
                    d: row.getCell(7).value?.toString(),
                },
                answerKey: row.getCell(8).value?.toString() || '',
                explanation: row.getCell(9).value?.toString(),
            });
            questionsToSave.push(question);
        });
        await this.questionRepository.save(questionsToSave);
        return { importedCount: questionsToSave.length };
    }
    async seed() {
        const passage = this.passageRepository.create({
            title: 'The History of TOEFL',
            content: 'The Test of English as a Foreign Language (TOEFL) is a standardized test to measure the English language ability of non-native speakers wishing to enroll in English-speaking universities. The test is accepted by many English-speaking academic and professional institutions. TOEFL is one of the two major English-language tests in the world, the other being the IELTS.\n\nThe TOEFL test was originally developed at the Center for Applied Linguistics under the direction of applied linguist Dr. Charles A. Ferguson.'
        });
        const savedPassage = await this.passageRepository.save(passage);
        const questions = [
            {
                section: 'Reading',
                content: 'What is the main purpose of the TOEFL test?',
                choices: {
                    a: 'To test native speakers',
                    b: 'To measure English ability of non-native speakers',
                    c: 'To teach linguistics',
                    d: 'To enroll in any university'
                },
                answerKey: 'B',
                passage: savedPassage
            },
            {
                section: 'Reading',
                content: 'Who directed the original development of the TOEFL test?',
                choices: {
                    a: 'Dr. Charles A. Ferguson',
                    b: 'A non-native speaker',
                    c: 'The IELTS committee',
                    d: 'An anonymous linguist'
                },
                answerKey: 'A',
                passage: savedPassage
            },
            {
                section: 'Listening',
                content: 'Which of the following is NOT a major English test mentioned?',
                choices: {
                    a: 'TOEFL',
                    b: 'IELTS',
                    c: 'TOEIC',
                    d: 'None of the above'
                },
                answerKey: 'C'
            }
        ];
        for (const q of questions) {
            await this.questionRepository.save(this.questionRepository.create(q));
        }
        return { message: 'Database seeded with dummy Reading passage and questions' };
    }
};
exports.QuestionsService = QuestionsService;
exports.QuestionsService = QuestionsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(question_entity_1.Question)),
    __param(1, (0, typeorm_1.InjectRepository)(passage_entity_1.Passage)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository])
], QuestionsService);
//# sourceMappingURL=questions.service.js.map