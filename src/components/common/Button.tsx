import React from "react";
import { Button as MuiButton, ButtonProps as MuiButtonProps } from "@mui/material";

interface ButtonProps extends MuiButtonProps {
  className?: string;
  children: React.ReactNode;
}

const Button: React.FC<ButtonProps> = ({ children, className, ...props }) => {
  return (
    <MuiButton variant="contained" className={className} {...props}>
      {children}
    </MuiButton>
  );
};

export default Button;
