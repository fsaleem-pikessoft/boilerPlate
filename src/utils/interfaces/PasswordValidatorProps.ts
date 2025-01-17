
export interface PasswordValidatorProps {

    password: string;
  
    isValidHook: (isValid: boolean) => void;
  
  }
  
  
  
export interface ValidationState {
  
    hasNumber: boolean;
  
    isLongEnough: boolean;
  
    hasUppercase: boolean;
  
    hasLowercase: boolean;
  
  }
  