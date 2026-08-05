import type {
  ComponentProps,
  ForwardRefExoticComponent,
  RefAttributes,
} from "react";
import type { LucideProps } from "lucide-react";
import { designSystem } from "@/lib/design-system";

type LucideIcon = ForwardRefExoticComponent<
  Omit<LucideProps, "ref"> & RefAttributes<SVGSVGElement>
>;

type IconProps = Omit<ComponentProps<LucideIcon>, "size" | "strokeWidth"> & {
  icon: LucideIcon;
  size?: keyof typeof designSystem.icon.size;
};

export function Icon({
  icon: IconComponent,
  size = "md",
  ...props
}: IconProps) {
  return (
    <IconComponent
      aria-hidden={props["aria-label"] ? undefined : true}
      size={designSystem.icon.size[size]}
      strokeWidth={designSystem.icon.strokeWidth}
      {...props}
    />
  );
}
