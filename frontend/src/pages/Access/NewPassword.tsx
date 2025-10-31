import { AuthLayout } from "../../layouts/AuthLayout";

import EbentosBackground from "../../assets/concert-blue.png";
import EbentosLogo from "../../assets/ebentos-white-logo.png";

import React, { useEffect } from "react";

import { useNavigate } from "react-router-dom";

import FormNuevaContrasenia from "../../components/Access/FormNuevaContrasenia";

const NewPassword: React.FC = () => {
  return (
    <AuthLayout backgroundImage={EbentosBackground} logo={EbentosLogo}>
      <FormNuevaContrasenia />
    </AuthLayout>
  );
};

export default NewPassword;
