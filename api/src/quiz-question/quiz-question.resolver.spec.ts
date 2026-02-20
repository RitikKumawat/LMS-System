import { Test, TestingModule } from '@nestjs/testing';
import { QuizQuestionResolver } from './quiz-question.resolver';

describe('QuizQuestionResolver', () => {
  let resolver: QuizQuestionResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [QuizQuestionResolver],
    }).compile();

    resolver = module.get<QuizQuestionResolver>(QuizQuestionResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
