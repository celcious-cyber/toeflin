import { Passage } from './passage.entity';
import { Audio } from './audio.entity';
import { TestPackage } from './test-package.entity';
export declare class Question {
    id: string;
    section: string;
    skillCategory: string;
    content: string;
    choices: any;
    answerKey: string;
    explanation: string;
    audio: Audio;
    audioId: string | null;
    passage: Passage;
    passageId: string | null;
    package: TestPackage;
    packageId: string | null;
}
