import React from "react";
import { TextField, InputAdornment } from "@mui/material";

const Input = ({ startIcon, endIcon, className, inputRef, ...props }) => {
  return (
    <TextField
      inputRef={inputRef}
      className={className}
      slotProps={{
        input: {
          startAdornment: startIcon && (
            <InputAdornment position="start">{startIcon}</InputAdornment>
          ),
          endAdornment: endIcon && (
            <InputAdornment position="end">{endIcon}</InputAdornment>
          ),
        },
      }}
      fullWidth
      variant="outlined"
      {...props}
    />
  );
};

export default Input;
