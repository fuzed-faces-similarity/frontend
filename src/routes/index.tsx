import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
	component: HomePage,
});

function HomePage() {
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
			</div>
		</div>
	);
}
