import { Passage } from './passage.entity';
import { Audio } from './audio.entity';
export declare class Question {
    id: string;
    section: string;
    skillCategory: string;
    content: string;
    choices: any;
    answerKey: string;
    explanation: string;
    audio: Audio;
    audioId: string;
    passage: Passage;
    passageId: string;
}
