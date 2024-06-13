import { Calendar, Home } from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { usePathname, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import {
  PiCalendarBlankBold,
  PiHouseSimpleBold,
  PiCurrencyDollarSimpleBold,
  PiStudentBold,
  PiListNumbersBold,
  PiUserBold,
} from "react-icons/pi";

interface Route {
  name: string;
  path: string;
  selected: boolean;
  icon: typeof PiCalendarBlankBold;
}

export interface NavbarProps {
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function Navbar({ setOpen }: NavbarProps) {
  const [routes, setRoutes] = useState<Route[]>([
    { name: "Home", path: "/home", selected: true, icon: PiHouseSimpleBold },
    { name: "Courses", path: "/courses", selected: false, icon: PiStudentBold },
    {
      name: "Attendance",
      path: "/attendance",
      selected: false,
      icon: PiCalendarBlankBold,
    },
    {
      name: "Grades",
      path: "/grades",
      selected: false,
      icon: PiListNumbersBold,
    },
    {
      name: "Finance",
      path: "/finance",
      selected: false,
      icon: PiCurrencyDollarSimpleBold,
    },
    {
      name: "User Profile",
      path: "/user-profile",
      selected: false,
      icon: PiUserBold,
    },
  ]);
  const currentPath = usePathname();

  useEffect(() => {
    setRoutes((routes) => {
      return routes.map((route) => {
        return { ...route, selected: currentPath === route.path };
      });
    });
  }, [currentPath]);

  return (
    <nav className="grid items-start px-2 text-sm font-medium lg:px-4">
      {routes.map((route: Route) => {
        return (
          <Link
            onClick={() => setOpen(false)}
            key={route.name}
            href={route.path}
            className={cn([
              "flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary",
              route.selected ? "bg-muted" : "",
            ])}
          >
            {<route.icon className="w-4 h-4" />}
            {route.name}
            {/* TODO: Add badge to student announcements tab */}
            {/* <Badge className="ml-auto flex h-6 w-6 shrink-0 items-center justify-center rounded-full">
                6
              </Badge> */}
          </Link>
        );
      })}
    </nav>
  );
}
