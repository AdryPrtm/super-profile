import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type ProfileFieldProps = {
  label: string;
  name: string;
  defaultValue: string;
  placeholder?: string;
  type?: string;
  maxLength?: number;
};

export function ProfileField({
  label,
  name,
  defaultValue,
  placeholder,
  type = "text",
  maxLength,
}: ProfileFieldProps) {
  return (
    <div className="space-y-2">
      <Label htmlFor={name}>{label}</Label>
      <Input
        id={name}
        name={name}
        type={type}
        maxLength={maxLength}
        defaultValue={defaultValue}
        placeholder={placeholder}
      />
    </div>
  );
}
