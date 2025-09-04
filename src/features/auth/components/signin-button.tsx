import { cn } from "@/lib/utils";

export function SignInButton({ className }: { className?: string }) {
	return (
		<button
			type="button"
			className={cn(
				"text-foreground/80 hover:text-foreground px-4 py-2 text-sm font-medium transition-colors duration-200",
				className,
			)}
		>
			Sign In
		</button>
	);
}
