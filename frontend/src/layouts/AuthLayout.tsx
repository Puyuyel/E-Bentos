import React from "react";
import "../styles/Access/AuthLayout.css";

interface AuthLayoutProps {
  children: React.ReactNode;
  backgroundImage: string;
  logo: string;
}

export const AuthLayout: React.FC<AuthLayoutProps> = ({
  children,
  backgroundImage,
  logo,
}) => {
  return (
    <div className="auth-layout">
      <div
        className="auth-left"
        style={{ backgroundImage: `url(${backgroundImage})` }}
      >
        <img src={logo} alt="Ebentos Icon" />
      </div>

      <div className="auth-right">{children}</div>
    </div>
  );
};
