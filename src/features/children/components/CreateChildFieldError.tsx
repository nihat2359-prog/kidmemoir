import { CircleAlert } from "lucide-react";

type CreateChildFieldErrorProps = Readonly<{
  id: string;
  message?: string;
}>;

export function CreateChildFieldError({
  id,
  message,
}: CreateChildFieldErrorProps) {
  if (!message) return null;

  return (
    <p
      className="text-danger flex items-center gap-1.5 text-sm"
      id={id}
      role="alert"
    >
      <CircleAlert aria-hidden className="size-4 shrink-0" />
      {message}
    </p>
  );
}
