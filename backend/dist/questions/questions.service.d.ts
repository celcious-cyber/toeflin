import { Repository } from 'typeorm';
import { Question } from '../entities/question.entity';
import { Passage } from '../entities/passage.entity';
export declare class QuestionsService {
    private questionRepository;
    private passageRepository;
    constructor(questionRepository: Repository<Question>, passageRepository: Repository<Passage>);
    findAll(): Promise<Question[]>;
    findOne(id: string): Promise<Question | null>;
    create(data: Partial<Question>): Promise<Question>;
    update(id: string, data: Partial<Question>): Promise<Question | null>;
    remove(id: string): Promise<void>;
    importFromExcel(buffer: Buffer): Promise<any>;
    seed(): Promise<any>;
}
