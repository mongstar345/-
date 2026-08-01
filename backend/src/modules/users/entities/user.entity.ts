import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  ManyToMany,
  JoinTable,
  Index,
} from 'typeorm';
import { Exclude } from 'class-transformer';
import { Post } from '../posts/entities/post.entity';
import { Comment } from '../comments/entities/comment.entity';
import { Story } from '../stories/entities/story.entity';
import { Message } from '../messages/entities/message.entity';
import { Role } from '../auth/entities/role.entity';

export enum Gender {
  MALE = 'male',
  FEMALE = 'female',
  OTHER = 'other',
}

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true, length: 50 })
  @Index()
  username: string;

  @Column({ unique: true, length: 255 })
  @Index()
  email: string;

  @Column({ name: 'password_hash' })
  @Exclude() // Don't expose in API responses
  password: string;

  @Column({ name: 'full_name', nullable: true, length: 100 })
  fullName: string;

  @Column({ type: 'text', nullable: true })
  bio: string;

  @Column({ name: 'avatar_url', nullable: true, length: 500 })
  avatarUrl: string;

  @Column({ name: 'cover_photo_url', nullable: true, length: 500 })
  coverPhotoUrl: string;

  @Column({ nullable: true, length: 20 })
  phone: string;

  @Column({ name: 'date_of_birth', type: 'date', nullable: true })
  dateOfBirth: Date;

  @Column({
    type: 'enum',
    enum: Gender,
    nullable: true,
  })
  gender: Gender;

  @Column({ name: 'is_verified', default: false })
  isVerified: boolean;

  @Column({ name: 'is_private', default: false })
  isPrivate: boolean;

  @Column({ name: 'is_active', default: true })
  @Index()
  isActive: boolean;

  @Column({ name: 'is_banned', default: false })
  isBanned: boolean;

  @Column({ name: 'ban_reason', type: 'text', nullable: true })
  banReason: string;

  @Column({ name: 'banned_until', type: 'timestamp', nullable: true })
  bannedUntil: Date;

  @Column({ name: 'email_verified', default: false })
  emailVerified: boolean;

  @Column({ name: 'email_verification_token', nullable: true })
  @Exclude()
  emailVerificationToken: string;

  @Column({ name: 'password_reset_token', nullable: true })
  @Exclude()
  passwordResetToken: string;

  @Column({ name: 'password_reset_expires', type: 'timestamp', nullable: true })
  @Exclude()
  passwordResetExpires: Date;

  @Column({ name: 'last_login_at', type: 'timestamp', nullable: true })
  lastLoginAt: Date;

  @Column({ name: 'login_count', default: 0 })
  loginCount: number;

  @Column({ name: 'refresh_token', type: 'text', nullable: true })
  @Exclude()
  refreshToken: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @Column({ name: 'deleted_at', type: 'timestamp', nullable: true })
  deletedAt: Date;

  // ==========================================
  // RELATIONSHIPS
  // ==========================================

  @ManyToMany(() => Role, (role) => role.users, { eager: true })
  @JoinTable({
    name: 'user_roles',
    joinColumn: { name: 'user_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'role_id', referencedColumnName: 'id' },
  })
  roles: Role[];

  @OneToMany(() => Post, (post) => post.user)
  posts: Post[];

  @OneToMany(() => Comment, (comment) => comment.user)
  comments: Comment[];

  @OneToMany(() => Story, (story) => story.user)
  stories: Story[];

  @OneToMany(() => Message, (message) => message.sender)
  messages: Message[];

  // ==========================================
  // VIRTUAL PROPERTIES
  // ==========================================

  get hasRole() {
    return (roleName: string): boolean => {
      return this.roles?.some((role) => role.name === roleName) || false;
    };
  }

  get isAdmin(): boolean {
    return this.roles?.some((role) => ['admin', 'super_admin'].includes(role.name)) || false;
  }

  get isSuperAdmin(): boolean {
    return this.roles?.some((role) => role.name === 'super_admin') || false;
  }
}
