# 🏗️ NAHRAIN CAMPUS - PLATFORM ARCHITECTURE

## Executive Summary

Nahrain Campus is not just an app—it's a **modular platform** designed to scale from MVP to enterprise with millions of users. The architecture separates concerns into **independent engines** that communicate through well-defined boundaries, enabling:

- **Horizontal scaling** (add more servers)
- **Vertical scaling** (upgrade hardware)
- **Feature scaling** (add new engines without breaking existing ones)
- **Team scaling** (different teams work on different engines)

---

## 🎯 Core Engines Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    API GATEWAY LAYER                        │
│  - Authentication                                           │
│  - Rate Limiting                                            │
│  - Request Routing                                          │
│  - Load Balancing                                           │
└─────────────────────────────────────────────────────────────┘
                            │
            ┌───────────────┼───────────────┐
            │               │               │
┌───────────▼──────┐ ┌─────▼──────┐ ┌─────▼──────┐
│  LEARNING ENGINE │ │   SOCIAL   │ │ MESSAGING  │
│                  │ │   ENGINE   │ │   ENGINE   │
│ - Courses        │ │ - Posts    │ │ - Real-time│
│ - Lessons        │ │ - Comments │ │ - WebSocket│
│ - Quizzes        │ │ - Likes    │ │ - Typing   │
│ - Progress       │ │ - Shares   │ │ - Read     │
│ - Certificates   │ │ - Follow   │ │ - Delivery │
└──────────────────┘ └────────────┘ └────────────┘
            │               │               │
            └───────────────┼───────────────┘
                            │
┌───────────────────────────▼─────────────────────────────────┐
│                    EVENT BUS (Redis Pub/Sub)                │
│  - Cross-engine communication                               │
│  - Event sourcing                                           │
│  - Async operations                                         │
└─────────────────────────────────────────────────────────────┘
            │
    ┌───────┴───────┐
    │               │
┌───▼────┐   ┌─────▼──────┐
│   AI   │   │  CREATOR   │
│ ENGINE │   │   ENGINE   │
│        │   │            │
│ - Recs │   │ - Revenue  │
│ - Rank │   │ - Analytics│
│ - Tutor│   │ - Payouts  │
└────────┘   └────────────┘
```

---

## 🧩 Engine-by-Engine Breakdown

### 1. Learning Engine 📚

**Responsibilities:**
- Course catalog management
- Lesson progression tracking
- Quiz & assessment system
- Certificate generation
- Learning path recommendations

**Database Schema:**
```sql
-- Courses
CREATE TABLE courses (
  id UUID PRIMARY KEY,
  title VARCHAR(255),
  description TEXT,
  thumbnail_url VARCHAR(500),
  instructor_id UUID REFERENCES users(id),
  price DECIMAL(10,2),
  is_published BOOLEAN DEFAULT false,
  difficulty_level VARCHAR(50),
  category_id UUID,
  created_at TIMESTAMP,
  updated_at TIMESTAMP,
  INDEX idx_instructor (instructor_id),
  INDEX idx_category (category_id),
  INDEX idx_published (is_published)
);

-- Lessons
CREATE TABLE lessons (
  id UUID PRIMARY KEY,
  course_id UUID REFERENCES courses(id),
  title VARCHAR(255),
  content_type VARCHAR(50), -- video, text, quiz
  content_url VARCHAR(500),
  duration INTEGER, -- in seconds
  order_index INTEGER,
  is_free BOOLEAN DEFAULT false,
  created_at TIMESTAMP
);

-- User Progress
CREATE TABLE user_course_progress (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES users(id),
  course_id UUID REFERENCES courses(id),
  lesson_id UUID REFERENCES lessons(id),
  completed_at TIMESTAMP,
  watch_time INTEGER, -- in seconds
  quiz_score DECIMAL(5,2),
  UNIQUE(user_id, course_id, lesson_id)
);

-- Certificates
CREATE TABLE certificates (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES users(id),
  course_id UUID REFERENCES courses(id),
  issued_at TIMESTAMP,
  certificate_url VARCHAR(500),
  verification_code VARCHAR(100) UNIQUE
);
```

**API Endpoints:**
```typescript
// Learning Engine API
GET    /api/courses
GET    /api/courses/:id
POST   /api/courses/:id/enroll
GET    /api/courses/:id/lessons
GET    /api/lessons/:id
POST   /api/lessons/:id/complete
GET    /api/my-learning
GET    /api/certificates/:id
```

**Events Published:**
- `course.enrolled` → AI Engine (for recommendations)
- `lesson.completed` → Creator Engine (for analytics)
- `course.completed` → Social Engine (for achievements)

**Scaling Strategy:**
- Cache course catalog in Redis (TTL: 1 hour)
- CDN for video content (CloudFront/Cloudflare)
- Read replicas for progress queries
- Shard by `user_id` for progress table

---

### 2. Social Engine 👥

**Responsibilities:**
- Posts (text, images, videos)
- Comments & replies
- Likes & reactions
- Follow/Unfollow system
- Feed generation
- Trending algorithm

**Database Schema:**
```sql
-- Posts
CREATE TABLE posts (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES users(id),
  content TEXT,
  media_urls JSON,
  post_type VARCHAR(50), -- regular, live, reel
  visibility VARCHAR(50), -- public, followers, private
  created_at TIMESTAMP,
  updated_at TIMESTAMP,
  INDEX idx_user_created (user_id, created_at DESC),
  INDEX idx_created (created_at DESC)
);

-- Reactions
CREATE TABLE post_reactions (
  id UUID PRIMARY KEY,
  post_id UUID REFERENCES posts(id),
  user_id UUID REFERENCES users(id),
  reaction_type VARCHAR(50), -- like, love, celebrate
  created_at TIMESTAMP,
  UNIQUE(post_id, user_id),
  INDEX idx_post (post_id)
);

-- Comments
CREATE TABLE comments (
  id UUID PRIMARY KEY,
  post_id UUID REFERENCES posts(id),
  user_id UUID REFERENCES users(id),
  parent_comment_id UUID REFERENCES comments(id),
  content TEXT,
  created_at TIMESTAMP,
  INDEX idx_post (post_id, created_at),
  INDEX idx_parent (parent_comment_id)
);

-- Follows
CREATE TABLE user_follows (
  id UUID PRIMARY KEY,
  follower_id UUID REFERENCES users(id),
  following_id UUID REFERENCES users(id),
  created_at TIMESTAMP,
  UNIQUE(follower_id, following_id),
  INDEX idx_follower (follower_id),
  INDEX idx_following (following_id)
);

-- Engagement Score (denormalized for performance)
CREATE TABLE post_engagement (
  post_id UUID PRIMARY KEY,
  likes_count INTEGER DEFAULT 0,
  comments_count INTEGER DEFAULT 0,
  shares_count INTEGER DEFAULT 0,
  views_count INTEGER DEFAULT 0,
  engagement_score DECIMAL(10,2), -- calculated metric
  updated_at TIMESTAMP,
  INDEX idx_score (engagement_score DESC)
);
```

**Feed Algorithm:**
```typescript
// Personalized feed ranking
function calculateFeedScore(post: Post, user: User): number {
  const recencyScore = getRecencyScore(post.created_at);
  const authorScore = getAuthorScore(post.user_id, user.id);
  const engagementScore = post.engagement.engagement_score;
  const relevanceScore = getRelevanceScore(post, user);

  return (
    recencyScore * 0.3 +
    authorScore * 0.25 +
    engagementScore * 0.25 +
    relevanceScore * 0.2
  );
}

// Trending algorithm
function calculateTrendingScore(post: Post): number {
  const ageInHours = (Date.now() - post.created_at) / (1000 * 60 * 60);
  const gravity = 1.8;
  
  return (
    (post.likes_count + 2 * post.comments_count + 3 * post.shares_count) /
    Math.pow(ageInHours + 2, gravity)
  );
}
```

**Scaling Strategy:**
- Pre-generate feeds asynchronously (fan-out on write)
- Cache user feeds in Redis (TTL: 5 minutes)
- Use Redis sorted sets for trending posts
- Partition posts by month (`posts_2024_03`)
- Elasticsearch for post search

---

### 3. Messaging Engine 💬

**Responsibilities:**
- Real-time messaging
- WebSocket connections
- Typing indicators
- Read receipts
- Message delivery tracking
- Voice messages

**Database Schema:**
```sql
-- Conversations
CREATE TABLE conversations (
  id UUID PRIMARY KEY,
  type VARCHAR(50), -- direct, group
  name VARCHAR(255),
  created_at TIMESTAMP,
  updated_at TIMESTAMP
);

-- Participants
CREATE TABLE conversation_participants (
  id UUID PRIMARY KEY,
  conversation_id UUID REFERENCES conversations(id),
  user_id UUID REFERENCES users(id),
  joined_at TIMESTAMP,
  last_read_at TIMESTAMP,
  UNIQUE(conversation_id, user_id),
  INDEX idx_user (user_id),
  INDEX idx_conversation (conversation_id)
);

-- Messages
CREATE TABLE messages (
  id UUID PRIMARY KEY,
  conversation_id UUID REFERENCES conversations(id),
  sender_id UUID REFERENCES users(id),
  content TEXT,
  message_type VARCHAR(50), -- text, image, video, voice
  media_url VARCHAR(500),
  reply_to_id UUID REFERENCES messages(id),
  created_at TIMESTAMP,
  INDEX idx_conversation_created (conversation_id, created_at DESC),
  INDEX idx_sender (sender_id)
);

-- Message Status (for read receipts)
CREATE TABLE message_status (
  id UUID PRIMARY KEY,
  message_id UUID REFERENCES messages(id),
  user_id UUID REFERENCES users(id),
  status VARCHAR(50), -- delivered, read
  timestamp TIMESTAMP,
  UNIQUE(message_id, user_id),
  INDEX idx_message (message_id)
);
```

**WebSocket Architecture:**
```typescript
// Connection pool management
class WebSocketManager {
  private connections: Map<string, WebSocket> = new Map();
  private userToConnections: Map<string, Set<string>> = new Map();

  addConnection(userId: string, connectionId: string, ws: WebSocket) {
    this.connections.set(connectionId, ws);
    
    if (!this.userToConnections.has(userId)) {
      this.userToConnections.set(userId, new Set());
    }
    this.userToConnections.get(userId)!.add(connectionId);
  }

  broadcast(userId: string, message: any) {
    const connections = this.userToConnections.get(userId);
    if (!connections) return;

    connections.forEach((connId) => {
      const ws = this.connections.get(connId);
      if (ws && ws.readyState === WebSocket.OPEN) {
        ws.send(JSON.stringify(message));
      }
    });
  }

  // Clean up dead connections
  removeConnection(connectionId: string) {
    this.connections.delete(connectionId);
    // Also remove from userToConnections
  }
}
```

**Scaling Strategy:**
- Use Redis for pub/sub between WebSocket servers
- Sticky sessions for WebSocket connections
- Partition messages by conversation_id
- Archive old messages (> 6 months) to cold storage
- Message queue for delivery guarantees

---

### 4. Creator Engine 💰

**Responsibilities:**
- Revenue tracking
- Payout management
- Course analytics
- Student engagement metrics
- Earnings dashboard

**Database Schema:**
```sql
-- Revenue Transactions
CREATE TABLE revenue_transactions (
  id UUID PRIMARY KEY,
  creator_id UUID REFERENCES users(id),
  student_id UUID REFERENCES users(id),
  course_id UUID REFERENCES courses(id),
  amount DECIMAL(10,2),
  platform_fee DECIMAL(10,2),
  creator_earnings DECIMAL(10,2),
  transaction_type VARCHAR(50), -- purchase, subscription, refund
  status VARCHAR(50), -- pending, completed, failed
  created_at TIMESTAMP,
  INDEX idx_creator (creator_id, created_at DESC),
  INDEX idx_status (status)
);

-- Payouts
CREATE TABLE creator_payouts (
  id UUID PRIMARY KEY,
  creator_id UUID REFERENCES users(id),
  amount DECIMAL(10,2),
  status VARCHAR(50), -- pending, processing, completed
  payout_method VARCHAR(50), -- bank_transfer, paypal
  initiated_at TIMESTAMP,
  completed_at TIMESTAMP,
  INDEX idx_creator_status (creator_id, status)
);

-- Analytics Cache
CREATE TABLE creator_analytics (
  id UUID PRIMARY KEY,
  creator_id UUID REFERENCES users(id),
  date DATE,
  total_views INTEGER,
  total_enrollments INTEGER,
  total_revenue DECIMAL(10,2),
  avg_completion_rate DECIMAL(5,2),
  updated_at TIMESTAMP,
  UNIQUE(creator_id, date),
  INDEX idx_creator_date (creator_id, date DESC)
);
```

**Revenue Split Model:**
```typescript
// Platform takes 20%, Creator gets 80%
interface RevenueModel {
  PLATFORM_FEE_PERCENTAGE: 20;
  CREATOR_PERCENTAGE: 80;
  
  calculateRevenueSplit(amount: number) {
    const platformFee = amount * (this.PLATFORM_FEE_PERCENTAGE / 100);
    const creatorEarnings = amount - platformFee;
    
    return { platformFee, creatorEarnings };
  }
}

// Subscription tiers
enum SubscriptionTier {
  FREE = 'free',
  BASIC = 'basic',     // $9.99/month
  PRO = 'pro',         // $19.99/month
  ENTERPRISE = 'enterprise' // $49.99/month
}
```

---

### 5. AI Engine 🤖

**Responsibilities:**
- Personalized recommendations
- Feed ranking
- Learning path generation
- Content moderation
- Sentiment analysis
- Search relevance

**Architecture:**
```typescript
// Recommendation System
class RecommendationEngine {
  // Collaborative filtering
  async getCourseRecommendations(userId: string): Promise<Course[]> {
    // 1. Get user's completed courses
    const userCourses = await getUserCourses(userId);
    
    // 2. Find similar users
    const similarUsers = await findSimilarUsers(userId, userCourses);
    
    // 3. Get courses they took that user hasn't
    const recommendations = await getCoursesFromSimilarUsers(
      similarUsers,
      userCourses
    );
    
    return recommendations;
  }

  // Content-based filtering
  async getContentBasedRecommendations(userId: string): Promise<Course[]> {
    const userInterests = await getUserInterests(userId);
    const userSkillLevel = await getUserSkillLevel(userId);
    
    return await findCoursesMatchingProfile(userInterests, userSkillLevel);
  }

  // Hybrid approach
  async getHybridRecommendations(userId: string): Promise<Course[]> {
    const collaborative = await this.getCourseRecommendations(userId);
    const contentBased = await this.getContentBasedRecommendations(userId);
    
    // Merge and rank
    return mergeAndRankRecommendations(collaborative, contentBased);
  }
}

// AI Tutor Integration
class AITutorService {
  async askQuestion(courseId: string, question: string): Promise<string> {
    // Integration with OpenAI/Claude API
    const context = await getCourseContext(courseId);
    
    const response = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [
        { role: 'system', content: `You are a tutor for: ${context}` },
        { role: 'user', content: question },
      ],
    });
    
    return response.choices[0].message.content;
  }
}

// Content Moderation
class ModerationEngine {
  async moderateContent(content: string): Promise<ModerationResult> {
    // Check for inappropriate content
    const toxicity = await checkToxicity(content);
    const spam = await detectSpam(content);
    const profanity = await detectProfanity(content);
    
    return {
      isApproved: !toxicity && !spam && !profanity,
      reasons: [
        toxicity && 'toxic_content',
        spam && 'spam',
        profanity && 'profanity',
      ].filter(Boolean),
    };
  }
}
```

**Machine Learning Pipeline:**
```
1. Data Collection → User interactions, course completions
2. Feature Engineering → User vectors, course embeddings
3. Model Training → Collaborative filtering + Neural networks
4. Model Serving → Low-latency API (< 100ms)
5. A/B Testing → Test recommendation variants
6. Monitoring → Track CTR, conversion rate
```

---

## 🔄 Inter-Engine Communication

### Event-Driven Architecture

**Event Bus (Redis Pub/Sub):**
```typescript
// Event types
enum EventType {
  USER_REGISTERED = 'user.registered',
  COURSE_ENROLLED = 'course.enrolled',
  LESSON_COMPLETED = 'lesson.completed',
  COURSE_COMPLETED = 'course.completed',
  POST_CREATED = 'post.created',
  MESSAGE_SENT = 'message.sent',
  PAYMENT_COMPLETED = 'payment.completed',
}

// Event publisher
class EventBus {
  async publish(event: Event) {
    await redis.publish(event.type, JSON.stringify(event));
    
    // Also store in event log for audit
    await db.eventLog.create(event);
  }
}

// Event subscribers
class LearningEngineSubscriber {
  async onUserRegistered(event: UserRegisteredEvent) {
    // Create learning profile
    await createLearningProfile(event.userId);
  }
}

class AIEngineSubscriber {
  async onCourseEnrolled(event: CourseEnrolledEvent) {
    // Update recommendation model
    await updateUserPreferences(event.userId, event.courseId);
  }
}
```

### API Communication

**Service-to-Service:**
```typescript
// Internal API Gateway
class InternalAPIGateway {
  async callLearningEngine(endpoint: string, data: any) {
    return await fetch(`http://learning-engine:3001${endpoint}`, {
      method: 'POST',
      headers: {
        'X-Internal-Auth': process.env.INTERNAL_SECRET,
      },
      body: JSON.stringify(data),
    });
  }
}

// Circuit breaker pattern
class CircuitBreaker {
  private failures = 0;
  private lastFailureTime: number = 0;
  private readonly threshold = 5;
  private readonly timeout = 60000; // 1 minute

  async execute<T>(fn: () => Promise<T>): Promise<T> {
    if (this.isOpen()) {
      throw new Error('Circuit breaker is OPEN');
    }

    try {
      const result = await fn();
      this.onSuccess();
      return result;
    } catch (error) {
      this.onFailure();
      throw error;
    }
  }

  private isOpen(): boolean {
    if (this.failures >= this.threshold) {
      const timeSinceLastFailure = Date.now() - this.lastFailureTime;
      return timeSinceLastFailure < this.timeout;
    }
    return false;
  }
}
```

---

## 📊 Data Flow Example: Course Enrollment

```
User clicks "Enroll" →
  ↓
[Frontend] Optimistic update →
  ↓
[API Gateway] Authentication + Rate limit →
  ↓
[Learning Engine] Process enrollment →
  ↓
[Database] Save enrollment record →
  ↓
[Event Bus] Publish "course.enrolled" event →
  ↓
  ├─→ [AI Engine] Update recommendations
  ├─→ [Creator Engine] Track revenue
  ├─→ [Social Engine] Generate achievement post
  └─→ [Messaging Engine] Send welcome message
```

---

## 🚀 Scalability Plan

### Stage 1: MVP (0-1K users)
- Single monolithic backend
- Single PostgreSQL database
- Redis for caching
- Deploy on single server

### Stage 2: Growth (1K-10K users)
- Separate WebSocket server
- Database read replicas
- CDN for static assets
- Load balancer (nginx)

### Stage 3: Scale (10K-100K users)
- Microservices architecture
- Database sharding (by user_id)
- Elasticsearch for search
- Message queue (RabbitMQ)
- Auto-scaling groups

### Stage 4: Enterprise (100K-1M+ users)
- Kubernetes orchestration
- Multi-region deployment
- Advanced caching (Redis Cluster)
- Video streaming (dedicated CDN)
- Real-time analytics (Apache Kafka)

---

## 🎓 Technical Debt Prevention

### Code Quality
```typescript
// 1. Enforce TypeScript strict mode
{
  "compilerOptions": {
    "strict": true,
    "noImplicitAny": true,
    "strictNullChecks": true
  }
}

// 2. Automated testing
- Unit tests: 80%+ coverage
- Integration tests: Critical paths
- E2E tests: User journeys

// 3. Code review process
- All PRs require 2 approvals
- Automated linting (ESLint)
- Pre-commit hooks (Husky)
```

### Architecture Principles
1. **Single Responsibility** - Each engine does one thing well
2. **Loose Coupling** - Engines communicate via events
3. **High Cohesion** - Related features stay together
4. **Fail Fast** - Validate early, fail loudly
5. **Monitor Everything** - Logs, metrics, traces

---

**Next Document**: `MONETIZATION_STRATEGY.md` →
