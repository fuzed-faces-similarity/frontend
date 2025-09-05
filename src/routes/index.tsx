import { createFileRoute } from "@tanstack/react-router";
import { SignInButton } from "@/features/auth/components/signin-button";
import { SignOutButton } from "@/features/auth/components/signout-button";
import { useAuth, useUser } from "@/stores/auth-store";

export const Route = createFileRoute("/")({
	component: HomePage,
});

function HomePage() {
	const { accessToken } = useAuth();
	const user = useUser();

	return (
		<div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
			<div className="max-w-md w-full space-y-8 p-8 bg-white rounded-xl shadow-lg">
				<div className="text-center">
					<h1 className="text-3xl font-bold text-gray-900 mb-2">
						AI Matching App
					</h1>
					<p className="text-gray-600">
						Welcome to the AI-powered matching platform
					</p>
				</div>

				{accessToken && user ? (
					<div className="space-y-6">
						<div className="text-center">
							<div className="w-20 h-20 mx-auto mb-4">
								{user.avatar ? (
									<img
										src={user.avatar}
										alt={user.username}
										className="w-full h-full rounded-full object-cover"
									/>
								) : (
									<div className="w-full h-full rounded-full bg-gray-300 flex items-center justify-center">
										<span className="text-gray-600 text-xl font-semibold">
											{user.username?.charAt(0)?.toUpperCase() || "U"}
										</span>
									</div>
								)}
							</div>
							<h2 className="text-xl font-semibold text-gray-900">
								Welcome, {user.username || user.email}!
							</h2>
							<p className="text-gray-600">{user.email}</p>
						</div>

						<div className="flex justify-center">
							<SignOutButton className="bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded-lg" />
						</div>
					</div>
				) : (
					<div className="space-y-6">
						<div className="text-center">
							<p className="text-gray-600 mb-6">
								Please sign in to access the AI matching features
							</p>
						</div>

						<div className="flex justify-center">
							<SignInButton className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg" />
						</div>
					</div>
				)}
			</div>
		</div>
	);
}
