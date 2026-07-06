import { ButtonHTMLAttributes } from "react";
import clsx from "clsx";

type ButtonVariant = "primary" | "secondary" | "danger";

type ButtonSize = "sm" | "md" | "lg";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
}

export default function Button({
  children,
  variant = "primary",
  size = "md",
  loading = false,
  className,
  disabled,
  ...props
}: ButtonProps) {
  return (
    <button
      disabled={disabled || loading}
      className={clsx(
        "rounded-lg font-medium transition-all duration-200 disabled:cursor-not-allowed disabled:opacity-60",

        {
          "bg-blue-600 text-white hover:bg-blue-700": variant === "primary",
          "bg-gray-200 text-gray-900 hover:bg-gray-300":
            variant === "secondary",
          "bg-red-600 text-white hover:bg-red-700": variant === "danger",

          "px-3 py-2 text-sm": size === "sm",
          "px-5 py-2.5 text-base": size === "md",
          "px-6 py-3 text-lg": size === "lg",
        },

        className,
      )}
      {...props}
    >
      {loading ? "Loading..." : children}
    </button>
  );
}
