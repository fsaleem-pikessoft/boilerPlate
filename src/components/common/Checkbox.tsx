import React, { ChangeEvent } from "react";
import { Checkbox as MuiCheckbox, FormControlLabel, CheckboxProps } from "@mui/material";

interface CustomCheckboxProps extends Omit<CheckboxProps, "onChange"> {
  id?: string;
  checked: boolean;
  onChange: (event: ChangeEvent<HTMLInputElement>) => void;
  icon?: React.ReactNode;
  checkedIcon?: React.ReactNode;
  className?: string;
  label?: string | React.ReactNode;
}

const Checkbox: React.FC<CustomCheckboxProps> = ({
  id,
  checked,
  onChange,
  icon,
  checkedIcon,
  className,
  label,
  ...props
}) => {
  return (
    <FormControlLabel
      control={
        <MuiCheckbox
          id={id}
          checked={checked}
          onChange={onChange}
          icon={icon}
          checkedIcon={checkedIcon}
          {...props}
        />
      }
      label={label}
      className={className}
    />
  );
};

export default Checkbox;
