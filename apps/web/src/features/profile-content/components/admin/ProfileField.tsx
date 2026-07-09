import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type ProfileFieldProps = {
  label: string;
  name: string;
  defaultValue: string;
  placeholder?: string;
  type?: string;
};

export function ProfileField({
  label,
  name,
  defaultValue,
  placeholder,
  type = "text",
}: ProfileFieldProps) {
  return (
    <div className="space-y-2">
      <Label htmlFor={name}>{label}</Label>
      <Input
        id={name}
        name={name}
        type={type}
        defaultValue={defaultValue}
        placeholder={placeholder}
      />
    </div>
  );
}
