import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import FileUploadInput from "./FileUploadInput";
import { FieldError, FieldValues, Path, RegisterOptions, useFormContext } from "react-hook-form";

interface FormInputControllerProps<FieldsType extends FieldValues> {
  name: Path<FieldsType>;
  defaultValue?: string;
  rules?: RegisterOptions;
  error?: FieldError;
  placeholder?: string;
}

type FileUploadFieldProps<FieldsType extends FieldValues> = FormInputControllerProps<FieldsType> & {
  label?: string;
  uploadUrl: string;
};
const FileUploadField = <FieldsType extends FieldValues>({
  label,
  name,
  uploadUrl,
}: FileUploadFieldProps<FieldsType>) => {
  const { control } = useFormContext();
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel>{label}</FormLabel>
          <FormControl>
            <FileUploadInput
              uploadUrl={uploadUrl}
              name={name}
              label=""
              value={field.value}
              onChange={field.onChange}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default FileUploadField;
