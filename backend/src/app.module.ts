import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ThrottlerModule } from '@nestjs/throttler';
import { ScheduleModule } from '@nestjs/schedule';

// Configuration
import { databaseConfig } from './config/database.config';
import { jwtConfig } from './config/jwt.config';
import { s3Config } from './config/s3.config';

// Modules
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { PostsModule } from './modules/posts/posts.module';
import { CommentsModule } from './modules/comments/comments.module';
import { StoriesModule } from './modules/stories/stories.module';
import { MessagesModule } from './modules/messages/messages.module';
import { NotificationsModule } from './modules/notifications/notifications.module';
import { AdminModule } from './modules/admin/admin.module';
import { ReportsModule } from './modules/reports/reports.module';
import { FollowsModule } from './modules/follows/follows.module';

// Common
import { CacheModule } from './common/cache/cache.module';
import { LoggerModule } from './common/logger/logger.module';
import { UploadModule } from './common/upload/upload.module';

@Module({
  imports: [
    // ==========================================
    // CONFIGURATION MODULE
    // ==========================================
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
      load: [databaseConfig, jwtConfig, s3Config],
    }),

    // ==========================================
    // DATABASE MODULE (TypeORM)
    // ==========================================
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get<string>('DB_HOST'),
        port: configService.get<number>('DB_PORT'),
        username: configService.get<string>('DB_USERNAME'),
        password: configService.get<string>('DB_PASSWORD'),
        database: configService.get<string>('DB_DATABASE'),
        entities: [__dirname + '/**/*.entity{.ts,.js}'],
        synchronize: configService.get<boolean>('DB_SYNCHRONIZE', false),
        logging: configService.get<boolean>('DB_LOGGING', false),
        ssl: configService.get<string>('NODE_ENV') === 'production' 
          ? { rejectUnauthorized: false } 
          : false,
        extra: {
          max: 20, // Maximum pool size
          min: 5,  // Minimum pool size
          idleTimeoutMillis: 30000,
        },
      }),
      inject: [ConfigService],
    }),

    // ==========================================
    // RATE LIMITING (Throttler)
    // ==========================================
    ThrottlerModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        ttl: configService.get<number>('RATE_LIMIT_TTL', 60),
        limit: configService.get<number>('RATE_LIMIT_MAX', 100),
      }),
      inject: [ConfigService],
    }),

    // ==========================================
    // TASK SCHEDULING
    // ==========================================
    ScheduleModule.forRoot(),

    // ==========================================
    // COMMON MODULES
    // ==========================================
    CacheModule,
    LoggerModule,
    UploadModule,

    // ==========================================
    // FEATURE MODULES
    // ==========================================
    AuthModule,
    UsersModule,
    PostsModule,
    CommentsModule,
    StoriesModule,
    MessagesModule,
    NotificationsModule,
    AdminModule,
    ReportsModule,
    FollowsModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
