import { CircleAlert } from "lucide-react";

type AuthFieldErrorProps = Readonly<{
  id: string;
  message?: string;
}>;

export function AuthFieldError({ id, message }: AuthFieldErrorProps) {
  if (!message) return null;

  return (
    <p
      className="text-danger flex items-start gap-1.5 text-xs leading-5"
      id={id}
      role="alert"
    >
      <CircleAlert aria-hidden className="mt-0.5 size-3.5 shrink-0" />
      <span>{message}</span>
    </p>
  );
}
