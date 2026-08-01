# 📊 DATABASE ENTITY RELATIONSHIP DIAGRAM (ERD)

## 🏗️ Architecture Overview

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                       NAHRAIN SOCIAL MEDIA PLATFORM                         │
│                          Database Architecture                              │
└─────────────────────────────────────────────────────────────────────────────┘

┌──────────────┐         ┌──────────────┐         ┌──────────────┐
│    ROLES     │────────<│  USER_ROLES  │>────────│    USERS     │
│              │  1    n │              │ n    1  │              │
│ • id (PK)    │         │ • id (PK)    │         │ • id (PK)    │
│ • name       │         │ • user_id    │         │ • username   │
│ • descrip... │         │ • role_id    │         │ • email      │
└──────────────┘         └──────────────┘         │ • password   │
                                                   │ • full_name  │
                                                   │ • avatar_url │
                                                   │ • is_active  │
                                                   │ • is_banned  │
                                                   └──────────────┘
                                                          │
                ┌─────────────────────────────────────────┼─────────────────┐
                │                                         │                 │
                │                                         │                 │
         ┌──────▼──────┐                          ┌──────▼──────┐   ┌──────▼──────┐
         │    POSTS    │                          │   FOLLOWS   │   │   BLOCKS    │
         │             │                          │             │   │             │
         │ • id (PK)   │                          │ • id (PK)   │   │ • id (PK)   │
         │ • user_id   │                          │ • follower  │   │ • blocker   │
         │ • content   │                          │ • following │   │ • blocked   │
         │ • media_url │                          │ • status    │   └─────────────┘
         │ • likes_cnt │                          └─────────────┘
         │ • comments  │
         └─────┬───────┘
               │
       ┌───────┼───────────────┐
       │       │               │
┌──────▼───┐ ┌▼──────────┐ ┌──▼────────────┐
│ COMMENTS │ │   LIKES   │ │  SAVED_POSTS  │
│          │ │           │ │               │
│ • id     │ │ • id      │ │ • id          │
│ • post   │ │ • user_id │ │ • user_id     │
│ • user   │ │ • likeable│ │ • post_id     │
│ • content│ │ • type    │ └───────────────┘
└──────────┘ └───────────┘

┌──────────────┐         ┌──────────────┐
│   STORIES    │────────<│ STORY_VIEWS  │
│              │  1    n │              │
│ • id (PK)    │         │ • id (PK)    │
│ • user_id    │         │ • story_id   │
│ • media_url  │         │ • viewer_id  │
│ • expires_at │         │ • viewed_at  │
└──────────────┘         └──────────────┘

┌─────────────────┐      ┌────────────────────────┐
│ CONVERSATIONS   │─────<│ CONVERSATION_PARTICIP. │>─────┐
│                 │ 1  n │                        │ n  1 │
│ • id (PK)       │      │ • id (PK)              │      │
│ • type          │      │ • conversation_id      │      │
│ • name          │      │ • user_id              │      │
│ • last_message  │      │ • role                 │      │
└────────┬────────┘      └────────────────────────┘      │
         │                                                │
         │ 1                                             │
         │                                                │
         │ n                                              │
    ┌────▼───────┐                                  ┌────▼─────┐
    │  MESSAGES  │                                  │  USERS   │
    │            │                                  └──────────┘
    │ • id (PK)  │
    │ • conv_id  │
    │ • sender   │
    │ • content  │
    │ • media    │
    │ • is_read  │
    └────────────┘

┌──────────────────┐         ┌──────────────┐
│  NOTIFICATIONS   │         │   REPORTS    │
│                  │         │              │
│ • id (PK)        │         │ • id (PK)    │
│ • user_id        │         │ • reporter   │
│ • type           │         │ • reported   │
│ • message        │         │ • type       │
│ • actor_id       │         │ • reason     │
│ • reference_id   │         │ • status     │
│ • is_read        │         │ • reviewed   │
└──────────────────┘         └──────────────┘

┌──────────────────┐         ┌──────────────┐
│   ADMIN_LOGS     │         │  HASHTAGS    │
│                  │         │              │
│ • id (PK)        │         │ • id (PK)    │
│ • admin_id       │         │ • name       │
│ • action         │         │ • usage_cnt  │
│ • target_type    │         └──────┬───────┘
│ • target_id      │                │
│ • details        │                │ n
│ • ip_address     │                │
└──────────────────┘         ┌──────▼──────────┐
                             │  POST_HASHTAGS  │
                             │                 │
                             │ • id (PK)       │
                             │ • post_id       │
                             │ • hashtag_id    │
                             └─────────────────┘
```

## 📋 Key Relationships

### 1️⃣ Users & Roles (Many-to-Many)
- One user can have multiple roles
- One role can be assigned to multiple users
- Junction table: `user_roles`

### 2️⃣ Users & Posts (One-to-Many)
- One user can create many posts
- Each post belongs to one user

### 3️⃣ Posts & Comments (One-to-Many)
- One post can have many comments
- Comments can have replies (self-referencing)

### 4️⃣ Users & Follows (Self-referencing Many-to-Many)
- Users can follow other users
- Tracks follower/following relationships
- Status field for private account follow requests

### 5️⃣ Posts & Likes (Polymorphic)
- Posts can be liked by many users
- Comments can also be liked
- `likeable_type` and `likeable_id` for polymorphic relationship

### 6️⃣ Stories & Views (One-to-Many)
- One story can have many views
- Tracks which users viewed which stories

### 7️⃣ Conversations & Messages (One-to-Many)
- One conversation has many messages
- Supports both direct and group chats

### 8️⃣ Conversations & Participants (Many-to-Many)
- Multiple users can participate in one conversation
- Junction table: `conversation_participants`

### 9️⃣ Posts & Hashtags (Many-to-Many)
- One post can have multiple hashtags
- One hashtag can be used in multiple posts
- Junction table: `post_hashtags`

## 🔑 Indexes Strategy

### High-Performance Indexes:
```sql
-- User lookups
idx_users_username, idx_users_email

-- Feed queries
idx_posts_user, idx_posts_created_at

-- Social interactions
idx_follows_follower, idx_follows_following
idx_likes_user, idx_likes_likeable

-- Messaging
idx_messages_conversation, idx_messages_created_at

-- Notifications
idx_notifications_user, idx_notifications_is_read

-- Stories
idx_stories_expires_at (for cleanup)
```

## 🔒 Security Constraints

1. **No self-referencing actions**: Users cannot follow/block themselves
2. **Unique constraints**: Prevent duplicate likes, follows, etc.
3. **Content validation**: Posts must have either content or media
4. **Email format validation**: Regex check on user emails
5. **Enum constraints**: Status fields limited to valid values
6. **Cascading deletes**: Maintain referential integrity

## 📊 Scalability Considerations

### 🚀 Future Optimizations:
- **Partitioning**: Posts and messages by date
- **Read replicas**: For feed generation
- **Sharding**: User data by region
- **Archive strategy**: Move old posts to cold storage
- **CDN integration**: For media URLs
