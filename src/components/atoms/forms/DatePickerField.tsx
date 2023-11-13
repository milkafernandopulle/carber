import { DatePicker } from "@/components/ui/date-picker";
import { FormItem, FormLabel, FormControl, FormMessage, FormField } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { type } from "os";
import React from "react";
import {
  Control,
  Controller,
  FieldError,
  FieldValues,
  Path,
  RegisterOptions,
} from "react-hook-form";

interface FormInputControllerProps<FieldsType extends FieldValues> {
  name: Path<FieldsType>;
  defaultValue?: string;
  rules?: RegisterOptions;
  error?: FieldError;
  control: Control<FieldsType>;
}

type Props<FieldsType extends FieldValues> = FormInputControllerProps<FieldsType> & {
  label?: string;
  placeholder?: string;
  type?: string;
  inputProps?: Omit<
    React.ComponentProps<typeof Input>,
    "placeholder" | "label" | "value" | "onChangeText" | "onBlur" | "type"
  >;
};

const DatePickerField = <FieldsType extends FieldValues>({
  label,
  control,
  name,
  placeholder,
  type = "text",
  inputProps,
}: Props<FieldsType>) => {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel className="block">{label}</FormLabel>
          <FormControl>
            <DatePicker
              {...inputProps}
              value={field.value}
              onChange={field.onChange}
              placeholder={placeholder}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default DatePickerField;
