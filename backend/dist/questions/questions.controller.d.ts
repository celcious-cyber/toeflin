import { QuestionsService } from './questions.service';
import { Question } from '../entities/question.entity';
export declare class QuestionsController {
    private readonly questionsService;
    constructor(questionsService: QuestionsService);
    findAll(): Promise<Question[]>;
    findOne(id: string): Promise<Question | null>;
    create(data: Partial<Question>): Promise<Question>;
    update(id: string, data: Partial<Question>): Promise<Question | null>;
    remove(id: string): Promise<void>;
    importExcel(file: any): Promise<any>;
    seed(): Promise<any>;
}
