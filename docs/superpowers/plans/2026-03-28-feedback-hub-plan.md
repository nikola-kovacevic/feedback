# Feedback Hub Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a Peakon-style feedback analytics platform with an embeddable widget, NestJS backend, React+Ant Design frontend, and Docker Compose deployment.

**Architecture:** Monorepo with pnpm workspaces containing three packages: `backend/` (NestJS + TypeORM + PostgreSQL), `frontend/` (React 18 + Ant Design 5 + Recharts), and `widget/` (vanilla TypeScript + Shadow DOM). All services orchestrated via Docker Compose.

**Tech Stack:** NestJS, React 18, Ant Design 5, TypeORM, PostgreSQL 16, Vite, Recharts, TanStack Query, pnpm workspaces, Docker Compose

**Spec:** `docs/superpowers/specs/2026-03-28-feedback-hub-design.md`

---

## File Structure

```
feedback/
├── packages/
│   ├── backend/
│   │   ├── src/
│   │   │   ├── main.ts
│   │   │   ├── app.module.ts
│   │   │   ├── config/
│   │   │   │   └── database.config.ts
│   │   │   ├── auth/
│   │   │   │   ├── auth.module.ts
│   │   │   │   ├── auth.controller.ts
│   │   │   │   ├── auth.service.ts
│   │   │   │   ├── jwt.strategy.ts
│   │   │   │   ├── dto/
│   │   │   │   │   ├── register.dto.ts
│   │   │   │   │   ├── login.dto.ts
│   │   │   │   │   └── refresh.dto.ts
│   │   │   │   └── guards/
│   │   │   │       └── jwt-auth.guard.ts
│   │   │   ├── users/
│   │   │   │   ├── user.entity.ts
│   │   │   │   └── users.module.ts
│   │   │   ├── applications/
│   │   │   │   ├── applications.module.ts
│   │   │   │   ├── applications.controller.ts
│   │   │   │   ├── applications.service.ts
│   │   │   │   ├── application.entity.ts
│   │   │   │   └── dto/
│   │   │   │       ├── create-application.dto.ts
│   │   │   │       └── update-application.dto.ts
│   │   │   ├── feedback/
│   │   │   │   ├── feedback.module.ts
│   │   │   │   ├── feedback.controller.ts
│   │   │   │   ├── feedback.service.ts
│   │   │   │   ├── feedback-response.entity.ts
│   │   │   │   └── dto/
│   │   │   │       ├── submit-feedback.dto.ts
│   │   │   │       └── query-feedback.dto.ts
│   │   │   ├── widget/
│   │   │   │   ├── widget.module.ts
│   │   │   │   └── widget.controller.ts
│   │   │   ├── analytics/
│   │   │   │   ├── analytics.module.ts
│   │   │   │   ├── analytics.controller.ts
│   │   │   │   ├── analytics.service.ts
│   │   │   │   └── dto/
│   │   │   │       └── analytics-query.dto.ts
│   │   │   └── sentiment/
│   │   │       ├── sentiment.module.ts
│   │   │       └── sentiment.service.ts
│   │   ├── test/
│   │   │   ├── auth.e2e-spec.ts
│   │   │   ├── applications.e2e-spec.ts
│   │   │   ├── widget.e2e-spec.ts
│   │   │   ├── feedback.e2e-spec.ts
│   │   │   ├── analytics.e2e-spec.ts
│   │   │   └── jest-e2e.json
│   │   ├── package.json
│   │   ├── tsconfig.json
│   │   ├── tsconfig.build.json
│   │   ├── nest-cli.json
│   │   └── Dockerfile
│   ├── frontend/
│   │   ├── src/
│   │   │   ├── main.tsx
│   │   │   ├── App.tsx
│   │   │   ├── api/
│   │   │   │   └── client.ts
│   │   │   ├── context/
│   │   │   │   ├── AuthContext.tsx
│   │   │   │   └── ThemeContext.tsx
│   │   │   ├── hooks/
│   │   │   │   ├── useAuth.ts
│   │   │   │   ├── useApplications.ts
│   │   │   │   ├── useFeedback.ts
│   │   │   │   └── useAnalytics.ts
│   │   │   ├── layouts/
│   │   │   │   └── DashboardLayout.tsx
│   │   │   ├── pages/
│   │   │   │   ├── LoginPage.tsx
│   │   │   │   ├── RegisterPage.tsx
│   │   │   │   ├── DashboardPage.tsx
│   │   │   │   ├── ApplicationsPage.tsx
│   │   │   │   ├── ApplicationDetailPage.tsx
│   │   │   │   ├── NewApplicationPage.tsx
│   │   │   │   ├── ResponsesPage.tsx
│   │   │   │   ├── ComparisonPage.tsx
│   │   │   │   ├── ExportPage.tsx
│   │   │   │   └── SettingsPage.tsx
│   │   │   ├── components/
│   │   │   │   ├── GlassCard.tsx
│   │   │   │   ├── ThemeToggle.tsx
│   │   │   │   ├── FilterBar.tsx
│   │   │   │   ├── ScoreTag.tsx
│   │   │   │   ├── SummaryCards.tsx
│   │   │   │   ├── ScoreTrendChart.tsx
│   │   │   │   ├── ScoreDistributionChart.tsx
│   │   │   │   ├── WordCloud.tsx
│   │   │   │   ├── RecentComments.tsx
│   │   │   │   └── EmbedSnippet.tsx
│   │   │   ├── styles/
│   │   │   │   ├── theme.ts
│   │   │   │   └── glass.css
│   │   │   └── types/
│   │   │       └── index.ts
│   │   ├── index.html
│   │   ├── vite.config.ts
│   │   ├── tsconfig.json
│   │   ├── package.json
│   │   ├── Dockerfile
│   │   └── nginx.conf
│   └── widget/
│       ├── src/
│       │   ├── index.ts
│       │   ├── api.ts
│       │   ├── ui.ts
│       │   ├── styles.ts
│       │   └── types.ts
│       ├── vite.config.ts
│       ├── tsconfig.json
│       └── package.json
├── docker-compose.yml
├── .env.example
├── .gitignore
├── pnpm-workspace.yaml
├── tsconfig.base.json
└── package.json
```

---

## Task 1: Monorepo Scaffolding

**Files:**
- Create: `package.json`, `pnpm-workspace.yaml`, `tsconfig.base.json`, `.env.example`
- Create: `packages/backend/package.json`, `packages/backend/tsconfig.json`, `packages/backend/tsconfig.build.json`, `packages/backend/nest-cli.json`
- Create: `packages/frontend/package.json`, `packages/frontend/tsconfig.json`, `packages/frontend/vite.config.ts`, `packages/frontend/index.html`
- Create: `packages/widget/package.json`, `packages/widget/tsconfig.json`, `packages/widget/vite.config.ts`

- [ ] **Step 1: Create root package.json and pnpm workspace config**

```json
// package.json
{
  "name": "feedback-hub",
  "private": true,
  "scripts": {
    "dev:backend": "pnpm --filter backend dev",
    "dev:frontend": "pnpm --filter frontend dev",
    "dev:widget": "pnpm --filter widget dev",
    "build": "pnpm -r build",
    "test": "pnpm -r test",
    "lint": "pnpm -r lint"
  },
  "engines": {
    "node": ">=20"
  }
}
```

```yaml
# pnpm-workspace.yaml
packages:
  - 'packages/*'
```

```json
// tsconfig.base.json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "ESNext",
    "moduleResolution": "bundler",
    "lib": ["ES2022"],
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "resolveJsonModule": true,
    "declaration": true,
    "declarationMap": true,
    "sourceMap": true
  }
}
```

```
# .env.example
POSTGRES_DB=feedback
POSTGRES_USER=feedback
POSTGRES_PASSWORD=changeme
DATABASE_URL=postgresql://feedback:changeme@localhost:5432/feedback
JWT_SECRET=changeme-use-a-long-random-string
JWT_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d
CORS_ORIGIN=http://localhost:5173
BACKEND_URL=http://localhost:3000
```

- [ ] **Step 2: Scaffold NestJS backend package**

Run:
```bash
cd packages/backend
pnpm init
```

Then set `packages/backend/package.json`:
```json
{
  "name": "backend",
  "version": "0.0.1",
  "private": true,
  "scripts": {
    "build": "nest build",
    "dev": "nest start --watch",
    "start": "node dist/main.js",
    "test": "jest",
    "test:watch": "jest --watch",
    "test:e2e": "jest --config ./test/jest-e2e.json",
    "lint": "eslint \"{src,test}/**/*.ts\""
  }
}
```

Install deps:
```bash
pnpm add @nestjs/common @nestjs/core @nestjs/platform-express @nestjs/typeorm @nestjs/jwt @nestjs/passport @nestjs/config @nestjs/cache-manager @nestjs/swagger reflect-metadata rxjs typeorm pg passport passport-jwt class-validator class-transformer bcrypt natural uuid
pnpm add -D @nestjs/cli @nestjs/schematics @nestjs/testing @types/node @types/jest @types/bcrypt @types/passport-jwt @types/uuid typescript jest ts-jest ts-node @types/natural
```

Create `packages/backend/tsconfig.json`:
```json
{
  "extends": "../../tsconfig.base.json",
  "compilerOptions": {
    "module": "CommonJS",
    "moduleResolution": "node",
    "outDir": "./dist",
    "rootDir": "./src",
    "emitDecoratorMetadata": true,
    "experimentalDecorators": true,
    "lib": ["ES2022"],
    "target": "ES2022"
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist"]
}
```

Create `packages/backend/tsconfig.build.json`:
```json
{
  "extends": "./tsconfig.json",
  "exclude": ["node_modules", "dist", "test", "**/*spec.ts"]
}
```

Create `packages/backend/nest-cli.json`:
```json
{
  "$schema": "https://json.schemastore.org/nest-cli",
  "collection": "@nestjs/schematics",
  "sourceRoot": "src",
  "compilerOptions": {
    "deleteOutDir": true
  }
}
```

- [ ] **Step 3: Scaffold React frontend package**

`packages/frontend/package.json`:
```json
{
  "name": "frontend",
  "version": "0.0.1",
  "private": true,
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "tsc -b && vite build",
    "preview": "vite preview",
    "lint": "eslint src"
  }
}
```

Install deps:
```bash
cd packages/frontend
pnpm add react react-dom react-router-dom antd @ant-design/icons @tanstack/react-query recharts axios dayjs
pnpm add -D @types/react @types/react-dom @vitejs/plugin-react typescript vite
```

Create `packages/frontend/tsconfig.json`:
```json
{
  "extends": "../../tsconfig.base.json",
  "compilerOptions": {
    "jsx": "react-jsx",
    "lib": ["ES2022", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "moduleResolution": "bundler",
    "outDir": "./dist"
  },
  "include": ["src"]
}
```

Create `packages/frontend/vite.config.ts`:
```ts
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      '/api': 'http://localhost:3000',
    },
  },
});
```

Create `packages/frontend/index.html`:
```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Feedback Hub</title>
</head>
<body>
  <div id="root"></div>
  <script type="module" src="/src/main.tsx"></script>
</body>
</html>
```

- [ ] **Step 4: Scaffold widget package**

`packages/widget/package.json`:
```json
{
  "name": "widget",
  "version": "0.0.1",
  "private": true,
  "type": "module",
  "scripts": {
    "dev": "vite build --watch",
    "build": "vite build",
    "lint": "eslint src"
  }
}
```

Install deps:
```bash
cd packages/widget
pnpm add -D typescript vite
```

Create `packages/widget/tsconfig.json`:
```json
{
  "extends": "../../tsconfig.base.json",
  "compilerOptions": {
    "lib": ["ES2022", "DOM"],
    "outDir": "./dist"
  },
  "include": ["src"]
}
```

Create `packages/widget/vite.config.ts`:
```ts
import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  build: {
    lib: {
      entry: resolve(__dirname, 'src/index.ts'),
      name: 'FeedbackWidget',
      formats: ['iife'],
      fileName: () => 'feedback.js',
    },
    outDir: 'dist',
  },
});
```

- [ ] **Step 5: Install all dependencies and verify workspace**

Run from project root:
```bash
pnpm install
```

Expected: All three packages resolve. No errors.

- [ ] **Step 6: Commit**

```bash
git add -A
git commit -m "feat: scaffold monorepo with backend, frontend, and widget packages"
```

---

## Task 2: Backend — Database Entities & Configuration

**Files:**
- Create: `packages/backend/src/main.ts`
- Create: `packages/backend/src/app.module.ts`
- Create: `packages/backend/src/config/database.config.ts`
- Create: `packages/backend/src/users/user.entity.ts`
- Create: `packages/backend/src/users/users.module.ts`
- Create: `packages/backend/src/applications/application.entity.ts`
- Create: `packages/backend/src/feedback/feedback-response.entity.ts`
- Create: `packages/backend/src/auth/refresh-token.entity.ts`

- [ ] **Step 1: Create database config**

```ts
// packages/backend/src/config/database.config.ts
import { TypeOrmModuleOptions } from '@nestjs/typeorm';

export function getDatabaseConfig(): TypeOrmModuleOptions {
  return {
    type: 'postgres',
    url: process.env.DATABASE_URL,
    autoLoadEntities: true,
    synchronize: process.env.NODE_ENV !== 'production',
    logging: process.env.NODE_ENV === 'development',
  };
}
```

- [ ] **Step 2: Create User entity**

```ts
// packages/backend/src/users/user.entity.ts
import {
  Entity, PrimaryGeneratedColumn, Column,
  CreateDateColumn, UpdateDateColumn,
} from 'typeorm';

export enum UserRole {
  ADMIN = 'admin',
  MEMBER = 'member',
}

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 255, unique: true })
  email: string;

  @Column({ type: 'varchar', length: 255 })
  passwordHash: string;

  @Column({ type: 'varchar', length: 255 })
  name: string;

  @Column({ type: 'enum', enum: UserRole, default: UserRole.MEMBER })
  role: UserRole;

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt: Date;
}
```

- [ ] **Step 3: Create Application entity**

```ts
// packages/backend/src/applications/application.entity.ts
import {
  Entity, PrimaryGeneratedColumn, Column,
  CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn,
} from 'typeorm';
import { User } from '../users/user.entity';

export interface WidgetConfig {
  mode: 'floating' | 'inline';
  question: string;
  commentRequired: boolean;
  themeColor: string;
  cooldownHours: number;
  position: string;
}

@Entity('applications')
export class Application {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 255 })
  name: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ type: 'varchar', length: 64, unique: true })
  apiKey: string;

  @Column({ type: 'varchar', length: 64, nullable: true })
  previousApiKey: string;

  @Column({ type: 'timestamptz', nullable: true })
  previousApiKeyExpiresAt: Date;

  @Column({ type: 'jsonb' })
  widgetConfig: WidgetConfig;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'createdById' })
  createdBy: User;

  @Column({ type: 'uuid' })
  createdById: string;

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt: Date;
}
```

- [ ] **Step 4: Create FeedbackResponse entity**

```ts
// packages/backend/src/feedback/feedback-response.entity.ts
import {
  Entity, PrimaryGeneratedColumn, Column,
  CreateDateColumn, ManyToOne, JoinColumn, Index,
} from 'typeorm';
import { Application } from '../applications/application.entity';

export enum Sentiment {
  POSITIVE = 'positive',
  NEGATIVE = 'negative',
  NEUTRAL = 'neutral',
}

@Entity('feedback_responses')
@Index('idx_feedback_app_created', ['applicationId', 'createdAt'])
@Index('idx_feedback_created', ['createdAt'])
export class FeedbackResponse {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Application)
  @JoinColumn({ name: 'applicationId' })
  application: Application;

  @Column({ type: 'uuid' })
  applicationId: string;

  @Column({ type: 'smallint' })
  score: number;

  @Column({ type: 'text', nullable: true })
  comment: string;

  @Column({ type: 'enum', enum: Sentiment, default: Sentiment.NEUTRAL })
  sentiment: Sentiment;

  @Column({ type: 'jsonb', nullable: true })
  userMetadata: Record<string, unknown>;

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;
}
```

- [ ] **Step 5: Create RefreshToken entity**

```ts
// packages/backend/src/auth/refresh-token.entity.ts
import {
  Entity, PrimaryGeneratedColumn, Column,
  CreateDateColumn, ManyToOne, JoinColumn,
} from 'typeorm';
import { User } from '../users/user.entity';

@Entity('refresh_tokens')
export class RefreshToken {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'userId' })
  user: User;

  @Column({ type: 'uuid' })
  userId: string;

  @Column({ type: 'varchar', length: 255, unique: true })
  token: string;

  @Column({ type: 'timestamptz' })
  expiresAt: Date;

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;
}
```

- [ ] **Step 6: Create UsersModule**

```ts
// packages/backend/src/users/users.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  exports: [TypeOrmModule],
})
export class UsersModule {}
```

- [ ] **Step 7: Create AppModule and main.ts**

```ts
// packages/backend/src/app.module.ts
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { getDatabaseConfig } from './config/database.config';
import { UsersModule } from './users/users.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRoot(getDatabaseConfig()),
    UsersModule,
  ],
})
export class AppModule {}
```

```ts
// packages/backend/src/main.ts
import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: process.env.CORS_ORIGIN?.split(',') || '*',
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      transformOptions: { enableImplicitConversion: true },
    }),
  );

  const swaggerConfig = new DocumentBuilder()
    .setTitle('Feedback Hub API')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('api/docs', app, document);

  await app.listen(process.env.PORT || 3000);
}
bootstrap();
```

- [ ] **Step 8: Verify backend compiles**

Run: `cd packages/backend && pnpm build`
Expected: Compiles without errors to `dist/`

- [ ] **Step 9: Commit**

```bash
git add packages/backend/src
git commit -m "feat: add database entities, config, and app bootstrap"
```

---

## Task 3: Backend — Auth Module

**Files:**
- Create: `packages/backend/src/auth/auth.module.ts`
- Create: `packages/backend/src/auth/auth.controller.ts`
- Create: `packages/backend/src/auth/auth.service.ts`
- Create: `packages/backend/src/auth/jwt.strategy.ts`
- Create: `packages/backend/src/auth/guards/jwt-auth.guard.ts`
- Create: `packages/backend/src/auth/dto/register.dto.ts`
- Create: `packages/backend/src/auth/dto/login.dto.ts`
- Create: `packages/backend/src/auth/dto/refresh.dto.ts`
- Test: `packages/backend/test/auth.e2e-spec.ts`

- [ ] **Step 1: Write e2e test for auth**

```ts
// packages/backend/test/jest-e2e.json
{
  "moduleFileExtensions": ["js", "json", "ts"],
  "rootDir": ".",
  "testEnvironment": "node",
  "testRegex": ".e2e-spec.ts$",
  "transform": { "^.+\\.(t|j)s$": "ts-jest" }
}
```

```ts
// packages/backend/test/auth.e2e-spec.ts
import { Test } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';

describe('Auth (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  const testUser = {
    email: 'test@example.com',
    password: 'StrongPass123!',
    name: 'Test User',
  };

  describe('POST /api/auth/register', () => {
    it('should register a new user', () => {
      return request(app.getHttpServer())
        .post('/api/auth/register')
        .send(testUser)
        .expect(201)
        .expect((res) => {
          expect(res.body.accessToken).toBeDefined();
          expect(res.body.refreshToken).toBeDefined();
          expect(res.body.user.email).toBe(testUser.email);
          expect(res.body.user.passwordHash).toBeUndefined();
        });
    });

    it('should reject duplicate email', () => {
      return request(app.getHttpServer())
        .post('/api/auth/register')
        .send(testUser)
        .expect(409);
    });

    it('should reject invalid email', () => {
      return request(app.getHttpServer())
        .post('/api/auth/register')
        .send({ email: 'notanemail', password: 'Pass123!', name: 'Bad' })
        .expect(400);
    });
  });

  describe('POST /api/auth/login', () => {
    it('should login with valid credentials', () => {
      return request(app.getHttpServer())
        .post('/api/auth/login')
        .send({ email: testUser.email, password: testUser.password })
        .expect(200)
        .expect((res) => {
          expect(res.body.accessToken).toBeDefined();
          expect(res.body.refreshToken).toBeDefined();
        });
    });

    it('should reject invalid password', () => {
      return request(app.getHttpServer())
        .post('/api/auth/login')
        .send({ email: testUser.email, password: 'wrongpassword' })
        .expect(401);
    });
  });

  describe('GET /api/auth/me', () => {
    it('should return current user with valid token', async () => {
      const loginRes = await request(app.getHttpServer())
        .post('/api/auth/login')
        .send({ email: testUser.email, password: testUser.password });

      return request(app.getHttpServer())
        .get('/api/auth/me')
        .set('Authorization', `Bearer ${loginRes.body.accessToken}`)
        .expect(200)
        .expect((res) => {
          expect(res.body.email).toBe(testUser.email);
        });
    });

    it('should reject without token', () => {
      return request(app.getHttpServer())
        .get('/api/auth/me')
        .expect(401);
    });
  });

  describe('POST /api/auth/refresh', () => {
    it('should issue new tokens with valid refresh token', async () => {
      const loginRes = await request(app.getHttpServer())
        .post('/api/auth/login')
        .send({ email: testUser.email, password: testUser.password });

      return request(app.getHttpServer())
        .post('/api/auth/refresh')
        .send({ refreshToken: loginRes.body.refreshToken })
        .expect(200)
        .expect((res) => {
          expect(res.body.accessToken).toBeDefined();
          expect(res.body.refreshToken).toBeDefined();
        });
    });
  });
});
```

- [ ] **Step 2: Run tests, verify they fail**

Run: `cd packages/backend && pnpm test:e2e`
Expected: FAIL — auth routes don't exist yet

- [ ] **Step 3: Create DTOs**

```ts
// packages/backend/src/auth/dto/register.dto.ts
import { IsEmail, IsString, MinLength, MaxLength } from 'class-validator';

export class RegisterDto {
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(8)
  @MaxLength(128)
  password: string;

  @IsString()
  @MinLength(1)
  @MaxLength(255)
  name: string;
}
```

```ts
// packages/backend/src/auth/dto/login.dto.ts
import { IsEmail, IsString } from 'class-validator';

export class LoginDto {
  @IsEmail()
  email: string;

  @IsString()
  password: string;
}
```

```ts
// packages/backend/src/auth/dto/refresh.dto.ts
import { IsString } from 'class-validator';

export class RefreshDto {
  @IsString()
  refreshToken: string;
}
```

- [ ] **Step 4: Create JWT strategy and guard**

```ts
// packages/backend/src/auth/jwt.strategy.ts
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../users/user.entity';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET || 'dev-secret',
    });
  }

  async validate(payload: { sub: string }) {
    const user = await this.usersRepository.findOne({
      where: { id: payload.sub },
    });
    if (!user) throw new UnauthorizedException();
    return user;
  }
}
```

```ts
// packages/backend/src/auth/guards/jwt-auth.guard.ts
import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {}
```

- [ ] **Step 5: Create AuthService**

```ts
// packages/backend/src/auth/auth.service.ts
import {
  Injectable, ConflictException, UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';
import { User } from '../users/user.entity';
import { RefreshToken } from './refresh-token.entity';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    @InjectRepository(RefreshToken)
    private refreshTokenRepository: Repository<RefreshToken>,
    private jwtService: JwtService,
  ) {}

  async register(dto: RegisterDto) {
    const existing = await this.usersRepository.findOne({
      where: { email: dto.email },
    });
    if (existing) throw new ConflictException('Email already registered');

    const passwordHash = await bcrypt.hash(dto.password, 12);
    const user = this.usersRepository.create({
      email: dto.email,
      passwordHash,
      name: dto.name,
    });
    await this.usersRepository.save(user);

    const tokens = await this.generateTokens(user);
    return {
      ...tokens,
      user: this.sanitizeUser(user),
    };
  }

  async login(dto: LoginDto) {
    const user = await this.usersRepository.findOne({
      where: { email: dto.email },
    });
    if (!user) throw new UnauthorizedException('Invalid credentials');

    const valid = await bcrypt.compare(dto.password, user.passwordHash);
    if (!valid) throw new UnauthorizedException('Invalid credentials');

    const tokens = await this.generateTokens(user);
    return {
      ...tokens,
      user: this.sanitizeUser(user),
    };
  }

  async refresh(refreshTokenValue: string) {
    const hashed = await this.hashToken(refreshTokenValue);
    const tokenRecord = await this.refreshTokenRepository.findOne({
      where: { token: hashed },
      relations: ['user'],
    });

    if (!tokenRecord || tokenRecord.expiresAt < new Date()) {
      throw new UnauthorizedException('Invalid or expired refresh token');
    }

    await this.refreshTokenRepository.remove(tokenRecord);
    const tokens = await this.generateTokens(tokenRecord.user);
    return tokens;
  }

  async getProfile(userId: string) {
    const user = await this.usersRepository.findOne({ where: { id: userId } });
    if (!user) throw new UnauthorizedException();
    return this.sanitizeUser(user);
  }

  private async generateTokens(user: User) {
    const accessToken = this.jwtService.sign({ sub: user.id, email: user.email });

    const rawRefreshToken = uuidv4();
    const hashedRefreshToken = await this.hashToken(rawRefreshToken);
    const refreshToken = this.refreshTokenRepository.create({
      userId: user.id,
      token: hashedRefreshToken,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
    });
    await this.refreshTokenRepository.save(refreshToken);

    return { accessToken, refreshToken: rawRefreshToken };
  }

  private async hashToken(token: string): Promise<string> {
    return bcrypt.hash(token, 10);
  }

  private sanitizeUser(user: User) {
    const { passwordHash, ...rest } = user;
    return rest;
  }
}
```

- [ ] **Step 6: Create AuthController**

```ts
// packages/backend/src/auth/auth.controller.ts
import {
  Controller, Post, Get, Body, UseGuards, Request,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { RefreshDto } from './dto/refresh.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';

@ApiTags('auth')
@Controller('api/auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  register(@Body() dto: RegisterDto) {
    return this.authService.register(dto);
  }

  @Post('login')
  login(@Body() dto: LoginDto) {
    return this.authService.login(dto);
  }

  @Post('refresh')
  refresh(@Body() dto: RefreshDto) {
    return this.authService.refresh(dto.refreshToken);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Get('me')
  getProfile(@Request() req: { user: { id: string } }) {
    return this.authService.getProfile(req.user.id);
  }
}
```

- [ ] **Step 7: Create AuthModule and register in AppModule**

```ts
// packages/backend/src/auth/auth.module.ts
import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../users/user.entity';
import { RefreshToken } from './refresh-token.entity';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtStrategy } from './jwt.strategy';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, RefreshToken]),
    PassportModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'dev-secret',
      signOptions: { expiresIn: process.env.JWT_EXPIRES_IN || '15m' },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy],
  exports: [AuthService, JwtModule],
})
export class AuthModule {}
```

Update `packages/backend/src/app.module.ts` to import `AuthModule`:
```ts
import { AuthModule } from './auth/auth.module';
// Add AuthModule to imports array
```

- [ ] **Step 8: Run e2e tests against a test database**

Run: `cd packages/backend && DATABASE_URL=postgresql://feedback:changeme@localhost:5432/feedback_test pnpm test:e2e`
Expected: All auth tests pass

- [ ] **Step 9: Commit**

```bash
git add packages/backend/src/auth packages/backend/test
git commit -m "feat: add auth module with register, login, refresh, and JWT guard"
```

---

## Task 4: Backend — Applications CRUD

**Files:**
- Create: `packages/backend/src/applications/applications.module.ts`
- Create: `packages/backend/src/applications/applications.controller.ts`
- Create: `packages/backend/src/applications/applications.service.ts`
- Create: `packages/backend/src/applications/dto/create-application.dto.ts`
- Create: `packages/backend/src/applications/dto/update-application.dto.ts`
- Test: `packages/backend/test/applications.e2e-spec.ts`

- [ ] **Step 1: Write e2e test for applications**

```ts
// packages/backend/test/applications.e2e-spec.ts
import { Test } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';

describe('Applications (e2e)', () => {
  let app: INestApplication;
  let accessToken: string;
  let appId: string;

  beforeAll(async () => {
    const moduleFixture = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
    await app.init();

    // Register and get token
    const res = await request(app.getHttpServer())
      .post('/api/auth/register')
      .send({ email: 'apps@test.com', password: 'StrongPass123!', name: 'Apps Test' });
    accessToken = res.body.accessToken;
  });

  afterAll(async () => {
    await app.close();
  });

  describe('POST /api/applications', () => {
    it('should create an application', () => {
      return request(app.getHttpServer())
        .post('/api/applications')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({
          name: 'My Test App',
          description: 'A test application',
          widgetConfig: {
            mode: 'floating',
            question: 'How do you like our app?',
            commentRequired: true,
            themeColor: '#354B8C',
            cooldownHours: 24,
            position: 'bottom-right',
          },
        })
        .expect(201)
        .expect((res) => {
          expect(res.body.name).toBe('My Test App');
          expect(res.body.apiKey).toMatch(/^fbk_/);
          appId = res.body.id;
        });
    });

    it('should reject without auth', () => {
      return request(app.getHttpServer())
        .post('/api/applications')
        .send({ name: 'Fail' })
        .expect(401);
    });
  });

  describe('GET /api/applications', () => {
    it('should list applications', () => {
      return request(app.getHttpServer())
        .get('/api/applications')
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(200)
        .expect((res) => {
          expect(res.body.length).toBeGreaterThanOrEqual(1);
        });
    });
  });

  describe('GET /api/applications/:id', () => {
    it('should return application detail with embed snippet', async () => {
      return request(app.getHttpServer())
        .get(`/api/applications/${appId}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(200)
        .expect((res) => {
          expect(res.body.id).toBe(appId);
          expect(res.body.embedSnippet).toBeDefined();
        });
    });
  });

  describe('PATCH /api/applications/:id', () => {
    it('should update widget config', () => {
      return request(app.getHttpServer())
        .patch(`/api/applications/${appId}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send({ widgetConfig: { commentRequired: false } })
        .expect(200)
        .expect((res) => {
          expect(res.body.widgetConfig.commentRequired).toBe(false);
        });
    });
  });

  describe('POST /api/applications/:id/regenerate-key', () => {
    it('should generate a new API key', async () => {
      const before = await request(app.getHttpServer())
        .get(`/api/applications/${appId}`)
        .set('Authorization', `Bearer ${accessToken}`);

      return request(app.getHttpServer())
        .post(`/api/applications/${appId}/regenerate-key`)
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(200)
        .expect((res) => {
          expect(res.body.apiKey).not.toBe(before.body.apiKey);
          expect(res.body.previousApiKeyExpiresAt).toBeDefined();
        });
    });
  });

  describe('DELETE /api/applications/:id', () => {
    it('should delete an application', () => {
      return request(app.getHttpServer())
        .delete(`/api/applications/${appId}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(200);
    });
  });
});
```

- [ ] **Step 2: Run test, verify it fails**

Run: `cd packages/backend && pnpm test:e2e -- --testPathPattern=applications`
Expected: FAIL — routes don't exist

- [ ] **Step 3: Create DTOs**

```ts
// packages/backend/src/applications/dto/create-application.dto.ts
import { IsString, IsOptional, MaxLength, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

class WidgetConfigDto {
  @IsString()
  mode: 'floating' | 'inline';

  @IsString()
  @MaxLength(500)
  question: string;

  commentRequired: boolean;

  @IsString()
  themeColor: string;

  cooldownHours: number;

  @IsString()
  position: string;
}

export class CreateApplicationDto {
  @IsString()
  @MaxLength(255)
  name: string;

  @IsOptional()
  @IsString()
  description?: string;

  @ValidateNested()
  @Type(() => WidgetConfigDto)
  widgetConfig: WidgetConfigDto;
}
```

```ts
// packages/backend/src/applications/dto/update-application.dto.ts
import { PartialType } from '@nestjs/swagger';
import { CreateApplicationDto } from './create-application.dto';

export class UpdateApplicationDto extends PartialType(CreateApplicationDto) {}
```

- [ ] **Step 4: Create ApplicationsService**

```ts
// packages/backend/src/applications/applications.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
import { Application } from './application.entity';
import { CreateApplicationDto } from './dto/create-application.dto';
import { UpdateApplicationDto } from './dto/update-application.dto';

@Injectable()
export class ApplicationsService {
  constructor(
    @InjectRepository(Application)
    private applicationsRepository: Repository<Application>,
  ) {}

  private generateApiKey(): string {
    return `fbk_${uuidv4().replace(/-/g, '')}`;
  }

  async create(dto: CreateApplicationDto, userId: string) {
    const application = this.applicationsRepository.create({
      ...dto,
      apiKey: this.generateApiKey(),
      createdById: userId,
    });
    return this.applicationsRepository.save(application);
  }

  async findAll() {
    return this.applicationsRepository.find({
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: string) {
    const app = await this.applicationsRepository.findOne({ where: { id } });
    if (!app) throw new NotFoundException('Application not found');

    const backendUrl = process.env.BACKEND_URL || 'http://localhost:3000';
    const embedSnippet = app.widgetConfig.mode === 'floating'
      ? `<script src="${backendUrl}/widget/feedback.js"></script>\n<script>\n  FeedbackWidget.init({ apiKey: '${app.apiKey}' });\n</script>`
      : `<div id="feedback-container"></div>\n<script src="${backendUrl}/widget/feedback.js"></script>\n<script>\n  FeedbackWidget.render({ apiKey: '${app.apiKey}', target: '#feedback-container' });\n</script>`;

    return { ...app, embedSnippet };
  }

  async update(id: string, dto: UpdateApplicationDto) {
    const app = await this.findOne(id);
    if (dto.widgetConfig) {
      dto.widgetConfig = { ...app.widgetConfig, ...dto.widgetConfig } as any;
    }
    Object.assign(app, dto);
    return this.applicationsRepository.save(app);
  }

  async remove(id: string) {
    const app = await this.applicationsRepository.findOne({ where: { id } });
    if (!app) throw new NotFoundException('Application not found');
    await this.applicationsRepository.remove(app);
    return { deleted: true };
  }

  async regenerateKey(id: string) {
    const app = await this.applicationsRepository.findOne({ where: { id } });
    if (!app) throw new NotFoundException('Application not found');

    app.previousApiKey = app.apiKey;
    app.previousApiKeyExpiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);
    app.apiKey = this.generateApiKey();
    return this.applicationsRepository.save(app);
  }

  async findByApiKey(apiKey: string) {
    const app = await this.applicationsRepository.findOne({
      where: { apiKey },
    });
    if (app) return app;

    // Check previous key within grace period
    const appWithPrevKey = await this.applicationsRepository
      .createQueryBuilder('app')
      .where('app.previousApiKey = :apiKey', { apiKey })
      .andWhere('app.previousApiKeyExpiresAt > :now', { now: new Date() })
      .getOne();

    return appWithPrevKey || null;
  }
}
```

- [ ] **Step 5: Create ApplicationsController**

```ts
// packages/backend/src/applications/applications.controller.ts
import {
  Controller, Get, Post, Patch, Delete,
  Param, Body, UseGuards, Request,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ApplicationsService } from './applications.service';
import { CreateApplicationDto } from './dto/create-application.dto';
import { UpdateApplicationDto } from './dto/update-application.dto';

@ApiTags('applications')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('api/applications')
export class ApplicationsController {
  constructor(private applicationsService: ApplicationsService) {}

  @Post()
  create(
    @Body() dto: CreateApplicationDto,
    @Request() req: { user: { id: string } },
  ) {
    return this.applicationsService.create(dto, req.user.id);
  }

  @Get()
  findAll() {
    return this.applicationsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.applicationsService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateApplicationDto) {
    return this.applicationsService.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.applicationsService.remove(id);
  }

  @Post(':id/regenerate-key')
  regenerateKey(@Param('id') id: string) {
    return this.applicationsService.regenerateKey(id);
  }
}
```

- [ ] **Step 6: Create ApplicationsModule and register in AppModule**

```ts
// packages/backend/src/applications/applications.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Application } from './application.entity';
import { ApplicationsController } from './applications.controller';
import { ApplicationsService } from './applications.service';

@Module({
  imports: [TypeOrmModule.forFeature([Application])],
  controllers: [ApplicationsController],
  providers: [ApplicationsService],
  exports: [ApplicationsService],
})
export class ApplicationsModule {}
```

Add to `app.module.ts` imports.

- [ ] **Step 7: Run e2e tests**

Run: `cd packages/backend && pnpm test:e2e -- --testPathPattern=applications`
Expected: All tests pass

- [ ] **Step 8: Commit**

```bash
git add packages/backend/src/applications packages/backend/test/applications.e2e-spec.ts
git commit -m "feat: add applications CRUD with API key rotation and embed snippets"
```

---

## Task 5: Backend — Sentiment Service

**Files:**
- Create: `packages/backend/src/sentiment/sentiment.module.ts`
- Create: `packages/backend/src/sentiment/sentiment.service.ts`

- [ ] **Step 1: Create SentimentService**

```ts
// packages/backend/src/sentiment/sentiment.service.ts
import { Injectable } from '@nestjs/common';
import * as natural from 'natural';

const analyzer = new natural.SentimentAnalyzer('English', natural.PorterStemmer, 'afinn');
const tokenizer = new natural.WordTokenizer();
const TfIdf = natural.TfIdf;

// Common English stopwords
const STOPWORDS = new Set([
  'i', 'me', 'my', 'myself', 'we', 'our', 'ours', 'ourselves', 'you', 'your',
  'yours', 'yourself', 'yourselves', 'he', 'him', 'his', 'himself', 'she', 'her',
  'hers', 'herself', 'it', 'its', 'itself', 'they', 'them', 'their', 'theirs',
  'themselves', 'what', 'which', 'who', 'whom', 'this', 'that', 'these', 'those',
  'am', 'is', 'are', 'was', 'were', 'be', 'been', 'being', 'have', 'has', 'had',
  'having', 'do', 'does', 'did', 'doing', 'a', 'an', 'the', 'and', 'but', 'if',
  'or', 'because', 'as', 'until', 'while', 'of', 'at', 'by', 'for', 'with',
  'about', 'against', 'between', 'through', 'during', 'before', 'after', 'above',
  'below', 'to', 'from', 'up', 'down', 'in', 'out', 'on', 'off', 'over', 'under',
  'again', 'further', 'then', 'once', 'here', 'there', 'when', 'where', 'why',
  'how', 'all', 'both', 'each', 'few', 'more', 'most', 'other', 'some', 'such',
  'no', 'nor', 'not', 'only', 'own', 'same', 'so', 'than', 'too', 'very', 's',
  't', 'can', 'will', 'just', 'don', 'should', 'now', 'also', 'would', 'could',
  'really', 'much', 'get', 'got', 'like', 'use', 'used', 'using', 'make', 'made',
]);

@Injectable()
export class SentimentService {
  analyzeSentiment(text: string): 'positive' | 'negative' | 'neutral' {
    if (!text || text.trim().length === 0) return 'neutral';

    const tokens = tokenizer.tokenize(text.toLowerCase()) || [];
    if (tokens.length === 0) return 'neutral';

    const score = analyzer.getSentiment(tokens);

    if (score > 0.05) return 'positive';
    if (score < -0.05) return 'negative';
    return 'neutral';
  }

  extractKeywords(comments: string[], topN = 30): Array<{ term: string; weight: number }> {
    if (comments.length === 0) return [];

    const tfidf = new TfIdf();
    comments.forEach((comment) => tfidf.addDocument(comment));

    const termScores = new Map<string, number>();

    tfidf.listTerms(0).forEach((item) => {
      // Aggregate across all documents
      for (let i = 0; i < comments.length; i++) {
        const measures = tfidf.listTerms(i);
        const found = measures.find((m) => m.term === item.term);
        if (found && !STOPWORDS.has(item.term) && item.term.length > 2) {
          termScores.set(
            item.term,
            (termScores.get(item.term) || 0) + found.tfidf,
          );
        }
      }
    });

    return Array.from(termScores.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, topN)
      .map(([term, weight]) => ({ term, weight }));
  }
}
```

- [ ] **Step 2: Create SentimentModule**

```ts
// packages/backend/src/sentiment/sentiment.module.ts
import { Module, Global } from '@nestjs/common';
import { SentimentService } from './sentiment.service';

@Global()
@Module({
  providers: [SentimentService],
  exports: [SentimentService],
})
export class SentimentModule {}
```

Add to `app.module.ts` imports.

- [ ] **Step 3: Verify build**

Run: `cd packages/backend && pnpm build`
Expected: Compiles without errors

- [ ] **Step 4: Commit**

```bash
git add packages/backend/src/sentiment
git commit -m "feat: add sentiment analysis service with TF-IDF keyword extraction"
```

---

## Task 6: Backend — Widget API & Feedback Submission

**Files:**
- Create: `packages/backend/src/widget/widget.module.ts`
- Create: `packages/backend/src/widget/widget.controller.ts`
- Create: `packages/backend/src/feedback/feedback.module.ts`
- Create: `packages/backend/src/feedback/feedback.service.ts`
- Create: `packages/backend/src/feedback/feedback.controller.ts`
- Create: `packages/backend/src/feedback/dto/submit-feedback.dto.ts`
- Create: `packages/backend/src/feedback/dto/query-feedback.dto.ts`
- Test: `packages/backend/test/widget.e2e-spec.ts`
- Test: `packages/backend/test/feedback.e2e-spec.ts`

- [ ] **Step 1: Write e2e test for widget API**

```ts
// packages/backend/test/widget.e2e-spec.ts
import { Test } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';

describe('Widget API (e2e)', () => {
  let app: INestApplication;
  let apiKey: string;

  beforeAll(async () => {
    const moduleFixture = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
    await app.init();

    // Create a user and application
    const authRes = await request(app.getHttpServer())
      .post('/api/auth/register')
      .send({ email: 'widget@test.com', password: 'StrongPass123!', name: 'Widget Test' });

    const appRes = await request(app.getHttpServer())
      .post('/api/applications')
      .set('Authorization', `Bearer ${authRes.body.accessToken}`)
      .send({
        name: 'Widget Test App',
        widgetConfig: {
          mode: 'floating',
          question: 'Rate us?',
          commentRequired: true,
          themeColor: '#354B8C',
          cooldownHours: 24,
          position: 'bottom-right',
        },
      });
    apiKey = appRes.body.apiKey;
  });

  afterAll(async () => {
    await app.close();
  });

  describe('GET /api/widget/config/:apiKey', () => {
    it('should return widget config', () => {
      return request(app.getHttpServer())
        .get(`/api/widget/config/${apiKey}`)
        .expect(200)
        .expect((res) => {
          expect(res.body.question).toBe('Rate us?');
          expect(res.body.mode).toBe('floating');
        });
    });

    it('should 404 for invalid key', () => {
      return request(app.getHttpServer())
        .get('/api/widget/config/fbk_invalid')
        .expect(404);
    });
  });

  describe('POST /api/widget/feedback', () => {
    it('should submit feedback', () => {
      return request(app.getHttpServer())
        .post('/api/widget/feedback')
        .send({
          apiKey,
          score: 8,
          comment: 'Great product, love it!',
          userMetadata: { userId: '123' },
        })
        .expect(201)
        .expect((res) => {
          expect(res.body.score).toBe(8);
          expect(res.body.sentiment).toBe('positive');
        });
    });

    it('should reject score out of range', () => {
      return request(app.getHttpServer())
        .post('/api/widget/feedback')
        .send({ apiKey, score: 11, comment: 'Bad score' })
        .expect(400);
    });

    it('should reject invalid API key', () => {
      return request(app.getHttpServer())
        .post('/api/widget/feedback')
        .send({ apiKey: 'fbk_doesnotexist', score: 5, comment: 'Test' })
        .expect(404);
    });
  });
});
```

- [ ] **Step 2: Run test, verify it fails**

Run: `cd packages/backend && pnpm test:e2e -- --testPathPattern=widget`
Expected: FAIL

- [ ] **Step 3: Create DTOs**

```ts
// packages/backend/src/feedback/dto/submit-feedback.dto.ts
import { IsString, IsInt, Min, Max, IsOptional, MaxLength, IsObject } from 'class-validator';

export class SubmitFeedbackDto {
  @IsString()
  apiKey: string;

  @IsInt()
  @Min(0)
  @Max(10)
  score: number;

  @IsOptional()
  @IsString()
  @MaxLength(2000)
  comment?: string;

  @IsOptional()
  @IsObject()
  userMetadata?: Record<string, unknown>;
}
```

```ts
// packages/backend/src/feedback/dto/query-feedback.dto.ts
import { IsOptional, IsUUID, IsDateString, IsInt, Min, Max } from 'class-validator';
import { Type } from 'class-transformer';

export class QueryFeedbackDto {
  @IsOptional()
  @IsUUID()
  applicationId?: string;

  @IsOptional()
  @IsDateString()
  dateFrom?: string;

  @IsOptional()
  @IsDateString()
  dateTo?: string;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number = 1;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  limit?: number = 20;
}
```

- [ ] **Step 4: Create FeedbackService**

```ts
// packages/backend/src/feedback/feedback.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { FeedbackResponse } from './feedback-response.entity';
import { ApplicationsService } from '../applications/applications.service';
import { SentimentService } from '../sentiment/sentiment.service';
import { SubmitFeedbackDto } from './dto/submit-feedback.dto';
import { QueryFeedbackDto } from './dto/query-feedback.dto';

@Injectable()
export class FeedbackService {
  constructor(
    @InjectRepository(FeedbackResponse)
    private feedbackRepository: Repository<FeedbackResponse>,
    private applicationsService: ApplicationsService,
    private sentimentService: SentimentService,
  ) {}

  async submit(dto: SubmitFeedbackDto) {
    const application = await this.applicationsService.findByApiKey(dto.apiKey);
    if (!application) throw new NotFoundException('Application not found');

    const sentiment = this.sentimentService.analyzeSentiment(dto.comment || '');

    const feedback = this.feedbackRepository.create({
      applicationId: application.id,
      score: dto.score,
      comment: dto.comment,
      sentiment,
      userMetadata: dto.userMetadata,
    });

    return this.feedbackRepository.save(feedback);
  }

  async findAll(query: QueryFeedbackDto) {
    const qb = this.feedbackRepository
      .createQueryBuilder('f')
      .leftJoinAndSelect('f.application', 'app')
      .orderBy('f.createdAt', 'DESC');

    if (query.applicationId) {
      qb.andWhere('f.applicationId = :applicationId', {
        applicationId: query.applicationId,
      });
    }
    if (query.dateFrom) {
      qb.andWhere('f.createdAt >= :dateFrom', { dateFrom: query.dateFrom });
    }
    if (query.dateTo) {
      qb.andWhere('f.createdAt <= :dateTo', { dateTo: query.dateTo });
    }

    const page = query.page || 1;
    const limit = query.limit || 20;
    qb.skip((page - 1) * limit).take(limit);

    const [items, total] = await qb.getManyAndCount();
    return { items, total, page, limit, totalPages: Math.ceil(total / limit) };
  }

  async exportAll(query: QueryFeedbackDto) {
    const qb = this.feedbackRepository
      .createQueryBuilder('f')
      .leftJoinAndSelect('f.application', 'app')
      .orderBy('f.createdAt', 'DESC');

    if (query.applicationId) {
      qb.andWhere('f.applicationId = :applicationId', {
        applicationId: query.applicationId,
      });
    }
    if (query.dateFrom) {
      qb.andWhere('f.createdAt >= :dateFrom', { dateFrom: query.dateFrom });
    }
    if (query.dateTo) {
      qb.andWhere('f.createdAt <= :dateTo', { dateTo: query.dateTo });
    }

    return qb.getMany();
  }
}
```

- [ ] **Step 5: Create WidgetController**

```ts
// packages/backend/src/widget/widget.controller.ts
import { Controller, Get, Param, NotFoundException } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ApplicationsService } from '../applications/applications.service';

@ApiTags('widget')
@Controller('api/widget')
export class WidgetController {
  constructor(private applicationsService: ApplicationsService) {}

  @Get('config/:apiKey')
  async getConfig(@Param('apiKey') apiKey: string) {
    const app = await this.applicationsService.findByApiKey(apiKey);
    if (!app) throw new NotFoundException('Application not found');
    return app.widgetConfig;
  }
}
```

- [ ] **Step 6: Create FeedbackController**

```ts
// packages/backend/src/feedback/feedback.controller.ts
import {
  Controller, Get, Post, Body, Query, UseGuards, Res,
} from '@nestjs/common';
import { Response } from 'express';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { FeedbackService } from './feedback.service';
import { SubmitFeedbackDto } from './dto/submit-feedback.dto';
import { QueryFeedbackDto } from './dto/query-feedback.dto';

@ApiTags('feedback')
@Controller('api')
export class FeedbackController {
  constructor(private feedbackService: FeedbackService) {}

  @Post('widget/feedback')
  submitFeedback(@Body() dto: SubmitFeedbackDto) {
    return this.feedbackService.submit(dto);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Get('feedback')
  findAll(@Query() query: QueryFeedbackDto) {
    return this.feedbackService.findAll(query);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Get('feedback/export')
  async exportFeedback(
    @Query() query: QueryFeedbackDto,
    @Query('format') format: string,
    @Res() res: Response,
  ) {
    const data = await this.feedbackService.exportAll(query);

    if (format === 'csv') {
      const header = 'id,applicationId,score,comment,sentiment,createdAt\n';
      const rows = data
        .map((r) =>
          `"${r.id}","${r.applicationId}",${r.score},"${(r.comment || '').replace(/"/g, '""')}","${r.sentiment}","${r.createdAt.toISOString()}"`,
        )
        .join('\n');
      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', 'attachment; filename=feedback-export.csv');
      res.send(header + rows);
    } else {
      res.json(data);
    }
  }
}
```

- [ ] **Step 7: Create modules and register in AppModule**

```ts
// packages/backend/src/widget/widget.module.ts
import { Module } from '@nestjs/common';
import { WidgetController } from './widget.controller';
import { ApplicationsModule } from '../applications/applications.module';

@Module({
  imports: [ApplicationsModule],
  controllers: [WidgetController],
})
export class WidgetModule {}
```

```ts
// packages/backend/src/feedback/feedback.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FeedbackResponse } from './feedback-response.entity';
import { FeedbackController } from './feedback.controller';
import { FeedbackService } from './feedback.service';
import { ApplicationsModule } from '../applications/applications.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([FeedbackResponse]),
    ApplicationsModule,
  ],
  controllers: [FeedbackController],
  providers: [FeedbackService],
  exports: [FeedbackService],
})
export class FeedbackModule {}
```

Add `WidgetModule` and `FeedbackModule` to `app.module.ts` imports.

- [ ] **Step 8: Run e2e tests**

Run: `cd packages/backend && pnpm test:e2e -- --testPathPattern=widget`
Expected: All tests pass

- [ ] **Step 9: Commit**

```bash
git add packages/backend/src/widget packages/backend/src/feedback packages/backend/test
git commit -m "feat: add widget config API and feedback submission with sentiment analysis"
```

---

## Task 7: Backend — Analytics Endpoints

**Files:**
- Create: `packages/backend/src/analytics/analytics.module.ts`
- Create: `packages/backend/src/analytics/analytics.controller.ts`
- Create: `packages/backend/src/analytics/analytics.service.ts`
- Create: `packages/backend/src/analytics/dto/analytics-query.dto.ts`
- Test: `packages/backend/test/analytics.e2e-spec.ts`

- [ ] **Step 1: Write e2e test for analytics**

```ts
// packages/backend/test/analytics.e2e-spec.ts
import { Test } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';

describe('Analytics (e2e)', () => {
  let app: INestApplication;
  let accessToken: string;
  let apiKey: string;
  let applicationId: string;

  beforeAll(async () => {
    const moduleFixture = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
    await app.init();

    const authRes = await request(app.getHttpServer())
      .post('/api/auth/register')
      .send({ email: 'analytics@test.com', password: 'StrongPass123!', name: 'Analytics Test' });
    accessToken = authRes.body.accessToken;

    const appRes = await request(app.getHttpServer())
      .post('/api/applications')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        name: 'Analytics App',
        widgetConfig: { mode: 'floating', question: 'Rate?', commentRequired: false, themeColor: '#354B8C', cooldownHours: 24, position: 'bottom-right' },
      });
    apiKey = appRes.body.apiKey;
    applicationId = appRes.body.id;

    // Submit 5 feedback entries
    const feedbacks = [
      { score: 9, comment: 'Excellent product' },
      { score: 10, comment: 'Love it, amazing experience' },
      { score: 7, comment: 'Pretty good overall' },
      { score: 3, comment: 'Terrible, very slow and buggy' },
      { score: 8, comment: 'Good but could be better' },
    ];
    for (const fb of feedbacks) {
      await request(app.getHttpServer())
        .post('/api/widget/feedback')
        .send({ apiKey, ...fb });
    }
  });

  afterAll(async () => {
    await app.close();
  });

  describe('GET /api/analytics/summary', () => {
    it('should return summary metrics', () => {
      return request(app.getHttpServer())
        .get('/api/analytics/summary')
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(200)
        .expect((res) => {
          expect(res.body.averageScore).toBeDefined();
          expect(res.body.npsScore).toBeDefined();
          expect(res.body.totalResponses).toBe(5);
        });
    });
  });

  describe('GET /api/analytics/distribution', () => {
    it('should return score distribution', () => {
      return request(app.getHttpServer())
        .get('/api/analytics/distribution')
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(200)
        .expect((res) => {
          expect(Array.isArray(res.body)).toBe(true);
          expect(res.body.length).toBe(11); // scores 0-10
        });
    });
  });

  describe('GET /api/analytics/trends', () => {
    it('should return score trends', () => {
      return request(app.getHttpServer())
        .get('/api/analytics/trends?granularity=daily')
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(200)
        .expect((res) => {
          expect(Array.isArray(res.body)).toBe(true);
        });
    });
  });

  describe('GET /api/analytics/sentiment', () => {
    it('should return sentiment breakdown', () => {
      return request(app.getHttpServer())
        .get('/api/analytics/sentiment')
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(200)
        .expect((res) => {
          expect(res.body.positive).toBeDefined();
          expect(res.body.negative).toBeDefined();
          expect(res.body.neutral).toBeDefined();
        });
    });
  });

  describe('GET /api/analytics/word-cloud', () => {
    it('should return keyword list', () => {
      return request(app.getHttpServer())
        .get('/api/analytics/word-cloud')
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(200)
        .expect((res) => {
          expect(Array.isArray(res.body)).toBe(true);
        });
    });
  });

  describe('GET /api/analytics/comparison', () => {
    it('should return per-app comparison', () => {
      return request(app.getHttpServer())
        .get('/api/analytics/comparison')
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(200)
        .expect((res) => {
          expect(Array.isArray(res.body)).toBe(true);
          expect(res.body[0].applicationId).toBeDefined();
          expect(res.body[0].averageScore).toBeDefined();
        });
    });
  });
});
```

- [ ] **Step 2: Run test, verify it fails**

Run: `cd packages/backend && pnpm test:e2e -- --testPathPattern=analytics`
Expected: FAIL

- [ ] **Step 3: Create AnalyticsQuery DTO**

```ts
// packages/backend/src/analytics/dto/analytics-query.dto.ts
import { IsOptional, IsUUID, IsDateString, IsIn } from 'class-validator';

export class AnalyticsQueryDto {
  @IsOptional()
  @IsUUID()
  applicationId?: string;

  @IsOptional()
  @IsDateString()
  dateFrom?: string;

  @IsOptional()
  @IsDateString()
  dateTo?: string;

  @IsOptional()
  @IsIn(['daily', 'weekly', 'monthly'])
  granularity?: 'daily' | 'weekly' | 'monthly' = 'daily';
}
```

- [ ] **Step 4: Create AnalyticsService**

```ts
// packages/backend/src/analytics/analytics.service.ts
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, SelectQueryBuilder } from 'typeorm';
import { FeedbackResponse } from '../feedback/feedback-response.entity';
import { SentimentService } from '../sentiment/sentiment.service';
import { AnalyticsQueryDto } from './dto/analytics-query.dto';

@Injectable()
export class AnalyticsService {
  constructor(
    @InjectRepository(FeedbackResponse)
    private feedbackRepository: Repository<FeedbackResponse>,
    private sentimentService: SentimentService,
  ) {}

  private applyFilters(
    qb: SelectQueryBuilder<FeedbackResponse>,
    query: AnalyticsQueryDto,
  ) {
    if (query.applicationId) {
      qb.andWhere('f.applicationId = :applicationId', {
        applicationId: query.applicationId,
      });
    }
    if (query.dateFrom) {
      qb.andWhere('f.createdAt >= :dateFrom', { dateFrom: query.dateFrom });
    }
    if (query.dateTo) {
      qb.andWhere('f.createdAt <= :dateTo', { dateTo: query.dateTo });
    }
    return qb;
  }

  async getSummary(query: AnalyticsQueryDto) {
    const qb = this.feedbackRepository.createQueryBuilder('f');
    this.applyFilters(qb, query);

    const result = await qb
      .select('AVG(f.score)', 'averageScore')
      .addSelect('COUNT(*)', 'totalResponses')
      .getRawOne();

    // Calculate NPS
    const npsQb = this.feedbackRepository.createQueryBuilder('f');
    this.applyFilters(npsQb, query);
    const all = await npsQb.getMany();
    const total = all.length;

    let npsScore = 0;
    if (total > 0) {
      const promoters = all.filter((f) => f.score >= 9).length;
      const detractors = all.filter((f) => f.score <= 6).length;
      npsScore = Math.round(((promoters - detractors) / total) * 100);
    }

    return {
      averageScore: parseFloat(result.averageScore) || 0,
      npsScore,
      totalResponses: parseInt(result.totalResponses) || 0,
    };
  }

  async getDistribution(query: AnalyticsQueryDto) {
    const qb = this.feedbackRepository.createQueryBuilder('f');
    this.applyFilters(qb, query);

    const results = await qb
      .select('f.score', 'score')
      .addSelect('COUNT(*)', 'count')
      .groupBy('f.score')
      .orderBy('f.score', 'ASC')
      .getRawMany();

    // Fill all scores 0-10
    const distribution = Array.from({ length: 11 }, (_, i) => ({
      score: i,
      count: 0,
    }));
    results.forEach((r) => {
      distribution[r.score].count = parseInt(r.count);
    });
    return distribution;
  }

  async getTrends(query: AnalyticsQueryDto) {
    const granularity = query.granularity || 'daily';
    const truncTo = granularity === 'monthly' ? 'month' : granularity === 'weekly' ? 'week' : 'day';

    const qb = this.feedbackRepository.createQueryBuilder('f');
    this.applyFilters(qb, query);

    const results = await qb
      .select(`DATE_TRUNC('${truncTo}', f."createdAt")`, 'period')
      .addSelect('AVG(f.score)', 'averageScore')
      .addSelect('COUNT(*)', 'count')
      .groupBy('period')
      .orderBy('period', 'ASC')
      .getRawMany();

    return results.map((r) => ({
      period: r.period,
      averageScore: parseFloat(r.averageScore) || 0,
      count: parseInt(r.count) || 0,
    }));
  }

  async getSentimentBreakdown(query: AnalyticsQueryDto) {
    const qb = this.feedbackRepository.createQueryBuilder('f');
    this.applyFilters(qb, query);

    const results = await qb
      .select('f.sentiment', 'sentiment')
      .addSelect('COUNT(*)', 'count')
      .groupBy('f.sentiment')
      .getRawMany();

    const breakdown = { positive: 0, negative: 0, neutral: 0 };
    results.forEach((r) => {
      breakdown[r.sentiment as keyof typeof breakdown] = parseInt(r.count);
    });
    return breakdown;
  }

  async getWordCloud(query: AnalyticsQueryDto) {
    const qb = this.feedbackRepository.createQueryBuilder('f');
    this.applyFilters(qb, query);
    qb.andWhere('f.comment IS NOT NULL');

    const feedbacks = await qb.getMany();
    const comments = feedbacks.map((f) => f.comment).filter(Boolean);

    return this.sentimentService.extractKeywords(comments, 30);
  }

  async getComparison(query: AnalyticsQueryDto) {
    const qb = this.feedbackRepository.createQueryBuilder('f')
      .leftJoinAndSelect('f.application', 'app');

    if (query.dateFrom) {
      qb.andWhere('f.createdAt >= :dateFrom', { dateFrom: query.dateFrom });
    }
    if (query.dateTo) {
      qb.andWhere('f.createdAt <= :dateTo', { dateTo: query.dateTo });
    }

    const results = await qb
      .select('f.applicationId', 'applicationId')
      .addSelect('app.name', 'applicationName')
      .addSelect('AVG(f.score)', 'averageScore')
      .addSelect('COUNT(*)', 'totalResponses')
      .groupBy('f.applicationId')
      .addGroupBy('app.name')
      .getRawMany();

    return results.map((r) => ({
      applicationId: r.applicationId,
      applicationName: r.applicationName,
      averageScore: parseFloat(r.averageScore) || 0,
      totalResponses: parseInt(r.totalResponses) || 0,
    }));
  }
}
```

- [ ] **Step 5: Create AnalyticsController**

```ts
// packages/backend/src/analytics/analytics.controller.ts
import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { AnalyticsService } from './analytics.service';
import { AnalyticsQueryDto } from './dto/analytics-query.dto';

@ApiTags('analytics')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('api/analytics')
export class AnalyticsController {
  constructor(private analyticsService: AnalyticsService) {}

  @Get('summary')
  getSummary(@Query() query: AnalyticsQueryDto) {
    return this.analyticsService.getSummary(query);
  }

  @Get('trends')
  getTrends(@Query() query: AnalyticsQueryDto) {
    return this.analyticsService.getTrends(query);
  }

  @Get('distribution')
  getDistribution(@Query() query: AnalyticsQueryDto) {
    return this.analyticsService.getDistribution(query);
  }

  @Get('sentiment')
  getSentiment(@Query() query: AnalyticsQueryDto) {
    return this.analyticsService.getSentimentBreakdown(query);
  }

  @Get('word-cloud')
  getWordCloud(@Query() query: AnalyticsQueryDto) {
    return this.analyticsService.getWordCloud(query);
  }

  @Get('comparison')
  getComparison(@Query() query: AnalyticsQueryDto) {
    return this.analyticsService.getComparison(query);
  }
}
```

- [ ] **Step 6: Create AnalyticsModule and register in AppModule**

```ts
// packages/backend/src/analytics/analytics.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FeedbackResponse } from '../feedback/feedback-response.entity';
import { AnalyticsController } from './analytics.controller';
import { AnalyticsService } from './analytics.service';

@Module({
  imports: [TypeOrmModule.forFeature([FeedbackResponse])],
  controllers: [AnalyticsController],
  providers: [AnalyticsService],
})
export class AnalyticsModule {}
```

Add to `app.module.ts` imports.

- [ ] **Step 7: Run e2e tests**

Run: `cd packages/backend && pnpm test:e2e -- --testPathPattern=analytics`
Expected: All tests pass

- [ ] **Step 8: Commit**

```bash
git add packages/backend/src/analytics packages/backend/test/analytics.e2e-spec.ts
git commit -m "feat: add analytics endpoints (summary, trends, distribution, sentiment, word-cloud, comparison)"
```

---

## Task 8: Backend — Static Widget Serving

**Files:**
- Modify: `packages/backend/src/main.ts`

- [ ] **Step 1: Add static file serving for widget bundle**

Add to `packages/backend/src/main.ts` before `app.listen()`:

```ts
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';

// In bootstrap(), change create call:
const app = await NestFactory.create<NestExpressApplication>(AppModule);

// Add static serving for widget:
app.useStaticAssets(join(__dirname, '..', '..', 'widget', 'dist'), {
  prefix: '/widget/',
});
```

- [ ] **Step 2: Verify build**

Run: `cd packages/backend && pnpm build`
Expected: Compiles

- [ ] **Step 3: Commit**

```bash
git add packages/backend/src/main.ts
git commit -m "feat: serve widget JS bundle as static asset from backend"
```

---

## Task 9: Frontend — Project Setup, Theme, Auth Context

**Files:**
- Create: `packages/frontend/src/main.tsx`
- Create: `packages/frontend/src/App.tsx`
- Create: `packages/frontend/src/api/client.ts`
- Create: `packages/frontend/src/context/AuthContext.tsx`
- Create: `packages/frontend/src/context/ThemeContext.tsx`
- Create: `packages/frontend/src/styles/theme.ts`
- Create: `packages/frontend/src/styles/glass.css`
- Create: `packages/frontend/src/types/index.ts`

- [ ] **Step 1: Create shared types**

```ts
// packages/frontend/src/types/index.ts
export interface User {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'member';
  createdAt: string;
}

export interface WidgetConfig {
  mode: 'floating' | 'inline';
  question: string;
  commentRequired: boolean;
  themeColor: string;
  cooldownHours: number;
  position: string;
}

export interface Application {
  id: string;
  name: string;
  description?: string;
  apiKey: string;
  widgetConfig: WidgetConfig;
  createdById: string;
  createdAt: string;
  updatedAt: string;
  embedSnippet?: string;
  previousApiKeyExpiresAt?: string;
}

export interface FeedbackResponse {
  id: string;
  applicationId: string;
  application?: Application;
  score: number;
  comment?: string;
  sentiment: 'positive' | 'negative' | 'neutral';
  userMetadata?: Record<string, unknown>;
  createdAt: string;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface AnalyticsSummary {
  averageScore: number;
  npsScore: number;
  totalResponses: number;
}

export interface TrendPoint {
  period: string;
  averageScore: number;
  count: number;
}

export interface DistributionItem {
  score: number;
  count: number;
}

export interface SentimentBreakdown {
  positive: number;
  negative: number;
  neutral: number;
}

export interface KeywordItem {
  term: string;
  weight: number;
}

export interface ComparisonItem {
  applicationId: string;
  applicationName: string;
  averageScore: number;
  totalResponses: number;
}
```

- [ ] **Step 2: Create API client**

```ts
// packages/frontend/src/api/client.ts
import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('accessToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      const refreshToken = localStorage.getItem('refreshToken');
      if (refreshToken) {
        try {
          const res = await axios.post('/api/auth/refresh', { refreshToken });
          localStorage.setItem('accessToken', res.data.accessToken);
          localStorage.setItem('refreshToken', res.data.refreshToken);
          originalRequest.headers.Authorization = `Bearer ${res.data.accessToken}`;
          return api(originalRequest);
        } catch {
          localStorage.removeItem('accessToken');
          localStorage.removeItem('refreshToken');
          window.location.href = '/login';
        }
      }
    }
    return Promise.reject(error);
  },
);

export default api;
```

- [ ] **Step 3: Create theme config and glass CSS**

```ts
// packages/frontend/src/styles/theme.ts
import type { ThemeConfig } from 'antd';

const baseTokens = {
  colorPrimary: '#354B8C',
  colorSuccess: '#2D733E',
  colorWarning: '#F2BB77',
  colorError: '#D93A2B',
  borderRadius: 8,
  fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Segoe UI', sans-serif",
};

export const lightTheme: ThemeConfig = {
  token: {
    ...baseTokens,
    colorBgContainer: 'rgba(255, 255, 255, 0.55)',
    colorBgLayout: '#e8e6e4',
    colorText: '#1a1a2e',
    colorTextSecondary: '#555566',
  },
};

export const darkTheme: ThemeConfig = {
  token: {
    ...baseTokens,
    colorBgContainer: 'rgba(40, 48, 80, 0.35)',
    colorBgLayout: '#0f1225',
    colorText: '#F2F1F0',
    colorTextSecondary: '#b0b0c0',
  },
};
```

```css
/* packages/frontend/src/styles/glass.css */
.glass-card {
  background: var(--glass-bg, rgba(255, 255, 255, 0.45));
  backdrop-filter: blur(20px) saturate(1.4);
  -webkit-backdrop-filter: blur(20px) saturate(1.4);
  border: 1px solid var(--glass-border, rgba(255, 255, 255, 0.3));
  border-radius: 12px;
  box-shadow: 0 8px 32px var(--glass-shadow, rgba(53, 75, 140, 0.08));
  transition: all 0.3s;
}

.glass-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 12px 48px var(--glass-shadow-hover, rgba(53, 75, 140, 0.12));
}

[data-theme='dark'] .glass-card {
  --glass-bg: rgba(40, 48, 80, 0.35);
  --glass-border: rgba(255, 255, 255, 0.08);
  --glass-shadow: rgba(0, 0, 0, 0.3);
  --glass-shadow-hover: rgba(0, 0, 0, 0.4);
}

body {
  transition: background 0.4s ease, color 0.3s ease;
}

body::before {
  content: '';
  position: fixed;
  top: 0; left: 0; right: 0; bottom: 0;
  background:
    radial-gradient(ellipse at 20% 20%, rgba(53, 75, 140, 0.15) 0%, transparent 50%),
    radial-gradient(ellipse at 80% 80%, rgba(45, 115, 62, 0.08) 0%, transparent 50%),
    radial-gradient(ellipse at 60% 30%, rgba(242, 187, 119, 0.06) 0%, transparent 40%);
  z-index: -1;
  pointer-events: none;
}
```

- [ ] **Step 4: Create ThemeContext**

```tsx
// packages/frontend/src/context/ThemeContext.tsx
import React, { createContext, useContext, useState, useEffect } from 'react';

type ThemeMode = 'light' | 'dark' | 'system';

interface ThemeContextType {
  mode: ThemeMode;
  setMode: (mode: ThemeMode) => void;
  resolved: 'light' | 'dark';
}

const ThemeContext = createContext<ThemeContextType>(null!);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [mode, setModeState] = useState<ThemeMode>(
    () => (localStorage.getItem('theme') as ThemeMode) || 'system',
  );

  const systemDark = window.matchMedia('(prefers-color-scheme: dark)');
  const [systemIsDark, setSystemIsDark] = useState(systemDark.matches);

  useEffect(() => {
    const handler = (e: MediaQueryListEvent) => setSystemIsDark(e.matches);
    systemDark.addEventListener('change', handler);
    return () => systemDark.removeEventListener('change', handler);
  }, []);

  const resolved = mode === 'system' ? (systemIsDark ? 'dark' : 'light') : mode;

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', resolved);
  }, [resolved]);

  const setMode = (m: ThemeMode) => {
    setModeState(m);
    localStorage.setItem('theme', m);
  };

  return (
    <ThemeContext.Provider value={{ mode, setMode, resolved }}>
      {children}
    </ThemeContext.Provider>
  );
}

export const useTheme = () => useContext(ThemeContext);
```

- [ ] **Step 5: Create AuthContext**

```tsx
// packages/frontend/src/context/AuthContext.tsx
import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../api/client';
import type { User } from '../types';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType>(null!);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      api.get('/auth/me')
        .then((res) => setUser(res.data))
        .catch(() => {
          localStorage.removeItem('accessToken');
          localStorage.removeItem('refreshToken');
        })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  const login = async (email: string, password: string) => {
    const res = await api.post('/auth/login', { email, password });
    localStorage.setItem('accessToken', res.data.accessToken);
    localStorage.setItem('refreshToken', res.data.refreshToken);
    setUser(res.data.user);
  };

  const register = async (email: string, password: string, name: string) => {
    const res = await api.post('/auth/register', { email, password, name });
    localStorage.setItem('accessToken', res.data.accessToken);
    localStorage.setItem('refreshToken', res.data.refreshToken);
    setUser(res.data.user);
  };

  const logout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
```

- [ ] **Step 6: Create App.tsx and main.tsx**

```tsx
// packages/frontend/src/App.tsx
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ConfigProvider } from 'antd';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider, useTheme } from './context/ThemeContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import { lightTheme, darkTheme } from './styles/theme';
import DashboardLayout from './layouts/DashboardLayout';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import ApplicationsPage from './pages/ApplicationsPage';
import NewApplicationPage from './pages/NewApplicationPage';
import ApplicationDetailPage from './pages/ApplicationDetailPage';
import ResponsesPage from './pages/ResponsesPage';
import ComparisonPage from './pages/ComparisonPage';
import ExportPage from './pages/ExportPage';
import SettingsPage from './pages/SettingsPage';
import './styles/glass.css';

const queryClient = new QueryClient();

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  if (loading) return null;
  if (!user) return <Navigate to="/login" />;
  return <>{children}</>;
}

function ThemedApp() {
  const { resolved } = useTheme();

  return (
    <ConfigProvider theme={resolved === 'dark' ? darkTheme : lightTheme}>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route
            path="/*"
            element={
              <ProtectedRoute>
                <DashboardLayout>
                  <Routes>
                    <Route path="/" element={<DashboardPage />} />
                    <Route path="/applications" element={<ApplicationsPage />} />
                    <Route path="/applications/new" element={<NewApplicationPage />} />
                    <Route path="/applications/:id" element={<ApplicationDetailPage />} />
                    <Route path="/responses" element={<ResponsesPage />} />
                    <Route path="/comparison" element={<ComparisonPage />} />
                    <Route path="/export" element={<ExportPage />} />
                    <Route path="/settings" element={<SettingsPage />} />
                  </Routes>
                </DashboardLayout>
              </ProtectedRoute>
            }
          />
        </Routes>
      </BrowserRouter>
    </ConfigProvider>
  );
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <AuthProvider>
          <ThemedApp />
        </AuthProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}
```

```tsx
// packages/frontend/src/main.tsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
```

- [ ] **Step 7: Create stub pages (each as a simple placeholder)**

Create each page file in `packages/frontend/src/pages/` with a basic placeholder:

```tsx
// Template for each page — replace PageName and title
export default function PageName() {
  return <div><h2>Page Title</h2></div>;
}
```

Create stubs for: `LoginPage`, `RegisterPage`, `DashboardPage`, `ApplicationsPage`, `NewApplicationPage`, `ApplicationDetailPage`, `ResponsesPage`, `ComparisonPage`, `ExportPage`, `SettingsPage`.

- [ ] **Step 8: Verify frontend compiles**

Run: `cd packages/frontend && pnpm build`
Expected: Builds without errors

- [ ] **Step 9: Commit**

```bash
git add packages/frontend/src
git commit -m "feat: scaffold frontend with routing, auth context, theme system, and glassmorphism"
```

---

## Task 10: Frontend — DashboardLayout & Core Components

**Files:**
- Create: `packages/frontend/src/layouts/DashboardLayout.tsx`
- Create: `packages/frontend/src/components/GlassCard.tsx`
- Create: `packages/frontend/src/components/ThemeToggle.tsx`
- Create: `packages/frontend/src/components/ScoreTag.tsx`
- Create: `packages/frontend/src/components/FilterBar.tsx`

- [ ] **Step 1: Create GlassCard component**

```tsx
// packages/frontend/src/components/GlassCard.tsx
import React from 'react';

interface GlassCardProps {
  children: React.ReactNode;
  style?: React.CSSProperties;
  className?: string;
  hoverable?: boolean;
}

export default function GlassCard({ children, style, className, hoverable = true }: GlassCardProps) {
  return (
    <div className={`glass-card ${hoverable ? '' : 'no-hover'} ${className || ''}`} style={style}>
      {children}
    </div>
  );
}
```

- [ ] **Step 2: Create ThemeToggle component**

```tsx
// packages/frontend/src/components/ThemeToggle.tsx
import { useTheme } from '../context/ThemeContext';

const modes = ['light', 'system', 'dark'] as const;

export default function ThemeToggle() {
  const { mode, setMode } = useTheme();

  return (
    <div style={{ padding: '16px 20px', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
      <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.6)', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 8 }}>
        Theme
      </div>
      <div style={{ display: 'flex', background: 'rgba(0,0,0,0.2)', borderRadius: 6, padding: 2 }}>
        {modes.map((m) => (
          <button
            key={m}
            onClick={() => setMode(m)}
            style={{
              flex: 1, padding: '5px 0', textAlign: 'center', fontSize: 11,
              color: mode === m ? 'rgba(255,255,255,0.95)' : 'rgba(255,255,255,0.5)',
              background: mode === m ? 'rgba(255,255,255,0.18)' : 'transparent',
              border: 'none', borderRadius: 4, cursor: 'pointer',
              fontFamily: 'inherit', transition: 'all 0.2s',
              textTransform: 'capitalize',
            }}
          >
            {m}
          </button>
        ))}
      </div>
    </div>
  );
}
```

- [ ] **Step 3: Create ScoreTag component**

```tsx
// packages/frontend/src/components/ScoreTag.tsx
import { Tag } from 'antd';

export default function ScoreTag({ score }: { score: number }) {
  const color = score >= 9 ? '#2D733E' : score >= 7 ? '#354B8C' : '#D93A2B';
  return <Tag color={color}>{score}</Tag>;
}
```

- [ ] **Step 4: Create FilterBar component**

```tsx
// packages/frontend/src/components/FilterBar.tsx
import { Select, DatePicker, Button, Space } from 'antd';
import dayjs from 'dayjs';
import type { Application } from '../types';

const { RangePicker } = DatePicker;

interface FilterBarProps {
  applications: Application[];
  filters: {
    applicationId?: string;
    dateFrom?: string;
    dateTo?: string;
  };
  onChange: (filters: FilterBarProps['filters']) => void;
  onExport?: () => void;
}

export default function FilterBar({ applications, filters, onChange, onExport }: FilterBarProps) {
  return (
    <Space wrap style={{ marginBottom: 24, width: '100%', justifyContent: 'space-between' }}>
      <Space wrap>
        <Select
          placeholder="All Applications"
          allowClear
          style={{ minWidth: 180 }}
          value={filters.applicationId}
          onChange={(v) => onChange({ ...filters, applicationId: v })}
          options={applications.map((a) => ({ label: a.name, value: a.id }))}
        />
        <RangePicker
          value={
            filters.dateFrom && filters.dateTo
              ? [dayjs(filters.dateFrom), dayjs(filters.dateTo)]
              : undefined
          }
          onChange={(dates) =>
            onChange({
              ...filters,
              dateFrom: dates?.[0]?.toISOString(),
              dateTo: dates?.[1]?.toISOString(),
            })
          }
        />
        <Button onClick={() => onChange({})}>Reset Filters</Button>
      </Space>
      {onExport && <Button type="primary" onClick={onExport}>Export</Button>}
    </Space>
  );
}
```

- [ ] **Step 5: Create DashboardLayout**

```tsx
// packages/frontend/src/layouts/DashboardLayout.tsx
import React from 'react';
import { Layout, Menu } from 'antd';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import ThemeToggle from '../components/ThemeToggle';

const { Sider, Content } = Layout;

const menuItems = [
  { key: '/', label: 'Dashboard' },
  { key: '/applications', label: 'Applications' },
  { key: '/responses', label: 'Responses' },
  { key: '/comparison', label: 'Comparison' },
  { key: '/export', label: 'Export' },
  { key: '/settings', label: 'Settings' },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const navigate = useNavigate();
  const location = useLocation();
  const { logout } = useAuth();

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider
        width={220}
        style={{
          background: 'rgba(53, 75, 140, 0.85)',
          backdropFilter: 'blur(20px) saturate(1.8)',
          borderRight: '1px solid rgba(255,255,255,0.1)',
        }}
      >
        <div style={{ padding: '20px 20px 16px', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
          <div style={{ fontSize: 18, fontWeight: 700, color: 'rgba(255,255,255,0.95)' }}>
            Feedback Hub
          </div>
          <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.6)', textTransform: 'uppercase', letterSpacing: 1 }}>
            Analytics Platform
          </div>
        </div>
        <Menu
          mode="inline"
          selectedKeys={[location.pathname]}
          onClick={({ key }) => {
            if (key === 'logout') {
              logout();
              navigate('/login');
            } else {
              navigate(key);
            }
          }}
          style={{ background: 'transparent', borderRight: 'none', color: 'rgba(255,255,255,0.6)' }}
          items={[
            ...menuItems,
            { type: 'divider' as const },
            { key: 'logout', label: 'Logout' },
          ]}
        />
        <div style={{ marginTop: 'auto' }}>
          <ThemeToggle />
        </div>
      </Sider>
      <Content style={{ padding: '24px 28px', overflow: 'auto' }}>
        {children}
      </Content>
    </Layout>
  );
}
```

- [ ] **Step 6: Verify build**

Run: `cd packages/frontend && pnpm build`
Expected: Builds

- [ ] **Step 7: Commit**

```bash
git add packages/frontend/src/layouts packages/frontend/src/components
git commit -m "feat: add dashboard layout with glassmorphic sidebar, theme toggle, and core components"
```

---

## Task 11: Frontend — Auth Pages

**Files:**
- Modify: `packages/frontend/src/pages/LoginPage.tsx`
- Modify: `packages/frontend/src/pages/RegisterPage.tsx`

- [ ] **Step 1: Implement LoginPage**

```tsx
// packages/frontend/src/pages/LoginPage.tsx
import { useState } from 'react';
import { Form, Input, Button, Typography, message } from 'antd';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import GlassCard from '../components/GlassCard';

const { Title, Text } = Typography;

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const onFinish = async (values: { email: string; password: string }) => {
    setLoading(true);
    try {
      await login(values.email, values.password);
      navigate('/');
    } catch {
      message.error('Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
      <GlassCard style={{ width: 400, padding: 32 }}>
        <Title level={3} style={{ marginBottom: 4 }}>Feedback Hub</Title>
        <Text type="secondary" style={{ display: 'block', marginBottom: 24 }}>Sign in to your account</Text>
        <Form layout="vertical" onFinish={onFinish}>
          <Form.Item name="email" label="Email" rules={[{ required: true, type: 'email' }]}>
            <Input size="large" />
          </Form.Item>
          <Form.Item name="password" label="Password" rules={[{ required: true }]}>
            <Input.Password size="large" />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" block size="large" loading={loading}>
              Sign In
            </Button>
          </Form.Item>
        </Form>
        <Text>Don't have an account? <Link to="/register">Register</Link></Text>
      </GlassCard>
    </div>
  );
}
```

- [ ] **Step 2: Implement RegisterPage**

```tsx
// packages/frontend/src/pages/RegisterPage.tsx
import { useState } from 'react';
import { Form, Input, Button, Typography, message } from 'antd';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import GlassCard from '../components/GlassCard';

const { Title, Text } = Typography;

export default function RegisterPage() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const onFinish = async (values: { email: string; password: string; name: string }) => {
    setLoading(true);
    try {
      await register(values.email, values.password, values.name);
      navigate('/');
    } catch {
      message.error('Registration failed. Email may already be in use.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
      <GlassCard style={{ width: 400, padding: 32 }}>
        <Title level={3} style={{ marginBottom: 4 }}>Create Account</Title>
        <Text type="secondary" style={{ display: 'block', marginBottom: 24 }}>Get started with Feedback Hub</Text>
        <Form layout="vertical" onFinish={onFinish}>
          <Form.Item name="name" label="Name" rules={[{ required: true }]}>
            <Input size="large" />
          </Form.Item>
          <Form.Item name="email" label="Email" rules={[{ required: true, type: 'email' }]}>
            <Input size="large" />
          </Form.Item>
          <Form.Item name="password" label="Password" rules={[{ required: true, min: 8 }]}>
            <Input.Password size="large" />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" block size="large" loading={loading}>
              Create Account
            </Button>
          </Form.Item>
        </Form>
        <Text>Already have an account? <Link to="/login">Sign in</Link></Text>
      </GlassCard>
    </div>
  );
}
```

- [ ] **Step 3: Verify build**

Run: `cd packages/frontend && pnpm build`
Expected: Builds

- [ ] **Step 4: Commit**

```bash
git add packages/frontend/src/pages/LoginPage.tsx packages/frontend/src/pages/RegisterPage.tsx
git commit -m "feat: implement login and register pages with glassmorphic cards"
```

---

## Task 12: Frontend — React Query Hooks

**Files:**
- Create: `packages/frontend/src/hooks/useAuth.ts`
- Create: `packages/frontend/src/hooks/useApplications.ts`
- Create: `packages/frontend/src/hooks/useFeedback.ts`
- Create: `packages/frontend/src/hooks/useAnalytics.ts`

- [ ] **Step 1: Create all hooks**

```ts
// packages/frontend/src/hooks/useApplications.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../api/client';
import type { Application } from '../types';

export function useApplications() {
  return useQuery({
    queryKey: ['applications'],
    queryFn: () => api.get<Application[]>('/applications').then((r) => r.data),
  });
}

export function useApplication(id: string) {
  return useQuery({
    queryKey: ['applications', id],
    queryFn: () => api.get<Application & { embedSnippet: string }>(`/applications/${id}`).then((r) => r.data),
    enabled: !!id,
  });
}

export function useCreateApplication() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: { name: string; description?: string; widgetConfig: Application['widgetConfig'] }) =>
      api.post<Application>('/applications', data).then((r) => r.data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['applications'] }),
  });
}

export function useUpdateApplication() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, ...data }: { id: string } & Partial<Application>) =>
      api.patch<Application>(`/applications/${id}`, data).then((r) => r.data),
    onSuccess: (_, vars) => {
      qc.invalidateQueries({ queryKey: ['applications'] });
      qc.invalidateQueries({ queryKey: ['applications', vars.id] });
    },
  });
}

export function useDeleteApplication() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => api.delete(`/applications/${id}`),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['applications'] }),
  });
}

export function useRegenerateKey() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => api.post<Application>(`/applications/${id}/regenerate-key`).then((r) => r.data),
    onSuccess: (_, id) => {
      qc.invalidateQueries({ queryKey: ['applications', id] });
    },
  });
}
```

```ts
// packages/frontend/src/hooks/useFeedback.ts
import { useQuery } from '@tanstack/react-query';
import api from '../api/client';
import type { FeedbackResponse, PaginatedResponse } from '../types';

interface FeedbackFilters {
  applicationId?: string;
  dateFrom?: string;
  dateTo?: string;
  page?: number;
  limit?: number;
}

export function useFeedback(filters: FeedbackFilters) {
  return useQuery({
    queryKey: ['feedback', filters],
    queryFn: () =>
      api.get<PaginatedResponse<FeedbackResponse>>('/feedback', { params: filters }).then((r) => r.data),
  });
}
```

```ts
// packages/frontend/src/hooks/useAnalytics.ts
import { useQuery } from '@tanstack/react-query';
import api from '../api/client';
import type {
  AnalyticsSummary, TrendPoint, DistributionItem,
  SentimentBreakdown, KeywordItem, ComparisonItem,
} from '../types';

interface AnalyticsFilters {
  applicationId?: string;
  dateFrom?: string;
  dateTo?: string;
  granularity?: string;
}

export function useSummary(filters: AnalyticsFilters) {
  return useQuery({
    queryKey: ['analytics', 'summary', filters],
    queryFn: () => api.get<AnalyticsSummary>('/analytics/summary', { params: filters }).then((r) => r.data),
  });
}

export function useTrends(filters: AnalyticsFilters) {
  return useQuery({
    queryKey: ['analytics', 'trends', filters],
    queryFn: () => api.get<TrendPoint[]>('/analytics/trends', { params: filters }).then((r) => r.data),
  });
}

export function useDistribution(filters: AnalyticsFilters) {
  return useQuery({
    queryKey: ['analytics', 'distribution', filters],
    queryFn: () => api.get<DistributionItem[]>('/analytics/distribution', { params: filters }).then((r) => r.data),
  });
}

export function useSentiment(filters: AnalyticsFilters) {
  return useQuery({
    queryKey: ['analytics', 'sentiment', filters],
    queryFn: () => api.get<SentimentBreakdown>('/analytics/sentiment', { params: filters }).then((r) => r.data),
  });
}

export function useWordCloud(filters: AnalyticsFilters) {
  return useQuery({
    queryKey: ['analytics', 'word-cloud', filters],
    queryFn: () => api.get<KeywordItem[]>('/analytics/word-cloud', { params: filters }).then((r) => r.data),
  });
}

export function useComparison(filters: AnalyticsFilters) {
  return useQuery({
    queryKey: ['analytics', 'comparison', filters],
    queryFn: () => api.get<ComparisonItem[]>('/analytics/comparison', { params: filters }).then((r) => r.data),
  });
}
```

- [ ] **Step 2: Verify build**

Run: `cd packages/frontend && pnpm build`
Expected: Builds

- [ ] **Step 3: Commit**

```bash
git add packages/frontend/src/hooks
git commit -m "feat: add React Query hooks for applications, feedback, and analytics"
```

---

## Task 13: Frontend — Dashboard Page with Charts

**Files:**
- Modify: `packages/frontend/src/pages/DashboardPage.tsx`
- Create: `packages/frontend/src/components/SummaryCards.tsx`
- Create: `packages/frontend/src/components/ScoreTrendChart.tsx`
- Create: `packages/frontend/src/components/ScoreDistributionChart.tsx`
- Create: `packages/frontend/src/components/WordCloud.tsx`
- Create: `packages/frontend/src/components/RecentComments.tsx`

- [ ] **Step 1: Create SummaryCards**

```tsx
// packages/frontend/src/components/SummaryCards.tsx
import { Col, Row } from 'antd';
import GlassCard from './GlassCard';
import type { AnalyticsSummary } from '../types';

interface Props {
  summary?: AnalyticsSummary;
  loading: boolean;
}

export default function SummaryCards({ summary, loading }: Props) {
  const cards = [
    { label: 'Average Score', value: summary?.averageScore?.toFixed(1) ?? '-', color: '#2D733E' },
    { label: 'NPS Score', value: summary ? `${summary.npsScore > 0 ? '+' : ''}${summary.npsScore}` : '-', color: '#354B8C' },
    { label: 'Total Responses', value: summary?.totalResponses?.toLocaleString() ?? '-', color: undefined },
  ];

  return (
    <Row gutter={14} style={{ marginBottom: 24 }}>
      {cards.map((card) => (
        <Col span={8} key={card.label}>
          <GlassCard style={{ padding: 20 }}>
            <div style={{ fontSize: 12, color: '#888', marginBottom: 8 }}>{card.label}</div>
            <div style={{ fontSize: 30, fontWeight: 700, color: card.color }}>{loading ? '...' : card.value}</div>
          </GlassCard>
        </Col>
      ))}
    </Row>
  );
}
```

- [ ] **Step 2: Create ScoreTrendChart**

```tsx
// packages/frontend/src/components/ScoreTrendChart.tsx
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import GlassCard from './GlassCard';
import type { TrendPoint } from '../types';
import dayjs from 'dayjs';

interface Props {
  data?: TrendPoint[];
  loading: boolean;
}

export default function ScoreTrendChart({ data, loading }: Props) {
  const formatted = (data || []).map((d) => ({
    ...d,
    label: dayjs(d.period).format('MMM D'),
  }));

  return (
    <GlassCard style={{ padding: 20 }} hoverable={false}>
      <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 16 }}>Score Trend</div>
      {loading ? (
        <div style={{ height: 200, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>Loading...</div>
      ) : (
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={formatted}>
            <XAxis dataKey="label" fontSize={10} />
            <YAxis domain={[0, 10]} fontSize={10} />
            <Tooltip />
            <Bar dataKey="averageScore" fill="#354B8C" radius={[3, 3, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      )}
    </GlassCard>
  );
}
```

- [ ] **Step 3: Create ScoreDistributionChart**

```tsx
// packages/frontend/src/components/ScoreDistributionChart.tsx
import GlassCard from './GlassCard';
import type { DistributionItem } from '../types';

interface Props {
  data?: DistributionItem[];
  loading: boolean;
}

function barColor(score: number) {
  if (score >= 9) return '#2D733E';
  if (score >= 7) return '#354B8C';
  return '#D93A2B';
}

export default function ScoreDistributionChart({ data, loading }: Props) {
  const maxCount = Math.max(...(data || []).map((d) => d.count), 1);

  return (
    <GlassCard style={{ padding: 20 }} hoverable={false}>
      <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 16 }}>Score Distribution</div>
      {loading ? (
        <div>Loading...</div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
          {(data || []).reverse().map((d) => (
            <div key={d.score} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <span style={{ width: 24, textAlign: 'right', fontSize: 12, color: '#888' }}>{d.score}</span>
              <div style={{ flex: 1, height: 16, background: 'rgba(53,75,140,0.04)', borderRadius: 4, overflow: 'hidden' }}>
                <div
                  style={{
                    height: '100%',
                    width: `${(d.count / maxCount) * 100}%`,
                    background: barColor(d.score),
                    borderRadius: 4,
                    transition: 'width 0.5s',
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </GlassCard>
  );
}
```

- [ ] **Step 4: Create WordCloud**

```tsx
// packages/frontend/src/components/WordCloud.tsx
import { Tag } from 'antd';
import GlassCard from './GlassCard';
import type { KeywordItem } from '../types';

interface Props {
  data?: KeywordItem[];
  loading: boolean;
}

const tagColors = ['#354B8C', '#2D733E', '#F2BB77', '#D93A2B', '#888'];

export default function WordCloud({ data, loading }: Props) {
  const maxWeight = Math.max(...(data || []).map((d) => d.weight), 1);

  return (
    <GlassCard style={{ padding: 20 }} hoverable={false}>
      <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 16 }}>Top Keywords</div>
      {loading ? (
        <div>Loading...</div>
      ) : (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, justifyContent: 'center', minHeight: 80 }}>
          {(data || []).map((kw, i) => {
            const size = 11 + (kw.weight / maxWeight) * 8;
            return (
              <Tag key={kw.term} color={tagColors[i % tagColors.length]} style={{ fontSize: size }}>
                {kw.term}
              </Tag>
            );
          })}
        </div>
      )}
    </GlassCard>
  );
}
```

- [ ] **Step 5: Create RecentComments**

```tsx
// packages/frontend/src/components/RecentComments.tsx
import GlassCard from './GlassCard';
import ScoreTag from './ScoreTag';
import type { FeedbackResponse } from '../types';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';

dayjs.extend(relativeTime);

interface Props {
  data?: FeedbackResponse[];
  loading: boolean;
}

export default function RecentComments({ data, loading }: Props) {
  return (
    <GlassCard style={{ padding: 20 }} hoverable={false}>
      <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 16 }}>Recent Comments</div>
      {loading ? (
        <div>Loading...</div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {(data || []).slice(0, 5).map((fb) => (
            <div
              key={fb.id}
              style={{
                padding: '12px 14px',
                borderRadius: 8,
                borderLeft: `3px solid ${fb.score >= 9 ? '#2D733E' : fb.score >= 7 ? '#354B8C' : '#D93A2B'}`,
                background: 'rgba(255,255,255,0.3)',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                <span style={{ fontSize: 13, fontWeight: 500, color: '#354B8C' }}>
                  {fb.application?.name || 'Unknown App'}
                </span>
                <ScoreTag score={fb.score} />
              </div>
              <div style={{ fontSize: 13, color: '#555' }}>{fb.comment}</div>
              <div style={{ fontSize: 11, color: '#888', marginTop: 4 }}>{dayjs(fb.createdAt).fromNow()}</div>
            </div>
          ))}
          {(!data || data.length === 0) && (
            <div style={{ textAlign: 'center', color: '#888', padding: 20 }}>
              No feedback yet. Register an app and embed the widget to get started.
            </div>
          )}
        </div>
      )}
    </GlassCard>
  );
}
```

- [ ] **Step 6: Implement DashboardPage**

```tsx
// packages/frontend/src/pages/DashboardPage.tsx
import { useState } from 'react';
import { Col, Row } from 'antd';
import FilterBar from '../components/FilterBar';
import SummaryCards from '../components/SummaryCards';
import ScoreTrendChart from '../components/ScoreTrendChart';
import ScoreDistributionChart from '../components/ScoreDistributionChart';
import WordCloud from '../components/WordCloud';
import RecentComments from '../components/RecentComments';
import { useApplications } from '../hooks/useApplications';
import { useSummary, useTrends, useDistribution, useWordCloud } from '../hooks/useAnalytics';
import { useFeedback } from '../hooks/useFeedback';

export default function DashboardPage() {
  const [filters, setFilters] = useState<{ applicationId?: string; dateFrom?: string; dateTo?: string }>({});
  const { data: applications } = useApplications();
  const { data: summary, isLoading: summaryLoading } = useSummary(filters);
  const { data: trends, isLoading: trendsLoading } = useTrends({ ...filters, granularity: 'daily' });
  const { data: distribution, isLoading: distLoading } = useDistribution(filters);
  const { data: keywords, isLoading: kwLoading } = useWordCloud(filters);
  const { data: feedback, isLoading: fbLoading } = useFeedback({ ...filters, limit: 5 });

  return (
    <div>
      <FilterBar applications={applications || []} filters={filters} onChange={setFilters} />
      <SummaryCards summary={summary} loading={summaryLoading} />
      <Row gutter={14} style={{ marginBottom: 24 }}>
        <Col span={16}>
          <ScoreTrendChart data={trends} loading={trendsLoading} />
        </Col>
        <Col span={8}>
          <ScoreDistributionChart data={distribution} loading={distLoading} />
        </Col>
      </Row>
      <Row gutter={14}>
        <Col span={12}>
          <WordCloud data={keywords} loading={kwLoading} />
        </Col>
        <Col span={12}>
          <RecentComments data={feedback?.items} loading={fbLoading} />
        </Col>
      </Row>
    </div>
  );
}
```

- [ ] **Step 7: Verify build**

Run: `cd packages/frontend && pnpm build`
Expected: Builds

- [ ] **Step 8: Commit**

```bash
git add packages/frontend/src/pages/DashboardPage.tsx packages/frontend/src/components
git commit -m "feat: implement dashboard page with analytics charts, word cloud, and recent comments"
```

---

## Task 14: Frontend — Applications, Responses, Comparison, Export, Settings Pages

**Files:**
- Modify: all remaining page files in `packages/frontend/src/pages/`
- Create: `packages/frontend/src/components/EmbedSnippet.tsx`

- [ ] **Step 1: Create EmbedSnippet component**

```tsx
// packages/frontend/src/components/EmbedSnippet.tsx
import { Typography, Button, message } from 'antd';

const { Paragraph } = Typography;

export default function EmbedSnippet({ snippet }: { snippet: string }) {
  const copy = () => {
    navigator.clipboard.writeText(snippet);
    message.success('Copied to clipboard');
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
        <span style={{ fontWeight: 500 }}>Embed Code</span>
        <Button size="small" onClick={copy}>Copy</Button>
      </div>
      <Paragraph>
        <pre style={{ background: 'rgba(0,0,0,0.04)', padding: 12, borderRadius: 8, fontSize: 12, overflow: 'auto' }}>
          {snippet}
        </pre>
      </Paragraph>
    </div>
  );
}
```

- [ ] **Step 2: Implement ApplicationsPage**

```tsx
// packages/frontend/src/pages/ApplicationsPage.tsx
import { Button, Card, Row, Col, Typography, Tag } from 'antd';
import { useNavigate } from 'react-router-dom';
import { useApplications } from '../hooks/useApplications';
import GlassCard from '../components/GlassCard';
import dayjs from 'dayjs';

const { Text } = Typography;

export default function ApplicationsPage() {
  const navigate = useNavigate();
  const { data: applications, isLoading } = useApplications();

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 24 }}>
        <h2>Applications</h2>
        <Button type="primary" onClick={() => navigate('/applications/new')}>
          Register New App
        </Button>
      </div>
      <Row gutter={[14, 14]}>
        {(applications || []).map((app) => (
          <Col span={8} key={app.id}>
            <GlassCard style={{ padding: 20, cursor: 'pointer' }}>
              <div onClick={() => navigate(`/applications/${app.id}`)}>
                <h3 style={{ marginBottom: 8 }}>{app.name}</h3>
                <Text type="secondary">{app.description || 'No description'}</Text>
                <div style={{ marginTop: 12 }}>
                  <Tag>{app.widgetConfig.mode}</Tag>
                  <Text type="secondary" style={{ fontSize: 12 }}>
                    Created {dayjs(app.createdAt).format('MMM D, YYYY')}
                  </Text>
                </div>
              </div>
            </GlassCard>
          </Col>
        ))}
        {!isLoading && (!applications || applications.length === 0) && (
          <Col span={24}>
            <GlassCard style={{ padding: 40, textAlign: 'center' }}>
              <h3>No applications yet</h3>
              <Text type="secondary">Register your first application to start collecting feedback.</Text>
              <div style={{ marginTop: 16 }}>
                <Button type="primary" onClick={() => navigate('/applications/new')}>Register New App</Button>
              </div>
            </GlassCard>
          </Col>
        )}
      </Row>
    </div>
  );
}
```

- [ ] **Step 3: Implement NewApplicationPage**

```tsx
// packages/frontend/src/pages/NewApplicationPage.tsx
import { Form, Input, Select, Switch, InputNumber, Button, message } from 'antd';
import { useNavigate } from 'react-router-dom';
import { useCreateApplication } from '../hooks/useApplications';
import GlassCard from '../components/GlassCard';

export default function NewApplicationPage() {
  const navigate = useNavigate();
  const createApp = useCreateApplication();

  const onFinish = async (values: any) => {
    try {
      const app = await createApp.mutateAsync({
        name: values.name,
        description: values.description,
        widgetConfig: {
          mode: values.mode,
          question: values.question,
          commentRequired: values.commentRequired ?? true,
          themeColor: values.themeColor || '#354B8C',
          cooldownHours: values.cooldownHours || 24,
          position: values.position || 'bottom-right',
        },
      });
      message.success('Application created');
      navigate(`/applications/${app.id}`);
    } catch {
      message.error('Failed to create application');
    }
  };

  return (
    <div style={{ maxWidth: 600 }}>
      <h2 style={{ marginBottom: 24 }}>Register New Application</h2>
      <GlassCard style={{ padding: 24 }}>
        <Form layout="vertical" onFinish={onFinish} initialValues={{ mode: 'floating', commentRequired: true, cooldownHours: 24, position: 'bottom-right', question: 'How would you rate your experience?' }}>
          <Form.Item name="name" label="Application Name" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="description" label="Description">
            <Input.TextArea rows={2} />
          </Form.Item>
          <Form.Item name="mode" label="Widget Mode" rules={[{ required: true }]}>
            <Select options={[{ label: 'Floating Button', value: 'floating' }, { label: 'Inline Embed', value: 'inline' }]} />
          </Form.Item>
          <Form.Item name="question" label="Feedback Question" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="commentRequired" label="Comment Required" valuePropName="checked">
            <Switch />
          </Form.Item>
          <Form.Item name="themeColor" label="Theme Color">
            <Input type="color" style={{ width: 60, height: 32 }} />
          </Form.Item>
          <Form.Item name="cooldownHours" label="Cooldown (hours)">
            <InputNumber min={0} />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" loading={createApp.isPending}>Create Application</Button>
          </Form.Item>
        </Form>
      </GlassCard>
    </div>
  );
}
```

- [ ] **Step 4: Implement ApplicationDetailPage**

```tsx
// packages/frontend/src/pages/ApplicationDetailPage.tsx
import { useParams, useNavigate } from 'react-router-dom';
import { Button, Descriptions, Popconfirm, message, Space } from 'antd';
import { useApplication, useDeleteApplication, useRegenerateKey } from '../hooks/useApplications';
import GlassCard from '../components/GlassCard';
import EmbedSnippet from '../components/EmbedSnippet';

export default function ApplicationDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: app, isLoading } = useApplication(id!);
  const deleteApp = useDeleteApplication();
  const regenerateKey = useRegenerateKey();

  if (isLoading || !app) return <div>Loading...</div>;

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 24 }}>
        <h2>{app.name}</h2>
        <Space>
          <Button onClick={async () => { await regenerateKey.mutateAsync(id!); message.success('API key regenerated'); }}>
            Regenerate Key
          </Button>
          <Popconfirm title="Delete this application?" onConfirm={async () => { await deleteApp.mutateAsync(id!); navigate('/applications'); }}>
            <Button danger>Delete</Button>
          </Popconfirm>
        </Space>
      </div>
      <GlassCard style={{ padding: 24, marginBottom: 24 }}>
        <Descriptions column={1}>
          <Descriptions.Item label="API Key">{app.apiKey}</Descriptions.Item>
          <Descriptions.Item label="Mode">{app.widgetConfig.mode}</Descriptions.Item>
          <Descriptions.Item label="Question">{app.widgetConfig.question}</Descriptions.Item>
          <Descriptions.Item label="Comment Required">{app.widgetConfig.commentRequired ? 'Yes' : 'No'}</Descriptions.Item>
          <Descriptions.Item label="Cooldown">{app.widgetConfig.cooldownHours}h</Descriptions.Item>
        </Descriptions>
      </GlassCard>
      {app.embedSnippet && (
        <GlassCard style={{ padding: 24 }}>
          <EmbedSnippet snippet={app.embedSnippet} />
        </GlassCard>
      )}
    </div>
  );
}
```

- [ ] **Step 5: Implement ResponsesPage**

```tsx
// packages/frontend/src/pages/ResponsesPage.tsx
import { useState } from 'react';
import { Table } from 'antd';
import FilterBar from '../components/FilterBar';
import ScoreTag from '../components/ScoreTag';
import { useApplications } from '../hooks/useApplications';
import { useFeedback } from '../hooks/useFeedback';
import dayjs from 'dayjs';

export default function ResponsesPage() {
  const [filters, setFilters] = useState<{ applicationId?: string; dateFrom?: string; dateTo?: string }>({});
  const [page, setPage] = useState(1);
  const { data: applications } = useApplications();
  const { data, isLoading } = useFeedback({ ...filters, page, limit: 20 });

  const columns = [
    { title: 'App', dataIndex: ['application', 'name'], key: 'app' },
    { title: 'Score', dataIndex: 'score', key: 'score', render: (s: number) => <ScoreTag score={s} /> },
    { title: 'Comment', dataIndex: 'comment', key: 'comment', ellipsis: true },
    { title: 'Sentiment', dataIndex: 'sentiment', key: 'sentiment' },
    { title: 'Date', dataIndex: 'createdAt', key: 'date', render: (d: string) => dayjs(d).format('MMM D, YYYY HH:mm') },
  ];

  return (
    <div>
      <h2 style={{ marginBottom: 24 }}>Responses</h2>
      <FilterBar applications={applications || []} filters={filters} onChange={setFilters} />
      <Table
        dataSource={data?.items}
        columns={columns}
        loading={isLoading}
        rowKey="id"
        pagination={{
          current: page,
          total: data?.total,
          pageSize: 20,
          onChange: setPage,
        }}
        expandable={{
          expandedRowRender: (record) => (
            <div>
              <p><strong>Full comment:</strong> {record.comment}</p>
              {record.userMetadata && <p><strong>User metadata:</strong> {JSON.stringify(record.userMetadata)}</p>}
            </div>
          ),
        }}
      />
    </div>
  );
}
```

- [ ] **Step 6: Implement ComparisonPage**

```tsx
// packages/frontend/src/pages/ComparisonPage.tsx
import { useState } from 'react';
import { Table, DatePicker } from 'antd';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { useComparison } from '../hooks/useAnalytics';
import GlassCard from '../components/GlassCard';

const { RangePicker } = DatePicker;

export default function ComparisonPage() {
  const [filters, setFilters] = useState<{ dateFrom?: string; dateTo?: string }>({});
  const { data, isLoading } = useComparison(filters);

  const columns = [
    { title: 'Application', dataIndex: 'applicationName', key: 'name' },
    { title: 'Avg Score', dataIndex: 'averageScore', key: 'avg', render: (v: number) => v.toFixed(1) },
    { title: 'Total Responses', dataIndex: 'totalResponses', key: 'total' },
  ];

  return (
    <div>
      <h2 style={{ marginBottom: 24 }}>App Comparison</h2>
      <RangePicker
        style={{ marginBottom: 24 }}
        onChange={(dates) =>
          setFilters({
            dateFrom: dates?.[0]?.toISOString(),
            dateTo: dates?.[1]?.toISOString(),
          })
        }
      />
      <GlassCard style={{ padding: 20, marginBottom: 24 }} hoverable={false}>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data || []}>
            <XAxis dataKey="applicationName" fontSize={12} />
            <YAxis domain={[0, 10]} />
            <Tooltip />
            <Legend />
            <Bar dataKey="averageScore" fill="#354B8C" name="Avg Score" radius={[3, 3, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </GlassCard>
      <Table dataSource={data} columns={columns} loading={isLoading} rowKey="applicationId" pagination={false} />
    </div>
  );
}
```

- [ ] **Step 7: Implement ExportPage**

```tsx
// packages/frontend/src/pages/ExportPage.tsx
import { useState } from 'react';
import { Button, Select, Space, message } from 'antd';
import FilterBar from '../components/FilterBar';
import { useApplications } from '../hooks/useApplications';
import api from '../api/client';

export default function ExportPage() {
  const [filters, setFilters] = useState<{ applicationId?: string; dateFrom?: string; dateTo?: string }>({});
  const [format, setFormat] = useState<'json' | 'csv'>('csv');
  const { data: applications } = useApplications();

  const handleExport = async () => {
    try {
      const res = await api.get('/feedback/export', {
        params: { ...filters, format },
        responseType: format === 'csv' ? 'blob' : 'json',
      });

      if (format === 'csv') {
        const blob = new Blob([res.data], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'feedback-export.csv';
        a.click();
        URL.revokeObjectURL(url);
      } else {
        const blob = new Blob([JSON.stringify(res.data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'feedback-export.json';
        a.click();
        URL.revokeObjectURL(url);
      }
      message.success('Export downloaded');
    } catch {
      message.error('Export failed');
    }
  };

  return (
    <div>
      <h2 style={{ marginBottom: 24 }}>Export</h2>
      <FilterBar applications={applications || []} filters={filters} onChange={setFilters} />
      <Space style={{ marginTop: 16 }}>
        <Select value={format} onChange={setFormat} options={[{ label: 'CSV', value: 'csv' }, { label: 'JSON', value: 'json' }]} />
        <Button type="primary" onClick={handleExport}>Download Export</Button>
      </Space>
    </div>
  );
}
```

- [ ] **Step 8: Implement SettingsPage**

```tsx
// packages/frontend/src/pages/SettingsPage.tsx
import { Descriptions, Typography } from 'antd';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import GlassCard from '../components/GlassCard';

export default function SettingsPage() {
  const { user } = useAuth();
  const { mode } = useTheme();

  return (
    <div>
      <h2 style={{ marginBottom: 24 }}>Settings</h2>
      <GlassCard style={{ padding: 24 }}>
        <Typography.Title level={4}>Profile</Typography.Title>
        <Descriptions column={1}>
          <Descriptions.Item label="Name">{user?.name}</Descriptions.Item>
          <Descriptions.Item label="Email">{user?.email}</Descriptions.Item>
          <Descriptions.Item label="Role">{user?.role}</Descriptions.Item>
          <Descriptions.Item label="Theme">{mode}</Descriptions.Item>
        </Descriptions>
      </GlassCard>
    </div>
  );
}
```

- [ ] **Step 9: Verify build**

Run: `cd packages/frontend && pnpm build`
Expected: Builds

- [ ] **Step 10: Commit**

```bash
git add packages/frontend/src/pages packages/frontend/src/components/EmbedSnippet.tsx
git commit -m "feat: implement all dashboard pages (applications, responses, comparison, export, settings)"
```

---

## Task 15: Widget — Embeddable Feedback Plugin

**Files:**
- Create: `packages/widget/src/types.ts`
- Create: `packages/widget/src/api.ts`
- Create: `packages/widget/src/styles.ts`
- Create: `packages/widget/src/ui.ts`
- Create: `packages/widget/src/index.ts`

- [ ] **Step 1: Create widget types**

```ts
// packages/widget/src/types.ts
export interface WidgetConfig {
  mode: 'floating' | 'inline';
  question: string;
  commentRequired: boolean;
  themeColor: string;
  cooldownHours: number;
  position: string;
}

export interface InitOptions {
  apiKey: string;
  user?: Record<string, unknown>;
}

export interface RenderOptions extends InitOptions {
  target: string;
}
```

- [ ] **Step 2: Create widget API layer**

```ts
// packages/widget/src/api.ts
import type { WidgetConfig } from './types';

let baseUrl = '';

export function setBaseUrl(url: string) {
  baseUrl = url;
}

function detectBaseUrl(): string {
  if (baseUrl) return baseUrl;
  const scripts = document.querySelectorAll('script[src*="feedback.js"]');
  if (scripts.length > 0) {
    const src = (scripts[scripts.length - 1] as HTMLScriptElement).src;
    return new URL(src).origin;
  }
  return '';
}

export async function fetchConfig(apiKey: string): Promise<WidgetConfig | null> {
  try {
    const base = detectBaseUrl();
    const res = await fetch(`${base}/api/widget/config/${apiKey}`);
    if (!res.ok) return null;
    return res.json();
  } catch {
    return null;
  }
}

export async function submitFeedback(
  apiKey: string,
  score: number,
  comment: string,
  userMetadata?: Record<string, unknown>,
): Promise<boolean> {
  try {
    const base = detectBaseUrl();
    const res = await fetch(`${base}/api/widget/feedback`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ apiKey, score, comment, userMetadata }),
    });
    return res.ok;
  } catch {
    return false;
  }
}
```

- [ ] **Step 3: Create widget styles**

```ts
// packages/widget/src/styles.ts
export function getStyles(themeColor: string): string {
  return `
    :host { all: initial; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; }

    .fb-trigger {
      position: fixed; bottom: 20px; right: 20px; z-index: 999999;
      width: 48px; height: 48px; border-radius: 50%;
      background: ${themeColor}; color: white; border: none;
      cursor: pointer; font-size: 20px; display: flex;
      align-items: center; justify-content: center;
      box-shadow: 0 4px 12px rgba(0,0,0,0.15);
      transition: transform 0.2s;
    }
    .fb-trigger:hover { transform: scale(1.1); }

    .fb-panel {
      position: fixed; bottom: 80px; right: 20px; z-index: 999999;
      width: 360px; background: white; border-radius: 12px;
      box-shadow: 0 12px 48px rgba(0,0,0,0.15);
      padding: 24px; display: none;
      animation: fb-slide-up 0.3s ease;
    }
    .fb-panel.open { display: block; }
    .fb-panel.inline-mode { position: static; box-shadow: 0 2px 12px rgba(0,0,0,0.08); }

    @keyframes fb-slide-up {
      from { opacity: 0; transform: translateY(10px); }
      to { opacity: 1; transform: translateY(0); }
    }

    .fb-question { font-size: 16px; font-weight: 600; margin-bottom: 16px; color: #1a1a2e; }

    .fb-scores {
      display: flex; gap: 6px; margin-bottom: 16px; justify-content: center;
    }
    .fb-score-btn {
      width: 32px; height: 32px; border-radius: 6px;
      border: 2px solid #e0e0e0; background: white;
      cursor: pointer; font-size: 13px; font-weight: 600;
      color: #555; transition: all 0.2s;
      display: flex; align-items: center; justify-content: center;
    }
    .fb-score-btn:hover { border-color: ${themeColor}; color: ${themeColor}; }
    .fb-score-btn.selected { background: ${themeColor}; color: white; border-color: ${themeColor}; }

    .fb-comment {
      width: 100%; min-height: 80px; border: 1px solid #e0e0e0;
      border-radius: 8px; padding: 10px; font-size: 14px;
      font-family: inherit; resize: vertical; margin-bottom: 12px;
      outline: none; transition: border-color 0.2s;
    }
    .fb-comment:focus { border-color: ${themeColor}; }

    .fb-submit {
      width: 100%; padding: 10px; background: ${themeColor};
      color: white; border: none; border-radius: 8px;
      font-size: 14px; font-weight: 600; cursor: pointer;
      transition: opacity 0.2s;
    }
    .fb-submit:hover { opacity: 0.9; }
    .fb-submit:disabled { opacity: 0.5; cursor: not-allowed; }

    .fb-thank-you {
      text-align: center; padding: 20px;
      font-size: 16px; color: #2D733E;
    }

    .fb-error { color: #D93A2B; font-size: 12px; margin-bottom: 8px; }
    .fb-cooldown { text-align: center; color: #888; font-size: 14px; padding: 20px; }
    .fb-labels { display: flex; justify-content: space-between; font-size: 10px; color: #999; margin-top: -8px; margin-bottom: 12px; }
  `;
}
```

- [ ] **Step 4: Create widget UI**

```ts
// packages/widget/src/ui.ts
import { getStyles } from './styles';
import { fetchConfig, submitFeedback } from './api';
import type { WidgetConfig } from './types';

const COOLDOWN_KEY = 'fb_widget_last_submit';

function isCoolingDown(cooldownHours: number): boolean {
  const last = localStorage.getItem(COOLDOWN_KEY);
  if (!last) return false;
  const elapsed = Date.now() - parseInt(last);
  return elapsed < cooldownHours * 60 * 60 * 1000;
}

export function createWidget(
  config: WidgetConfig,
  apiKey: string,
  userMetadata?: Record<string, unknown>,
  container?: HTMLElement,
) {
  const host = container || document.createElement('div');
  if (!container) document.body.appendChild(host);

  const shadow = host.attachShadow({ mode: 'closed' });

  const style = document.createElement('style');
  style.textContent = getStyles(config.themeColor);
  shadow.appendChild(style);

  if (isCoolingDown(config.cooldownHours)) {
    const cooldown = document.createElement('div');
    cooldown.className = 'fb-panel open' + (container ? ' inline-mode' : '');
    cooldown.innerHTML = '<div class="fb-cooldown">Thank you, you\'ve already submitted feedback recently.</div>';
    if (!container) {
      cooldown.style.display = 'none';
      const trigger = document.createElement('button');
      trigger.className = 'fb-trigger';
      trigger.textContent = '💬';
      trigger.onclick = () => cooldown.classList.toggle('open');
      shadow.appendChild(trigger);
    }
    shadow.appendChild(cooldown);
    return;
  }

  let selectedScore: number | null = null;

  const panel = document.createElement('div');
  panel.className = 'fb-panel' + (container ? ' open inline-mode' : '');

  panel.innerHTML = `
    <div class="fb-question">${config.question}</div>
    <div class="fb-scores">
      ${Array.from({ length: 11 }, (_, i) => `<button class="fb-score-btn" data-score="${i}">${i}</button>`).join('')}
    </div>
    <div class="fb-labels"><span>Not likely</span><span>Very likely</span></div>
    <textarea class="fb-comment" placeholder="Share your feedback...${config.commentRequired ? ' (required)' : ''}"></textarea>
    <div class="fb-error" style="display:none"></div>
    <button class="fb-submit">Submit Feedback</button>
  `;

  // Score selection
  panel.querySelectorAll('.fb-score-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      panel.querySelectorAll('.fb-score-btn').forEach((b) => b.classList.remove('selected'));
      btn.classList.add('selected');
      selectedScore = parseInt((btn as HTMLElement).dataset.score!);
    });
  });

  // Submit
  const submitBtn = panel.querySelector('.fb-submit') as HTMLButtonElement;
  const commentEl = panel.querySelector('.fb-comment') as HTMLTextAreaElement;
  const errorEl = panel.querySelector('.fb-error') as HTMLElement;

  submitBtn.addEventListener('click', async () => {
    errorEl.style.display = 'none';
    if (selectedScore === null) {
      errorEl.textContent = 'Please select a score';
      errorEl.style.display = 'block';
      return;
    }
    if (config.commentRequired && !commentEl.value.trim()) {
      errorEl.textContent = 'Please add a comment';
      errorEl.style.display = 'block';
      return;
    }

    submitBtn.disabled = true;
    const ok = await submitFeedback(apiKey, selectedScore, commentEl.value, userMetadata);

    if (ok) {
      localStorage.setItem(COOLDOWN_KEY, Date.now().toString());
      panel.innerHTML = '<div class="fb-thank-you">✓ Thank you for your feedback!</div>';
      setTimeout(() => {
        if (!container) panel.classList.remove('open');
      }, 3000);
    } else {
      errorEl.textContent = 'Failed to submit. Please try again.';
      errorEl.style.display = 'block';
      submitBtn.disabled = false;
    }
  });

  shadow.appendChild(panel);

  // Floating trigger
  if (!container) {
    const trigger = document.createElement('button');
    trigger.className = 'fb-trigger';
    trigger.textContent = '💬';
    trigger.addEventListener('click', () => panel.classList.toggle('open'));
    shadow.appendChild(trigger);
  }
}

export async function init(apiKey: string, userMetadata?: Record<string, unknown>) {
  const config = await fetchConfig(apiKey);
  if (!config) return; // Graceful degradation
  createWidget(config, apiKey, userMetadata);
}

export async function render(apiKey: string, target: string, userMetadata?: Record<string, unknown>) {
  const container = document.querySelector(target) as HTMLElement;
  if (!container) return;
  const config = await fetchConfig(apiKey);
  if (!config) return;
  createWidget(config, apiKey, userMetadata, container);
}
```

- [ ] **Step 5: Create widget entry point**

```ts
// packages/widget/src/index.ts
import { init, render } from './ui';
import type { InitOptions, RenderOptions } from './types';

const FeedbackWidget = {
  init(options: InitOptions) {
    init(options.apiKey, options.user);
  },
  render(options: RenderOptions) {
    render(options.apiKey, options.target, options.user);
  },
};

// Expose globally
(window as any).FeedbackWidget = FeedbackWidget;

export default FeedbackWidget;
```

- [ ] **Step 6: Build widget**

Run: `cd packages/widget && pnpm build`
Expected: Creates `dist/feedback.js`

- [ ] **Step 7: Commit**

```bash
git add packages/widget/src
git commit -m "feat: implement embeddable feedback widget with floating and inline modes"
```

---

## Task 16: Docker — Production Deployment

**Files:**
- Create: `packages/backend/Dockerfile`
- Create: `packages/frontend/Dockerfile`
- Create: `packages/frontend/nginx.conf`
- Create: `docker-compose.yml`

- [ ] **Step 1: Create backend Dockerfile**

```dockerfile
# packages/backend/Dockerfile
FROM node:20-alpine AS builder
RUN corepack enable
WORKDIR /app
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile
COPY . .
RUN pnpm build

FROM node:20-alpine
RUN corepack enable
WORKDIR /app
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/package.json ./
COPY --from=builder /app/node_modules ./node_modules
# Copy widget dist for static serving
COPY --from=builder /app/../widget/dist ./widget-dist
EXPOSE 3000
CMD ["node", "dist/main.js"]
```

- [ ] **Step 2: Create frontend nginx config and Dockerfile**

```nginx
# packages/frontend/nginx.conf
server {
    listen 80;
    server_name _;
    root /usr/share/nginx/html;
    index index.html;

    location /api/ {
        proxy_pass http://backend:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }

    location /widget/ {
        proxy_pass http://backend:3000;
    }

    location / {
        try_files $uri $uri/ /index.html;
    }
}
```

```dockerfile
# packages/frontend/Dockerfile
FROM node:20-alpine AS builder
RUN corepack enable
WORKDIR /app
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile
COPY . .
RUN pnpm build

FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
```

- [ ] **Step 3: Create docker-compose.yml**

```yaml
# docker-compose.yml
services:
  postgres:
    image: postgres:16-alpine
    restart: unless-stopped
    environment:
      POSTGRES_DB: ${POSTGRES_DB:-feedback}
      POSTGRES_USER: ${POSTGRES_USER:-feedback}
      POSTGRES_PASSWORD: ${POSTGRES_PASSWORD:-changeme}
    volumes:
      - postgres_data:/var/lib/postgresql/data
    ports:
      - "5432:5432"

  backend:
    build:
      context: .
      dockerfile: packages/backend/Dockerfile
    restart: unless-stopped
    depends_on:
      - postgres
    environment:
      DATABASE_URL: postgresql://${POSTGRES_USER:-feedback}:${POSTGRES_PASSWORD:-changeme}@postgres:5432/${POSTGRES_DB:-feedback}
      JWT_SECRET: ${JWT_SECRET:-changeme-use-a-long-random-string}
      JWT_EXPIRES_IN: ${JWT_EXPIRES_IN:-15m}
      CORS_ORIGIN: ${CORS_ORIGIN:-http://localhost}
      NODE_ENV: production
    ports:
      - "3000:3000"

  frontend:
    build:
      context: .
      dockerfile: packages/frontend/Dockerfile
    restart: unless-stopped
    depends_on:
      - backend
    ports:
      - "80:80"

volumes:
  postgres_data:
```

- [ ] **Step 4: Verify docker compose config**

Run: `docker compose config`
Expected: Valid config output, no errors

- [ ] **Step 5: Commit**

```bash
git add packages/backend/Dockerfile packages/frontend/Dockerfile packages/frontend/nginx.conf docker-compose.yml
git commit -m "feat: add Docker configuration for production deployment"
```

---

## Verification

**Local development (requires PostgreSQL running locally):**
1. `pnpm install` from root
2. `cp .env.example .env` and adjust DATABASE_URL
3. `pnpm dev:backend` — backend starts on :3000
4. `pnpm dev:frontend` — frontend starts on :5173
5. Open http://localhost:5173, register, create an app, submit feedback via the widget API, verify dashboard shows data

**Docker deployment:**
1. `cp .env.example .env`
2. `docker compose up --build`
3. Open http://localhost
4. Register, create app, note the embed snippet
5. Test widget endpoint: `curl http://localhost:3000/api/widget/config/<apiKey>`
6. Submit feedback: `curl -X POST http://localhost:3000/api/widget/feedback -H 'Content-Type: application/json' -d '{"apiKey":"<key>","score":8,"comment":"Test"}'`
7. Verify dashboard shows the feedback data
