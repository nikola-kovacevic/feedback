import {
  Entity, PrimaryGeneratedColumn, Column,
  CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn,
} from 'typeorm';
import { User } from '../users/user.entity';

export type WidgetPosition = 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left';

export interface AlertConfig {
  enabled: boolean;
  slackUrl: string;
  npsThreshold: number;
}

export interface WidgetConfig {
  mode: 'floating' | 'inline';
  question: string;
  commentRequired: boolean;
  themeColor: string;
  cooldownHours: number;
  position: WidgetPosition;
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

  @Column({ type: 'jsonb', nullable: true })
  alertConfig: AlertConfig | null;

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
