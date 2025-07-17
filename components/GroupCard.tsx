import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { TontineGroup } from '@/types';
import { Users, Clock, DollarSign } from 'lucide-react-native';

interface GroupCardProps {
  group: TontineGroup;
}

export function GroupCard({ group }: GroupCardProps) {
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

  const getFrequencyText = (frequency: string) => {
    switch (frequency) {
      case 'weekly': return 'Hebdomadaire';
      case 'monthly': return 'Mensuel';
      case 'biweekly': return 'Bi-hebdomadaire';
      default: return frequency;
    }
  };

  const formatCurrency = (amount: number) => {
    return `${amount.toLocaleString()} CDF`;
  };

  const progress = (group.currentRound / group.totalRounds) * 100;

  return (
    <TouchableOpacity style={styles.container}>
      <View style={styles.header}>
        <View style={styles.titleContainer}>
          <Text style={styles.name}>{group.name}</Text>
          <View style={[styles.statusBadge, { backgroundColor: getStatusColor(group.status) }]}>
            <Text style={styles.statusText}>{getStatusText(group.status)}</Text>
          </View>
        </View>
        <Text style={styles.description}>{group.description}</Text>
      </View>

      <View style={styles.info}>
        <View style={styles.infoItem}>
          <DollarSign size={16} color="#6B7280" />
          <Text style={styles.infoText}>{formatCurrency(group.amount)}</Text>
        </View>
        <View style={styles.infoItem}>
          <Clock size={16} color="#6B7280" />
          <Text style={styles.infoText}>{getFrequencyText(group.frequency)}</Text>
        </View>
        <View style={styles.infoItem}>
          <Users size={16} color="#6B7280" />
          <Text style={styles.infoText}>{group.members.length} membres</Text>
        </View>
      </View>

      <View style={styles.progress}>
        <View style={styles.progressHeader}>
          <Text style={styles.progressText}>
            Tour {group.currentRound} sur {group.totalRounds}
          </Text>
          <Text style={styles.progressPercent}>{Math.round(progress)}%</Text>
        </View>
        <View style={styles.progressBar}>
          <View style={[styles.progressFill, { width: `${progress}%` }]} />
        </View>
      </View>
    </TouchableOpacity>
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
    marginBottom: 12,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  name: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1F2937',
    flex: 1,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 12,
    color: '#FFFFFF',
    fontWeight: '600',
  },
  description: {
    fontSize: 14,
    color: '#6B7280',
  },
  info: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  infoText: {
    fontSize: 12,
    color: '#6B7280',
    marginLeft: 4,
  },
  progress: {
    marginTop: 8,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  progressText: {
    fontSize: 14,
    color: '#374151',
    fontWeight: '500',
  },
  progressPercent: {
    fontSize: 14,
    color: '#FF8C00',
    fontWeight: '600',
  },
  progressBar: {
    height: 6,
    backgroundColor: '#E5E7EB',
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#FF8C00',
    borderRadius: 3,
  },
});