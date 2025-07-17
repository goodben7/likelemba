import { View, Text, KeyboardAvoidingView, Platform, AccessibilityInfo, StyleSheet, TouchableOpacity, Keyboard } from 'react-native';
import { useCallback, useEffect, useState, useRef } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Phone, MessageCircle, ChevronLeft, X } from 'lucide-react-native';
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
        style={styles.keypadKey} 
        onPress={() => onKeyPress(value.toString())}
        accessibilityLabel={`Touche ${value}`}
      >
        <Text style={styles.keypadKeyText}>{value}</Text>
      </TouchableOpacity>
    </Animatable.View>
  );

  return (
    <Animatable.View 
      animation="fadeInUp" 
      duration={800} 
      delay={300}
      style={styles.keypadContainer}
    >
      <View style={styles.keypadRow}>
        {[1, 2, 3].map(renderKey)}
      </View>
      <View style={styles.keypadRow}>
        {[4, 5, 6].map(renderKey)}
      </View>
      <View style={styles.keypadRow}>
        {[7, 8, 9].map(renderKey)}
      </View>
      <View style={styles.keypadRow}>
        <TouchableOpacity style={[styles.keypadKey, styles.keypadSpecialKey]} onPress={onClear}>
          <X size={20} color="#6B7280" />
        </TouchableOpacity>
        {renderKey(0)}
        <TouchableOpacity style={[styles.keypadKey, styles.keypadSpecialKey]} onPress={onDelete}>
          <ChevronLeft size={20} color="#6B7280" />
        </TouchableOpacity>
      </View>
    </Animatable.View>
  );
};

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
  const [showKeypad, setShowKeypad] = useState(false);
  const [animationComplete, setAnimationComplete] = useState(false);
  const inputRef = useRef<any>(null);
  
  // Effet pour déclencher l'animation initiale
  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimationComplete(true);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  // Gérer la soumission du numéro de téléphone
  const handleSendOTP = useCallback(async () => {
    Keyboard.dismiss();
    const success = await sendOTP();
    if (success) {
      // Annoncer aux lecteurs d'écran que le code a été envoyé
      AccessibilityInfo.announceForAccessibility(t('success.otp_sent'));
    }
  }, [sendOTP, t]);

  // Gérer la vérification du code OTP
  const handleVerifyOTP = useCallback(async () => {
    Keyboard.dismiss();
    const success = await verifyOTP();
    if (success) {
      router.replace('/(tabs)');
    }
  }, [verifyOTP, router]);

  // Formater le numéro de téléphone pour l'affichage
  const handlePhoneChange = useCallback((value: string) => {
    setPhone(value);
  }, [setPhone]);

  // Gérer l'appui sur une touche du clavier numérique
  const handleKeyPress = useCallback((key: string) => {
    if (step === 'phone') {
      const newPhone = phone.length >= 12 ? phone : phone + key;
      setPhone(newPhone);
    } else {
      const newOtp = otp.length >= 4 ? otp : otp + key;
      setOtp(newOtp);
    }
  }, [step, setPhone, setOtp, phone, otp]);

  // Gérer la suppression d'un caractère
  const handleDelete = useCallback(() => {
    if (step === 'phone') {
      setPhone(phone.slice(0, -1));
    } else {
      setOtp(otp.slice(0, -1));
    }
  }, [step, setPhone, setOtp, phone, otp]);

  // Effacer tout le texte
  const handleClear = useCallback(() => {
    if (step === 'phone') {
      setPhone('');
    } else {
      setOtp('');
    }
  }, [step, setPhone, setOtp]);

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
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={['#FFFFFF', '#FFF7ED']}
        style={styles.gradient}
      >
        <KeyboardAvoidingView
          style={styles.content}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          keyboardVerticalOffset={Platform.OS === 'ios' ? 40 : 0}
        >
          <Animatable.View 
            animation="fadeIn" 
            duration={1000} 
            delay={300}
            style={styles.header}
          >
            <Animatable.Text 
              animation="bounceIn" 
              duration={1500} 
              delay={500}
              style={styles.logo} 
              accessibilityRole="image"
            >
              🏪
            </Animatable.Text>
            <Animatable.Text 
              animation="fadeInDown" 
              duration={800} 
              delay={800}
              style={styles.title} 
              accessibilityRole="header"
            >
              {t('auth.login.title')}
            </Animatable.Text>
            <Animatable.Text 
              animation="fadeIn" 
              duration={800} 
              delay={1000}
              style={styles.subtitle}
            >
              {t('auth.login.subtitle')}
            </Animatable.Text>
          </Animatable.View>

        <View style={styles.form}>
          {step === 'phone' ? (
            <Animatable.View 
              animation="fadeInUp" 
              duration={800} 
              delay={1200}
            >
              <View style={styles.inputContainer}>
                <AnimatedInput
                  label={t('auth.phone.label')}
                  value={phone}
                  onChangeText={handlePhoneChange}
                  placeholder={t('auth.phone.placeholder')}
                  keyboardType="phone-pad"
                  autoFocus={!showKeypad}
                  accessibilityLabel={t('auth.phone.label')}
                  accessibilityHint={t('auth.login.subtitle')}
                  icon={<Phone size={20} color="#6B7280" />}
                  error={error}
                  ref={inputRef}
                  onFocus={() => setShowKeypad(false)}
                />
                
                <TouchableOpacity 
                  style={styles.keypadToggle}
                  onPress={toggleKeypad}
                  accessibilityLabel={showKeypad ? "Masquer le clavier" : "Afficher le clavier"}
                >
                  <Text style={styles.keypadToggleText}>
                    {showKeypad ? "Masquer le clavier" : "Utiliser le clavier numérique"}
                  </Text>
                </TouchableOpacity>
              </View>

              <AnimatedButton
                onPress={handleSendOTP}
                disabled={loading || !phone.trim()}
                loading={loading}
                text={loading ? t('auth.button.sending') : t('auth.button.send')}
                gradientColors={['#FF8C00', '#FF6347']}
                accessibilityLabel={loading ? t('auth.button.sending') : t('auth.button.send')}
                style={{ alignSelf: 'center', width: '100%', maxWidth: 400 }} // Centrer le bouton et limiter sa largeur
              />
            </Animatable.View>
          ) : (
            <Animatable.View 
              animation="fadeInRight" 
              duration={800}
            >
              <Text style={styles.stepTitle}>{t('auth.verification.title')}</Text>
              <Text style={styles.stepSubtitle}>
                {t('auth.verification.subtitle', { phone: formatPhoneNumber(phone) })}
              </Text>
              
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
                inputStyle={styles.otpInputStyle}
                ref={inputRef}
                onFocus={() => setShowKeypad(false)}
              />

              <TouchableOpacity 
                style={styles.keypadToggle}
                onPress={toggleKeypad}
                accessibilityLabel={showKeypad ? "Masquer le clavier" : "Afficher le clavier"}
              >
                <Text style={styles.keypadToggleText}>
                  {showKeypad ? "Masquer le clavier" : "Utiliser le clavier numérique"}
                </Text>
              </TouchableOpacity>

              <AnimatedButton
                onPress={handleVerifyOTP}
                disabled={loading || otp.length !== 4}
                loading={loading}
                text={loading ? t('auth.button.verifying') : t('auth.button.verify')}
                gradientColors={['#FF8C00', '#FF6347']}
                accessibilityLabel={loading ? t('auth.button.verifying') : t('auth.button.verify')}
                style={{ alignSelf: 'center', width: '100%', maxWidth: 400 }} // Centrer le bouton et limiter sa largeur
              />

              <Animatable.View animation="fadeIn" delay={300}>
                <AnimatedButton
                  onPress={resetToPhoneStep}
                  text={t('auth.button.change_number')}
                  gradientColors={['transparent', 'transparent']}
                  textStyle={styles.backButtonText}
                  style={styles.backButton}
                  accessibilityLabel={t('auth.button.change_number')}
                />
              </Animatable.View>
            </Animatable.View>
          )}
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
            style={styles.footer}
          >
            <Text style={styles.footerText}>
              {t('footer.terms')}
            </Text>
          </Animatable.View>
        </KeyboardAvoidingView>
      </LinearGradient>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradient: {
    flex: 1,
  },
  content: {
    flex: 1,
    padding: 20,
  },
  header: {
    alignItems: 'center',
    paddingTop: 60,
    paddingBottom: 40,
  },
  logo: {
    fontSize: 64,
    marginBottom: 16,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
  },
  form: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center', // Centrer horizontalement les éléments du formulaire
  },
  inputContainer: {
    marginBottom: 8,
    width: '100%', // Assurer que le conteneur prend toute la largeur disponible
    maxWidth: 400, // Limiter la largeur maximale pour un meilleur aspect visuel
    alignSelf: 'center', // Centrer le conteneur lui-même
  },
  stepTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 8,
  },
  stepSubtitle: {
    fontSize: 16,
    color: '#6B7280',
    marginBottom: 32,
    lineHeight: 24,
  },
  otpInputStyle: {
    fontSize: 24,
    fontWeight: 'bold',
    letterSpacing: 8,
    textAlign: 'center',
  },
  backButton: {
    marginTop: 16,
    backgroundColor: 'transparent',
    shadowOpacity: 0,
    elevation: 0,
  },
  backButtonText: {
    color: '#FF8C00',
    fontSize: 16,
    fontWeight: '600',
  },
  footer: {
    paddingTop: 20,
  },
  footerText: {
    fontSize: 12,
    color: '#9CA3AF',
    textAlign: 'center',
    lineHeight: 18,
  },
  keypadToggle: {
    alignItems: 'center',
    paddingVertical: 8,
    marginBottom: 16,
  },
  keypadToggleText: {
    color: '#FF8C00',
    fontSize: 14,
    fontWeight: '500',
  },
  keypadContainer: {
    backgroundColor: '#F9FAFB',
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
  },
  keypadRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 16,
  },
  keypadKey: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  keypadKeyText: {
    fontSize: 24,
    fontWeight: '600',
    color: '#1F2937',
  },
  keypadSpecialKey: {
    backgroundColor: '#F3F4F6',
  },
});