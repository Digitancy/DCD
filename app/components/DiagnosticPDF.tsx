'use client'

import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer'

interface DiagnosticPDFProps {
  companyInfo: {
    name: string;
    email: string;
    size: string;
    sector: string;
  };
  globalProfiles: {
    name: string;
    score: number;
    levelDistribution: Record<string, number>;
    scores: {
      [profile: string]: {
        level: string;
        score: number;
      }
    }
  }[];
  results: {
    universe: string;
    scores: {
      [profile: string]: {
        level: string;
        score: number;
      }
    }
  }[];
}

interface Gap {
  universe: string;
  highestProfile: string;
  lowestProfile: string;
  gap: number;
  description: string;
}

interface StrengthOrWeakness {
  name: string;
  score: number;
  description: string;
}

const styles = StyleSheet.create({
  page: {
    padding: 40,
    backgroundColor: '#ffffff',
  },
  header: {
    marginBottom: 30,
    borderBottom: '2 solid #e5e7eb',
    paddingBottom: 20,
  },
  headerContent: {
    flexDirection: 'row' as const,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#004C5F',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: '#444444',
    marginBottom: 20,
  },
  companyInfo: {
    marginBottom: 20,
    padding: 15,
    backgroundColor: '#f9fafb',
    borderRadius: 8,
    border: '1 solid #e5e7eb',
  },
  companyInfoTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#004C5F',
    marginBottom: 10,
  },
  companyInfoGrid: {
    flexDirection: 'row' as const,
    flexWrap: 'wrap' as const,
    gap: 10,
  },
  companyInfoItem: {
    width: '48%',
    padding: 10,
    backgroundColor: '#ffffff',
    borderRadius: 6,
    marginBottom: 10,
    border: '1 solid #e5e7eb',
  },
  companyInfoLabel: {
    fontSize: 12,
    color: '#6b7280',
    marginBottom: 4,
  },
  companyInfoValue: {
    fontSize: 14,
    color: '#1a1a1a',
    fontWeight: 'bold',
  },
  section: {
    marginBottom: 25,
    padding: 15,
    backgroundColor: '#ffffff',
    borderRadius: 8,
    border: '1 solid #e5e7eb',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#004C5F',
    marginBottom: 15,
    borderBottom: '1 solid #e5e7eb',
    paddingBottom: 5,
  },
  scoreContainer: {
    flexDirection: 'row' as const,
    alignItems: 'center',
    marginBottom: 15,
    padding: 10,
    backgroundColor: '#f9fafb',
    borderRadius: 6,
  },
  scoreLabel: {
    width: '30%',
    fontSize: 14,
    color: '#444444',
    fontWeight: 'bold',
  },
  scoreBar: {
    width: '60%',
    height: 20,
    backgroundColor: '#e5e7eb',
    borderRadius: 10,
    overflow: 'hidden',
  },
  scoreFill: {
    height: '100%',
    backgroundColor: '#00A3C6',
  },
  scoreValue: {
    width: '10%',
    fontSize: 14,
    color: '#1a1a1a',
    textAlign: 'right' as const,
    fontWeight: 'bold',
  },
  universeRow: {
    flexDirection: 'row' as const,
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
    padding: 10,
    backgroundColor: '#f9fafb',
    borderRadius: 6,
    border: '1 solid #e5e7eb',
  },
  universeName: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#004C5F',
  },
  levelText: {
    fontSize: 12,
    color: '#6b7280',
    marginTop: 4,
  },
  scoreText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#00A3C6',
  },
  footer: {
    position: 'absolute' as const,
    bottom: 40,
    left: 40,
    right: 40,
    textAlign: 'center' as const,
    fontSize: 10,
    color: '#9ca3af',
  },
  summary: {
    marginBottom: 20,
    padding: 15,
    backgroundColor: '#f0f9ff',
    borderRadius: 8,
    border: '1 solid #bae6fd',
  },
  summaryTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#004C5F',
    marginBottom: 10,
  },
  summaryText: {
    fontSize: 14,
    color: '#444444',
    lineHeight: 1.5,
  },
  recommendations: {
    marginTop: 20,
  },
  recommendationItem: {
    marginBottom: 10,
    padding: 10,
    backgroundColor: '#f0fdf4',
    borderRadius: 6,
    border: '1 solid #bbf7d0',
  },
  recommendationTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#004C5F',
    marginBottom: 5,
  },
  recommendationText: {
    fontSize: 12,
    color: '#444444',
    lineHeight: 1.4,
  },
  levelDistribution: {
    marginTop: 10,
    padding: 10,
    backgroundColor: '#f8fafc',
    borderRadius: 6,
  },
  levelItem: {
    flexDirection: 'row' as const,
    justifyContent: 'space-between',
    marginBottom: 5,
  },
  levelLabel: {
    fontSize: 12,
    color: '#64748b',
  },
  levelValue: {
    fontSize: 12,
    color: '#1e293b',
    fontWeight: 'bold',
  },
  explanationBox: {
    marginTop: 10,
    padding: 10,
    backgroundColor: '#f0f9ff',
    borderRadius: 6,
    border: '1 solid #bae6fd',
  },
  explanationText: {
    fontSize: 12,
    color: '#444444',
    lineHeight: 1.4,
    fontStyle: 'italic',
  },
  legend: {
    marginTop: 15,
    padding: 10,
    backgroundColor: '#f8fafc',
    borderRadius: 6,
    border: '1 solid #e5e7eb',
  },
  legendTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#004C5F',
    marginBottom: 10,
  },
  legendItem: {
    flexDirection: 'row' as const,
    alignItems: 'center',
    marginBottom: 5,
  },
  legendColor: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 8,
  },
  legendText: {
    fontSize: 12,
    color: '#444444',
  },
  targetInfo: {
    marginTop: 5,
    fontSize: 10,
    color: '#6b7280',
    fontStyle: 'italic',
  },
  profileSection: {
    marginBottom: 15,
    padding: 10,
    backgroundColor: '#f9fafb',
    borderRadius: 6,
    border: '1 solid #e5e7eb',
  },
  profileHeader: {
    flexDirection: 'row' as const,
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  profileName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#004C5F',
  },
  profileScore: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#00A3C6',
  },
  profileDescription: {
    fontSize: 12,
    color: '#444444',
    marginBottom: 10,
    lineHeight: 1.4,
  },
  universeSection: {
    marginBottom: 15,
    padding: 10,
    backgroundColor: '#f9fafb',
    borderRadius: 6,
    border: '1 solid #e5e7eb',
  },
  universeHeader: {
    flexDirection: 'row' as const,
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  universeTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#004C5F',
  },
  universeScore: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#00A3C6',
  },
  universeDescription: {
    fontSize: 12,
    color: '#444444',
    marginBottom: 10,
    lineHeight: 1.4,
  },
  profileScores: {
    marginTop: 10,
  },
  profileScoreRow: {
    flexDirection: 'row' as const,
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 5,
  },
  profileScoreLabel: {
    fontSize: 12,
    color: '#444444',
    width: '40%',
  },
  profileScoreBar: {
    width: '50%',
    height: 8,
    backgroundColor: '#e5e7eb',
    borderRadius: 4,
    overflow: 'hidden',
  },
  profileScoreValue: {
    fontSize: 12,
    color: '#444444',
    width: '10%',
    textAlign: 'right' as const,
  },
  profileScoreFill: {
    height: '100%',
    backgroundColor: '#00A3C6',
  },
  profileColor: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 8,
  },
  profileColorLeaders: {
    backgroundColor: '#FF6B6B',
  },
  profileColorManagers: {
    backgroundColor: '#4ECDC4',
  },
  profileColorSpecialists: {
    backgroundColor: '#45B7D1',
  },
  profileColorCollaborators: {
    backgroundColor: '#96CEB4',
  },
  gapSection: {
    marginBottom: 10,
    padding: 10,
    backgroundColor: '#f0f9ff',
    borderRadius: 6,
    border: '1 solid #bae6fd',
  },
  gapTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#004C5F',
    marginBottom: 5,
  },
  gapDescription: {
    fontSize: 12,
    color: '#444444',
    lineHeight: 1.4,
  },
  gapDetails: {
    marginTop: 5,
  },
  gapDetail: {
    fontSize: 12,
    color: '#444444',
    marginBottom: 2,
  },
  noGapsText: {
    fontSize: 12,
    color: '#444444',
    textAlign: 'center' as const,
  },
  strengthItem: {
    marginBottom: 10,
    padding: 10,
    backgroundColor: '#f0fdf4',
    borderRadius: 6,
    border: '1 solid #bbf7d0',
  },
  strengthTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#004C5F',
    marginBottom: 5,
  },
  strengthDescription: {
    fontSize: 12,
    color: '#444444',
    lineHeight: 1.4,
  },
  noStrengthsText: {
    fontSize: 12,
    color: '#444444',
    textAlign: 'center' as const,
  },
  weaknessItem: {
    marginBottom: 10,
    padding: 10,
    backgroundColor: '#f0fdf4',
    borderRadius: 6,
    border: '1 solid #bbf7d0',
  },
  weaknessTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#004C5F',
    marginBottom: 5,
  },
  weaknessDescription: {
    fontSize: 12,
    color: '#444444',
    lineHeight: 1.4,
  },
  noWeaknessesText: {
    fontSize: 12,
    color: '#444444',
    textAlign: 'center' as const,
  },
})

export function DiagnosticPDF({ companyInfo, globalProfiles, results }: DiagnosticPDFProps) {
  const formatDate = (date: Date) => {
    return date.toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return '#22c55e';
    if (score >= 60) return '#00A3C6';
    if (score >= 40) return '#f59e0b';
    return '#ef4444';
  };

  const getProfileColor = (profileName: string) => {
    switch (profileName) {
      case 'Leaders':
        return '#FF6B6B';
      case 'Managers':
        return '#4ECDC4';
      case 'Équipes Spécialisées':
        return '#45B7D1';
      case 'Collaborateurs (Tous)':
        return '#96CEB4';
      default:
        return '#00A3C6';
    }
  };

  const getLevelDescription = (level: string) => {
    switch (level) {
      case 'Débutant':
        return 'Niveau initial - Connaissances de base';
      case 'Intermédiaire':
        return 'Niveau fonctionnel - Capacité à utiliser les outils';
      case 'Avancé':
        return 'Niveau opérationnel - Maîtrise des concepts et outils';
      case 'Expert':
        return 'Niveau stratégique - Leadership et innovation';
      default:
        return '';
    }
  };

  const generateRecommendations = (profile: any) => {
    const recommendations = [];
    if (profile.score < 60) {
      recommendations.push({
        title: 'Formation et développement',
        text: `Renforcer les compétences en ${profile.name.toLowerCase()} à travers des programmes de formation ciblés.`
      });
    }
    if (profile.score < 40) {
      recommendations.push({
        title: 'Accompagnement externe',
        text: `Envisager un accompagnement externe pour accélérer la transformation digitale dans le domaine ${profile.name.toLowerCase()}.`
      });
    }
    return recommendations;
  };

  const getUniverseDescription = (universe: string) => {
    switch (universe) {
      case 'Transformation Digitale':
        return 'Capacité à piloter et accompagner la transformation digitale de l\'organisation';
      case 'Agilité':
        return 'Capacité à s\'adapter rapidement aux changements et à innover en continu';
      case 'Innovation':
        return 'Capacité à générer et implémenter des idées nouvelles et créatives';
      case 'Expérience Client':
        return 'Capacité à comprendre et améliorer l\'expérience client à travers le digital';
      case 'Technologie':
        return 'Capacité à comprendre et utiliser les technologies digitales pertinentes';
      case 'Data':
        return 'Capacité à collecter, analyser et exploiter les données pour la prise de décision';
      default:
        return '';
    }
  };

  // Fonction pour analyser les écarts entre les profils
  const analyzeProfileGaps = (): Gap[] => {
    const gaps: Gap[] = [];
    
    // Analyser les écarts par univers
    results.forEach(result => {
      const scores = Object.entries(result.scores);
      if (scores.length > 1) {
        // Trouver le score le plus élevé et le plus bas
        const sortedScores = [...scores].sort((a, b) => b[1].score - a[1].score);
        const highestScore = sortedScores[0];
        const lowestScore = sortedScores[sortedScores.length - 1];
        
        const gap = highestScore[1].score - lowestScore[1].score;
        if (gap > 20) { // Seuil significatif d'écart
          gaps.push({
            universe: result.universe,
            highestProfile: highestScore[0],
            lowestProfile: lowestScore[0],
            gap: gap,
            description: `Dans l'univers "${result.universe}", il existe un écart significatif de ${Math.round(gap)}% entre le profil ${highestScore[0]} (${highestScore[1].score}%) et le profil ${lowestScore[0]} (${lowestScore[1].score}%).`
          });
        }
      }
    });
    
    return gaps;
  };

  // Fonction pour identifier les points forts et les points à améliorer
  const analyzeStrengthsAndWeaknesses = (): { strengths: StrengthOrWeakness[], weaknesses: StrengthOrWeakness[] } => {
    const strengths: StrengthOrWeakness[] = [];
    const weaknesses: StrengthOrWeakness[] = [];
    
    // Analyser les univers
    results.forEach(result => {
      const averageScore = Math.round(Object.values(result.scores).reduce((sum, s) => sum + s.score, 0) / Object.keys(result.scores).length);
      
      if (averageScore >= 70) {
        strengths.push({
          name: result.universe,
          score: averageScore,
          description: `L'univers "${result.universe}" présente un niveau de maturité élevé avec un score moyen de ${averageScore}%.`
        });
      } else if (averageScore <= 40) {
        // Identifier les profils avec les scores les plus bas dans cet univers
        const lowScores = Object.entries(result.scores)
          .filter(([_, score]) => score.score <= 40)
          .map(([profile, score]) => `${profile} (${score.score}%)`);
        
        weaknesses.push({
          name: result.universe,
          score: averageScore,
          description: `L'univers "${result.universe}" nécessite une attention particulière avec un score moyen de ${averageScore}%. ${lowScores.length > 0 ? `Profils concernés : ${lowScores.join(', ')}.` : ''}`
        });
      }
    });
    
    // Si aucun point faible n'est identifié, prendre les 3 univers avec les scores les plus bas
    if (weaknesses.length === 0) {
      const universeScores = results.map(result => ({
        name: result.universe,
        score: Math.round(Object.values(result.scores).reduce((sum, s) => sum + s.score, 0) / Object.keys(result.scores).length),
        lowScores: Object.entries(result.scores)
          .filter(([_, score]) => score.score <= 50)
          .map(([profile, score]) => `${profile} (${score.score}%)`)
      }));
      
      // Trier par score croissant et prendre les 3 premiers
      const lowestUniverses = [...universeScores]
        .sort((a, b) => a.score - b.score)
        .slice(0, 3);
      
      lowestUniverses.forEach(universe => {
        weaknesses.push({
          name: universe.name,
          score: universe.score,
          description: `L'univers "${universe.name}" présente un score de ${universe.score}%. ${universe.lowScores.length > 0 ? `Profils concernés : ${universe.lowScores.join(', ')}.` : ''}`
        });
      });
    }
    
    // Limiter à 6 univers maximum pour les points à améliorer
    if (weaknesses.length > 6) {
      weaknesses.splice(6);
    }
    
    // Limiter à 6 univers maximum pour les points forts
    if (strengths.length > 6) {
      strengths.splice(6);
    }
    
    // Si aucun point fort n'est identifié, prendre l'univers avec le score le plus élevé
    if (strengths.length === 0 && results.length > 0) {
      const highestUniverse = results.reduce((highest, current) => {
        const currentScore = Math.round(Object.values(current.scores).reduce((sum, s) => sum + s.score, 0) / Object.keys(current.scores).length);
        const highestScore = Math.round(Object.values(highest.scores).reduce((sum, s) => sum + s.score, 0) / Object.keys(highest.scores).length);
        return currentScore > highestScore ? current : highest;
      }, results[0]);
      
      const highestScore = Math.round(Object.values(highestUniverse.scores).reduce((sum, s) => sum + s.score, 0) / Object.keys(highestUniverse.scores).length);
      
      strengths.push({
        name: highestUniverse.universe,
        score: highestScore,
        description: `L'univers "${highestUniverse.universe}" présente le meilleur score avec ${highestScore}%.`
      });
    }
    
    return { strengths, weaknesses };
  };

  const profileGaps = analyzeProfileGaps();
  const { strengths, weaknesses } = analyzeStrengthsAndWeaknesses();

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <View style={styles.headerContent}>
            <Text style={styles.title}>Diagnostic Digital</Text>
          </View>
          <Text style={styles.subtitle}>Rapport détaillé des compétences</Text>
        </View>

        <View style={styles.summary}>
          <Text style={styles.summaryTitle}>Résumé Exécutif</Text>
          <Text style={styles.summaryText}>
            Ce diagnostic digital a été réalisé pour {companyInfo.name} le {formatDate(new Date())}. 
            L'analyse couvre {results.length} univers digitaux et {globalProfiles.length} profils de compétences. 
            Le score global moyen est de {Math.round(globalProfiles.reduce((sum, p) => sum + p.score, 0) / globalProfiles.length)}%.
          </Text>
        </View>

        <View style={styles.companyInfo}>
          <Text style={styles.companyInfoTitle}>Informations de l'entreprise</Text>
          <View style={styles.companyInfoGrid}>
            <View style={styles.companyInfoItem}>
              <Text style={styles.companyInfoLabel}>Nom</Text>
              <Text style={styles.companyInfoValue}>{companyInfo.name}</Text>
            </View>
            <View style={styles.companyInfoItem}>
              <Text style={styles.companyInfoLabel}>Email</Text>
              <Text style={styles.companyInfoValue}>{companyInfo.email}</Text>
            </View>
            <View style={styles.companyInfoItem}>
              <Text style={styles.companyInfoLabel}>Taille</Text>
              <Text style={styles.companyInfoValue}>{companyInfo.size}</Text>
            </View>
            <View style={styles.companyInfoItem}>
              <Text style={styles.companyInfoLabel}>Secteur</Text>
              <Text style={styles.companyInfoValue}>{companyInfo.sector}</Text>
            </View>
            <View style={styles.companyInfoItem}>
              <Text style={styles.companyInfoLabel}>Date du diagnostic</Text>
              <Text style={styles.companyInfoValue}>{formatDate(new Date())}</Text>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Résultats par univers</Text>
          {results.map((result, index) => {
            const averageScore = Math.round(Object.values(result.scores).reduce((sum, s) => sum + s.score, 0) / Object.keys(result.scores).length);
            return (
              <View key={index} style={styles.universeSection}>
                <View style={styles.universeHeader}>
                  <Text style={styles.universeTitle}>{result.universe}</Text>
                  <Text style={[styles.universeScore, { color: getScoreColor(averageScore) }]}>
                    {averageScore}%
                  </Text>
                </View>
                <Text style={styles.universeDescription}>
                  {getUniverseDescription(result.universe)}
                </Text>
                <View style={styles.profileScores}>
                  {Object.entries(result.scores).map(([profile, score], i) => (
                    <View key={i} style={styles.profileScoreRow}>
                      <Text style={styles.profileScoreLabel}>{profile}</Text>
                      <View style={styles.profileScoreBar}>
                        <View 
                          style={[
                            styles.profileScoreFill,
                            { 
                              width: `${score.score}%`,
                              backgroundColor: getProfileColor(profile)
                            }
                          ]} 
                        />
                      </View>
                      <Text style={styles.profileScoreValue}>{score.score}%</Text>
                    </View>
                  ))}
                </View>
                <View style={styles.explanationBox}>
                  <Text style={styles.explanationText}>
                    Score d'évaluation : {averageScore}% - Niveau : {averageScore >= 80 ? 'Expert' : averageScore >= 60 ? 'Avancé' : averageScore >= 40 ? 'Intermédiaire' : 'Débutant'}
                  </Text>
                </View>
              </View>
            );
          })}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Analyse des écarts entre les profils</Text>
          {profileGaps.length > 0 ? (
            profileGaps.map((gap, index) => (
              <View key={index} style={styles.gapSection}>
                <Text style={styles.gapTitle}>Écart dans l'univers : {gap.universe}</Text>
                <Text style={styles.gapDescription}>{gap.description}</Text>
                <View style={styles.gapDetails}>
                  <Text style={styles.gapDetail}>• Profil le plus performant : {gap.highestProfile}</Text>
                  <Text style={styles.gapDetail}>• Profil nécessitant le plus d'attention : {gap.lowestProfile}</Text>
                  <Text style={styles.gapDetail}>• Écart : {Math.round(gap.gap)}%</Text>
                </View>
              </View>
            ))
          ) : (
            <Text style={styles.noGapsText}>Aucun écart significatif n'a été identifié entre les profils dans les différents univers.</Text>
          )}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Points forts</Text>
          {strengths.length > 0 ? (
            strengths.map((strength, index) => (
              <View key={index} style={styles.strengthItem}>
                <Text style={styles.strengthTitle}>{strength.name} ({strength.score}%)</Text>
                <Text style={styles.strengthDescription}>{strength.description}</Text>
              </View>
            ))
          ) : (
            <Text style={styles.noStrengthsText}>Aucun point fort significatif n'a été identifié dans ce diagnostic.</Text>
          )}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Points à améliorer</Text>
          {weaknesses.length > 0 ? (
            weaknesses.map((weakness, index) => (
              <View key={index} style={styles.weaknessItem}>
                <Text style={styles.weaknessTitle}>{weakness.name} ({weakness.score}%)</Text>
                <Text style={styles.weaknessDescription}>{weakness.description}</Text>
              </View>
            ))
          ) : (
            <Text style={styles.noWeaknessesText}>Aucun point faible significatif n'a été identifié dans ce diagnostic.</Text>
          )}
        </View>

        <Text style={styles.footer}>
          Rapport généré automatiquement par Digitancy • {formatDate(new Date())}
        </Text>
      </Page>
    </Document>
  );
} 