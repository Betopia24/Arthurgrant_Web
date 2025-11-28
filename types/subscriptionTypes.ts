export type SubscriptionResponseTypes = {
  success: boolean;
  message: string;
  data: SubscriptionDataTypes;
};
export type SubscriptionDataTypes = {
  id: string;
  userId: string;
  planId: string;
  startDate: string;
  endDate: string | null;
  amount: number;
  stripePaymentId: string;
  paymentStatus: "PENDING" | "COMPLETED" | "FAILED";
  createdAt: string;
  updatedAt: string;
  user: UserTypes;
  plan: PlanTypes;
  members: MemberTypes[];
};
export type UserTypes = {
  id: string;
  firstName: string;
  lastName: string;
  profilePic: string;
  email: string;
  role: "USER" | "ADMIN";
  isSubscribed: boolean;
  planExpiration: string;
};
export type PlanTypes = {
  id: string;
  planName: string;
  amount: number;
  PlanType: "FREE" | "PAID";
  currency: string;
  interval: "month" | "year";
  intervalCount: number;
  freeTrialDays: number | null;
  productId: string;
  priceId: string;
  active: boolean;
  description: string;
  maxMembers: number;
  features: string[];
  createdAt: string;
  updatedAt: string;
};
export type MemberTypes = {
  // currently empty in your sample
  // define later if you have a structure
};
