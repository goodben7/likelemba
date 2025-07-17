/**
 * Utilitaires de validation pour les entrées utilisateur
 */

/**
 * Valide un numéro de téléphone
 * @param phone Numéro de téléphone à valider
 * @returns {boolean} True si le numéro est valide
 */
export const isValidPhone = (phone: string): boolean => {
  // Validation basique pour les numéros de téléphone congolais (RDC)
  // Format attendu: +243 XX XXX XXXX
  const phoneRegex = /^\+?243[0-9]{9}$/;
  return phoneRegex.test(phone.replace(/\s/g, ''));
};

/**
 * Valide un code OTP
 * @param otp Code OTP à valider
 * @returns {boolean} True si le code OTP est valide
 */
export const isValidOTP = (otp: string): boolean => {
  // Validation simple pour un code OTP à 4 chiffres
  const otpRegex = /^[0-9]{4}$/;
  return otpRegex.test(otp);
};

/**
 * Formate un numéro de téléphone pour l'affichage
 * @param phone Numéro de téléphone à formater
 * @returns {string} Numéro de téléphone formaté
 */
export const formatPhoneNumber = (phone: string): string => {
  // Supprime tous les espaces et caractères non numériques sauf le +
  const cleaned = phone.replace(/[^\d+]/g, '');
  
  // Si le numéro commence par +243
  if (cleaned.startsWith('+243') || cleaned.startsWith('243')) {
    const prefix = cleaned.startsWith('+') ? '+243' : '243';
    const number = cleaned.replace(/^\+?243/, '');
    
    // Format: +243 XX XXX XXXX
    if (number.length === 9) {
      return `${prefix} ${number.substring(0, 2)} ${number.substring(2, 5)} ${number.substring(5)}`;
    }
  }
  
  // Retourne le numéro tel quel si le format n'est pas reconnu
  return phone;
};