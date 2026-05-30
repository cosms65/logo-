import { cn } from "@/lib/utils";

export function Card({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("rounded-2xl border border-white/10 bg-white/[0.04] p-6 shadow-2xl backdrop-blur", className)} {...props} />;
}
