import { Label } from "@/components/ui/label";

const textareaClass =
  "border-input placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-ring/50 min-h-28 w-full rounded-md border bg-transparent px-3 py-2 text-sm shadow-xs outline-none transition-[color,box-shadow] focus-visible:ring-[3px]";

type ProfileTextareaFieldProps = {
  label: string;
  name: string;
  defaultValue: string;
  placeholder?: string;
  rows?: number;
};

export function ProfileTextareaField({
  label,
  name,
  defaultValue,
  placeholder,
  rows = 5,
}: ProfileTextareaFieldProps) {
  return (
    <div className="space-y-2">
      <Label htmlFor={name}>{label}</Label>
      <textarea
        id={name}
        name={name}
        rows={rows}
        className={textareaClass}
        defaultValue={defaultValue}
        placeholder={placeholder}
      />
    </div>
  );
}
