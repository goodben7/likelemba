import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Payment, TontineGroup } from '@/types';
import { Clock, CircleCheck as CheckCircle, Circle as XCircle } from 'lucide-react-native';

interface PaymentCardProps {
  payment: Payment;
  group: TontineGroup;
  onPay?: () => void;
}

export function PaymentCard({ payment, group, onPay }: PaymentCardProps) {
  const getStatusIcon = () => {
    switch (payment.status) {
      case 'completed':
        return <CheckCircle size={20} color="#228B22" />;
      case 'failed':
        return <XCircle size={20} color="#DC2626" />;
      default:
        return <Clock size={20} color="#FF8C00" />;
    }
  };

  const getStatusText = () => {
    switch (payment.status) {
      case 'completed': return 'Payé';
      case 'failed': return 'Échec';
      default: return 'En attente';
    }
  };

  const getStatusColor = () => {
    switch (payment.status) {
      case 'completed': return '#228B22';
      case 'failed': return '#DC2626';
      default: return '#FF8C00';
    }
  };

  const formatCurrency = (amount: number) => {
    return `${amount.toLocaleString()} CDF`;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.groupInfo}>
          <Text style={styles.groupName}>{group.name}</Text>
          <Text style={styles.roundText}>Tour {payment.round}</Text>
        </View>
        <View style={styles.statusContainer}>
          {getStatusIcon()}
          <Text style={[styles.statusText, { color: getStatusColor() }]}>
            {getStatusText()}
          </Text>
        </View>
      </View>

      <View style={styles.content}>
        <View style={styles.amountContainer}>
          <Text style={styles.amountLabel}>Montant</Text>
          <Text style={styles.amount}>{formatCurrency(payment.amount)}</Text>
        </View>
        
        <View style={styles.dateContainer}>
          <Text style={styles.dateLabel}>Date</Text>
          <Text style={styles.date}>
            {payment.paidAt ? formatDate(payment.paidAt) : formatDate(payment.createdAt)}
          </Text>
        </View>
      </View>

      {payment.status === 'pending' && onPay && (
        <TouchableOpacity style={styles.payButton} onPress={onPay}>
          <Text style={styles.payButtonText}>Payer maintenant</Text>
        </TouchableOpacity>
      )}

      {payment.status === 'completed' && payment.paymentMethod && (
        <View style={styles.paymentMethod}>
          <Text style={styles.paymentMethodText}>
            Via {payment.paymentMethod.toUpperCase()}
          </Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  groupInfo: {
    flex: 1,
  },
  groupName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
  },
  roundText: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 2,
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusText: {
    fontSize: 14,
    fontWeight: '500',
    marginLeft: 4,
  },
  content: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  amountContainer: {
    flex: 1,
  },
  amountLabel: {
    fontSize: 12,
    color: '#6B7280',
    marginBottom: 4,
  },
  amount: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  dateContainer: {
    flex: 1,
    alignItems: 'flex-end',
  },
  dateLabel: {
    fontSize: 12,
    color: '#6B7280',
    marginBottom: 4,
  },
  date: {
    fontSize: 14,
    color: '#374151',
  },
  payButton: {
    backgroundColor: '#FF8C00',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  payButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  paymentMethod: {
    backgroundColor: '#F3F4F6',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 6,
    alignItems: 'center',
  },
  paymentMethodText: {
    fontSize: 12,
    color: '#6B7280',
    fontWeight: '500',
  },
});