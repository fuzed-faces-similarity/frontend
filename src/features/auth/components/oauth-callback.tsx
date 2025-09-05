import { useRouter } from "@tanstack/react-router";
import { Loader2 } from "lucide-react";
import { useEffect } from "react";
import { toast } from "sonner";
import { useAuth } from "@/stores/auth-store";
import { extractOAuthParams, useGetCurrentUser } from "../api/google-oauth";

export function OAuthCallback() {
	const router = useRouter();
	const { setAccessToken } = useAuth();
	const getCurrentUser = useGetCurrentUser();

	useEffect(() => {
		const { error } = extractOAuthParams();
		const urlParams = new URLSearchParams(window.location.search);
		const accessToken = urlParams.get("access_token");

		if (error) {
			toast.error(`OAuth error: ${error}`);
			router.navigate({ to: "/" });
			return;
		}

		// Handle direct token in URL (our backend redirects with access_token)
		if (accessToken) {
			// Set the access token first
			setAccessToken(accessToken);
			
			// Then fetch user data
			getCurrentUser.mutate(undefined, {
				onSuccess: () => {
					toast.success("Login successful");
					router.navigate({ to: "/" });
				},
				onError: (error) => {
					console.error("Failed to fetch user data:", error);
					toast.success("Login successful");
					router.navigate({ to: "/" });
				}
			});
			return;
		}

		// No token received
		toast.error("No access token received from authentication");
		router.navigate({ to: "/" });
	}, [router]);

	return (
		<div className="flex min-h-screen items-center justify-center">
			<div className="text-center">
				<Loader2 className="mx-auto h-8 w-8 animate-spin text-primary" />
				<p className="mt-4 text-sm text-muted-foreground">
					Completing authentication...
				</p>
			</div>
		</div>
	);
}
