import { FormItem, FormLabel, FormControl, FormMessage, FormField } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { format, isDate } from "date-fns";
import { type } from "os";

import { enGB } from "date-fns/locale";
import React from "react";
import {
  Control,
  Controller,
  FieldError,
  FieldValues,
  Path,
  RegisterOptions,
  useFormContext,
} from "react-hook-form";

interface FormInputControllerProps<FieldsType extends FieldValues> {
  name: Path<FieldsType>;
  defaultValue?: string;
  rules?: RegisterOptions;
  error?: FieldError;
}

type Props<FieldsType extends FieldValues> = FormInputControllerProps<FieldsType> & {
  label?: string;
  placeholder?: string;
  type?: string;
  disabled?: boolean;
  maxLength?: number;
  inputProps?: Omit<
    React.ComponentProps<typeof Input>,
    "placeholder" | "label" | "value" | "onChangeText" | "onBlur" | "type"
  >;
};

const TextInputField = <FieldsType extends FieldValues>({
  label,
  name,
  placeholder,
  type = "text",
  inputProps,
  disabled = false,
  maxLength,
}: Props<FieldsType>) => {
  const { control } = useFormContext();

  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => {
        let value = field.value;
        if (typeof value === "number") {
          value = isNaN(field.value) || field.value === 0 ? "" : field.value.toString();
        } else if (isDate(value)) {
          value = format(value, "P", {
            locale: enGB,
          }) as any;
        }
        return (
          <FormItem>
            <FormLabel className="block">{label}</FormLabel>
            <FormControl>
              <Input
                {...inputProps}
                disabled={disabled || false}
                type={type}
                value={value}
                onChange={(e) => {
                  if (type !== "number") {
                    field.onChange(e);
                    return;
                  } else if (type === "number") {
                    if (
                      maxLength &&
                      (value?.toString()?.length > maxLength || e.target.value.length >= maxLength)
                    ) {
                      return;
                    }
                    let output = parseInt(e.target.value, 10);
                    output = isNaN(output) ? 0 : output;
                    field.onChange({
                      ...e,
                      target: {
                        ...e.target,
                        value: output,
                      },
                    });
                  }
                }}
                placeholder={placeholder}
                maxLength={maxLength}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        );
      }}
    />
  );
};

export default TextInputField;
