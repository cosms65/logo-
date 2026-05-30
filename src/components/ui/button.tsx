import Link from "next/link";
import { cn } from "@/lib/utils";

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & { href?: string; variant?: "primary" | "ghost" };

export function Button({ className, href, variant = "primary", ...props }: ButtonProps) {
  const styles = cn(
    "inline-flex items-center justify-center rounded-xl px-4 py-2 text-sm font-semibold transition",
    variant === "primary" ? "bg-eclipse text-white shadow-glow hover:bg-violet-500" : "border border-white/10 bg-white/5 text-starlight hover:bg-white/10",
    className
  );
  if (href) return <Link href={href} className={styles}>{props.children}</Link>;
  return <button className={styles} {...props} />;
}
