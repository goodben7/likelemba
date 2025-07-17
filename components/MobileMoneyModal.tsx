import { View, Text, StyleSheet, Modal, TouchableOpacity, TextInput, Alert } from 'react-native';
import { useState } from 'react';
import { Payment } from '@/types';
import { X, CreditCard, Phone } from 'lucide-react-native';

interface MobileMoneyModalProps {
  visible: boolean;
  payment: Payment | null;
  onClose: () => void;
  onPay: (paymentMethod: string) => void;
}

export function MobileMoneyModal({ visible, payment, onClose, onPay }: MobileMoneyModalProps) {
  const [selectedMethod, setSelectedMethod] = useState<string>('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [processing, setProcessing] = useState(false);

  const paymentMethods = [
    { id: 'airtel', name: 'Airtel Money', color: '#E60026', icon: '📱' },
    { id: 'mpesa', name: 'M-Pesa', color: '#00A86B', icon: '💳' },
    { id: 'orange', name: 'Orange Money', color: '#FF6600', icon: '🧡' },
  ];

  const handlePayment = async () => {
    if (!selectedMethod || !phoneNumber) {
      Alert.alert('Erreur', 'Veuillez sélectionner un moyen de paiement et saisir votre numéro');
      return;
    }

    setProcessing(true);
    try {
      await onPay(selectedMethod);
    } finally {
      setProcessing(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return `${amount.toLocaleString()} CDF`;
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
    >
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Paiement Mobile Money</Text>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <X size={24} color="#6B7280" />
          </TouchableOpacity>
        </View>

        {payment && (
          <View style={styles.paymentInfo}>
            <Text style={styles.paymentAmount}>{formatCurrency(payment.amount)}</Text>
            <Text style={styles.paymentDescription}>
              Cotisation pour le tour {payment.round}
            </Text>
          </View>
        )}

        <View style={styles.form}>
          <Text style={styles.sectionTitle}>Choisir un moyen de paiement</Text>
          
          <View style={styles.methodsContainer}>
            {paymentMethods.map((method) => (
              <TouchableOpacity
                key={method.id}
                style={[
                  styles.methodOption,
                  selectedMethod === method.id && styles.methodOptionSelected,
                ]}
                onPress={() => setSelectedMethod(method.id)}
              >
                <View style={styles.methodIcon}>
                  <Text style={styles.methodEmoji}>{method.icon}</Text>
                </View>
                <Text style={styles.methodName}>{method.name}</Text>
                <View style={styles.methodRadio}>
                  {selectedMethod === method.id && (
                    <View style={styles.methodRadioSelected} />
                  )}
                </View>
              </TouchableOpacity>
            ))}
          </View>

          <View style={styles.field}>
            <Text style={styles.label}>Numéro de téléphone</Text>
            <View style={styles.inputContainer}>
              <Phone size={20} color="#6B7280" />
              <TextInput
                style={styles.input}
                value={phoneNumber}
                onChangeText={setPhoneNumber}
                placeholder="+243 XXX XXX XXX"
                keyboardType="phone-pad"
              />
            </View>
          </View>

          <View style={styles.infoBox}>
            <Text style={styles.infoText}>
              💡 Vous recevrez un SMS avec le code de confirmation pour valider le paiement
            </Text>
          </View>
        </View>

        <View style={styles.actions}>
          <TouchableOpacity style={styles.cancelButton} onPress={onClose}>
            <Text style={styles.cancelButtonText}>Annuler</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.payButton, processing && styles.payButtonDisabled]}
            onPress={handlePayment}
            disabled={processing}
          >
            <CreditCard size={20} color="#FFFFFF" />
            <Text style={styles.payButtonText}>
              {processing ? 'Traitement...' : 'Payer'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  closeButton: {
    padding: 4,
  },
  paymentInfo: {
    padding: 20,
    backgroundColor: '#F9FAFB',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  paymentAmount: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  paymentDescription: {
    fontSize: 16,
    color: '#6B7280',
    marginTop: 4,
  },
  form: {
    flex: 1,
    padding: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 16,
  },
  methodsContainer: {
    marginBottom: 24,
  },
  methodOption: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    backgroundColor: '#F9FAFB',
    marginBottom: 12,
  },
  methodOptionSelected: {
    borderColor: '#FF8C00',
    backgroundColor: '#FFF7ED',
  },
  methodIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  methodEmoji: {
    fontSize: 20,
  },
  methodName: {
    flex: 1,
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
  },
  methodRadio: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#D1D5DB',
    justifyContent: 'center',
    alignItems: 'center',
  },
  methodRadioSelected: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#FF8C00',
  },
  field: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 8,
    padding: 12,
    backgroundColor: '#F9FAFB',
  },
  input: {
    flex: 1,
    fontSize: 16,
    marginLeft: 8,
  },
  infoBox: {
    backgroundColor: '#EFF6FF',
    padding: 16,
    borderRadius: 8,
    marginBottom: 20,
  },
  infoText: {
    fontSize: 14,
    color: '#1E40AF',
    lineHeight: 20,
  },
  actions: {
    flexDirection: 'row',
    padding: 20,
    gap: 12,
  },
  cancelButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#D1D5DB',
    alignItems: 'center',
  },
  cancelButtonText: {
    fontSize: 16,
    color: '#6B7280',
    fontWeight: '600',
  },
  payButton: {
    flex: 1,
    flexDirection: 'row',
    paddingVertical: 12,
    borderRadius: 8,
    backgroundColor: '#FF8C00',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  payButtonDisabled: {
    backgroundColor: '#9CA3AF',
  },
  payButtonText: {
    fontSize: 16,
    color: '#FFFFFF',
    fontWeight: '600',
  },
});