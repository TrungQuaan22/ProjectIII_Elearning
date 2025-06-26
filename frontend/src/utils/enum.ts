export enum UserStatus {
    ACTIVE = 1,
    INACTIVE = 2,
    LOCKED = 3
  }
  
  export enum UserRole {
    USER = 1,
    ADMIN = 2
  }
  
  export enum BookLanguage {
    VIETNAMESE = 1,
    JAPANESE = 2,
    ENGLISH = 3,
    CHINESE = 4
  }
 export function getLanguageName(value: number): string {
    switch (value) {
      case BookLanguage.VIETNAMESE:
        return "Tiếng Việt";
      case BookLanguage.JAPANESE:
        return "Tiếng Nhật";
      case BookLanguage.ENGLISH:
        return "Tiếng Anh";
      case BookLanguage.CHINESE:
        return "Tiếng Trung";
      default:
        return "Ngôn ngữ không xác định";
    }
  }
  
  export enum ReviewStatus {
    PENDING = 1,
    COMPLETE = 2,
    REJECT = 3
  }
  
  export enum OrderStatus {
    OVERDUE = 1,
    BORROWING = 2,
    LOST = 3,
    COMPLETED = 4
  }
  
  export enum Gender {
    MALE = 1,
    FEMALE = 2,
    OTHER = 3
  }
  
  export enum BookStatus {
    AVAILABLE = 1,
    UNAVAILABLE = 2
  } 