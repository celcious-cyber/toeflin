import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { UsersService } from './users/users.service';
import { TestPackagesService } from './test-packages/test-packages.service';
import { QuestionsService } from './questions/questions.service';
import * as bcrypt from 'bcrypt';
import { UserRole } from './entities/user.entity';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();

  // ── Seed Admin User ──
  const usersService = app.get(UsersService);
  const adminExists = await usersService.findOneByEmail('admin@cordova.ac.id');
  if (!adminExists) {
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash('admin123', salt);
    await usersService.create({
      name: 'Super Admin',
      email: 'admin@cordova.ac.id',
      passwordHash,
      role: UserRole.ADMIN,
    });
    console.log('✅ Admin seeded: admin@cordova.ac.id / admin123');
  }

  // ── Seed Demo Student ──
  const studentExists = await usersService.findOneByEmail('mahasiswa@cordova.ac.id');
  if (!studentExists) {
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash('student123', salt);
    await usersService.create({
      name: 'Demo Mahasiswa',
      email: 'mahasiswa@cordova.ac.id',
      passwordHash,
      role: UserRole.STUDENT,
    });
    console.log('✅ Student seeded: mahasiswa@cordova.ac.id / student123');
  }

  // ── Seed Test Packages ──
  const pkgService = app.get(TestPackagesService);
  const existingPkgs = await pkgService.findAll();
  if (existingPkgs.length === 0) {
    const packages = [
      {
        name: 'TOEFL ITP Simulation - Full Test #1',
        type: 'Full Test',
        questions: { listening: [], structure: [], reading: [] },
        durations: { listening: 2100, structure: 1500, reading: 3300 },
        status: 'published',
      },
      {
        name: 'TOEFL ITP Simulation - Full Test #2',
        type: 'Full Test',
        questions: { listening: [], structure: [], reading: [] },
        durations: { listening: 2100, structure: 1500, reading: 3300 },
        status: 'published',
      },
      {
        name: 'Latihan Listening Comprehension',
        type: 'Section Practice',
        questions: { listening: [] },
        durations: { listening: 2100 },
        status: 'published',
      },
      {
        name: 'Latihan Structure & Written Expression',
        type: 'Section Practice',
        questions: { structure: [] },
        durations: { structure: 1500 },
        status: 'published',
      },
      {
        name: 'Latihan Reading Comprehension',
        type: 'Section Practice',
        questions: { reading: [] },
        durations: { reading: 3300 },
        status: 'published',
      },
    ];
    for (const p of packages) {
      await pkgService.create(p);
    }
    console.log(`✅ ${packages.length} test packages seeded`);
  }

  // ── Seed Sample Questions ──
  const qService = app.get(QuestionsService);
  const existingQ = await qService.findAll();
  if (existingQ.length === 0) {
    const sampleQuestions = [
      // ─── LISTENING (10 soal) ───
      { section: 'Listening', skillCategory: 'Part A - Short Conversations', content: 'Woman: "I can\'t believe the library is closed again today."\nMan: "They\'ve been renovating the second floor all week."\nWhat does the man imply?', choices: { a: 'The library is permanently closed', b: 'The closure is due to renovation work', c: 'He wants to go to the library', d: 'The second floor is open' }, answerKey: 'b', explanation: 'The man explains the reason for the closure is renovation on the second floor.' },
      { section: 'Listening', skillCategory: 'Part A - Short Conversations', content: 'Man: "Did you finish the assignment for Professor Kim\'s class?"\nWoman: "I wish I had. I was up until midnight and still couldn\'t complete it."\nWhat does the woman mean?', choices: { a: 'She completed the assignment', b: 'She did not finish the assignment', c: 'She went to bed early', d: 'She enjoyed doing the assignment' }, answerKey: 'b', explanation: '"I wish I had" implies she did NOT finish it.' },
      { section: 'Listening', skillCategory: 'Part A - Short Conversations', content: 'Woman: "Tom seems to have improved a lot in his writing."\nMan: "He should have. He\'s been working with a tutor all semester."\nWhat does the man say about Tom?', choices: { a: 'Tom has not improved at all', b: 'Tom\'s improvement is expected because he had a tutor', c: 'Tom doesn\'t need a tutor', d: 'Tom is the best writer in class' }, answerKey: 'b', explanation: 'The man suggests the improvement is expected given the tutoring.' },
      { section: 'Listening', skillCategory: 'Part B - Extended Conversations', content: 'In the conversation, what is the student\'s main concern about the research paper?', choices: { a: 'The topic is too broad', b: 'The deadline has passed', c: 'There are not enough sources available', d: 'The professor has not approved the topic' }, answerKey: 'c', explanation: 'The student expresses difficulty finding sufficient academic sources.' },
      { section: 'Listening', skillCategory: 'Part B - Extended Conversations', content: 'What does the professor suggest the student should do?', choices: { a: 'Change the topic entirely', b: 'Look for sources in other university libraries', c: 'Ask another professor for help', d: 'Submit the paper late' }, answerKey: 'b', explanation: 'The professor recommends using inter-library loan services.' },
      { section: 'Listening', skillCategory: 'Part A - Short Conversations', content: 'Man: "I heard the cafeteria is going to start serving breakfast."\nWoman: "It\'s about time!"\nWhat does the woman mean?', choices: { a: 'She wants to know what time breakfast is', b: 'She thinks this should have happened sooner', c: 'She doesn\'t eat breakfast', d: 'She prefers lunch' }, answerKey: 'b', explanation: '"It\'s about time" is an expression meaning it should have happened earlier.' },
      { section: 'Listening', skillCategory: 'Part C - Talks', content: 'What is the main topic of the lecture?', choices: { a: 'The history of the printing press', b: 'The impact of social media on communication', c: 'The development of the English language', d: 'Modern journalism practices' }, answerKey: 'c', explanation: 'The lecture traces how English evolved from Old English to Modern English.' },
      { section: 'Listening', skillCategory: 'Part C - Talks', content: 'According to the speaker, what was the most significant influence on Middle English?', choices: { a: 'The Roman invasion', b: 'The Norman Conquest of 1066', c: 'The invention of the dictionary', d: 'Trade with Asian countries' }, answerKey: 'b', explanation: 'The Norman Conquest introduced French vocabulary into English.' },
      { section: 'Listening', skillCategory: 'Part A - Short Conversations', content: 'Woman: "Would you mind closing the window? It\'s freezing in here."\nMan: "Oh, I didn\'t realize it was open."\nWhat will the man probably do?', choices: { a: 'Open another window', b: 'Close the window', c: 'Turn on the heater', d: 'Leave the room' }, answerKey: 'b', explanation: 'The man\'s response indicates he will comply with the request.' },
      { section: 'Listening', skillCategory: 'Part A - Short Conversations', content: 'Man: "I thought the exam was going to be next week."\nWoman: "So did I, until I checked the syllabus."\nWhat does the woman imply?', choices: { a: 'The exam is next week as planned', b: 'The exam date is different from what they expected', c: 'There is no exam', d: 'She lost the syllabus' }, answerKey: 'b', explanation: 'She discovered the exam date is different after checking the syllabus.' },

      // ─── STRUCTURE (10 soal) ───
      { section: 'Structure', skillCategory: 'Subject-Verb Agreement', content: 'The number of students who _____ enrolled in the course has increased significantly.', choices: { a: 'has', b: 'have', c: 'is', d: 'are' }, answerKey: 'b', explanation: '"who" refers to "students" (plural), so the verb in the relative clause is "have".' },
      { section: 'Structure', skillCategory: 'Verb Tense', content: 'By the time the professor arrived, the students _____ waiting for over thirty minutes.', choices: { a: 'have been', b: 'had been', c: 'were', d: 'are' }, answerKey: 'b', explanation: 'Past perfect continuous "had been" is used for an action continuing up to a past event.' },
      { section: 'Structure', skillCategory: 'Word Order', content: '_____ the invention of the telescope, very little was known about the surface of the moon.', choices: { a: '__(empty)__', b: 'It was__(empty)__', c: 'Prior to', d: 'When__(empty)__' }, answerKey: 'c', explanation: '"Prior to" correctly introduces a time reference before a past event.' },
      { section: 'Structure', skillCategory: 'Relative Clause', content: 'The scientist _____ research led to a major breakthrough received the Nobel Prize.', choices: { a: 'who', b: 'whose', c: 'which', d: 'whom' }, answerKey: 'b', explanation: '"whose" shows possession — the scientist\'s research.' },
      { section: 'Structure', skillCategory: 'Passive Voice', content: 'The new library _____ by the mayor next month.', choices: { a: 'will open', b: 'will be opened', c: 'is opening', d: 'has opened' }, answerKey: 'b', explanation: 'Passive voice is needed because the library is being opened by someone.' },
      { section: 'Structure', skillCategory: 'Conditional', content: 'If the weather _____ better yesterday, we would have gone to the beach.', choices: { a: 'was', b: 'were', c: 'had been', d: 'would be' }, answerKey: 'c', explanation: 'Third conditional requires "had been" for past unreal conditions.' },
      { section: 'Structure', skillCategory: 'Gerund/Infinitive', content: 'The committee postponed _____ a decision until all members were present.', choices: { a: 'to make', b: 'making', c: 'make', d: 'made' }, answerKey: 'b', explanation: '"Postpone" is followed by a gerund (-ing form).' },
      { section: 'Structure', skillCategory: 'Written Expression', content: 'The professor, along with her assistants, are preparing the final examination.\nWhich underlined part is incorrect?', choices: { a: 'along with', b: 'her assistants', c: 'are preparing', d: 'final examination' }, answerKey: 'c', explanation: 'The subject is "professor" (singular), so it should be "is preparing". "Along with" does not change the subject number.' },
      { section: 'Structure', skillCategory: 'Written Expression', content: 'Neither the students nor the teacher were able to solve the extremely difficulty problem.\nWhich underlined part is incorrect?', choices: { a: 'Neither', b: 'were able', c: 'extremely', d: 'difficulty' }, answerKey: 'd', explanation: '"difficulty" should be "difficult" (adjective, not noun).' },
      { section: 'Structure', skillCategory: 'Parallel Structure', content: 'The course requires reading extensively, _____ regularly, and participating in group discussions.', choices: { a: 'write', b: 'to write', c: 'writing', d: 'written' }, answerKey: 'c', explanation: 'Parallel structure requires matching gerund forms: reading, writing, participating.' },

      // ─── READING (10 soal) ───
      { section: 'Reading', skillCategory: 'Main Idea', content: 'Coral reefs are sometimes called the "rainforests of the sea" because of their incredible biodiversity. Although they cover less than 1% of the ocean floor, they support approximately 25% of all marine species. These complex ecosystems provide food, shelter, and breeding grounds for thousands of species of fish, invertebrates, and other marine organisms.\n\nWhat is the main idea of this passage?', choices: { a: 'Coral reefs are found in tropical waters', b: 'Coral reefs are vital ecosystems supporting enormous biodiversity', c: 'Marine species are declining in number', d: 'The ocean floor is mostly covered by coral' }, answerKey: 'b', explanation: 'The passage emphasizes the biodiversity and ecological importance of coral reefs.' },
      { section: 'Reading', skillCategory: 'Detail', content: 'According to the passage about coral reefs, approximately what percentage of marine species do they support?', choices: { a: '1%', b: '10%', c: '25%', d: '50%' }, answerKey: 'c', explanation: 'The passage states "approximately 25% of all marine species".' },
      { section: 'Reading', skillCategory: 'Vocabulary in Context', content: 'The word "biodiversity" in the passage is closest in meaning to:', choices: { a: 'biological research', b: 'variety of living organisms', c: 'ocean temperature', d: 'coral formation' }, answerKey: 'b', explanation: 'Biodiversity means the variety of plant and animal life in a particular habitat.' },
      { section: 'Reading', skillCategory: 'Main Idea', content: 'The development of the Internet has fundamentally transformed how information is distributed and consumed. In the pre-Internet era, news traveled slowly through print media, radio, and television. Today, information can circle the globe in seconds, reaching billions of people simultaneously through social media platforms and news websites.\n\nWhat is the passage mainly about?', choices: { a: 'The history of print media', b: 'How the Internet changed information distribution', c: 'Social media addiction', d: 'Television news programs' }, answerKey: 'b', explanation: 'The passage focuses on how the Internet transformed information distribution.' },
      { section: 'Reading', skillCategory: 'Inference', content: 'It can be inferred from the passage about the Internet that:', choices: { a: 'Print media no longer exists', b: 'Information spreads much faster now than in the past', c: 'Television is more popular than the Internet', d: 'Social media is harmful to society' }, answerKey: 'b', explanation: 'The comparison between slow pre-Internet distribution and instant modern sharing implies this.' },
      { section: 'Reading', skillCategory: 'Detail', content: 'Photosynthesis is the process by which green plants convert sunlight into chemical energy. During this process, plants absorb carbon dioxide from the atmosphere and water from the soil. Using the energy from sunlight, they transform these raw materials into glucose, a simple sugar that provides energy for the plant\'s growth and metabolism. Oxygen is released as a byproduct.\n\nWhat are the two main raw materials used in photosynthesis?', choices: { a: 'Glucose and oxygen', b: 'Sunlight and chlorophyll', c: 'Carbon dioxide and water', d: 'Sugar and minerals' }, answerKey: 'c', explanation: 'The passage states plants absorb "carbon dioxide from the atmosphere and water from the soil".' },
      { section: 'Reading', skillCategory: 'Vocabulary in Context', content: 'The word "byproduct" in the passage about photosynthesis is closest in meaning to:', choices: { a: 'main result', b: 'raw material', c: 'secondary product', d: 'chemical reaction' }, answerKey: 'c', explanation: 'A byproduct is something produced incidentally during the making of something else.' },
      { section: 'Reading', skillCategory: 'Reference', content: 'The pronoun "they" in line 3 of the photosynthesis passage refers to:', choices: { a: 'Raw materials', b: 'Green plants', c: 'Carbon dioxide molecules', d: 'Sunlight rays' }, answerKey: 'b', explanation: 'The subject performing the action of transforming raw materials is "plants".' },
      { section: 'Reading', skillCategory: 'Main Idea', content: 'Migration patterns of birds have fascinated scientists for centuries. While many species fly south for the winter to escape harsh conditions, the Arctic Tern holds the record for the longest migration of any animal. This remarkable bird travels approximately 70,000 kilometers annually, flying from its Arctic breeding grounds to Antarctica and back.\n\nWhat is the main purpose of this passage?', choices: { a: 'To describe winter weather conditions', b: 'To highlight the Arctic Tern\'s extraordinary migration', c: 'To explain why birds have feathers', d: 'To compare different Arctic animals' }, answerKey: 'b', explanation: 'The passage focuses on the Arctic Tern\'s record-breaking migration distance.' },
      { section: 'Reading', skillCategory: 'Detail', content: 'According to the passage, approximately how far does the Arctic Tern travel each year?', choices: { a: '7,000 kilometers', b: '17,000 kilometers', c: '70,000 kilometers', d: '700,000 kilometers' }, answerKey: 'c', explanation: 'The passage states "approximately 70,000 kilometers annually".' },
    ];

    for (const q of sampleQuestions) {
      await qService.create(q);
    }
    console.log(`✅ ${sampleQuestions.length} sample questions seeded (10 per section)`);
  }

  await app.listen(3001);
  console.log('🚀 Backend running on http://localhost:3001');
}
bootstrap();
