"use client";

import { useRouter } from "next/navigation";

interface NavbarProps {
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
}

const Navbar: React.FC<NavbarProps> = ({
  title,
  subtitle,
  showBackButton = true,
  showRestartButton = true,
  backRoute = "/",
  maxWidth = "4xl",
}) => {
  const router = useRouter();

  const handleRestart = () => {
    localStorage.removeItem("testAnswers");
    localStorage.removeItem("testScore");
    router.push("/");
  };

  const handleBack = () => {
    router.push(backRoute);
  };

  const getMaxWidthClass = () => {
    const widthClasses = {
      sm: "max-w-sm",
      md: "max-w-md",
      lg: "max-w-lg",
      xl: "max-w-xl",
      "2xl": "max-w-2xl",
      "3xl": "max-w-3xl",
      "4xl": "max-w-4xl",
      "5xl": "max-w-5xl",
      "6xl": "max-w-6xl",
      "7xl": "max-w-7xl",
    };
    return widthClasses[maxWidth];
  };

  return (
    <div className="bg-white/80 backdrop-blur-lg shadow-lg border-b border-blue-100">
      <div className={`${getMaxWidthClass()} mx-auto px-4 sm:px-6 lg:px-8`}>
        <div className="flex items-center justify-between lg:h-20 h-14">
          <div className="flex items-center gap-4">
            <div className="w-8 lg:w-12 h-8 lg:h-12 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center">
              <svg
                className="w-6 h-6 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 10V3L4 14h7v7l9-11h-7z"
                />
              </svg>
            </div>
            <div className="hidden md:block">
              <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                {title}
              </h1>
              <p className="text-sm text-gray-600">{subtitle}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            {showRestartButton && (
              <button
                onClick={handleRestart}
                className="flex items-center gap-2 px-3 md:px-6 py-3 text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-indigo-600 border-0 rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                  />
                </svg>
                <span className="hidden md:inline">Tekrar Başla</span>
              </button>
            )}
            {showBackButton && (
              <button
                onClick={handleBack}
                className="flex items-center gap-2 px-3 md:px-6 py-3 text-sm font-medium text-gray-700 bg-white/80 backdrop-blur border border-gray-200 rounded-xl hover:bg-gray-50 transition-all duration-300 shadow-md hover:shadow-lg"
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M10 19l-7-7m0 0l7-7m-7 7h18"
                  />
                </svg>
                <span className="hidden md:inline">Geri Dön</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
