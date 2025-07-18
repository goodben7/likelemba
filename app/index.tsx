import { View, Text, KeyboardAvoidingView, Platform, TouchableOpacity, Keyboard } from 'react-native';
import { phoneStepStyles } from '@/styles/phoneStep';
import { useCallback, useRef, useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Phone, MessageCircle, ChevronLeft, X } from 'lucide-react-native';
import { useAuth } from '@/hooks/useAuth';
import { useTranslation } from '@/utils/i18n';
import { AnimatedButton } from '@/components/AnimatedButton';
import { AnimatedInput } from '@/components/AnimatedInput';
import { LinearGradient } from 'expo-linear-gradient';
import * as Animatable from 'react-native-animatable';



export default function Index() {
  const {
    phone,
    loading,
    error,
    setPhone,
    sendOTP
  } = useAuth();
  const router = useRouter();
  const { t } = useTranslation();

  const inputRef = useRef<any>(null);

  // Gérer la soumission du numéro de téléphone
  const handleSendOTP = useCallback(async () => {
    Keyboard.dismiss();
    const success = await sendOTP();
    if (success) {
      // Rediriger vers la page OTP
      router.push('/otp');
    }
  }, [sendOTP, router]);

  // Formater le numéro de téléphone pour l'affichage
  const handlePhoneChange = useCallback((value: string) => {
    setPhone(value);
  }, [setPhone]);
  




  return (
    <SafeAreaView style={phoneStepStyles.container}>
      <LinearGradient
        colors={['#FFFFFF', '#FFF7ED']}
        style={phoneStepStyles.gradient}
      >
        <KeyboardAvoidingView
          style={phoneStepStyles.content}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          keyboardVerticalOffset={Platform.OS === 'ios' ? 40 : 0}
        >
          <Animatable.View 
            animation="fadeIn" 
            duration={1000} 
            delay={300}
            style={phoneStepStyles.header}
          >
            <Animatable.Text 
              animation="bounceIn" 
              duration={1500} 
              delay={500}
              style={phoneStepStyles.logo} 
              accessibilityRole="image"
            >
              🏪
            </Animatable.Text>
            <Animatable.Text 
              animation="fadeInDown" 
              duration={800} 
              delay={800}
              style={phoneStepStyles.title} 
              accessibilityRole="header"
            >
              {t('auth.phone.page.title')}
            </Animatable.Text>
            <Animatable.Text 
              animation="fadeIn" 
              duration={800} 
              delay={1000}
              style={phoneStepStyles.subtitle}
            >
              {t('auth.phone.page.subtitle')}
            </Animatable.Text>
          </Animatable.View>

          <View style={phoneStepStyles.form}>
            <Animatable.View 
              animation="fadeInUp" 
              duration={800} 
              delay={1200}
            >
              <View style={phoneStepStyles.inputContainer}>
                <AnimatedInput
                  label={t('auth.phone.label')}
                  value={phone}
                  onChangeText={handlePhoneChange}
                  placeholder={t('auth.phone.placeholder')}
                  keyboardType="phone-pad"
                  autoFocus={true}
                  accessibilityLabel={t('auth.phone.label')}
                  accessibilityHint={t('auth.login.subtitle')}
                  icon={<Phone size={20} color="#6B7280" />}
                  error={error}
                  ref={inputRef}

                />
                

              </View>

              <AnimatedButton
                onPress={handleSendOTP}
                disabled={loading || !phone.trim()}
                loading={loading}
                text={loading ? t('auth.button.sending') : t('auth.button.send')}
                icon={<MessageCircle size={20} color="#FFFFFF" />}
                gradientColors={['#FF8C00', '#FF6347']}
                accessibilityLabel={loading ? t('auth.button.sending') : t('auth.button.send')}
              />
            </Animatable.View>
          </View>



          <Animatable.View 
            animation="fadeIn" 
            duration={800} 
            delay={1500}
            style={phoneStepStyles.footer}
          >
            <Text style={phoneStepStyles.footerText}>
              {t('footer.terms')}
            </Text>
          </Animatable.View>
        </KeyboardAvoidingView>
      </LinearGradient>
    </SafeAreaView>
  );
}