"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";

import {
    IoHomeOutline,
    IoHomeSharp,
    IoAnalytics,
    IoAnalyticsSharp,
} from "react-icons/io5";
import { RiLogoutCircleLine, RiLogoutCircleFill } from "react-icons/ri";
import { FaRegUser, FaUser } from "react-icons/fa";

const navLinks = [
    {
        label: "Dashboard",
        href: "/dashboard",
        getIcon: (active) => (active ? <IoHomeSharp /> : <IoHomeOutline />),
    },
    {
        label: "Clients",
        href: "/clients",
        getIcon: (active) => (active ? <FaUser /> : <FaRegUser />),
    },
    {
        label: "Logout",
        href: "/logout",
        getIcon: (active) =>
            active ? <RiLogoutCircleFill /> : <RiLogoutCircleLine />,
    },
];

const Sidebar = () => {
    const pathname = usePathname();
    
    useGSAP(() => {
        gsap.from(".sidebar-item", {
            opacity: 0,
            x: -20,
            duration: 0.6,
            stagger: 0.1,
            ease: "power2.out",
        });
    }, []);

    return (
        <aside className="bg-[#FBFCFD] shadow-[1px_0px_4px_rgba(0,0,0,0.4)] h-[100dvh] w-20 md:w-72 p-4 md:p-6 rounded-r-2xl flex flex-col items-center sticky top-0 transition-all duration-300">
            <ul className="flex flex-col gap-y-6 w-full">
                {navLinks.map(({ label, href, getIcon }) => {
                    const isActive = pathname === href;

                    return (
                        <li key={href} className="sidebar-item">
                            <Link
                                href={href}
                                className={`flex items-center md:justify-start justify-center gap-3 text-lg font-medium px-4 py-2 rounded-xl transition-colors duration-200 ${isActive
                                        ? "text-white bg-blue-600"
                                        : "text-gray-700 hover:bg-gray-100"
                                    }`}
                            >
                                <span className="text-2xl">{getIcon(isActive)}</span>
                                <span className="hidden md:inline">{label}</span>
                            </Link>
                        </li>
                    );
                })}
            </ul>
        </aside>
    );
};

export default Sidebar;
