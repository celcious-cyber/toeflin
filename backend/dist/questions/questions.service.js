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
const audio_entity_1 = require("../entities/audio.entity");
const ExcelJS = __importStar(require("exceljs"));
let QuestionsService = class QuestionsService {
    questionRepository;
    passageRepository;
    audioRepository;
    constructor(questionRepository, passageRepository, audioRepository) {
        this.questionRepository = questionRepository;
        this.passageRepository = passageRepository;
        this.audioRepository = audioRepository;
    }
    async findAll() {
        return this.questionRepository.find({ relations: { passage: true, audio: true } });
    }
    async findOne(id) {
        return this.questionRepository.findOne({ where: { id }, relations: { passage: true, audio: true } });
    }
    async create(data) {
        const { audioUrl, passageTitle, passageContent, ...questionData } = data;
        if (questionData.passageId === '' || questionData.passageId === 'new') {
            questionData.passageId = null;
        }
        const question = this.questionRepository.create(questionData);
        if (audioUrl) {
            const audio = this.audioRepository.create({ fileUrl: audioUrl });
            const savedAudio = await this.audioRepository.save(audio);
            question.audio = savedAudio;
            question.audioId = savedAudio.id;
        }
        if (passageTitle) {
            let passage = await this.passageRepository.findOne({ where: { title: passageTitle } });
            if (!passage) {
                passage = this.passageRepository.create({ title: passageTitle, content: passageContent || '' });
                passage = await this.passageRepository.save(passage);
            }
            else if (passageContent && passage.content !== passageContent) {
                passage.content = passageContent;
                passage = await this.passageRepository.save(passage);
            }
            question.passage = passage;
            question.passageId = passage.id;
        }
        return this.questionRepository.save(question);
    }
    async update(id, data) {
        const { audioUrl, passageTitle, passageContent, ...questionData } = data;
        const existing = await this.findOne(id);
        if (!existing)
            return null;
        if (audioUrl) {
            if (existing.audio) {
                existing.audio.fileUrl = audioUrl;
                await this.audioRepository.save(existing.audio);
            }
            else {
                const audio = this.audioRepository.create({ fileUrl: audioUrl });
                const savedAudio = await this.audioRepository.save(audio);
                questionData.audioId = savedAudio.id;
            }
        }
        if (passageTitle !== undefined) {
            if (passageTitle) {
                let passage = await this.passageRepository.findOne({ where: { title: passageTitle } });
                if (!passage) {
                    passage = this.passageRepository.create({ title: passageTitle, content: passageContent || '' });
                    passage = await this.passageRepository.save(passage);
                }
                else if (passageContent && passage.content !== passageContent) {
                    passage.content = passageContent;
                    passage = await this.passageRepository.save(passage);
                }
                questionData.passageId = passage.id;
            }
            else {
                questionData.passageId = null;
            }
        }
        else if (questionData.passageId === '') {
            questionData.passageId = null;
        }
        await this.questionRepository.update(id, questionData);
        return this.findOne(id);
    }
    async remove(id) {
        await this.questionRepository.delete(id);
    }
    async findAllPassages() {
        return this.passageRepository.find();
    }
    async generateTemplate() {
        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet('Template Import Soal');
        worksheet.columns = [
            { header: 'Section', key: 'section', width: 15 },
            { header: 'Skill Category', key: 'skillCategory', width: 20 },
            { header: 'Content', key: 'content', width: 50 },
            { header: 'Choice A', key: 'choiceA', width: 25 },
            { header: 'Choice B', key: 'choiceB', width: 25 },
            { header: 'Choice C', key: 'choiceC', width: 25 },
            { header: 'Choice D', key: 'choiceD', width: 25 },
            { header: 'Answer Key', key: 'answerKey', width: 15 },
            { header: 'Explanation', key: 'explanation', width: 40 },
            { header: 'Audio URL', key: 'audioUrl', width: 20 },
            { header: 'Passage Title', key: 'passageTitle', width: 25 },
            { header: 'Passage Content', key: 'passageContent', width: 60 },
        ];
        const headerRow = worksheet.getRow(1);
        headerRow.font = { bold: true, color: { argb: 'FFFFFFFF' } };
        headerRow.fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: 'FFEA580C' },
        };
        headerRow.alignment = { vertical: 'middle', horizontal: 'center' };
        headerRow.height = 25;
        worksheet.addRow({
            section: 'Listening',
            skillCategory: 'Part A',
            content: 'Where is the conversation taking place?',
            choiceA: 'At a bakery',
            choiceB: 'In a library',
            choiceC: 'At a post office',
            choiceD: 'In a classroom',
            answerKey: 'B',
            explanation: 'The speaker mentions checking out books, indicating a library.',
            audioUrl: '/uploads/example-listening.mp3',
            passageTitle: '',
            passageContent: '',
        });
        worksheet.addRow({
            section: 'Structure',
            skillCategory: 'Subject-Verb Agreement',
            content: 'The committee members _____ disagreeing on the new proposal.',
            choiceA: 'is',
            choiceB: 'are',
            choiceC: 'was',
            choiceD: 'has',
            answerKey: 'B',
            explanation: 'The subject "members" is plural, so we use "are".',
            audioUrl: '',
            passageTitle: '',
            passageContent: '',
        });
        worksheet.addRow({
            section: 'Reading',
            skillCategory: 'Main Idea',
            content: 'What is the main purpose of the TOEFL test?',
            choiceA: 'To test native speakers',
            choiceB: 'To measure English ability of non-native speakers',
            choiceC: 'To teach linguistics',
            choiceD: 'To enroll in any university',
            answerKey: 'B',
            explanation: 'Paragraph 1 mentions it is a standardized test for non-native speakers.',
            audioUrl: '',
            passageTitle: 'The History of TOEFL',
            passageContent: 'The Test of English as a Foreign Language (TOEFL) is a standardized test to measure the English language ability of non-native speakers wishing to enroll in English-speaking universities. The test is accepted by many English-speaking academic and professional institutions.',
        });
        worksheet.addRow({
            section: 'Reading',
            skillCategory: 'Vocabulary',
            content: 'The word "accepted" in paragraph 1 is closest in meaning to...',
            choiceA: 'rejected',
            choiceB: 'approved',
            choiceC: 'suspected',
            choiceD: 'ignored',
            answerKey: 'B',
            explanation: '"Accepted" here means recognized or approved.',
            audioUrl: '',
            passageTitle: 'The History of TOEFL',
            passageContent: 'The Test of English as a Foreign Language (TOEFL) is a standardized test to measure the English language ability of non-native speakers wishing to enroll in English-speaking universities. The test is accepted by many English-speaking academic and professional institutions.',
        });
        const buffer = await workbook.xlsx.writeBuffer();
        return Buffer.from(buffer);
    }
    async importFromExcel(buffer, packageId) {
        const workbook = new ExcelJS.Workbook();
        await workbook.xlsx.load(buffer);
        const worksheet = workbook.worksheets[0];
        const allPassages = await this.passageRepository.find();
        const passageMap = new Map();
        for (const p of allPassages) {
            passageMap.set(p.title.toLowerCase().trim(), p);
        }
        const allAudios = await this.audioRepository.find();
        const audioMap = new Map();
        for (const a of allAudios) {
            audioMap.set(a.fileUrl.toLowerCase().trim(), a);
        }
        const questionsToSave = [];
        const rows = [];
        worksheet.eachRow((row, rowNumber) => {
            if (rowNumber > 1) {
                rows.push(row);
            }
        });
        for (const row of rows) {
            const section = row.getCell(1).value?.toString() || '';
            const skillCategory = row.getCell(2).value?.toString() || undefined;
            const content = row.getCell(3).value?.toString() || '';
            const choiceA = row.getCell(4).value?.toString() || '';
            const choiceB = row.getCell(5).value?.toString() || '';
            const choiceC = row.getCell(6).value?.toString() || '';
            const choiceD = row.getCell(7).value?.toString() || '';
            const answerKey = row.getCell(8).value?.toString() || '';
            const explanation = row.getCell(9).value?.toString() || undefined;
            const audioUrl = row.getCell(10).value?.toString()?.trim();
            const passageTitle = row.getCell(11).value?.toString()?.trim();
            const passageContent = row.getCell(12).value?.toString()?.trim();
            let audio = null;
            if (audioUrl) {
                const audioKey = audioUrl.toLowerCase();
                const existingAudio = audioMap.get(audioKey);
                if (existingAudio) {
                    audio = existingAudio;
                }
                else {
                    const newAudio = this.audioRepository.create({ fileUrl: audioUrl });
                    audio = await this.audioRepository.save(newAudio);
                    audioMap.set(audioKey, audio);
                }
            }
            let passage = null;
            if (passageTitle) {
                const passageKey = passageTitle.toLowerCase();
                const existingPassage = passageMap.get(passageKey);
                if (existingPassage) {
                    passage = existingPassage;
                    if (passageContent && passage.content !== passageContent) {
                        passage.content = passageContent;
                        passage = await this.passageRepository.save(passage);
                        passageMap.set(passageKey, passage);
                    }
                }
                else {
                    const newPassage = this.passageRepository.create({
                        title: passageTitle,
                        content: passageContent || '',
                    });
                    passage = await this.passageRepository.save(newPassage);
                    passageMap.set(passageKey, passage);
                }
            }
            const questionData = {
                section,
                skillCategory,
                content,
                choices: {
                    a: choiceA,
                    b: choiceB,
                    c: choiceC,
                    d: choiceD,
                },
                answerKey,
                explanation,
                packageId: packageId || null,
                audioId: audio ? audio.id : null,
                passageId: passage ? passage.id : null,
            };
            const question = this.questionRepository.create(questionData);
            questionsToSave.push(question);
        }
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
    __param(2, (0, typeorm_1.InjectRepository)(audio_entity_1.Audio)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository])
], QuestionsService);
//# sourceMappingURL=questions.service.js.map