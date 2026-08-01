# 💰 MONETIZATION STRATEGY - Technical Implementation

## Revenue Streams Overview

```
┌────────────────────────────────────────────────────────────┐
│                    REVENUE STREAMS                         │
├────────────────────────────────────────────────────────────┤
│  1. Course Sales (One-time)                  60% of revenue│
│  2. Subscriptions (Recurring)                25% of revenue│
│  3. Creator Revenue Share (Platform Fee)     10% of revenue│
│  4. Ads (Future)                              5% of revenue│
└────────────────────────────────────────────────────────────┘
```

---

## 1️⃣ Course Sales System

### Pricing Models

```sql
-- Pricing tiers
CREATE TABLE course_pricing (
  id UUID PRIMARY KEY,
  course_id UUID REFERENCES courses(id),
  pricing_type VARCHAR(50), -- fixed, dynamic, tiered
  base_price DECIMAL(10,2),
  currency VARCHAR(3) DEFAULT 'USD',
  discount_percentage DECIMAL(5,2),
  discount_valid_until TIMESTAMP,
  created_at TIMESTAMP,
  INDEX idx_course (course_id)
);

-- Dynamic pricing rules
CREATE TABLE pricing_rules (
  id UUID PRIMARY KEY,
  course_id UUID REFERENCES courses(id),
  rule_type VARCHAR(50), -- early_bird, bulk, seasonal
  condition_value INTEGER,
  discount_percentage DECIMAL(5,2),
  priority INTEGER,
  is_active BOOLEAN DEFAULT true
);
```

### Payment Integration

```typescript
// Payment gateway abstraction
interface PaymentGateway {
  createPaymentIntent(amount: number, currency: string): Promise<string>;
  confirmPayment(intentId: string): Promise<PaymentResult>;
  refund(transactionId: string, amount?: number): Promise<RefundResult>;
}

// Stripe implementation
class StripePaymentGateway implements PaymentGateway {
  async createPaymentIntent(amount: number, currency: string) {
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount * 100, // Convert to cents
      currency,
      automatic_payment_methods: { enabled: true },
    });
    
    return paymentIntent.client_secret;
  }

  async confirmPayment(intentId: string) {
    const intent = await stripe.paymentIntents.retrieve(intentId);
    
    return {
      success: intent.status === 'succeeded',
      transactionId: intent.id,
      amount: intent.amount / 100,
    };
  }

  async refund(transactionId: string, amount?: number) {
    const refund = await stripe.refunds.create({
      payment_intent: transactionId,
      amount: amount ? amount * 100 : undefined,
    });
    
    return {
      success: refund.status === 'succeeded',
      refundId: refund.id,
    };
  }
}

// Payment service
class PaymentService {
  private gateway: PaymentGateway;

  async purchaseCourse(
    userId: string,
    courseId: string,
    paymentMethod: string
  ): Promise<PurchaseResult> {
    // 1. Get course pricing
    const pricing = await this.getCoursePricing(courseId);
    
    // 2. Apply discounts
    const finalPrice = await this.applyDiscounts(pricing, userId);
    
    // 3. Create payment intent
    const clientSecret = await this.gateway.createPaymentIntent(
      finalPrice,
      'USD'
    );
    
    // 4. Wait for payment confirmation (webhook)
    // This happens asynchronously via webhook
    
    return {
      clientSecret,
      amount: finalPrice,
    };
  }

  async handlePaymentSuccess(transactionId: string) {
    // 1. Verify payment
    const payment = await this.gateway.confirmPayment(transactionId);
    
    // 2. Grant course access
    await this.grantCourseAccess(payment.userId, payment.courseId);
    
    // 3. Calculate revenue split
    const { platformFee, creatorEarnings } = this.calculateRevenueSplit(
      payment.amount
    );
    
    // 4. Record transaction
    await this.recordTransaction({
      userId: payment.userId,
      courseId: payment.courseId,
      amount: payment.amount,
      platformFee,
      creatorEarnings,
      transactionId,
    });
    
    // 5. Publish event
    await eventBus.publish({
      type: 'payment.completed',
      data: payment,
    });
  }

  private calculateRevenueSplit(amount: number) {
    const platformFee = amount * 0.2; // 20%
    const creatorEarnings = amount - platformFee; // 80%
    
    return { platformFee, creatorEarnings };
  }
}
```

---

## 2️⃣ Subscription System

### Subscription Tiers

```typescript
enum SubscriptionTier {
  FREE = 'free',
  BASIC = 'basic',
  PRO = 'pro',
  ENTERPRISE = 'enterprise',
}

interface SubscriptionFeatures {
  tier: SubscriptionTier;
  price: number;
  features: {
    coursesPerMonth: number | 'unlimited';
    downloadableContent: boolean;
    certificateAccess: boolean;
    aiTutorAccess: boolean;
    prioritySupport: boolean;
    offlineAccess: boolean;
  };
}

const SUBSCRIPTION_PLANS: Record<SubscriptionTier, SubscriptionFeatures> = {
  free: {
    tier: SubscriptionTier.FREE,
    price: 0,
    features: {
      coursesPerMonth: 1,
      downloadableContent: false,
      certificateAccess: false,
      aiTutorAccess: false,
      prioritySupport: false,
      offlineAccess: false,
    },
  },
  basic: {
    tier: SubscriptionTier.BASIC,
    price: 9.99,
    features: {
      coursesPerMonth: 5,
      downloadableContent: true,
      certificateAccess: true,
      aiTutorAccess: false,
      prioritySupport: false,
      offlineAccess: true,
    },
  },
  pro: {
    tier: SubscriptionTier.PRO,
    price: 19.99,
    features: {
      coursesPerMonth: 'unlimited',
      downloadableContent: true,
      certificateAccess: true,
      aiTutorAccess: true,
      prioritySupport: true,
      offlineAccess: true,
    },
  },
  enterprise: {
    tier: SubscriptionTier.ENTERPRISE,
    price: 49.99,
    features: {
      coursesPerMonth: 'unlimited',
      downloadableContent: true,
      certificateAccess: true,
      aiTutorAccess: true,
      prioritySupport: true,
      offlineAccess: true,
    },
  },
};
```

### Database Schema

```sql
-- Subscriptions
CREATE TABLE user_subscriptions (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES users(id),
  tier VARCHAR(50),
  status VARCHAR(50), -- active, cancelled, expired
  current_period_start TIMESTAMP,
  current_period_end TIMESTAMP,
  cancel_at_period_end BOOLEAN DEFAULT false,
  stripe_subscription_id VARCHAR(255),
  created_at TIMESTAMP,
  updated_at TIMESTAMP,
  INDEX idx_user (user_id),
  INDEX idx_status (status)
);

-- Subscription usage tracking
CREATE TABLE subscription_usage (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES users(id),
  subscription_id UUID REFERENCES user_subscriptions(id),
  month DATE,
  courses_accessed INTEGER DEFAULT 0,
  ai_queries_used INTEGER DEFAULT 0,
  updated_at TIMESTAMP,
  UNIQUE(user_id, month)
);
```

### Subscription Management

```typescript
class SubscriptionManager {
  async createSubscription(userId: string, tier: SubscriptionTier) {
    const plan = SUBSCRIPTION_PLANS[tier];
    
    // Create Stripe subscription
    const subscription = await stripe.subscriptions.create({
      customer: await this.getStripeCustomerId(userId),
      items: [{ price: plan.stripePriceId }],
      payment_behavior: 'default_incomplete',
      expand: ['latest_invoice.payment_intent'],
    });
    
    // Save to database
    await db.userSubscriptions.create({
      userId,
      tier,
      status: 'active',
      currentPeriodStart: new Date(subscription.current_period_start * 1000),
      currentPeriodEnd: new Date(subscription.current_period_end * 1000),
      stripeSubscriptionId: subscription.id,
    });
    
    return subscription;
  }

  async cancelSubscription(userId: string, immediate: boolean = false) {
    const subscription = await this.getActiveSubscription(userId);
    
    if (immediate) {
      // Cancel immediately
      await stripe.subscriptions.del(subscription.stripeSubscriptionId);
      await db.userSubscriptions.update({
        where: { id: subscription.id },
        data: { status: 'cancelled' },
      });
    } else {
      // Cancel at period end
      await stripe.subscriptions.update(subscription.stripeSubscriptionId, {
        cancel_at_period_end: true,
      });
      await db.userSubscriptions.update({
        where: { id: subscription.id },
        data: { cancelAtPeriodEnd: true },
      });
    }
  }

  async checkUsageLimit(userId: string, feature: string): Promise<boolean> {
    const subscription = await this.getActiveSubscription(userId);
    const plan = SUBSCRIPTION_PLANS[subscription.tier];
    
    if (feature === 'course_access') {
      if (plan.features.coursesPerMonth === 'unlimited') return true;
      
      const usage = await this.getMonthlyUsage(userId);
      return usage.coursesAccessed < plan.features.coursesPerMonth;
    }
    
    return false;
  }

  private async getMonthlyUsage(userId: string) {
    const currentMonth = new Date();
    currentMonth.setDate(1);
    currentMonth.setHours(0, 0, 0, 0);
    
    return await db.subscriptionUsage.findUnique({
      where: { userId_month: { userId, month: currentMonth } },
    });
  }
}
```

---

## 3️⃣ Coupon System

### Database Schema

```sql
-- Coupons
CREATE TABLE coupons (
  id UUID PRIMARY KEY,
  code VARCHAR(50) UNIQUE,
  discount_type VARCHAR(50), -- percentage, fixed_amount
  discount_value DECIMAL(10,2),
  max_uses INTEGER,
  current_uses INTEGER DEFAULT 0,
  valid_from TIMESTAMP,
  valid_until TIMESTAMP,
  min_purchase_amount DECIMAL(10,2),
  applicable_to VARCHAR(50), -- all, specific_courses, category
  created_by UUID REFERENCES users(id),
  is_active BOOLEAN DEFAULT true,
  INDEX idx_code (code),
  INDEX idx_active (is_active)
);

-- Coupon redemptions
CREATE TABLE coupon_redemptions (
  id UUID PRIMARY KEY,
  coupon_id UUID REFERENCES coupons(id),
  user_id UUID REFERENCES users(id),
  order_id UUID,
  discount_applied DECIMAL(10,2),
  redeemed_at TIMESTAMP,
  UNIQUE(coupon_id, user_id), -- One use per user
  INDEX idx_user (user_id)
);
```

### Coupon Service

```typescript
class CouponService {
  async validateCoupon(
    code: string,
    userId: string,
    amount: number
  ): Promise<CouponValidation> {
    const coupon = await db.coupons.findUnique({ where: { code } });
    
    if (!coupon) {
      return { valid: false, reason: 'Coupon not found' };
    }
    
    if (!coupon.isActive) {
      return { valid: false, reason: 'Coupon is inactive' };
    }
    
    if (coupon.currentUses >= coupon.maxUses) {
      return { valid: false, reason: 'Coupon usage limit reached' };
    }
    
    const now = new Date();
    if (now < coupon.validFrom || now > coupon.validUntil) {
      return { valid: false, reason: 'Coupon expired' };
    }
    
    if (amount < coupon.minPurchaseAmount) {
      return { valid: false, reason: 'Minimum purchase amount not met' };
    }
    
    // Check if user already used this coupon
    const redemption = await db.couponRedemptions.findUnique({
      where: { couponId_userId: { couponId: coupon.id, userId } },
    });
    
    if (redemption) {
      return { valid: false, reason: 'Coupon already used' };
    }
    
    // Calculate discount
    const discount =
      coupon.discountType === 'percentage'
        ? amount * (coupon.discountValue / 100)
        : coupon.discountValue;
    
    return {
      valid: true,
      discount: Math.min(discount, amount),
      finalAmount: amount - discount,
    };
  }

  async applyCoupon(code: string, userId: string, orderId: string) {
    const coupon = await db.coupons.findUnique({ where: { code } });
    
    // Increment usage
    await db.coupons.update({
      where: { id: coupon.id },
      data: { currentUses: coupon.currentUses + 1 },
    });
    
    // Record redemption
    await db.couponRedemptions.create({
      data: {
        couponId: coupon.id,
        userId,
        orderId,
        redeemedAt: new Date(),
      },
    });
  }

  async createCoupon(data: CreateCouponInput) {
    return await db.coupons.create({ data });
  }
}
```

---

## 4️⃣ Affiliate System

### Database Schema

```sql
-- Affiliates
CREATE TABLE affiliates (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES users(id),
  referral_code VARCHAR(50) UNIQUE,
  commission_rate DECIMAL(5,2), -- Percentage
  total_earnings DECIMAL(10,2) DEFAULT 0,
  status VARCHAR(50), -- active, suspended, inactive
  created_at TIMESTAMP,
  INDEX idx_user (user_id),
  INDEX idx_code (referral_code)
);

-- Affiliate conversions
CREATE TABLE affiliate_conversions (
  id UUID PRIMARY KEY,
  affiliate_id UUID REFERENCES affiliates(id),
  referred_user_id UUID REFERENCES users(id),
  order_id UUID,
  order_amount DECIMAL(10,2),
  commission_amount DECIMAL(10,2),
  status VARCHAR(50), -- pending, approved, paid
  converted_at TIMESTAMP,
  paid_at TIMESTAMP,
  INDEX idx_affiliate (affiliate_id),
  INDEX idx_referred_user (referred_user_id)
);
```

### Affiliate Service

```typescript
class AffiliateService {
  async registerAffiliate(userId: string) {
    const referralCode = this.generateReferralCode();
    
    return await db.affiliates.create({
      data: {
        userId,
        referralCode,
        commissionRate: 10, // 10% commission
        status: 'active',
      },
    });
  }

  async trackReferral(referralCode: string, newUserId: string) {
    const affiliate = await db.affiliates.findUnique({
      where: { referralCode },
    });
    
    if (!affiliate) return;
    
    // Store referral in session/cookie
    await this.storeReferralSource(newUserId, affiliate.id);
  }

  async recordConversion(orderId: string, userId: string, amount: number) {
    const affiliateId = await this.getReferralSource(userId);
    
    if (!affiliateId) return;
    
    const affiliate = await db.affiliates.findUnique({
      where: { id: affiliateId },
    });
    
    const commissionAmount = amount * (affiliate.commissionRate / 100);
    
    await db.affiliateConversions.create({
      data: {
        affiliateId,
        referredUserId: userId,
        orderId,
        orderAmount: amount,
        commissionAmount,
        status: 'pending',
        convertedAt: new Date(),
      },
    });
    
    // Update affiliate total earnings
    await db.affiliates.update({
      where: { id: affiliateId },
      data: {
        totalEarnings: {
          increment: commissionAmount,
        },
      },
    });
  }

  private generateReferralCode(): string {
    return `REF${Math.random().toString(36).substring(2, 10).toUpperCase()}`;
  }
}
```

---

## 5️⃣ Creator Payout System

### Payout Rules

```typescript
class PayoutManager {
  private readonly MINIMUM_PAYOUT = 50; // $50
  private readonly PAYOUT_SCHEDULE = 'monthly'; // Weekly, bi-weekly, monthly

  async requestPayout(creatorId: string) {
    const balance = await this.getCreatorBalance(creatorId);
    
    if (balance < this.MINIMUM_PAYOUT) {
      throw new Error(`Minimum payout amount is $${this.MINIMUM_PAYOUT}`);
    }
    
    // Create payout request
    const payout = await db.creatorPayouts.create({
      data: {
        creatorId,
        amount: balance,
        status: 'pending',
        initiatedAt: new Date(),
      },
    });
    
    // Process payout (async)
    await this.processPayout(payout.id);
    
    return payout;
  }

  private async processPayout(payoutId: string) {
    const payout = await db.creatorPayouts.findUnique({
      where: { id: payoutId },
    });
    
    const creator = await db.users.findUnique({
      where: { id: payout.creatorId },
      include: { payoutMethod: true },
    });
    
    // Process via payment gateway
    if (creator.payoutMethod.type === 'stripe') {
      await this.stripeTransfer(creator.stripeAccountId, payout.amount);
    } else if (creator.payoutMethod.type === 'paypal') {
      await this.paypalPayout(creator.paypalEmail, payout.amount);
    }
    
    // Mark as completed
    await db.creatorPayouts.update({
      where: { id: payoutId },
      data: {
        status: 'completed',
        completedAt: new Date(),
      },
    });
  }

  private async getCreatorBalance(creatorId: string): Promise<number> {
    const transactions = await db.revenueTransactions.aggregate({
      where: {
        creatorId,
        status: 'completed',
      },
      _sum: {
        creatorEarnings: true,
      },
    });
    
    const payouts = await db.creatorPayouts.aggregate({
      where: {
        creatorId,
        status: { in: ['completed', 'processing'] },
      },
      _sum: {
        amount: true,
      },
    });
    
    return (transactions._sum.creatorEarnings || 0) - (payouts._sum.amount || 0);
  }
}
```

---

## 📊 Revenue Analytics Dashboard

```typescript
class RevenueAnalytics {
  async getDashboardMetrics(creatorId: string) {
    const [
      totalRevenue,
      monthlyRevenue,
      totalStudents,
      avgRating,
      topCourses,
    ] = await Promise.all([
      this.getTotalRevenue(creatorId),
      this.getMonthlyRevenue(creatorId),
      this.getTotalStudents(creatorId),
      this.getAverageRating(creatorId),
      this.getTopCourses(creatorId),
    ]);
    
    return {
      totalRevenue,
      monthlyRevenue,
      totalStudents,
      avgRating,
      topCourses,
    };
  }

  private async getMonthlyRevenue(creatorId: string) {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    const result = await db.revenueTransactions.aggregate({
      where: {
        creatorId,
        createdAt: { gte: thirtyDaysAgo },
        status: 'completed',
      },
      _sum: {
        creatorEarnings: true,
      },
    });
    
    return result._sum.creatorEarnings || 0;
  }
}
```

---

**Total Revenue Potential:**
- 1,000 students × $50 avg course = $50,000
- Platform fee (20%) = $10,000
- Creator earnings (80%) = $40,000

**Next**: `SCALING_INFRASTRUCTURE.md` →
