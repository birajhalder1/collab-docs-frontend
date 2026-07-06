import { InputHTMLAttributes, forwardRef } from "react";
import clsx from "clsx";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, className, ...props }, ref) => {
    return (
      <div className="mb-5">
        <label className="mb-2 block text-sm font-medium text-slate-700">
          {label}
        </label>

        <input
          ref={ref}
          className={clsx(
            "w-full rounded-lg border border-slate-300 px-4 py-3 outline-none transition",
            "focus:border-blue-500 focus:ring-2 focus:ring-blue-200",
            error && "border-red-500 focus:ring-red-200",
            className,
          )}
          {...props}
        />

        {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
      </div>
    );
  },
);

Input.displayName = "Input";

export default Input;
