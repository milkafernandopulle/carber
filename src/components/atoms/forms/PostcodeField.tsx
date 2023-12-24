"use client";
import { Combobox } from "@/components/ui/combobox";
import { useDebouncedCallback } from "use-debounce";
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
import React, { useMemo, useState } from "react";
import {
  Control,
  ControllerRenderProps,
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
  className?: string;
};

const PostcodeField = <FieldsType extends FieldValues>({
  label,
  name,
  className,
}: Props<FieldsType>) => {
  const { control } = useFormContext();

  const { postcodeList, handleSearchChange } = usePostcodeSearch();

  const handleValueChange =
    (field: ControllerRenderProps<FieldValues, Path<FieldsType>>) => (value: string) => {
      field.onChange({
        target: {
          value,
        },
      });
    };

  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => {
        return (
          <FormItem>
            <FormLabel className="block">{label}</FormLabel>
            <FormControl>
              <Combobox
                className={className}
                value={field.value}
                onValueChange={handleValueChange(field)}
                items={postcodeList}
                onSearchChange={handleSearchChange}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        );
      }}
    />
  );
};

export default PostcodeField;

function usePostcodeSearch() {
  const [postcodeList, setPostcodeList] = useState<string[]>([]);

  const handleSearchChange = React.useCallback(async (value: string) => {
    const response = await fetch(`https://api.postcodes.io/postcodes/${value}/autocomplete`);
    const data = await response.json();
    setPostcodeList(data.result.map((i: string) => i.toUpperCase()));
  }, []);
  return {
    postcodeList,
    handleSearchChange,
  };
}
