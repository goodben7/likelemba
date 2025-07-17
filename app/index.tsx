import { View, Text, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform, AccessibilityInfo } from 'react-native';
import { useCallback, useEffect, memo } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Phone, MessageCircle } from 'lucide-react-native';
import { useAuth } from '@/hooks/useAuth';
import { useTranslation } from '@/utils/i18n';
import { formatPhoneNumber } from '@/utils/validation';
import { authStyles } from '@/styles/auth';

// Interface pour définir les types des props du bouton d'action
interface ActionButtonProps {
  onPress: () => void;
  disabled: boolean;
  loading: boolean;
  icon: React.ReactNode;
  text: string;
}

// Composant de bouton mémorisé pour éviter les re-rendus inutiles
const ActionButton = memo(({ onPress, disabled, loading, icon, text }: ActionButtonProps) => (
  <TouchableOpacity
    style={[authStyles.button, disabled && authStyles.buttonDisabled]}
    onPress={onPress}
    disabled={disabled}
    accessibilityRole="button"
    accessibilityState={{ disabled }}
    accessibilityLabel={text}
  >
    {icon}
    <Text style={authStyles.buttonText}>{text}</Text>
  </TouchableOpacity>
));

export default function LoginScreen() {
  const {
    phone,
    otp,
    step,
    loading,
    error,
    setPhone,
    setOtp,
    sendOTP,
    verifyOTP,
    resetToPhoneStep
  } = useAuth();
  const router = useRouter();
  const { t } = useTranslation();

  // Gérer la soumission du numéro de téléphone
  const handleSendOTP = useCallback(async () => {
    const success = await sendOTP();
    if (success) {
      // Annoncer aux lecteurs d'écran que le code a été envoyé
      AccessibilityInfo.announceForAccessibility(t('success.otp_sent'));
    }
  }, [sendOTP, t]);

  // Gérer la vérification du code OTP
  const handleVerifyOTP = useCallback(async () => {
    const success = await verifyOTP();
    if (success) {
      router.replace('/(tabs)');
    }
  }, [verifyOTP, router]);

  // Formater le numéro de téléphone pour l'affichage
  const handlePhoneChange = useCallback((value: string) => {
    setPhone(value);
  }, [setPhone]);

  // Effet pour annoncer les erreurs aux lecteurs d'écran
  useEffect(() => {
    if (error) {
      AccessibilityInfo.announceForAccessibility(error);
    }
  }, [error]);

  return (
    <SafeAreaView style={authStyles.container}>
      <KeyboardAvoidingView
        style={authStyles.content}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <View style={authStyles.header}>
          <Text style={authStyles.logo} accessibilityRole="image">🏪</Text>
          <Text style={authStyles.title} accessibilityRole="header">{t('auth.login.title')}</Text>
          <Text style={authStyles.subtitle}>
            {t('auth.login.subtitle')}
          </Text>
        </View>

        <View style={authStyles.form}>
          {step === 'phone' ? (
            <>
              <Text style={authStyles.stepTitle}>{t('auth.login.title')}</Text>
              <Text style={authStyles.stepSubtitle}>
                {t('auth.login.subtitle')}
              </Text>
              
              <View style={authStyles.field}>
                <Text style={authStyles.label}>{t('auth.phone.label')}</Text>
                <View style={authStyles.inputContainer}>
                  <Phone size={20} color="#6B7280" />
                  <TextInput
                    style={authStyles.input}
                    value={phone}
                    onChangeText={handlePhoneChange}
                    placeholder={t('auth.phone.placeholder')}
                    keyboardType="phone-pad"
                    autoFocus
                    accessibilityLabel={t('auth.phone.label')}
                    accessibilityHint={t('auth.login.subtitle')}
                  />
                </View>
                {error && <Text style={authStyles.errorText} accessibilityRole="alert">{error}</Text>}
              </View>

              <ActionButton
                onPress={handleSendOTP}
                disabled={loading}
                loading={loading}
                icon={<MessageCircle size={20} color="#FFFFFF" />}
                text={loading ? t('auth.button.sending') : t('auth.button.send')}
              />
            </>
          ) : (
            <>
              <Text style={authStyles.stepTitle}>{t('auth.verification.title')}</Text>
              <Text style={authStyles.stepSubtitle}>
                {t('auth.verification.subtitle', { phone: formatPhoneNumber(phone) })}
              </Text>
              
              <View style={authStyles.field}>
                <Text style={authStyles.label}>{t('auth.otp.label')}</Text>
                <TextInput
                  style={authStyles.otpInput}
                  value={otp}
                  onChangeText={setOtp}
                  placeholder={t('auth.otp.placeholder')}
                  keyboardType="numeric"
                  maxLength={4}
                  autoFocus
                  textAlign="center"
                  accessibilityLabel={t('auth.otp.label')}
                  accessibilityHint={t('auth.verification.subtitle', { phone: formatPhoneNumber(phone) })}
                />
                {error && <Text style={authStyles.errorText} accessibilityRole="alert">{error}</Text>}
              </View>

              <ActionButton
                onPress={handleVerifyOTP}
                disabled={loading}
                loading={loading}
                icon={null}
                text={loading ? t('auth.button.verifying') : t('auth.button.verify')}
              />

              <TouchableOpacity
                style={authStyles.backButton}
                onPress={resetToPhoneStep}
                accessibilityRole="button"
                accessibilityLabel={t('auth.button.change_number')}
              >
                <Text style={authStyles.backButtonText}>{t('auth.button.change_number')}</Text>
              </TouchableOpacity>
            </>
          )}
        </View>

        <View style={authStyles.footer}>
          <Text style={authStyles.footerText}>
            {t('footer.terms')}
          </Text>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}