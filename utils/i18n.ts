/**
 * Utilitaires d'internationalisation (i18n)
 */

type Locale = 'fr' | 'en';

type TranslationKeys = {
  // Auth messages
  'auth.login.title': string;
  'auth.login.subtitle': string;
  'auth.verification.title': string;
  'auth.verification.subtitle': string;
  'auth.phone.label': string;
  'auth.phone.placeholder': string;
  'auth.otp.label': string;
  'auth.otp.placeholder': string;
  'auth.button.send': string;
  'auth.button.sending': string;
  'auth.button.verify': string;
  'auth.button.verifying': string;
  'auth.button.change_number': string;
  
  // Error messages
  'error.required.phone': string;
  'error.invalid.phone': string;
  'error.required.otp': string;
  'error.invalid.otp': string;
  'error.send_otp': string;
  'error.verify_otp': string;
  'error.generic': string;
  
  // Success messages
  'success.otp_sent': string;
  
  // Footer
  'footer.terms': string;
};

type Translations = {
  [key in Locale]: TranslationKeys;
};

const translations: Translations = {
  fr: {
    // Auth messages
    'auth.login.title': 'Connexion',
    'auth.login.subtitle': 'Saisissez votre numéro de téléphone pour recevoir un code de vérification',
    'auth.verification.title': 'Vérification',
    'auth.verification.subtitle': 'Saisissez le code à 4 chiffres envoyé au {phone}',
    'auth.phone.label': 'Numéro de téléphone',
    'auth.phone.placeholder': '+243 XXX XXX XXX',
    'auth.otp.label': 'Code OTP',
    'auth.otp.placeholder': '1234',
    'auth.button.send': 'Envoyer le code',
    'auth.button.sending': 'Envoi...',
    'auth.button.verify': 'Vérifier',
    'auth.button.verifying': 'Vérification...',
    'auth.button.change_number': 'Changer de numéro',
    
    // Error messages
    'error.required.phone': 'Veuillez saisir votre numéro de téléphone',
    'error.invalid.phone': 'Le numéro de téléphone est invalide',
    'error.required.otp': 'Veuillez saisir le code OTP',
    'error.invalid.otp': 'Le code OTP est invalide',
    'error.send_otp': 'Impossible d\'envoyer le code OTP',
    'error.verify_otp': 'Code OTP incorrect',
    'error.generic': 'Une erreur est survenue',
    
    // Success messages
    'success.otp_sent': 'Code OTP envoyé',
    
    // Footer
    'footer.terms': 'En continuant, vous acceptez nos conditions d\'utilisation et notre politique de confidentialité',
  },
  en: {
    // Auth messages
    'auth.login.title': 'Login',
    'auth.login.subtitle': 'Enter your phone number to receive a verification code',
    'auth.verification.title': 'Verification',
    'auth.verification.subtitle': 'Enter the 4-digit code sent to {phone}',
    'auth.phone.label': 'Phone number',
    'auth.phone.placeholder': '+243 XXX XXX XXX',
    'auth.otp.label': 'OTP Code',
    'auth.otp.placeholder': '1234',
    'auth.button.send': 'Send code',
    'auth.button.sending': 'Sending...',
    'auth.button.verify': 'Verify',
    'auth.button.verifying': 'Verifying...',
    'auth.button.change_number': 'Change number',
    
    // Error messages
    'error.required.phone': 'Please enter your phone number',
    'error.invalid.phone': 'Invalid phone number',
    'error.required.otp': 'Please enter the OTP code',
    'error.invalid.otp': 'Invalid OTP code',
    'error.send_otp': 'Unable to send OTP code',
    'error.verify_otp': 'Incorrect OTP code',
    'error.generic': 'An error occurred',
    
    // Success messages
    'success.otp_sent': 'OTP code sent',
    
    // Footer
    'footer.terms': 'By continuing, you agree to our terms of use and privacy policy',
  },
};

/**
 * Configuration pour l'internationalisation
 */
class I18nService {
  private locale: Locale = 'fr';

  /**
   * Définit la langue de l'application
   * @param locale Code de langue ('fr', 'en')
   */
  setLocale(locale: Locale): void {
    this.locale = locale;
  }

  /**
   * Récupère la langue actuelle
   * @returns Code de langue actuel
   */
  getLocale(): Locale {
    return this.locale;
  }

  /**
   * Traduit une clé de traduction
   * @param key Clé de traduction
   * @param params Paramètres à insérer dans la traduction
   * @returns Texte traduit
   */
  translate(key: keyof TranslationKeys, params?: Record<string, string>): string {
    const translation = translations[this.locale][key] || key;
    
    if (!params) {
      return translation;
    }
    
    // Remplace les paramètres dans la traduction
    return Object.entries(params).reduce(
      (text, [param, value]) => text.replace(`{${param}}`, value),
      translation
    );
  }
}

export const i18n = new I18nService();

/**
 * Hook pour utiliser les traductions dans les composants
 * @returns Fonction de traduction
 */
export const useTranslation = () => {
  const t = (key: keyof TranslationKeys, params?: Record<string, string>): string => {
    return i18n.translate(key, params);
  };

  return { t, locale: i18n.getLocale(), setLocale: i18n.setLocale.bind(i18n) };
};