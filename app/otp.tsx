import { View, Text, KeyboardAvoidingView, Platform, TouchableOpacity, Keyboard, AccessibilityInfo, Image } from 'react-native';
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

  // Effet pour annoncer les erreurs aux lecteurs d'écran
  useEffect(() => {
    if (error) {
      AccessibilityInfo.announceForAccessibility(error);
    }
  }, [error]);



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
              <Image 
                source={require('@/assets/images/logo.png')} 
                style={{ width: 80, height: 80 }}
                resizeMode="contain"
                accessibilityLabel="Logo de l'application"
              />
            </Animatable.Text>
            <Animatable.Text 
              animation="fadeInDown" 
              duration={800} 
              delay={800}
              style={otpStepStyles.title} 
              accessibilityRole="header"
            >
              {t('auth.verification.title')}
            </Animatable.Text>
            <Animatable.Text 
              animation="fadeIn" 
              duration={800} 
              delay={1000}
              style={otpStepStyles.subtitle}
            >
            </Animatable.Text>
          </Animatable.View>

          <View style={otpStepStyles.form}>
            <Animatable.View 
              animation="fadeInRight" 
              duration={800}
            >
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
                  autoFocus={true}
                  textAlign="center"
                  accessibilityLabel={t('auth.otp.label')}
                  accessibilityHint={t('auth.verification.subtitle', { phone: formatPhoneNumber(phone) })}
                  error={error}
                  inputStyle={otpStepStyles.otpInputStyle}
                  ref={inputRef}

                />
                

              </View>

              <AnimatedButton
                onPress={handleVerifyOTP}
                disabled={loading || !otp.trim() || otp.length < 4}
                loading={loading}
                text={loading ? t('auth.button.verifying') : t('auth.button.verify')}
                gradientColors={['#FF8C00', '#FF6347']}
                accessibilityLabel={loading ? t('auth.button.verifying') : t('auth.button.verify')}
              />

              <Animatable.View animation="fadeIn" delay={300} style={otpStepStyles.changeNumberContainer}>
                <AnimatedButton
                  onPress={handleBackToPhone}
                  text={t('auth.button.change_number')}
                  icon={<ChevronLeft size={18} color="#FF8C00" />}
                  gradientColors={['#FFF7ED', '#FFEDD5']}
                  textStyle={otpStepStyles.backButtonText}
                  style={otpStepStyles.backButton}
                  accessibilityLabel={t('auth.button.change_number')}
                />
              </Animatable.View>
            </Animatable.View>
          </View>



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