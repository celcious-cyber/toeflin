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
    audio: Audio | null;
    audioId: string | null;
    passage: Passage | null;
    passageId: string | null;
    package: TestPackage | null;
    packageId: string | null;
}
