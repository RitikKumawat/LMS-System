# Antigravity Gemini Agent Instructions - LMS Project

## Project Overview

This is a full-stack Learning Management System (LMS) built with modern web technologies, featuring a microservices-oriented architecture with separate frontend applications for students and administrators/instructors.

### Technology Stack

- **Backend (api)**: NestJS + GraphQL (Code-First Schema)
- **Student Panel (web)**: Next.js + Apollo Client + Mantine UI + SCSS
- **Admin/Instructor Panel (admin)**: React (Vite) + Apollo Client + Mantine UI + SCSS
- **Database**: MongoDB
- **API Architecture**: GraphQL with Apollo

---

## Project Folder Structure

```
LSM-System/
├── api/                          # Backend NestJS GraphQL API
│   ├── src/           
│   │   │   ├── [module-name]/    # Feature modules (user, course, enrollment, etc.)
│   │   │   │   ├── dto/          # Data Transfer Objects
│   │   │   │   ├── entities/     # GraphQL Object Types (Code-First)
│   │   │   │   ├── inputs/       # GraphQL Input Types
│   │   │   │   ├── resolvers/    # GraphQL Resolvers
│   │   │   │   ├── services/     # Business Logic
│   │   │   │   └── [module-name].module.ts
│   │   ├── utils/                # Shared utilities
│   │   │   ├── EmailTemplate/
│   │   ├── config/               # Configuration files
│   │   ├── schemas/              # Database schemas
│   │   │   ├── index.ts
│   │   │   └── [schema-name].schema.ts
|   |   |___lib/                  #razorpay provider and other providers   
|   |   |___constants/            #constants used in the apis    
│   │   └── main.ts
│   ├── test/
│   └── package.json
│   └── uploads/                  #uploads folder for storing uploaded files
│
├── web/                          # Student Panel (Next.js)
│   ├── src/
│   │   ├── app/                  # Next.js 13+ App Router
│   │   │   ├── (auth)/           # Auth routes group
│   │   │   ├── (dashboard)/      # Dashboard routes group
│   │   │   ├── courses/
│   │   │   └── layout.tsx
│   │   ├── components/           # React components
│   │   │   ├── course/           # Course components
│   │   │   ├── dashboard/        # Dashboard components
│   │   │   ├── home-page/        # Home page components
│   │   │   └── ui/               # UI primitives
│   │   ├── graphql/[module-name]              # GraphQL queries & mutations
│   │   │   ├── queries/
│   │   │   ├── mutations/
│   │   │   └── fragments/
│   │   ├── lib/                  # Razorpay configuration and other configurations
│   │   ├── hooks/                # Custom React hooks
│   │   ├── styles/               # Global SCSS styles
│   │   │   ├── globals.scss
│   │   │   ├── variables.scss
│   │   │   └── mixins.scss
│   │   └── types/                # TypeScript type definitions
│   │   ├── form/                 # Form initial values and validations
│   │   │   ├── initial-values/   # Form initial values
│   │   │   └── validations/      # Form validations
│   │   ├── enum/                 # Enums used in the application
│   │   │   ├── [enum-name].enum.ts
│   │   ├── client/               # Apollo client configuration
│   │   │   ├── apolloClient.ts   # Apollo client configuration
│   │   ├── layouts/              # Layouts for Dashboard, Default and Public Layout
│   │   │   ├── dashboard-layout/
│   │   │   ├── default-layout/
│   │   │   └── public-layout/
│   │   ├── assets/                # Assets (Images, Videos, Icons, Colors, etc.)
│   │   │   ├── colors/            # Colors used in the application
|   |   |   |   |_____ colors.scss 
|   |   |   |   |_____ colors.ts 
│   │   │   ├── icons/             # Icons used in the application
│   │   │   ├── images/            # Images used in the application
│   │   │   └── videos/            # Videos used in the application
│   ├── public/
│   └── package.json
│
├── admin/                        # Admin/Instructor Panel (React Vite)
│   ├── node_modules/
│   ├── public/
│   ├── src/
│   │   ├── assets/
│   │   │   └── colors/
│   │   │       ├── colors.scss
│   │   │       ├── colors.ts
│   │   │       └── react.svg
│   │   ├── client/
│   │   │   └── apolloClient.ts
│   │   ├── columns/
│   │   │   └── courses.columns.tsx
│   │   ├── components/           # React components
│   │   ├── config/
│   │   ├── constants/
│   │   │   └── index.ts
│   │   ├── data/
│   │   │   └── navbar-links.data.ts
│   │   ├── enum/
│   │   │   ├── roles.ts
│   │   │   └── routes.ts
│   │   ├── form/
│   │   │   ├── initial-values/
│   │   │   └── validations/
│   │   ├── generated/
│   │   ├── graphql/              # GraphQL queries & mutations
│   │   │   ├── mutations/
│   │   │   └── queries/
│   │   ├── hooks/                # Custom React hooks
│   │   ├── layouts/
│   │   │   ├── common-layout/
│   │   │   ├── private-layout/
│   │   │   └── public-layout/
│   │   ├── pages/                # Page components
│   │   │   ├── add-course/
│   │   │   ├── courses/
│   │   │   ├── curriculum/
│   │   │   ├── dashboard/
│   │   │   ├── instructor-dashboard/
│   │   │   ├── login-page/
│   │   │   └── SignupPage/
│   │   ├── routes/               # Route definitions
│   │   │   └── appRoutes.tsx
│   │   ├── types/                # TypeScript definitions
│   │   ├── ui/
│   │   ├── utils/
│   │   ├── App.css
│   │   ├── App.tsx
│   │   ├── codegen.ts
│   │   ├── index.css
│   │   └── main.tsx
│   ├── .env
│   └── .gitignore
|
└── documentation/                # Project documentation
    ├── er_relationship_Lms_project.txt
    ├── LMS project er diagram.png
    ├── lms_erd.pdf
    ├── lms_full_detailed_project.pdf
    ├── lms_full_project_plan.pdf
    └── lms_mega_document.pdf
```

---

## Agent Instructions & Coding Practices

### General Principles

1. **Always Reference Documentation First**
   - Before implementing any feature, consult the ER diagram and project documentation
   - Verify entity relationships and data structures
   - Ensure alignment with the overall project plan

2. **Maintain Consistency Across Applications**
   - Use consistent naming conventions across api, web, and admin
   - Share TypeScript types/interfaces where possible
   - Maintain similar folder structures for analogous features

3. **Follow Single Responsibility Principle**
   - Each module/component should have one clear purpose
   - Separate business logic from presentation logic
   - Keep resolvers thin, services fat

---

## Backend (NestJS + GraphQL) Practices

### Code-First Schema Approach

```typescript
// Example Entity/Object Type
import { ObjectType, Field, ID, Int } from '@nestjs/graphql';

@ObjectType()
export class Course {
  @Field(() => ID)
  id: string;

  @Field()
  title: string;

  @Field(() => Int)
  duration: number;

  @Field(() => User)
  instructor: User;
}
```

### Module Structure Guidelines

1. **Entity Files** (`entities/[name].entity.ts`)
   - Define GraphQL object types using decorators
   - Include all field decorators with proper types
   - Add relationships and computed fields

2. **Input Files** (`inputs/[name].input.ts`)
   - Create separate inputs for create, update, and filter operations
   - Use `InputType` decorator
   - Apply validation decorators (`@IsString`, `@IsNotEmpty`, etc.)

3. **DTO Files** (`dto/[name].dto.ts`)
   - Use for internal data transfer between layers
   - Apply class-validator decorators

4. **Resolver Files** (`resolvers/[name].resolver.ts`)
   - Keep resolvers thin - delegate to services
   - Use proper decorators (`@Query`, `@Mutation`, `@ResolveField`)
   - Implement authentication guards where needed
   - Add pagination for list queries

5. **Service Files** (`services/[name].service.ts`)
   - Contain all business logic
   - Handle database operations
   - Throw appropriate exceptions
   - Use dependency injection

### Naming Conventions

- **Modules**: PascalCase (e.g., `CourseModule`, `UserModule`)
- **Services**: PascalCase with Service suffix (e.g., `CourseService`)
- **Resolvers**: PascalCase with Resolver suffix (e.g., `CourseResolver`)
- **Entities**: PascalCase (e.g., `Course`, `Enrollment`)
- **Inputs**: PascalCase with Input suffix (e.g., `CreateCourseInput`)
- **DTOs**: PascalCase with Dto suffix (e.g., `CourseDto`)

### GraphQL Best Practices

```typescript
// Pagination Pattern
@ObjectType()
export class PaginatedCourses {
  @Field(() => [Course])
  items: Course[];

  @Field(() => Int)
  total: number;

  @Field(() => Int)
  page: number;

  @Field(() => Int)
  pageSize: number;
}

// Resolver with Pagination
@Query(() => PaginatedCourses)
async courses(
  @Args('page', { type: () => Int, defaultValue: 1 }) page: number,
  @Args('pageSize', { type: () => Int, defaultValue: 10 }) pageSize: number,
) {
  return this.courseService.findAll(page, pageSize);
}
```

### Authentication & Authorization

```typescript
// Use Guards
@Query(() => Course)
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('instructor', 'admin')
async course(@Args('id') id: string) {
  return this.courseService.findOne(id);
}

// Current User Decorator
@Mutation(() => Course)
@UseGuards(JwtAuthGuard)
async createCourse(
  @Args('input') input: CreateCourseInput,
  @CurrentUser() user: User,
) {
  return this.courseService.create(input, user);
}
```

---

## Frontend Practices (Web & Admin)

### Component Organization

```typescript
// Folder structure for components
components/
├── common/           // Shared across entire app
│   ├── Button/
│   ├── Card/
│   └── Modal/
├── course/          // Course-specific components
│   ├── CourseCard/
│   ├── CourseList/
│   └── CourseDetail/
├── layout/          // Layout components
│   ├── Header/
│   ├── Sidebar/
│   └── Footer/
└── ui/              // Basic UI primitives
    ├── Input/
    └── Select/
```

### Component Structure Pattern

```typescript
// ComponentName/index.tsx
import { FC } from 'react';
import styles from './ComponentName.module.scss';

interface ComponentNameProps {
  // Props interface
}

export const ComponentName: FC<ComponentNameProps> = ({ prop1, prop2 }) => {
  // Component logic
  return (
    <div className={styles.container}>
      {/* JSX */}
    </div>
  );
};

// ComponentName/ComponentName.module.scss
.container {
  // Styles
}
```

### GraphQL Integration

```typescript
// graphql/queries/course.queries.ts
import { gql } from '@apollo/client';

export const GET_COURSES = gql`
  query GetCourses($page: Int!, $pageSize: Int!) {
    courses(page: $page, pageSize: $pageSize) {
      items {
        id
        title
        description
        instructor {
          id
          name
        }
      }
      total
      page
      pageSize
    }
  }
`;

// Usage in component
import { useQuery } from '@apollo/client';
import { GET_COURSES } from '@/graphql/queries/course.queries';

const CourseList = () => {
  const { data, loading, error } = useQuery(GET_COURSES, {
    variables: { page: 1, pageSize: 10 },
  });

  if (loading) return <Loader />;
  if (error) return <ErrorMessage error={error} />;

  return (
    <div>
      {data.courses.items.map(course => (
        <CourseCard key={course.id} course={course} />
      ))}
    </div>
  );
};
```

### Custom Hooks Pattern

```typescript
// hooks/useCourses.ts
import { useQuery } from '@apollo/client';
import { GET_COURSES } from '@/graphql/queries/course.queries';

export const useCourses = (page = 1, pageSize = 10) => {
  const { data, loading, error, refetch } = useQuery(GET_COURSES, {
    variables: { page, pageSize },
  });

  return {
    courses: data?.courses.items || [],
    total: data?.courses.total || 0,
    loading,
    error,
    refetch,
  };
};
```

### Mantine UI Integration

```typescript
import { Button, Card, Text, Group } from '@mantine/core';

const CourseCard = ({ course }) => {
  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder>
      <Text weight={500} size="lg">
        {course.title}
      </Text>
      <Text size="sm" color="dimmed">
        {course.description}
      </Text>
      <Group position="apart" mt="md">
        <Text size="sm">Instructor: {course.instructor.name}</Text>
        <Button variant="light">Enroll</Button>
      </Group>
    </Card>
  );
};
```

### SCSS Best Practices

```scss
// styles/variables.scss
$primary-color: #228be6;
$secondary-color: #15aabf;
$text-color: #212529;
$border-radius: 8px;
$spacing-sm: 8px;
$spacing-md: 16px;
$spacing-lg: 24px;

// Component styles
.courseCard {
  padding: $spacing-md;
  border-radius: $border-radius;
  
  &__title {
    color: $text-color;
    font-size: 1.25rem;
    font-weight: 600;
  }
  
  &__description {
    color: lighten($text-color, 20%);
    margin-top: $spacing-sm;
  }
  
  &:hover {
    transform: translateY(-2px);
    transition: transform 0.2s ease;
  }
}
```

---

## Development Workflow for Agent

### When Implementing a New Feature

1. **Analyze Requirements**
   ```
   - Check ER diagram for data relationships
   - Review lms_full_detailed_project.pdf for feature specifications
   - Identify which entities are involved
   ```

2. **Backend Implementation Order**
   ```
   a. Create/update entity with proper GraphQL decorators
   b. Create input types for mutations
   c. Implement service with business logic
   d. Create resolver with queries/mutations
   e. Add to module imports/providers
   f. Test with GraphQL playground
   ```

3. **Frontend Implementation Order**
   ```
   a. Create GraphQL queries/mutations in graphql folder
   b. Create custom hook if needed
   c. Build UI components with Mantine
   d. Add SCSS styling
   e. Integrate with Apollo Client
   f. Handle loading, error, and success states
   ```

4. **Code Review Checklist**
   ```
   ✓ TypeScript types are properly defined
   ✓ Error handling is implemented
   ✓ Loading states are shown
   ✓ GraphQL queries are optimized (no over-fetching)
   ✓ Components are reusable and follow DRY principle
   ✓ SCSS follows BEM or similar methodology
   ✓ Authentication/authorization is properly applied
   ✓ Code follows project naming conventions
   ```

### Testing Strategy

```typescript
// Backend - Service Test Example
describe('CourseService', () => {
  let service: CourseService;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [CourseService],
    }).compile();

    service = module.get<CourseService>(CourseService);
  });

  it('should create a course', async () => {
    const input = { title: 'Test Course', description: 'Test' };
    const result = await service.create(input);
    expect(result.title).toBe('Test Course');
  });
});

// Frontend - Component Test Example
import { render, screen } from '@testing-library/react';
import { CourseCard } from './CourseCard';

test('renders course title', () => {
  const course = { id: '1', title: 'Test Course' };
  render(<CourseCard course={course} />);
  expect(screen.getByText('Test Course')).toBeInTheDocument();
});
```

---

## File Naming Conventions

### Backend (api)
- Entities: `[name].entity.ts` (e.g., `course.entity.ts`)
- Services: `[name].service.ts` (e.g., `course.service.ts`)
- Resolvers: `[name].resolver.ts` (e.g., `course.resolver.ts`)
- Modules: `[name].module.ts` (e.g., `course.module.ts`)
- Inputs: `[action]-[name].input.ts` (e.g., `create-course.input.ts`)
- DTOs: `[name].dto.ts` (e.g., `course.dto.ts`)

### Frontend (web/admin)
- Components: `PascalCase/index.tsx` (e.g., `CourseCard/index.tsx`)
- Styles: `ComponentName.module.scss` (e.g., `CourseCard.module.scss`)
- Hooks: `use[Name].ts` (e.g., `useCourses.ts`)
- Queries: `[entity].queries.ts` (e.g., `course.queries.ts`)
- Mutations: `[entity].mutations.ts` (e.g., `course.mutations.ts`)
- Types: `[entity].types.ts` (e.g., `course.types.ts`)

---

## Environment Configuration

### Backend (.env)
```env
DATABASE_URL=postgresql://user:password@localhost:5432/lms_db
JWT_SECRET=your_jwt_secret
JWT_EXPIRATION=7d
PORT=4000
GRAPHQL_PLAYGROUND=true
```

### Web (.env.local)
```env
NEXT_PUBLIC_API_URL=http://localhost:4000/graphql
NEXT_PUBLIC_APP_NAME=LMS Student Portal
```

### Admin (.env)
```env
VITE_API_URL=http://localhost:4000/graphql
VITE_APP_NAME=LMS Admin Portal
```

---

## Common Patterns & Utilities

### Error Handling Pattern

```typescript
// Backend
try {
  const result = await this.service.someOperation();
  return result;
} catch (error) {
  throw new ApolloError(
    'Failed to perform operation',
    'OPERATION_FAILED',
    { originalError: error }
  );
}

// Frontend
const handleSubmit = async (data) => {
  try {
    await createCourse({ variables: { input: data } });
    notifications.show({
      title: 'Success',
      message: 'Course created successfully',
      color: 'green',
    });
  } catch (error) {
    notifications.show({
      title: 'Error',
      message: error.message,
      color: 'red',
    });
  }
};
```

### Pagination Utility

```typescript
// Shared pagination interface
export interface PaginationInput {
  page: number;
  pageSize: number;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

// Calculate offset
export const getOffset = (page: number, pageSize: number) => 
  (page - 1) * pageSize;
```

### Form Validation Pattern

```typescript
import { useForm } from '@mantine/form';
import { zodResolver } from 'mantine-form-zod-resolver';
import { z } from 'zod';

const schema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
});

const CourseForm = () => {
  const form = useForm({
    validate: zodResolver(schema),
    initialValues: {
      title: '',
      description: '',
    },
  });

  return (
    <form onSubmit={form.onSubmit(handleSubmit)}>
      <TextInput {...form.getInputProps('title')} />
      <Textarea {...form.getInputProps('description')} />
      <Button type="submit">Submit</Button>
    </form>
  );
};
```

---

## Agent Decision-Making Framework

### When to Create a New Module (Backend)
✅ Create when:
- Represents a distinct domain entity (User, Course, Enrollment)
- Has its own database table/model
- Contains unique business logic

❌ Don't create when:
- It's just a utility function
- It's a shared concern (use common/)

### When to Create a New Component (Frontend)
✅ Create when:
- Used in multiple places
- Has complex logic
- Represents a distinct UI element
- Exceeds 150 lines of code

❌ Don't create when:
- Only used once and simple
- Can be a simple function or element

### Code Reusability Guidelines
1. Extract repeated logic into hooks
2. Create shared components for common UI patterns
3. Use GraphQL fragments for repeated field selections
4. Create utility functions for common operations
5. Share TypeScript types between related files

---

## Performance Optimization

### Backend
- Use DataLoader for N+1 query prevention
- Implement field-level query complexity analysis
- Add database indexes on frequently queried fields
- Use connection pooling
- Implement caching where appropriate (Redis)

### Frontend
- Use React.memo for expensive components
- Implement virtual scrolling for long lists
- Lazy load routes and components
- Optimize images (Next.js Image component)
- Use Apollo Client cache effectively
- Implement pagination instead of loading all data

---

## Security Checklist

### Backend
- ✅ Validate all inputs with class-validator
- ✅ Implement authentication on protected routes
- ✅ Use role-based access control (RBAC)
- ✅ Sanitize database queries
- ✅ Implement rate limiting
- ✅ Use HTTPS in production
- ✅ Hash passwords with bcrypt
- ✅ Validate JWT tokens

### Frontend
- ✅ Never store sensitive data in localStorage
- ✅ Validate user input client-side
- ✅ Use CSRF tokens
- ✅ Sanitize user-generated content
- ✅ Implement proper CORS headers
- ✅ Use secure cookies for tokens

---

## Git Workflow

### Branch Naming
- `feature/[feature-name]` - New features
- `fix/[bug-name]` - Bug fixes
- `refactor/[area]` - Code refactoring
- `docs/[section]` - Documentation updates

### Commit Message Format
```
type(scope): subject

body

footer
```

Types: feat, fix, docs, style, refactor, test, chore

Example:
```
feat(course): add course creation functionality

- Implement CreateCourseInput
- Add CourseService.create method
- Create course creation resolver

Closes #123
```

---

## Agent Self-Check Questions

Before completing any implementation, the agent should verify:

1. **Documentation Alignment**
   - [ ] Does this match the ER diagram?
   - [ ] Is this feature in the project plan?
   - [ ] Are all relationships properly defined?

2. **Code Quality**
   - [ ] Are TypeScript types properly defined?
   - [ ] Is error handling comprehensive?
   - [ ] Are there any code smells?
   - [ ] Is the code DRY?

3. **Architecture Consistency**
   - [ ] Does this follow the established patterns?
   - [ ] Is the folder structure correct?
   - [ ] Are naming conventions followed?

4. **Completeness**
   - [ ] Backend + Frontend both updated?
   - [ ] GraphQL schema generated?
   - [ ] Types are in sync across all apps?

5. **User Experience**
   - [ ] Are loading states implemented?
   - [ ] Are error messages user-friendly?
   - [ ] Is the UI responsive?
   - [ ] Are success notifications shown?

---

## Quick Reference Commands

### Development
```bash
# Backend
cd api && npm run start:dev

# Web (Student Portal)
cd web && npm run dev

# Admin Panel
cd admin && npm run dev

# Generate GraphQL types
cd api && npm run generate:types
```

### Database
```bash
# Run migrations
cd api && npm run migration:run

# Create migration
cd api && npm run migration:create

# Seed database
cd api && npm run seed
```

---

## Troubleshooting Common Issues

### GraphQL Schema Not Updating
1. Restart NestJS dev server
2. Clear Apollo Client cache
3. Regenerate TypeScript types

### Apollo Client Cache Issues
```typescript
// Clear cache
client.clearStore();

// Refetch queries
refetch();

// Use cache-first, network-only, or no-cache policies appropriately
```

### CORS Errors
- Check backend CORS configuration
- Verify API URL in environment variables
- Ensure credentials are included in Apollo Client setup

---

## Resources & References

- **NestJS Documentation**: https://docs.nestjs.com
- **GraphQL Documentation**: https://graphql.org/learn
- **Next.js Documentation**: https://nextjs.org/docs
- **Mantine UI**: https://mantine.dev
- **Apollo Client**: https://www.apollographql.com/docs/react

---

## Agent Reminder

Always prioritize:
1. **Correctness** - Match the ER diagram and requirements
2. **Consistency** - Follow established patterns
3. **Quality** - Write clean, maintainable code
4. **Completeness** - Update all affected areas (backend, web, admin)
5. **Documentation** - Comment complex logic, update README files

When in doubt, refer to existing implementations in the codebase and the project documentation folder.