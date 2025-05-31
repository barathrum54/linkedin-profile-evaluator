"use client";

import { ReactNode } from "react";
import Navbar from "./Navbar";

interface LayoutProps {
  children: ReactNode;
  showNavbar?: boolean;
  navbarProps?: {
    title: string;
    subtitle: string;
    showBackButton?: boolean;
    showRestartButton?: boolean;
    backRoute?: string;
    maxWidth?:
      | "sm"
      | "md"
      | "lg"
      | "xl"
      | "2xl"
      | "3xl"
      | "4xl"
      | "5xl"
      | "6xl"
      | "7xl";
  };
  className?: string;
  contentClassName?: string;
}

const Layout: React.FC<LayoutProps> = ({
  children,
  showNavbar = true,
  navbarProps,
  className = "",
  contentClassName = "",
}) => {
  return (
    <div className={`h-screen flex flex-col ${className}`}>
      {showNavbar && navbarProps && (
        <div className="flex-none">
          <Navbar {...navbarProps} />
        </div>
      )}
      <div className={`flex-1 flex flex-col ${contentClassName}`}>
        {children}
      </div>
    </div>
  );
};

export default Layout;
