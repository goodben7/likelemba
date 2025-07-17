import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { useState, useEffect } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Payment, TontineGroup } from '@/types';
import { tontineService } from '@/services/tontine';
import { PaymentCard } from '@/components/PaymentCard';
import { MobileMoneyModal } from '@/components/MobileMoneyModal';
import { CreditCard, History, CircleAlert as AlertCircle } from 'lucide-react-native';

export default function PaymentsScreen() {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [groups, setGroups] = useState<TontineGroup[]>([]);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState<Payment | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPayments();
  }, []);

  const loadPayments = async () => {
    try {
      const userGroups = await tontineService.getGroups();
      setGroups(userGroups);
      
      // Charger les paiements pour chaque groupe
      const allPayments: Payment[] = [];
      for (const group of userGroups) {
        const groupPayments = await tontineService.getPaymentStatus(group.id, group.currentRound);
        allPayments.push(...groupPayments);
      }
      setPayments(allPayments);
    } catch (error) {
      console.error('Erreur lors du chargement des paiements:', error);
      Alert.alert('Erreur', 'Impossible de charger les paiements');
    } finally {
      setLoading(false);
    }
  };

  const handlePayment = (payment: Payment) => {
    setSelectedPayment(payment);
    setShowPaymentModal(true);
  };

  const processPayment = async (paymentMethod: string) => {
    if (!selectedPayment) return;

    try {
      const result = await tontineService.processPayment({
        ...selectedPayment,
        paymentMethod: paymentMethod as any,
      });
      
      if (result.success) {
        Alert.alert('Succès', result.message);
        setShowPaymentModal(false);
        setSelectedPayment(null);
        loadPayments(); // Recharger les paiements
      } else {
        Alert.alert('Erreur', 'Échec du paiement');
      }
    } catch (error) {
      console.error('Erreur lors du paiement:', error);
      Alert.alert('Erreur', 'Impossible de traiter le paiement');
    }
  };

  const pendingPayments = payments.filter(p => p.status === 'pending');
  const completedPayments = payments.filter(p => p.status === 'completed');

  const formatCurrency = (amount: number) => {
    return `${amount.toLocaleString()} CDF`;
  };

  const getTotalPending = () => {
    return pendingPayments.reduce((sum, p) => sum + p.amount, 0);
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Paiements</Text>
        <TouchableOpacity style={styles.historyButton}>
          <History size={20} color="#6B7280" />
        </TouchableOpacity>
      </View>

      {/* Summary Cards */}
      <View style={styles.summaryContainer}>
        <View style={[styles.summaryCard, styles.pendingCard]}>
          <AlertCircle size={24} color="#FF8C00" />
          <Text style={styles.summaryAmount}>{formatCurrency(getTotalPending())}</Text>
          <Text style={styles.summaryLabel}>En attente</Text>
        </View>
        <View style={[styles.summaryCard, styles.completedCard]}>
          <CreditCard size={24} color="#228B22" />
          <Text style={styles.summaryAmount}>{completedPayments.length}</Text>
          <Text style={styles.summaryLabel}>Payés ce mois</Text>
        </View>
      </View>

      <ScrollView style={styles.content}>
        {loading ? (
          <View style={styles.loadingContainer}>
            <Text style={styles.loadingText}>Chargement...</Text>
          </View>
        ) : (
          <>
            {/* Pending Payments */}
            {pendingPayments.length > 0 && (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>À payer</Text>
                <View style={styles.paymentsList}>
                  {pendingPayments.map((payment) => (
                    <PaymentCard
                      key={payment.id}
                      payment={payment}
                      group={groups.find(g => g.id === payment.groupId)!}
                      onPay={() => handlePayment(payment)}
                    />
                  ))}
                </View>
              </View>
            )}

            {/* Completed Payments */}
            {completedPayments.length > 0 && (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Historique</Text>
                <View style={styles.paymentsList}>
                  {completedPayments.slice(0, 10).map((payment) => (
                    <PaymentCard
                      key={payment.id}
                      payment={payment}
                      group={groups.find(g => g.id === payment.groupId)!}
                    />
                  ))}
                </View>
              </View>
            )}

            {payments.length === 0 && (
              <View style={styles.emptyContainer}>
                <Text style={styles.emptyIcon}>💳</Text>
                <Text style={styles.emptyTitle}>Aucun paiement</Text>
                <Text style={styles.emptySubtitle}>
                  Rejoignez un groupe pour commencer à cotiser
                </Text>
              </View>
            )}
          </>
        )}
      </ScrollView>

      {/* Mobile Money Modal */}
      <MobileMoneyModal
        visible={showPaymentModal}
        payment={selectedPayment}
        onClose={() => {
          setShowPaymentModal(false);
          setSelectedPayment(null);
        }}
        onPay={processPayment}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  historyButton: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: '#F3F4F6',
  },
  summaryContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingTop: 20,
    gap: 12,
  },
  summaryCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  pendingCard: {
    borderLeftWidth: 4,
    borderLeftColor: '#FF8C00',
  },
  completedCard: {
    borderLeftWidth: 4,
    borderLeftColor: '#228B22',
  },
  summaryAmount: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1F2937',
    marginTop: 8,
  },
  summaryLabel: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 4,
  },
  content: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  loadingText: {
    fontSize: 16,
    color: '#6B7280',
  },
  section: {
    paddingHorizontal: 20,
    paddingTop: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 16,
  },
  paymentsList: {
    gap: 12,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  emptyIcon: {
    fontSize: 48,
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
  },
});