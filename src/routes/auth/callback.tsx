import { createFileRoute } from "@tanstack/react-router";
import { OAuthCallback } from "@/features/auth/components/oauth-callback";

export const Route = createFileRoute("/auth/callback")({
	component: OAuthCallback,
});
