import { useMutation } from "@tanstack/react-query";
import { useRouter } from "@tanstack/react-router";
import { toast } from "sonner";
import apiClient from "@/lib/api-client";
import type { MutationConfig } from "@/lib/react-query";
import { useAuth } from "@/stores/auth-store";

/**
 * Sign out the current user
 */
export const signOut = async (): Promise<void> => {
	return apiClient.post("/api/auth/logout");
};

type UseSignOutOptions = {
	mutationConfig?: MutationConfig<typeof signOut>;
};

/**
 * Hook to handle user sign out
 */
export const useSignOut = ({ mutationConfig }: UseSignOutOptions = {}) => {
	const { reset } = useAuth();
	const router = useRouter();

	const { onSuccess, onError, ...restConfig } = mutationConfig || {};

	return useMutation({
		onSuccess: (...args) => {
			onSuccess?.(...args);
			reset();
			toast.success("Logged out successfully");
			router.navigate({ to: "/" });
		},
		onError: (error: Error, ...args) => {
			// Even if the API call fails, we should still clear local state
			reset();
			toast.success("Logged out successfully");
			router.navigate({ to: "/" });
			onError?.(error, ...args);
		},
		...restConfig,
		mutationFn: signOut,
	});
};
