import React, { useState, useEffect } from "react";
import { ValidationState, PasswordValidatorProps } from "../../utils/interfaces/PasswordValidatorProps";


const PasswordValidator: React.FC<PasswordValidatorProps> = ({ password, isValidHook }) => {
  const [validation, setValidation] = useState<ValidationState>({
    hasNumber: false,
    isLongEnough: false,
    hasUppercase: false,
    hasLowercase: false,
  });

  useEffect(() => {
    setValidation({
      hasNumber: /\d/.test(password),
      isLongEnough: password.length >= 8,
      hasUppercase: /[A-Z]/.test(password),
      hasLowercase: /[a-z]/.test(password),
    });
  }, [password]);

  // Calculate the number of valid conditions
  const validationsArray = [
    validation.isLongEnough,
    validation.hasNumber,
    validation.hasUppercase,
    validation.hasLowercase,
  ];
  const validCount = validationsArray.filter(Boolean).length;
  if (validCount === 4) {
    isValidHook(true);
  }

  return (
    <div className="password-validator space-y-4 p-4 bg-gray-100 rounded-lg shadow-md max-w-md mx-auto">
      {/* Progress Bar */}
      <div className="password-progress-validation flex space-x-2">
        {[...Array(4)].map((_, index) => (
          <div
            key={index}
            className={`w-1/4 h-2 ${
              index < validCount ? "bg-green-500" : "bg-gray-300"
            } rounded-md`}
          ></div>
        ))}
      </div>

      {/* Validation Messages */}
      <div className="password-validation-text space-y-2 text-sm text-gray-600">
        <p
          className={`flex items-center ${
            validation.hasNumber ? "text-green-600" : ""
          }`}
        >
          {validation.hasNumber ? "✅" : "❌"} Password must contain at least 1
          number
        </p>
        <p
          className={`flex items-center ${
            validation.isLongEnough ? "text-green-600" : ""
          }`}
        >
          {validation.isLongEnough ? "✅" : "❌"} Password must be at least 8
          characters long
        </p>
        <p
          className={`flex items-center ${
            validation.hasUppercase ? "text-green-600" : ""
          }`}
        >
          {validation.hasUppercase ? "✅" : "❌"} Password must contain at least
          1 uppercase letter
        </p>
        <p
          className={`flex items-center ${
            validation.hasLowercase ? "text-green-600" : ""
          }`}
        >
          {validation.hasLowercase ? "✅" : "❌"} Password must contain at least
          1 lowercase letter
        </p>
      </div>
    </div>
  );
};

export default PasswordValidator;
