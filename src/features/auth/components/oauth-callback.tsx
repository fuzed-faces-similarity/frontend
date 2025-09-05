import { useRouter, useSearch } from "@tanstack/react-router";
import { Loader2 } from "lucide-react";
import { useEffect } from "react";
import { toast } from "sonner";
import { useAuth } from "@/stores/auth-store";
import { useMe } from "../api/get-me";
import { extractOAuthParams } from "../api/google-oauth";

export function OAuthCallback() {
	const router = useRouter();
	const { setAccessToken } = useAuth();
	const { error } = extractOAuthParams();
	const searchParams = useSearch({ from: "/auth/callback" });
	const accessToken = searchParams.access_token;
	console.log("🚀 ~ OAuthCallback ~ accessToken:", accessToken);

	const { data: user } = useMe({
		queryConfig: {
			enabled: !!accessToken,
		},
	});
	console.log("🚀 ~ OAuthCallback ~ user:", user);

	// biome-ignore lint/correctness/useExhaustiveDependencies: <no need to re-run this effect>
	useEffect(() => {
		if (error) {
			toast.error(`OAuth error: ${error}`);
			router.navigate({ to: "/" });
			return;
		}

		if (accessToken) {
			setAccessToken(accessToken);
			return;
		}

		toast.error("No access token received from authentication");
		// router.navigate({ to: "/" });
	}, [accessToken]);

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
