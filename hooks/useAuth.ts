import { useState, useCallback, useReducer } from 'react';
import { authService } from '@/services/auth';
import { isValidPhone, isValidOTP } from '@/utils/validation';
import { useTranslation } from '@/utils/i18n';
import { User } from '@/types';

// Types pour le state et les actions
type AuthState = {
  phone: string;
  otp: string;
  step: 'phone' | 'otp';
  loading: boolean;
  error: string | null;
  user: User | null;
};

type AuthAction =
  | { type: 'SET_PHONE'; payload: string }
  | { type: 'SET_OTP'; payload: string }
  | { type: 'SET_STEP'; payload: 'phone' | 'otp' }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'SET_USER'; payload: User | null }
  | { type: 'RESET' };

// État initial
const initialState: AuthState = {
  phone: '',
  otp: '',
  step: 'phone',
  loading: false,
  error: null,
  user: null,
};

// Reducer pour gérer les états
const authReducer = (state: AuthState, action: AuthAction): AuthState => {
  switch (action.type) {
    case 'SET_PHONE':
      return { ...state, phone: action.payload, error: null };
    case 'SET_OTP':
      return { ...state, otp: action.payload, error: null };
    case 'SET_STEP':
      return { ...state, step: action.payload, error: null };
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    case 'SET_ERROR':
      return { ...state, error: action.payload };
    case 'SET_USER':
      return { ...state, user: action.payload };
    case 'RESET':
      return initialState;
    default:
      return state;
  }
};

/**
 * Hook personnalisé pour gérer l'authentification
 */
export const useAuth = () => {
  const [state, dispatch] = useReducer(authReducer, initialState);
  const { t } = useTranslation();

  // Mettre à jour le numéro de téléphone
  const setPhone = useCallback((phone: string) => {
    dispatch({ type: 'SET_PHONE', payload: phone });
  }, []);

  // Mettre à jour le code OTP
  const setOtp = useCallback((otp: string) => {
    dispatch({ type: 'SET_OTP', payload: otp });
  }, []);

  // Envoyer le code OTP
  const sendOTP = useCallback(async () => {
    // Validation du numéro de téléphone
    if (!state.phone) {
      dispatch({ type: 'SET_ERROR', payload: t('error.required.phone') });
      return false;
    }

    if (!isValidPhone(state.phone)) {
      dispatch({ type: 'SET_ERROR', payload: t('error.invalid.phone') });
      return false;
    }

    dispatch({ type: 'SET_LOADING', payload: true });
    dispatch({ type: 'SET_ERROR', payload: null });

    try {
      const result = await authService.sendOTP(state.phone);
      if (result.success) {
        dispatch({ type: 'SET_STEP', payload: 'otp' });
        return true;
      } else {
        dispatch({ type: 'SET_ERROR', payload: t('error.send_otp') });
        return false;
      }
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: t('error.generic') });
      return false;
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  }, [state.phone, t]);

  // Vérifier le code OTP
  const verifyOTP = useCallback(async () => {
    // Validation du code OTP
    if (!state.otp) {
      dispatch({ type: 'SET_ERROR', payload: t('error.required.otp') });
      return false;
    }

    if (!isValidOTP(state.otp)) {
      dispatch({ type: 'SET_ERROR', payload: t('error.invalid.otp') });
      return false;
    }

    dispatch({ type: 'SET_LOADING', payload: true });
    dispatch({ type: 'SET_ERROR', payload: null });

    try {
      const result = await authService.verifyOTP(state.phone, state.otp);
      if (result.success && result.user) {
        dispatch({ type: 'SET_USER', payload: result.user });
        return true;
      } else {
        dispatch({ type: 'SET_ERROR', payload: t('error.verify_otp') });
        return false;
      }
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: t('error.generic') });
      return false;
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  }, [state.phone, state.otp, t]);

  // Réinitialiser à l'étape du numéro de téléphone
  const resetToPhoneStep = useCallback(() => {
    dispatch({ type: 'SET_STEP', payload: 'phone' });
    dispatch({ type: 'SET_OTP', payload: '' });
    dispatch({ type: 'SET_ERROR', payload: null });
  }, []);

  // Déconnexion
  const logout = useCallback(async () => {
    await authService.logout();
    dispatch({ type: 'RESET' });
  }, []);

  return {
    ...state,
    setPhone,
    setOtp,
    sendOTP,
    verifyOTP,
    resetToPhoneStep,
    logout,
  };
};