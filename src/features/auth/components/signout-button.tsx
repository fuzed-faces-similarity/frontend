import { cn } from "@/lib/utils";
import { useSignOut } from "../api/sign-out";

export function SignOutButton({ className }: { className?: string }) {
	const signOut = useSignOut();

	const handleSignOut = () => {
		signOut.mutate();
	};

	return (
		<button
			type="button"
			onClick={handleSignOut}
			disabled={signOut.isPending}
			className={cn(
				"text-foreground/80 hover:text-foreground px-4 py-2 text-sm font-medium transition-colors duration-200 disabled:opacity-50",
				className,
			)}
		>
			{signOut.isPending ? "Signing out..." : "Sign Out"}
		</button>
	);
}
