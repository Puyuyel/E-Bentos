const verifyEmail = (email: any): boolean => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const emailNotNull = email !== "";
  return regex.test(email) && emailNotNull;
};
const verifyContrasenha = (contrasenha: any): boolean => {
  const contrasenhaRegex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%?&])[A-Za-z\d@$!%?&]{8,20}$/; // de 8 a 20 caracteres
  const contrasenhaNotNull = contrasenha !== "";
  return contrasenhaRegex.test(contrasenha) && contrasenhaNotNull;
};

export const contrasenhaIncluyeNumero = (pass: string): boolean =>
  /[0-9]/.test(pass);

export const contrasenhaIncluyeMayuscula = (pass: string): boolean =>
  /[A-Z]/.test(pass);

export const contrasenhaIncluyeMinuscula = (pass: string): boolean =>
  /[a-z]/.test(pass);

export const contrasenhaIncluyeCaracterEspecial = (pass: string): boolean =>
  /[@$!%?&]/.test(pass);

const verifyNombres = (nombres: string): boolean => {
  // Regex: solo letras (mayúsculas/minúsculas), espacios y tildes
  const regex = /^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+$/;

  // Trim para evitar que solo haya espacios
  const nombresLimpios = nombres.trim();

  // Validación: no vacío y cumple el patrón
  return nombresLimpios.length > 0 && regex.test(nombresLimpios);
};
const verifyDNI = (dni: string): boolean => {
  // Solo aceptar números y de 8 dígitos de tamaño
  const regexDNI = /^[0-9]{8}$/;
  return dni.length == 8 && dni.length > 0 && regexDNI.test(dni);
};
const verifyDate = (fechaNacimiento: string): boolean => {
  // Verificar formato con regex (YYYY-MM-DD)
  const regexDate = /^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])$/;
  if (!regexDate.test(fechaNacimiento)) return false;

  // Verificar que la fecha exista realmente
  const date = new Date(fechaNacimiento);
  const [year, month, day] = fechaNacimiento.split("-").map(Number);

  const fechaValida =
    date.getFullYear() === year &&
    date.getMonth() + 1 === month &&
    date.getDate() + 1 === day;

  if (!fechaValida) return false;

  // ---- Verificar que tenga al menos 18 años ----
  const hoy = new Date();
  let edad = hoy.getFullYear() - year;

  // Si todavía no ha cumplido años este año, restamos 1
  const mesActual = hoy.getMonth() + 1;
  const diaActual = hoy.getDate() + 1;

  console.log("dia actual: ", diaActual, "date.getDate()", date.getDate());

  if (mesActual < month || (mesActual === month && diaActual < day)) {
    edad--;
  }

  return edad >= 18;
};
const verifyTelf = (telf: string): boolean => {
  const regexTelf = /^9[0-9]{8}$/;
  return regexTelf.test(telf) && telf.length > 0 && telf.length == 9;
};
const verifyGen = (genero: string): boolean => {
  // Por si alguien decide cambiarlo a "Masculino" o "Femenino"
  // Para que no tenga ningún impacto en la función de verificación
  const normalized = genero.trim().toUpperCase();
  return normalized === "MASCULINO" || normalized === "FEMENINO";
};

export const verifyData = (id: string, value: any) => {
  /* Con una variable passVerify, es más fácil depurar */
  let passVerify = false;
  switch (id) {
    case "email":
      passVerify = verifyEmail(value);
      break;
    case "contrasenha":
      passVerify = verifyContrasenha(value);
      break;
    case "nombres":
    case "apePat":
    case "apeMat":
      passVerify = verifyNombres(value);
      break;
    case "dni":
      passVerify = verifyDNI(value);
      break;
    case "fechaNacimiento":
      passVerify = verifyDate(value);
      break;
    case "telefono":
      passVerify = verifyTelf(value);
      break;
    case "genero":
      passVerify = verifyGen(value);
      break;
    default:
      alert("Evento incorreto... ??? ");
  }
  return passVerify;
};
