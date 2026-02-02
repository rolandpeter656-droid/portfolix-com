import { z } from 'zod';

// Phone number validation - international format
const phoneRegex = /^\+?[1-9]\d{6,14}$/;

// SignUp form validation schema
export const signUpSchema = z.object({
  firstName: z.string()
    .min(1, 'First name is required')
    .max(50, 'First name must be less than 50 characters')
    .trim(),
  lastName: z.string()
    .min(1, 'Last name is required')
    .max(50, 'Last name must be less than 50 characters')
    .trim(),
  email: z.string()
    .email('Invalid email address')
    .max(255, 'Email must be less than 255 characters')
    .trim()
    .toLowerCase(),
  password: z.string()
    .min(8, 'Password must be at least 8 characters')
    .max(128, 'Password must be less than 128 characters'),
  phoneNumber: z.string()
    .min(1, 'Phone number is required')
    .regex(phoneRegex, 'Invalid phone number format (use international format: +1234567890)')
    .or(z.literal('')), // Allow empty for optional
});

export type SignUpFormData = z.infer<typeof signUpSchema>;

// Payment form validation schema
export const paymentFormSchema = z.object({
  firstName: z.string()
    .min(1, 'First name is required')
    .max(50, 'First name must be less than 50 characters')
    .trim(),
  lastName: z.string()
    .min(1, 'Last name is required')
    .max(50, 'Last name must be less than 50 characters')
    .trim(),
  email: z.string()
    .email('Invalid email address')
    .max(255, 'Email must be less than 255 characters')
    .trim()
    .toLowerCase(),
  phone: z.string()
    .regex(phoneRegex, 'Invalid phone number format')
    .or(z.literal(''))
    .optional(),
  teamSize: z.number()
    .min(1, 'Team size must be at least 1')
    .max(10000, 'Team size exceeds maximum allowed')
    .optional(),
  couponCode: z.string()
    .max(50, 'Coupon code is too long')
    .optional(),
});

export type PaymentFormData = z.infer<typeof paymentFormSchema>;

// API waitlist form validation schema
export const apiWaitlistSchema = z.object({
  email: z.string()
    .email('Invalid email address')
    .max(255, 'Email must be less than 255 characters')
    .trim()
    .toLowerCase(),
  company: z.string()
    .max(100, 'Company name must be less than 100 characters')
    .trim()
    .optional(),
});

export type ApiWaitlistFormData = z.infer<typeof apiWaitlistSchema>;

// Coupon code validation schema
export const couponCodeSchema = z.object({
  code: z.string()
    .min(1, 'Coupon code is required')
    .max(50, 'Coupon code is too long')
    .trim()
    .toUpperCase(),
});

// Referral code validation
export const referralCodeSchema = z.string()
  .max(20, 'Referral code is too long')
  .regex(/^[A-Z0-9-]*$/, 'Invalid referral code format')
  .optional();

// Helper function to validate and return errors
export function validateForm<T>(
  schema: z.ZodSchema<T>,
  data: unknown
): { success: true; data: T } | { success: false; errors: Record<string, string> } {
  const result = schema.safeParse(data);
  
  if (result.success) {
    return { success: true, data: result.data };
  }
  
  const errors: Record<string, string> = {};
  result.error.errors.forEach((error) => {
    const path = error.path.join('.');
    if (path) {
      errors[path] = error.message;
    }
  });
  
  return { success: false, errors };
}
