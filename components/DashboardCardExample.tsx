import React from 'react';
import { View, StyleSheet } from 'react-native';
import { DashboardCard } from './DashboardCard';

export function DashboardCardExample() {
  return (
    <View style={styles.container}>
      {/* Épargne totale */}
      <DashboardCard
        title="Épargne totale"
        value="50 000 CDF"
        icon="💰" // Icône de monnaie/portefeuille
        color="#4CAF50" // Vert
        onPress={() => console.log('Épargne totale pressed')}
      />

      {/* Paiements en attente */}
      <DashboardCard
        title="Paiements en attente"
        value="1"
        icon="⏳" // Icône de sablier
        color="#FF9800" // Orange
        onPress={() => console.log('Paiements en attente pressed')}
      />

      {/* Groupes actifs */}
      <DashboardCard
        title="Groupes actifs"
        value="1"
        icon="👥" // Icône de groupe de personnes
        color="#2196F3" // Bleu
        onPress={() => console.log('Groupes actifs pressed')}
      />

      {/* Prochaine collecte */}
      <DashboardCard
        title="Prochaine collecte"
        value="Dans 5 jours"
        subtitle="" // Pas besoin de sous-titre car déjà dans la valeur
        badge="17" // Badge avec le jour
        icon="📅" // Icône de calendrier
        color="#F44336" // Rouge
        onPress={() => console.log('Prochaine collecte pressed')}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    gap: 12, // Espacement entre les cartes
  },
});