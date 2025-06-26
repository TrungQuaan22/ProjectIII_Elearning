export enum UserVerifyStatus {
  Unverified, // chưa xác thực email, mặc định = 0
  Verified, // đã xác thực email
  Banned // bị khóa
}
export enum TokenType {
  AccessToken,
  RefreshToken,
  ForgotPasswordToken,
  EmailVerifyToken
}

export enum UserRole {
  Admin = 'admin',
  User = 'user'
}

export enum BlogStatus {
  Draft = 'draft',
  Published = 'published'
}

export enum CourseStatus {
  Draft = 'draft',
  Published = 'published',
  Archived = 'archived'
}

export enum EnrollmentStatus {
  Active = 'active',
  Completed = 'completed',
  Expired = 'expired'
}

export enum OrderStatus {
  Pending = 'pending',
  Processing = 'processing',
  Completed = 'completed',
  Failed = 'failed',
  Cancelled = 'cancelled'
}
