import { AuthLayout } from "../../layouts/AuthLayout";

import EbentosBackground from "../../assets/concert-blue.png";
import EbentosLogo from "../../assets/ebentos-white-logo.png";

import React, { useEffect } from "react";

import { useNavigate } from "react-router-dom";

import FormCodigoVerificacion from "../../components/Access/FormCodigoVerificacion";

const CodigoVerificacion: React.FC = () => {
  const navigate = useNavigate();
  useEffect(() => {
    const allowed = sessionStorage.getItem("allowedToVerification");
    if (allowed !== "true") {
      navigate("/forgetpass");
    }
  }, [navigate]);

  return (
    <AuthLayout backgroundImage={EbentosBackground} logo={EbentosLogo}>
      <FormCodigoVerificacion />
    </AuthLayout>
  );
};

export default CodigoVerificacion;
