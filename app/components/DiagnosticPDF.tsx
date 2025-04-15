import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer'

const styles = StyleSheet.create({
  page: {
    padding: 40,
    backgroundColor: '#ffffff'
  },
  header: {
    marginBottom: 30,
    borderBottom: '1pt solid #e2e8f0',
    paddingBottom: 20
  },
  title: {
    fontSize: 24,
    color: '#1e293b',
    marginBottom: 10
  },
  companyInfo: {
    fontSize: 14,
    color: '#64748b',
    marginBottom: 20
  },
  section: {
    marginBottom: 20,
    padding: 10
  },
  sectionTitle: {
    fontSize: 18,
    color: '#334155',
    marginBottom: 15,
    paddingBottom: 5,
    borderBottom: '1pt solid #e2e8f0'
  },
  universeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
    padding: 8,
    backgroundColor: '#f8fafc'
  },
  universeName: {
    fontSize: 14,
    color: '#475569'
  },
  score: {
    fontSize: 14,
    color: '#1e293b'
  },
  level: {
    fontSize: 12,
    color: '#64748b'
  },
  barChart: {
    marginTop: 15
  },
  barGroup: {
    marginBottom: 12
  },
  barContainer: {
    flexDirection: 'row',
    height: 8,
    backgroundColor: '#f1f5f9',
    marginTop: 4,
    borderRadius: 4,
    overflow: 'hidden'
  },
  bar: {
    height: '100%'
  },
  profileInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4
  },
  footer: {
    position: 'absolute',
    bottom: 40,
    left: 40,
    right: 40,
    textAlign: 'center',
    color: '#94a3b8',
    fontSize: 10,
    borderTop: '1pt solid #e2e8f0',
    paddingTop: 10
  }
})

const PROFILE_COLORS = {
  'Leaders': '#FF6B6B',
  'Managers': '#4ECDC4',
  'Équipes Spécialisées': '#45B7D1',
  'Collaborateurs (Tous)': '#96CEB4'
}

interface DiagnosticPDFProps {
  companyInfo: {
    name: string
    size: string
    sector: string
  }
  globalProfile: Array<{
    universe: string
    score: number
    level: string
  }>
  results: Array<{
    universe: string
    scores: {
      [profile: string]: {
        level: string
        score: number
      }
    }
  }>
}

export function DiagnosticPDF({ companyInfo, globalProfile, results }: DiagnosticPDFProps) {
  const formatDate = () => {
    return new Date().toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <Text style={styles.title}>Diagnostic des compétences digitales</Text>
          <Text style={styles.companyInfo}>
            {companyInfo.name} • {companyInfo.size} • {companyInfo.sector}
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Vue d'ensemble par univers</Text>
          {results.map((result) => (
            <View key={result.universe} style={styles.barGroup}>
              <Text style={styles.universeName}>{result.universe}</Text>
              {Object.entries(result.scores).map(([profile, data]) => (
                <View key={profile}>
                  <View style={styles.profileInfo}>
                    <Text style={styles.level}>{profile}</Text>
                    <Text style={styles.score}>{data.score}%</Text>
                  </View>
                  <View style={styles.barContainer}>
                    <View 
                      style={[
                        styles.bar,
                        { 
                          backgroundColor: PROFILE_COLORS[profile as keyof typeof PROFILE_COLORS],
                          width: `${data.score}%`
                        }
                      ]} 
                    />
                  </View>
                </View>
              ))}
            </View>
          ))}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Profil général de l'entreprise</Text>
          {globalProfile.map((item) => (
            <View key={item.universe} style={styles.universeRow}>
              <View>
                <Text style={styles.universeName}>{item.universe}</Text>
                <Text style={styles.level}>{item.level}</Text>
              </View>
              <Text style={styles.score}>{item.score}%</Text>
            </View>
          ))}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Résultats détaillés par profil</Text>
          {results.map((result) => (
            <View key={result.universe} style={[styles.universeRow, { flexDirection: 'column', alignItems: 'flex-start' }]}>
              <Text style={styles.universeName}>{result.universe}</Text>
              {Object.entries(result.scores).map(([profile, data]) => (
                <View key={profile} style={{ marginTop: 5, flexDirection: 'row', justifyContent: 'space-between', width: '100%' }}>
                  <Text style={styles.level}>{profile}</Text>
                  <Text style={styles.score}>{data.score}% - {data.level}</Text>
                </View>
              ))}
            </View>
          ))}
        </View>

        <Text style={styles.footer}>
          Rapport généré automatiquement par Digitancy • {formatDate()}
        </Text>
      </Page>
    </Document>
  )
} 