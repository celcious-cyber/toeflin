import { Repository } from 'typeorm';
import { Question } from '../entities/question.entity';
import { Passage } from '../entities/passage.entity';
import { Audio } from '../entities/audio.entity';
export declare class QuestionsService {
    private questionRepository;
    private passageRepository;
    private audioRepository;
    constructor(questionRepository: Repository<Question>, passageRepository: Repository<Passage>, audioRepository: Repository<Audio>);
    findAll(): Promise<Question[]>;
    findOne(id: string): Promise<Question | null>;
    create(data: Partial<Question & {
        audioUrl?: string;
        passageTitle?: string;
        passageContent?: string;
    }>): Promise<Question>;
    update(id: string, data: Partial<Question & {
        audioUrl?: string;
        passageTitle?: string;
        passageContent?: string;
    }>): Promise<Question | null>;
    remove(id: string): Promise<void>;
    findAllPassages(): Promise<Passage[]>;
    importFromExcel(buffer: Buffer, packageId?: string): Promise<any>;
    seed(): Promise<any>;
}
