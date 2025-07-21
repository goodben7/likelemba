import { View, Text, ScrollView, TouchableOpacity, RefreshControl, StatusBar } from 'react-native';
import { useState, useEffect, useCallback } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { TontineGroup, Payment } from '@/types';
import { tontineService } from '@/services/tontine';
import { DashboardCard } from '@/components/DashboardCard';
import { GroupCard } from '@/components/GroupCard';
import { QuickActionButton } from '@/components/QuickActionButton';
import { Bell, Plus, RefreshCw, Search } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import * as Animatable from 'react-native-animatable';
import { homeStyles } from '@/styles/home';

export default function HomeScreen() {
  const [groups, setGroups] = useState<TontineGroup[]>([]);
  const [totalSavings, setTotalSavings] = useState(0);
  const [pendingPayments, setPendingPayments] = useState(0);
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      const userGroups = await tontineService.getGroups();
      setGroups(userGroups);
      
      // Calcul des statistiques
      const total = userGroups.reduce((sum, group) => sum + (group.amount * group.currentRound), 0);
      setTotalSavings(total);
      
      // Simulation des paiements en attente
      setPendingPayments(userGroups.filter(g => g.status === 'active').length);
    } catch (error) {
      console.error('Erreur lors du chargement des données:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };
  
  const onRefresh = useCallback(() => {
    setRefreshing(true);
    loadDashboardData();
  }, []);

  const formatCurrency = (amount: number) => {
    return `${amount.toLocaleString()} CDF`;
  };

  return (
    <SafeAreaView style={homeStyles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      <ScrollView 
        style={homeStyles.content}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={['#FF8C00']} />
        }
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <LinearGradient
          colors={['#FFFFFF', '#FFF7ED']}
          style={homeStyles.header}
        >
          <Animatable.View animation="fadeIn" duration={800} delay={300}>
            <Text style={homeStyles.greeting}>Bonjour,</Text>
            <Animatable.Text animation="fadeInLeft" duration={800} delay={500} style={homeStyles.userName}>Jean Mukendi</Animatable.Text>
          </Animatable.View>
          <View style={homeStyles.headerActions}>
            <Animatable.View animation="fadeIn" duration={800} delay={600}>
              <TouchableOpacity style={homeStyles.actionButton} accessibilityLabel="Rechercher">
                <Search size={22} color="#6B7280" />
              </TouchableOpacity>
            </Animatable.View>
            <Animatable.View animation="fadeIn" duration={800} delay={700}>
              <TouchableOpacity 
                style={homeStyles.notificationButton}
                accessibilityLabel="2 notifications non lues"
                accessibilityHint="Appuyez pour voir vos notifications"
              >
                <Bell size={22} color="#FF8C00" />
              </TouchableOpacity>
            </Animatable.View>
          </View>
        </LinearGradient>

        {/* Dashboard Cards */}
        <Animatable.View animation="fadeInUp" duration={1000} style={homeStyles.dashboardContainer}>
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
        <Animatable.View animation="fadeIn" delay={1000} duration={800} style={homeStyles.sectionHeader}>
          <Text style={homeStyles.sectionTitle}>Mes Groupes</Text>
          <TouchableOpacity style={homeStyles.addButton}>
            <Plus size={20} color="#FF8C00" />
            <Text style={homeStyles.addButtonText}>Nouveau</Text>
          </TouchableOpacity>
        </Animatable.View>

        <Animatable.View animation="fadeInUp" delay={1200} duration={800} style={homeStyles.groupsContainer}>
          {groups.map((group, index) => (
            <Animatable.View key={group.id} animation="fadeInRight" delay={1200 + (index * 200)} duration={800}>
              <GroupCard group={group} />
            </Animatable.View>
          ))}
        </Animatable.View>

        {/* Quick Actions */}
        <Animatable.View animation="fadeIn" delay={1500} duration={800} style={homeStyles.quickActionsContainer}>
          <Text style={homeStyles.sectionTitle}>Actions rapides</Text>
          <View style={homeStyles.quickActions}>
            <Animatable.View animation="bounceIn" delay={1700} duration={1000}>
              <QuickActionButton
                icon="💳"
                label="Payer cotisation"
                onPress={() => console.log('Payer cotisation')}
                accessibilityLabel="Payer votre cotisation"
              />
            </Animatable.View>
            <Animatable.View animation="bounceIn" delay={1900} duration={1000}>
              <QuickActionButton
                icon="📊"
                label="Voir historique"
                onPress={() => console.log('Voir historique')}
                accessibilityLabel="Consulter l'historique des paiements"
              />
            </Animatable.View>
            <Animatable.View animation="bounceIn" delay={2100} duration={1000}>
              <QuickActionButton
                icon="👥"
                label="Inviter ami"
                onPress={() => console.log('Inviter ami')}
                accessibilityLabel="Inviter un ami à rejoindre un groupe"
              />
            </Animatable.View>
          </View>
        </Animatable.View>
        
        {groups.length === 0 && !loading && (
          <Animatable.View animation="fadeIn" delay={1000} duration={800} style={homeStyles.emptyStateContainer}>
            <Text style={homeStyles.emptyStateIcon}>🏦</Text>
            <Text style={homeStyles.emptyStateText}>Vous n'avez pas encore de groupes. Créez votre premier groupe pour commencer à épargner avec vos amis.</Text>
            <TouchableOpacity style={homeStyles.addButton}>
              <Plus size={20} color="#FF8C00" />
              <Text style={homeStyles.addButtonText}>Créer un groupe</Text>
            </TouchableOpacity>
          </Animatable.View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

// Styles déplacés dans /styles/home.ts