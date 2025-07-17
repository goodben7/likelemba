import { TontineGroup, TontineMember, Payment, TontineRound } from '@/types';

class TontineService {
  private groups: TontineGroup[] = [
    {
      id: '1',
      name: 'Tontine des Amis',
      description: 'Groupe d\'épargne entre amis',
      amount: 50000,
      frequency: 'monthly',
      members: [
        {
          id: '1',
          userId: 'user-1',
          name: 'Jean Mukendi',
          phone: '+243123456789',
          position: 1,
          hasReceived: false,
          joinedAt: '2024-01-01',
        },
        {
          id: '2',
          userId: 'user-2',
          name: 'Marie Tshala',
          phone: '+243987654321',
          position: 2,
          hasReceived: false,
          joinedAt: '2024-01-01',
        },
      ],
      currentRound: 1,
      totalRounds: 2,
      startDate: '2024-01-01',
      status: 'active',
      createdBy: 'user-1',
      createdAt: '2024-01-01',
    },
  ];

  async getGroups(): Promise<TontineGroup[]> {
    return this.groups;
  }

  async createGroup(groupData: Omit<TontineGroup, 'id' | 'createdAt'>): Promise<TontineGroup> {
    const newGroup: TontineGroup = {
      ...groupData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
    };
    this.groups.push(newGroup);
    return newGroup;
  }

  async addMember(groupId: string, member: Omit<TontineMember, 'id' | 'joinedAt'>): Promise<boolean> {
    const group = this.groups.find(g => g.id === groupId);
    if (!group) return false;

    const newMember: TontineMember = {
      ...member,
      id: Date.now().toString(),
      joinedAt: new Date().toISOString(),
    };

    group.members.push(newMember);
    group.totalRounds = group.members.length;
    return true;
  }

  async processPayment(payment: Omit<Payment, 'id' | 'createdAt'>): Promise<{ success: boolean; message: string }> {
    // Simulation du traitement de paiement
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({ success: true, message: 'Paiement traité avec succès' });
      }, 2000);
    });
  }

  async getPaymentStatus(groupId: string, round: number): Promise<Payment[]> {
    // Simulation des statuts de paiement
    const group = this.groups.find(g => g.id === groupId);
    if (!group) return [];

    return group.members.map(member => ({
      id: `payment-${member.id}-${round}`,
      groupId,
      userId: member.userId,
      amount: group.amount,
      round,
      status: Math.random() > 0.3 ? 'completed' : 'pending',
      paymentMethod: 'airtel',
      createdAt: new Date().toISOString(),
      paidAt: Math.random() > 0.3 ? new Date().toISOString() : undefined,
    }));
  }
}

export const tontineService = new TontineService();