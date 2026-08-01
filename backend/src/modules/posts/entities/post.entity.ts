import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToMany,
  JoinColumn,
  Index,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Comment } from '../../comments/entities/comment.entity';
import { Like } from './like.entity';

@Entity('posts')
export class Post {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'user_id', type: 'uuid' })
  @Index()
  userId: string;

  @Column({ type: 'text', nullable: true })
  content: string;

  @Column({ name: 'media_urls', type: 'text', array: true, nullable: true })
  mediaUrls: string[];

  @Column({ name: 'media_types', type: 'varchar', length: 20, array: true, nullable: true })
  mediaTypes: string[];

  @Column({ nullable: true, length: 255 })
  location: string;

  @Column({ name: 'is_archived', default: false })
  @Index()
  isArchived: boolean;

  @Column({ name: 'is_hidden', default: false })
  isHidden: boolean;

  @Column({ name: 'comments_disabled', default: false })
  commentsDisabled: boolean;

  @Column({ name: 'likes_hidden', default: false })
  likesHidden: boolean;

  @Column({ name: 'likes_count', default: 0 })
  likesCount: number;

  @Column({ name: 'comments_count', default: 0 })
  commentsCount: number;

  @Column({ name: 'shares_count', default: 0 })
  sharesCount: number;

  @Column({ name: 'views_count', default: 0 })
  viewsCount: number;

  @CreateDateColumn({ name: 'created_at' })
  @Index()
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @Column({ name: 'deleted_at', type: 'timestamp', nullable: true })
  deletedAt: Date;

  // ==========================================
  // RELATIONSHIPS
  // ==========================================

  @ManyToOne(() => User, (user) => user.posts, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @OneToMany(() => Comment, (comment) => comment.post)
  comments: Comment[];

  @OneToMany(() => Like, (like) => like.post)
  likes: Like[];
}
