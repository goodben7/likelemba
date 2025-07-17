import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useState, useEffect } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { TontineGroup, Payment } from '@/types';
import { tontineService } from '@/services/tontine';
import { DashboardCard } from '@/components/DashboardCard';
import { GroupCard } from '@/components/GroupCard';
import { Bell, Plus } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import * as Animatable from 'react-native-animatable';

export default function HomeScreen() {
  const [groups, setGroups] = useState<TontineGroup[]>([]);
  const [totalSavings, setTotalSavings] = useState(0);
  const [pendingPayments, setPendingPayments] = useState(0);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      const userGroups = await tontineService.getGroups();
      setGroups(userGroups);
      
      // Calcul des statistiques
      const total = userGroups.reduce((sum, group) => sum + (group.amount * group.currentRound), 0);
      setTotalSavings(total);
      
      // Simulation des paiements en attente
      setPendingPayments(userGroups.filter(g => g.status === 'active').length);
    } catch (error) {
      console.error('Erreur lors du chargement des données:', error);
    }
  };

  const formatCurrency = (amount: number) => {
    return `${amount.toLocaleString()} CDF`;
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.content}>
        {/* Header */}
        <LinearGradient
          colors={['#FFFFFF', '#FFF7ED']}
          style={styles.header}
        >
          <Animatable.View animation="fadeIn" duration={800} delay={300}>
            <Text style={styles.greeting}>Bonjour,</Text>
            <Animatable.Text animation="fadeInLeft" duration={800} delay={500} style={styles.userName}>Jean Mukendi</Animatable.Text>
          </Animatable.View>
          <Animatable.View animation="fadeIn" duration={800} delay={700}>
            <TouchableOpacity style={styles.notificationButton}>
              <Bell size={24} color="#FF8C00" />
              <View style={styles.notificationBadge}>
                <Text style={styles.badgeText}>2</Text>
              </View>
            </TouchableOpacity>
          </Animatable.View>
        </LinearGradient>

        {/* Dashboard Cards */}
        <Animatable.View animation="fadeInUp" duration={1000} style={styles.dashboardContainer}>
          <Animatable.View animation="zoomIn" delay={300} duration={800}>
            <DashboardCard
              title="Épargne totale"
              value={formatCurrency(totalSavings)}
              icon="💰"
              color="#228B22"
            />
          </Animatable.View>
          <Animatable.View animation="zoomIn" delay={500} duration={800}>
            <DashboardCard
              title="Paiements en attente"
              value={pendingPayments.toString()}
              icon="⏳"
              color="#FF8C00"
            />
          </Animatable.View>
          <Animatable.View animation="zoomIn" delay={700} duration={800}>
            <DashboardCard
              title="Groupes actifs"
              value={groups.filter(g => g.status === 'active').length.toString()}
              icon="👥"
              color="#4F46E5"
            />
          </Animatable.View>
          <Animatable.View animation="zoomIn" delay={900} duration={800}>
            <DashboardCard
              title="Prochaine collecte"
              value="Dans 5 jours"
              icon="📅"
              color="#DC2626"
            />
          </Animatable.View>
        </Animatable.View>

        {/* Active Groups */}
        <Animatable.View animation="fadeIn" delay={1000} duration={800} style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Mes Groupes</Text>
          <TouchableOpacity style={styles.addButton}>
            <Plus size={20} color="#FF8C00" />
            <Text style={styles.addButtonText}>Nouveau</Text>
          </TouchableOpacity>
        </Animatable.View>

        <Animatable.View animation="fadeInUp" delay={1200} duration={800} style={styles.groupsContainer}>
          {groups.map((group, index) => (
            <Animatable.View key={group.id} animation="fadeInRight" delay={1200 + (index * 200)} duration={800}>
              <GroupCard group={group} />
            </Animatable.View>
          ))}
        </Animatable.View>

        {/* Quick Actions */}
        <Animatable.View animation="fadeIn" delay={1500} duration={800} style={styles.quickActionsContainer}>
          <Text style={styles.sectionTitle}>Actions rapides</Text>
          <View style={styles.quickActions}>
            <Animatable.View animation="bounceIn" delay={1700} duration={1000}>
              <TouchableOpacity style={styles.quickAction}>
                <Text style={styles.quickActionIcon}>💳</Text>
                <Text style={styles.quickActionText}>Payer cotisation</Text>
              </TouchableOpacity>
            </Animatable.View>
            <Animatable.View animation="bounceIn" delay={1900} duration={1000}>
              <TouchableOpacity style={styles.quickAction}>
                <Text style={styles.quickActionIcon}>📊</Text>
                <Text style={styles.quickActionText}>Voir historique</Text>
              </TouchableOpacity>
            </Animatable.View>
            <Animatable.View animation="bounceIn" delay={2100} duration={1000}>
              <TouchableOpacity style={styles.quickAction}>
                <Text style={styles.quickActionIcon}>👥</Text>
                <Text style={styles.quickActionText}>Inviter ami</Text>
              </TouchableOpacity>
            </Animatable.View>
          </View>
        </Animatable.View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  content: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 24,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  greeting: {
    fontSize: 16,
    color: '#6B7280',
  },
  userName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1F2937',
    marginTop: 4,
  },
  notificationButton: {
    position: 'relative',
    padding: 8,
  },
  notificationBadge: {
    position: 'absolute',
    top: 4,
    right: 4,
    backgroundColor: '#DC2626',
    borderRadius: 10,
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  badgeText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: 'bold',
  },
  dashboardContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 20,
    paddingTop: 20,
    gap: 12,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 32,
    paddingBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF7ED',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#FF8C00',
  },
  addButtonText: {
    color: '#FF8C00',
    fontWeight: '600',
    marginLeft: 4,
  },
  groupsContainer: {
    paddingHorizontal: 20,
    gap: 12,
  },
  quickActionsContainer: {
    paddingHorizontal: 20,
    paddingTop: 32,
    paddingBottom: 20,
  },
  quickActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
  },
  quickAction: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    flex: 1,
    marginHorizontal: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  quickActionIcon: {
    fontSize: 24,
    marginBottom: 8,
  },
  quickActionText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    textAlign: 'center',
  },
});