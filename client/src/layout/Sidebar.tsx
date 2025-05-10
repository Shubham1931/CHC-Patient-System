import { Link, useLocation } from "wouter";
import { cn } from "@/lib/utils";
import { useContext } from "react";
import { AppContext } from "@/context/AppContext";

interface SidebarProps {
  isMobile?: boolean;
  onClose?: () => void;
}

export default function Sidebar({ isMobile, onClose }: SidebarProps) {
  const [location] = useLocation();
  const { user } = useContext(AppContext);

  const handleClick = () => {
    if (isMobile && onClose) {
      onClose();
    }
  };

  const routes = [
    { href: "/", label: "Dashboard", icon: "ri-dashboard-line" },
    { href: "/register", label: "Register Patient", icon: "ri-user-add-line" },
    { href: "/search", label: "Search Patients", icon: "ri-search-line" },
    { href: "/vitals", label: "Record Vitals", icon: "ri-heart-pulse-line" },
    { href: "/appointments", label: "Book Appointment", icon: "ri-calendar-check-line" },
  ];

  return (
    <div className="flex md:flex-shrink-0">
      <div className="flex flex-col w-64 bg-white border-r border-neutral-200">
        <div className="flex items-center justify-center h-16 px-4 bg-primary">
          <h1 className="text-xl font-bold text-white">CHC Patient System</h1>
        </div>
        <div className="flex flex-col flex-grow pt-5 pb-4 overflow-y-auto">
          <nav className="flex-1 px-3 space-y-2">
            {routes.map((route) => (
              <Link 
                key={route.href}
                href={route.href}
                onClick={handleClick}
                className={cn(
                  "flex items-center px-4 py-3 text-sm font-medium rounded-md group",
                  location === route.href
                    ? "bg-primary text-white"
                    : "text-neutral-700 hover:bg-neutral-100"
                )}
              >
                <i className={cn(route.icon, "mr-3 text-lg")}></i>
                {route.label}
              </Link>
            ))}
          </nav>
        </div>
        <div className="p-4 border-t border-neutral-200">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-10 h-10 rounded-full bg-neutral-200 flex items-center justify-center text-neutral-600">
                {user?.name.charAt(0) || 'A'}
              </div>
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-neutral-700">{user?.name || "Aisha Kumar"}</p>
              <p className="text-xs text-neutral-500">{user?.role || "Receptionist"}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
