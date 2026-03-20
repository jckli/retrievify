import { Sidebar } from "@/components/Sidebar";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
	return (
		<>
			<Sidebar />
			<main className="navbar:ml-[280px] min-h-screen w-full font-metropolis text-white">
				{children}
			</main>
		</>
	);
}
