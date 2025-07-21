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
    marginRight: 8,
    flex: 1,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  statusText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },
  description: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 6,
    lineHeight: 20,
  },
  info: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  infoText: {
    marginLeft: 6,
    fontSize: 14,
    color: '#4B5563',
    fontWeight: '500',
  },
  progress: {
    marginBottom: 12,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  progressText: {
    fontSize: 14,
    color: '#4B5563',
  },
  progressPercent: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  progressBar: {
    height: 8,
    backgroundColor: '#E5E7EB',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#FF8C00',
    borderRadius: 4,
  },
  cardFooter: {
    alignItems: 'flex-end',
    paddingTop: 8,
  },
});