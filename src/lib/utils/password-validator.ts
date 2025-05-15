export interface PasswordStrength {
  score: number; // 0-4
  hasMinLength: boolean;
  hasUpperCase: boolean;
  hasLowerCase: boolean;
  hasNumber: boolean;
  hasSpecialChar: boolean;
}

export function validatePassword(password: string): PasswordStrength {
  const minLength = 6;
  const hasMinLength = password.length >= minLength;
  const hasUpperCase = /[A-Z]/.test(password);
  const hasLowerCase = /[a-z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

  // Calculate score (0-4)
  let score = 0;
  if (hasMinLength) score++;
  if (hasUpperCase && hasLowerCase) score++;
  if (hasNumber) score++;
  if (hasSpecialChar) score++;

  return {
    score,
    hasMinLength,
    hasUpperCase,
    hasLowerCase,
    hasNumber,
    hasSpecialChar,
  };
}

export function getPasswordStrengthColor(score: number): string {
  switch (score) {
    case 0:
      return 'bg-red-500';
    case 1:
      return 'bg-orange-500';
    case 2:
      return 'bg-yellow-500';
    case 3:
      return 'bg-lime-500';
    case 4:
      return 'bg-green-500';
    default:
      return 'bg-gray-200';
  }
}

export function getPasswordStrengthText(score: number): string {
  switch (score) {
    case 0:
      return 'Very Weak';
    case 1:
      return 'Weak';
    case 2:
      return 'Fair';
    case 3:
      return 'Good';
    case 4:
      return 'Strong';
    default:
      return '';
  }
} 