import { View, Text, KeyboardAvoidingView, Platform, TouchableOpacity, Keyboard, AccessibilityInfo } from 'react-native';
import { otpStepStyles } from '@/styles/otpStep';
import { useCallback, useRef, useState, useEffect } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { MessageCircle, ChevronLeft, X } from 'lucide-react-native';
import { useAuth } from '@/hooks/useAuth';
import { useTranslation } from '@/utils/i18n';
import { formatPhoneNumber } from '@/utils/validation';
import { AnimatedButton } from '@/components/AnimatedButton';
import { AnimatedInput } from '@/components/AnimatedInput';
import { LinearGradient } from 'expo-linear-gradient';
import * as Animatable from 'react-native-animatable';

// Interface pour les props du clavier numérique personnalisé
interface NumericKeypadProps {
  onKeyPress: (key: string) => void;
  onDelete: () => void;
  onClear: () => void;
}

// Composant pour le clavier numérique personnalisé
const NumericKeypad: React.FC<NumericKeypadProps> = ({ onKeyPress, onDelete, onClear }) => {
  const renderKey = (value: number) => (
    <Animatable.View 
      animation="zoomIn" 
      duration={600} 
      delay={value * 50}
      key={value}
    >
      <TouchableOpacity 
        style={otpStepStyles.keypadKey} 
        onPress={() => onKeyPress(value.toString())}
        accessibilityLabel={`Touche ${value}`}
      >
        <Text style={otpStepStyles.keypadKeyText}>{value}</Text>
      </TouchableOpacity>
    </Animatable.View>
  );

  return (
    <Animatable.View 
      animation="fadeInUp" 
      duration={800} 
      delay={300}
      style={otpStepStyles.keypadContainer}
    >
      <View style={otpStepStyles.keypadRow}>
        {[1, 2, 3].map(renderKey)}
      </View>
      <View style={otpStepStyles.keypadRow}>
        {[4, 5, 6].map(renderKey)}
      </View>
      <View style={otpStepStyles.keypadRow}>
        {[7, 8, 9].map(renderKey)}
      </View>
      <View style={otpStepStyles.keypadRow}>
        <TouchableOpacity style={[otpStepStyles.keypadKey, otpStepStyles.keypadSpecialKey]} onPress={onClear}>
          <X size={20} color="#6B7280" />
        </TouchableOpacity>
        {renderKey(0)}
        <TouchableOpacity style={[otpStepStyles.keypadKey, otpStepStyles.keypadSpecialKey]} onPress={onDelete}>
          <ChevronLeft size={20} color="#6B7280" />
        </TouchableOpacity>
      </View>
    </Animatable.View>
  );
};

export default function OtpScreen() {
  const {
    phone,
    otp,
    loading,
    error,
    setOtp,
    verifyOTP,
    resetToPhoneStep
  } = useAuth();
  const router = useRouter();
  const { t } = useTranslation();
  const [showKeypad, setShowKeypad] = useState(false);
  const inputRef = useRef<any>(null);

  // Gérer la vérification du code OTP
  const handleVerifyOTP = useCallback(async () => {
    Keyboard.dismiss();
    const success = await verifyOTP();
    if (success) {
      router.replace('/(tabs)');
    }
  }, [verifyOTP, router]);

  // Gérer le retour à l'étape du numéro de téléphone
  const handleBackToPhone = useCallback(() => {
    resetToPhoneStep();
    router.back();
  }, [resetToPhoneStep, router]);

  // Gérer l'appui sur une touche du clavier numérique
  const handleKeyPress = useCallback((key: string) => {
    const newOtp = otp.length >= 4 ? otp : otp + key;
    setOtp(newOtp);
  }, [setOtp, otp]);

  // Gérer la suppression d'un caractère
  const handleDelete = useCallback(() => {
    setOtp(otp.slice(0, -1));
  }, [setOtp, otp]);

  // Effacer tout le texte
  const handleClear = useCallback(() => {
    setOtp('');
  }, [setOtp]);

  // Basculer l'affichage du clavier numérique
  const toggleKeypad = useCallback(() => {
    if (showKeypad) {
      Keyboard.dismiss();
    } else {
      if (inputRef.current) {
        inputRef.current.blur();
      }
    }
    setShowKeypad(prev => !prev);
  }, [showKeypad]);

  // Effet pour annoncer les erreurs aux lecteurs d'écran
  useEffect(() => {
    if (error) {
      AccessibilityInfo.announceForAccessibility(error);
    }
  }, [error]);

  // Effet pour masquer le clavier système quand le clavier personnalisé est affiché
  useEffect(() => {
    if (showKeypad) {
      Keyboard.dismiss();
    }
  }, [showKeypad]);

  return (
    <SafeAreaView style={otpStepStyles.container}>
      <LinearGradient
        colors={['#FFFFFF', '#FFF7ED']}
        style={otpStepStyles.gradient}
      >
        <KeyboardAvoidingView
          style={otpStepStyles.content}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          keyboardVerticalOffset={Platform.OS === 'ios' ? 40 : 0}
        >
          <Animatable.View 
            animation="fadeIn" 
            duration={1000} 
            delay={300}
            style={otpStepStyles.header}
          >
            <Animatable.Text 
              animation="bounceIn" 
              duration={1500} 
              delay={500}
              style={otpStepStyles.logo} 
              accessibilityRole="image"
            >
              🏪
            </Animatable.Text>
            <Animatable.Text 
              animation="fadeInDown" 
              duration={800} 
              delay={800}
              style={otpStepStyles.title} 
              accessibilityRole="header"
            >
              {t('auth.login.title')}
            </Animatable.Text>
            <Animatable.Text 
              animation="fadeIn" 
              duration={800} 
              delay={1000}
              style={otpStepStyles.subtitle}
            >
              {t('auth.login.subtitle')}
            </Animatable.Text>
          </Animatable.View>

          <View style={otpStepStyles.form}>
            <Animatable.View 
              animation="fadeInRight" 
              duration={800}
            >
              <Text style={otpStepStyles.stepTitle}>{t('auth.verification.title')}</Text>
              <Text style={otpStepStyles.stepSubtitle}>
                {t('auth.verification.subtitle', { phone: formatPhoneNumber(phone) })}
              </Text>
              
              <View style={otpStepStyles.inputContainer}>
                <AnimatedInput
                  label={t('auth.otp.label')}
                  value={otp}
                  onChangeText={setOtp}
                  placeholder={t('auth.otp.placeholder')}
                  keyboardType="numeric"
                  maxLength={4}
                  autoFocus={!showKeypad}
                  textAlign="center"
                  accessibilityLabel={t('auth.otp.label')}
                  accessibilityHint={t('auth.verification.subtitle', { phone: formatPhoneNumber(phone) })}
                  error={error}
                  inputStyle={otpStepStyles.otpInputStyle}
                  ref={inputRef}
                  onFocus={() => setShowKeypad(false)}
                />
                
                <TouchableOpacity 
                  style={otpStepStyles.keypadToggle}
                  onPress={toggleKeypad}
                  accessibilityLabel={showKeypad ? "Masquer le clavier" : "Afficher le clavier"}
                >
                  <Text style={otpStepStyles.keypadToggleText}>
                    {showKeypad ? "Masquer le clavier" : "Utiliser le clavier numérique"}
                  </Text>
                </TouchableOpacity>
              </View>

              <AnimatedButton
                onPress={handleVerifyOTP}
                disabled={loading || !otp.trim() || otp.length < 4}
                loading={loading}
                text={loading ? t('auth.button.verifying') : t('auth.button.verify')}
                gradientColors={['#FF8C00', '#FF6347']}
                accessibilityLabel={loading ? t('auth.button.verifying') : t('auth.button.verify')}
              />

              <Animatable.View animation="fadeIn" delay={300}>
                <AnimatedButton
                  onPress={handleBackToPhone}
                  text={t('auth.button.change_number')}
                  gradientColors={['transparent', 'transparent']}
                  textStyle={otpStepStyles.backButtonText}
                  style={otpStepStyles.backButton}
                  accessibilityLabel={t('auth.button.change_number')}
                />
              </Animatable.View>
            </Animatable.View>
          </View>

          {showKeypad && (
            <NumericKeypad 
              onKeyPress={handleKeyPress}
              onDelete={handleDelete}
              onClear={handleClear}
            />
          )}

          <Animatable.View 
            animation="fadeIn" 
            duration={800} 
            delay={1500}
            style={otpStepStyles.footer}
          >
            <Text style={otpStepStyles.footerText}>
              {t('footer.terms')}
            </Text>
          </Animatable.View>
        </KeyboardAvoidingView>
      </LinearGradient>
    </SafeAreaView>
  );
}