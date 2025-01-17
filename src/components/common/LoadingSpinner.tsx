import React from "react";

interface LoadingSpinnerProps {
  isVisible: boolean;
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  isVisible,
}) => {
  if (!isVisible) return null;

  return (
    <div className="flex items-center justify-center min-h-screen w-full">
      <div className="text-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-500 mx-auto mb-4"></div>
        <p className="text-xl font-semibold text-gray-700">Loading...</p>
      </div>
    </div>
  );
};
