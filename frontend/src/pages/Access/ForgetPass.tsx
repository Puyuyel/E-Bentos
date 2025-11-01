import { AuthLayout } from "../../layouts/AuthLayout";
import FormForgetPass from "../../components/Access/FormForgetPass";

import EbentosBackground from "../../assets/concert-blue.png";
import EbentosLogo from "../../assets/ebentos-white-logo.png";

const ForgetPass: React.FC = () => {
  return (
    <AuthLayout backgroundImage={EbentosBackground} logo={EbentosLogo}>
      <FormForgetPass />
    </AuthLayout>
  );
};

export default ForgetPass;
