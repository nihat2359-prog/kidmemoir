import { CircleAlert } from "lucide-react";

export function CreateMemoryFieldError({
  id,
  message,
}: {
  id: string;
  message?: string;
}) {
  if (!message) return null;
  return (
    <p
      className="text-danger flex items-center gap-1.5 text-xs"
      id={id}
      role="alert"
    >
      <CircleAlert aria-hidden className="size-3.5" />
      {message}
    </p>
  );
}
