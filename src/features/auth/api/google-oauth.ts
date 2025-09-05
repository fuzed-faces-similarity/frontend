import { useMutation } from "@tanstack/react-query";
import { useRouter } from "@tanstack/react-router";
import { AxiosError } from "axios";
import { toast } from "sonner";
import apiClient from "@/lib/api-client";
import type { MutationConfig } from "@/lib/react-query";
import { useAuth } from "@/stores/auth-store";

const BASE_API_URL = import.meta.env.VITE_BASE_API_URL;

/**
 * Initiates Google OAuth flow by redirecting to backend OAuth endpoint
 */
export const initiateGoogleOAuth = () => {
	// Add the frontend callback URL as a parameter so backend knows where to redirect
	const frontendUrl = window.location.origin;
	const callbackUrl = `${frontendUrl}/auth/callback`;
	const redirectUrl = `${BASE_API_URL}/login?callback=${encodeURIComponent(callbackUrl)}`;
	window.location.href = redirectUrl;
};

/**
 * Get current user information from the backend
 */
export const getCurrentUser = async (): Promise<any> => {
	return apiClient.get("/api/auth/me");
};

/**
 * Handles OAuth callback with authorization code or token
 * This function handles different OAuth response formats from your backend
 */
export const handleOAuthCallback = async (
	_code: string,
): Promise<{ accessToken: string }> => {
	// Since our backend now handles the full OAuth flow and redirects with token,
	// this function is mainly for compatibility. The token should come directly in URL.
	throw new Error("OAuth callback should be handled via URL parameters");
};

type UseOAuthCallbackOptions = {
	mutationConfig?: MutationConfig<typeof handleOAuthCallback>;
};

/**
 * Hook to get current user data
 */
export const useGetCurrentUser = () => {
	const { setUser } = useAuth();

	return useMutation({
		mutationFn: getCurrentUser,
		onSuccess: (userData) => {
			setUser(userData);
		},
		onError: (error: Error) => {
			console.error("Failed to get current user:", error);
		},
	});
};

/**
 * Hook to handle OAuth callback and authentication
 * This is now mainly used for error handling since tokens come via URL
 */
export const useOAuthCallback = ({
	mutationConfig,
}: UseOAuthCallbackOptions = {}) => {
	const { setAccessToken } = useAuth();
	const router = useRouter();

	const { onSuccess, onError, ...restConfig } = mutationConfig || {};

	return useMutation({
		onSuccess: (...args) => {
			onSuccess?.(...args);
			const [data] = args;
			setAccessToken(data.accessToken);
			toast.success("Login successful");
			router.navigate({ to: "/" });
		},
		onError: (error: Error, ...args) => {
			const errorMessage =
				error instanceof AxiosError
					? error.response?.data?.message
					: "OAuth authentication failed";
			toast.error(errorMessage);
			onError?.(error, ...args);
		},
		...restConfig,
		mutationFn: handleOAuthCallback,
	});
};

/**
 * Extracts OAuth parameters from URL
 */
export const extractOAuthParams = () => {
	const urlParams = new URLSearchParams(window.location.search);
	return {
		code: urlParams.get("code"),
		error: urlParams.get("error"),
		state: urlParams.get("state"),
	};
};
