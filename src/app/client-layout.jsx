"use client";

import { usePathname } from "next/navigation";
import Sidebar from "@/components/Sidebar";

export default function ClientLayout({ children }) {
    const pathname = usePathname();
    const hideSidebarRoutes = ["/"];

    const showSidebar = !hideSidebarRoutes.includes(pathname);

    return (
        <div className="flex">
            {showSidebar && <Sidebar />}
            <main className="flex-1 p-4">{children}</main>
        </div>
    );
}
