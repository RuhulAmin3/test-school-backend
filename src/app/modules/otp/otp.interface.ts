export type IOtp = {
    email: string;
    otp: string;
    type: 'email_verification' | 'password_reset';
    expiresAt: Date;
    attempts?: number; // default: 0
    maxAttempts?: number; // default: 5
    // attemptsResetTime?: Date; // default: 5 minutes from creation
    isUsed?: boolean; // default: false    
}