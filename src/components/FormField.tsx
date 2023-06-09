import { ChangeEventHandler, FocusEventHandler, useState } from "react";

type FormFieldProps = {
  label: string;
  value: string;
  onChange: ChangeEventHandler<HTMLInputElement | HTMLTextAreaElement>;
  onBlur?: FocusEventHandler<HTMLInputElement | HTMLTextAreaElement>;
  error: string | undefined;
  formSubmitted: boolean;
  id: string;
};

export function FormField({
  id,
  label,
  value,
  onChange,
  onBlur,
  error,
  formSubmitted,
}: FormFieldProps) {
  const [touched, setTouched] = useState(false);

  return (
    <div className="my-6">
      <label htmlFor={id} className="block mb-2 font-bold text-white text-md">
        {label}
      </label>
      <input
        type="text"
        className="w-full p-4 mx-0 text-white rounded-md bg-slate-700/70"
        id={id}
        value={value}
        onChange={onChange}
        onBlur={(e) => {
          setTouched(true);
          onBlur?.(e);
        }}
      />
      {(formSubmitted || touched) && error && (
        <span className="block mt-2 text-pink-500">{error}</span>
      )}
    </div>
  );
}
