"use client";
import { forwardRef } from "react";
import { Input } from "../ui/input";
import { useFormStatus } from "react-dom";
import { Label } from "../ui/label";
import { cn } from "@/lib/utils";
import { FormError } from "./FormError";
interface FormInputProps {
  id: string;
  label?: string;
  type?: string;
  placeholder?: string;
  disabled?: boolean;
  required?: boolean;
  errors?: Record<string, string[] | undefined>;
  className?: string;
  defaultValue?: string;
  onBlur?: () => void;
}

export const FormInput = forwardRef<HTMLInputElement, FormInputProps>(
  (
    {
      id,
      label,
      type,
      placeholder,
      disabled,
      required,
      errors,
      className,
      defaultValue = "",
      onBlur,
    },
    ref
  ) => {
    const { pending } = useFormStatus();
    return (
      <div className="space-y-2">
        <div className="space-y-1">
          {label ? (
            <Label
              htmlFor={id}
              className="text-xs font-semibold text-neutral-700"
            >
              {label}
            </Label>
          ) : null}
          <Input
            type={type}
            defaultValue={defaultValue}
            required={required}
            ref={ref}
            disabled={disabled || pending}
            name={id}
            placeholder={placeholder}
            id={id}
            onBlur={onBlur}
            className={cn("text-sm px-2 py-1 h-7", className)}
            aria-describedby={`${id}-error`}
          />
        </div>
        <FormError id={id} errors={errors} />
      </div>
    );
  }
);
FormInput.displayName = "FormInput";
