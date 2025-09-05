import { TanStackDevtools } from "@tanstack/react-devtools";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { Outlet } from "@tanstack/react-router";
import { TanStackRouterDevtoolsPanel } from "@tanstack/react-router-devtools";
import React from "react";
import { Toaster } from "sonner";
import { useMe } from "@/features/auth/api/get-me";
import { useAuth } from "@/stores/auth-store";
import { Header } from "./header";

export function RootLayout() {
	const { setUser } = useAuth();
	const { data: user } = useMe();

	React.useEffect(() => {
		if (user) {
			setUser(user);
		}
	}, [user]);

	return (
		<>
			<Header />
			<Outlet />
			<Toaster duration={3000} />
			{import.meta.env.MODE === "development" && (
				<TanStackDevtools
					config={{
						position: "bottom-left",
					}}
					plugins={[
						{
							name: "Tanstack Router",
							render: <TanStackRouterDevtoolsPanel />,
						},
						{
							name: "Tanstack Query",
							render: <ReactQueryDevtools />,
						},
					]}
				/>
			)}
		</>
	);
}
