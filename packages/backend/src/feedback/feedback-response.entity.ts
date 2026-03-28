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

  @ManyToOne(() => Application, { onDelete: 'CASCADE' })
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
