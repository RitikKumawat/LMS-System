import { Test, TestingModule } from '@nestjs/testing';
import { CourseModuleResolver } from './course-module.resolver';
import { CourseModuleService } from './course-module.service';

describe('CourseModuleResolver', () => {
  let resolver: CourseModuleResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CourseModuleResolver, CourseModuleService],
    }).compile();

    resolver = module.get<CourseModuleResolver>(CourseModuleResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
