import EbentosIcon from '../assets/ebentos-white-logo.png'
import LoginBackground from '../assets/concert-blue.png'

import FormLogin from '../components/FormLogin'

export default function Login() {

  return (
    // Espacio para background
    <div style={{ display: "flex", height: "100vh", width: "100vw" }}>
  
      <div 
          style={{
            flex: "0 0 60%",
            backgroundImage: `url(${LoginBackground})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
            position: 'relative',
            minHeight: "100vh", // asegura que siempre llene la pantalla
          }}>
          <img
            src={EbentosIcon}
            alt="Ebentos Icon"
            style={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              width: "27%",
              height: "auto",
            }}
          />
      </div>

      <div 
          style={{
            flex: "0 0 40%",
            minHeight: "100vh",     // asegura que siempre llene la pantalla
            backgroundColor: "#fff" // importante: fondo blanco
          }}>
        <FormLogin />
      </div>

    </div>
  )
}