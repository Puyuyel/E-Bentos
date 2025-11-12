import { Header, HeaderName } from "@carbon/react";
import "../../styles/Cliente/HeaderEbentos.css";
import logo from "../../assets/ebentos-white-logo.png";

export default function HeaderEbentos() {
  return (
    <Header aria-label="e-Bentos" className="header-ebentos">
      <div className="header-content">
        <img src={logo} alt="e-Bentos logo" className="header-logo" />
        <HeaderName className="bx--header__name" prefix="">
          e-Bentos
        </HeaderName>
      </div>
    </Header>
  );
}
