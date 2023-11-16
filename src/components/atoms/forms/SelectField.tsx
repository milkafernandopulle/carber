import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import React from "react";
import {
  Control,
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
  placeholder?: string;
}

type Props<FieldsType extends FieldValues> = FormInputControllerProps<FieldsType> & {
  label?: string;
  inputProps?: Omit<
    React.ComponentProps<typeof Select>,
    "placeholder" | "label" | "value" | "onBlur"
  >;
  items: readonly (string | number)[];
};

const SelectField = <FieldsType extends FieldValues>({
  label,
  name,
  inputProps,
  placeholder,
  items,
}: Props<FieldsType>) => {
  const { control } = useFormContext();
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => {
        return (
          <FormItem>
            <FormLabel className="block">{label}</FormLabel>
            <FormControl>
              <Select
                {...inputProps}
                value={field.value?.toString()}
                onValueChange={(value) => {
                  field.onChange(items.find((item) => item.toString() === value));
                }}>
                <SelectTrigger className="w-full bg-white">
                  <SelectValue placeholder={placeholder} />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup className="overflow-y-auto max-h-[10rem]">
                    {items.map((item) => (
                      <SelectItem key={item} value={item.toString()}>
                        {item}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </FormControl>
            <FormMessage />
          </FormItem>
        );
      }}
    />
  );
};

export default SelectField;
