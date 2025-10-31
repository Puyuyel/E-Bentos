import React from "react";
import "../styles/icons.css";

interface IconProps {
  className?: string;
}

export const ArrowLeftIcon: React.FC<IconProps> = ({
  className = "icon-sm",
}) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className={`icon ${className}`}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={2}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M10 19l-7-7m0 0l7-7m-7 7h18"
    />
  </svg>
);

export const DocumentReportIcon: React.FC<IconProps> = ({
  className = "icon-md",
}) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className={`icon ${className}`}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={2}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V7a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
    />
  </svg>
);

export const OfficeBuildingIcon: React.FC<IconProps> = ({
  className = "icon-md",
}) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className={`icon ${className}`}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={2}
  >
    <rect
      x="4"
      y="3"
      width="16"
      height="18"
      rx="1"
      ry="1"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <rect x="10" y="15" width="4" height="6" />
  </svg>
);

export const TicketIcon: React.FC<IconProps> = ({ className = "icon-md" }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className={`icon ${className}`}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={2}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z"
    />
  </svg>
);

export const ShoppingCartIcon: React.FC<IconProps> = ({
  className = "icon-md",
}) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className={`icon ${className}`}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={2}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
    />
  </svg>
);

export const CalendarIcon: React.FC<IconProps> = ({
  className = "icon-md",
}) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className={`icon ${className}`}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={2}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
    />
  </svg>
);

export const UsersIcon: React.FC<IconProps> = ({ className = "icon-md" }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className={`icon ${className}`}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={2}
  >
    <circle cx="12" cy="7" r="4" strokeLinecap="round" strokeLinejoin="round" />
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M6 21v-2a6 6 0 0112 0v2"
    />
  </svg>
);

export const ChartBarIcon: React.FC<IconProps> = ({
  className = "icon-md",
}) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className={`icon ${className}`}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={2}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
    />
  </svg>
);

export const LogoutIcon: React.FC<IconProps> = ({ className = "icon-md" }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className={`icon ${className}`}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={2}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
    />
  </svg>
);

export const DotsHorizontalIcon: React.FC<IconProps> = ({
  className = "icon-sm",
}) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className={`icon ${className}`}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={2}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M5 12h.01M12 12h.01M19 12h.01M6 12a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0z"
    />
  </svg>
);

export const MenuIcon: React.FC<IconProps> = ({ className = "icon-sm" }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className={`icon ${className}`}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={2}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M4 6h16M4 12h16M4 18h16"
    />
  </svg>
);

export const ArrowsExpandIcon: React.FC<IconProps> = ({
  className = "icon-sm",
}) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className={`icon ${className}`}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={2}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5v-4m0 0h-4m4 0l-5-5"
    />
  </svg>
);
