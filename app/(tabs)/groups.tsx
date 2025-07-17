import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { useState, useEffect } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { TontineGroup } from '@/types';
import { tontineService } from '@/services/tontine';
import { GroupCard } from '@/components/GroupCard';
import { CreateGroupModal } from '@/components/CreateGroupModal';
import { Plus, Search, Filter } from 'lucide-react-native';

export default function GroupsScreen() {
  const [groups, setGroups] = useState<TontineGroup[]>([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadGroups();
  }, []);

  const loadGroups = async () => {
    try {
      const userGroups = await tontineService.getGroups();
      setGroups(userGroups);
    } catch (error) {
      console.error('Erreur lors du chargement des groupes:', error);
      Alert.alert('Erreur', 'Impossible de charger les groupes');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateGroup = async (groupData: any) => {
    try {
      const newGroup = await tontineService.createGroup(groupData);
      setGroups([...groups, newGroup]);
      setShowCreateModal(false);
      Alert.alert('Succès', 'Groupe créé avec succès');
    } catch (error) {
      console.error('Erreur lors de la création du groupe:', error);
      Alert.alert('Erreur', 'Impossible de créer le groupe');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return '#228B22';
      case 'completed': return '#6B7280';
      case 'paused': return '#FF8C00';
      default: return '#6B7280';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'active': return 'Actif';
      case 'completed': return 'Terminé';
      case 'paused': return 'En pause';
      default: return 'Inconnu';
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Mes Groupes</Text>
        <View style={styles.headerActions}>
          <TouchableOpacity style={styles.iconButton}>
            <Search size={20} color="#6B7280" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconButton}>
            <Filter size={20} color="#6B7280" />
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.createButton}
            onPress={() => setShowCreateModal(true)}
          >
            <Plus size={20} color="#FFFFFF" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Statistics */}
      <View style={styles.statsContainer}>
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>{groups.length}</Text>
          <Text style={styles.statLabel}>Total</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>{groups.filter(g => g.status === 'active').length}</Text>
          <Text style={styles.statLabel}>Actifs</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>{groups.filter(g => g.status === 'completed').length}</Text>
          <Text style={styles.statLabel}>Terminés</Text>
        </View>
      </View>

      {/* Groups List */}
      <ScrollView style={styles.groupsList}>
        {loading ? (
          <View style={styles.loadingContainer}>
            <Text style={styles.loadingText}>Chargement...</Text>
          </View>
        ) : groups.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyIcon}>👥</Text>
            <Text style={styles.emptyTitle}>Aucun groupe</Text>
            <Text style={styles.emptySubtitle}>Créez votre premier groupe de tontine</Text>
            <TouchableOpacity 
              style={styles.emptyButton}
              onPress={() => setShowCreateModal(true)}
            >
              <Plus size={20} color="#FFFFFF" />
              <Text style={styles.emptyButtonText}>Créer un groupe</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.groupsContainer}>
            {groups.map((group) => (
              <GroupCard key={group.id} group={group} />
            ))}
          </View>
        )}
      </ScrollView>

      {/* Create Group Modal */}
      <CreateGroupModal
        visible={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onSubmit={handleCreateGroup}
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
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  iconButton: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: '#F3F4F6',
  },
  createButton: {
    backgroundColor: '#FF8C00',
    padding: 8,
    borderRadius: 8,
  },
  statsContainer: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  statLabel: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 4,
  },
  groupsList: {
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
    marginBottom: 24,
  },
  emptyButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FF8C00',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
    gap: 8,
  },
  emptyButtonText: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 16,
  },
  groupsContainer: {
    padding: 20,
    gap: 12,
  },
});