export interface Question {
  universe: string
  profile: string
  question: string
  answers: {
    text: string
    level: 'Débutant' | 'Intermédiaire' | 'Avancé' | 'Expert'
  }[]
}

export const questions: Question[] = [
  {
    universe: 'Transformation Digitale',
    profile: 'Leaders',
    question: 'Quelle affirmation décrit le mieux la capacité de vos leaders à conduire la transformation digitale de l\'entreprise ?',
    answers: [
      {
        text: 'Nos leaders comprennent les opportunités digitales et inspirent la stratégie de transformation.',
        level: 'Débutant'
      },
      {
        text: 'Nos leaders initient des projets pilotes digitaux pour expérimenter de nouvelles pistes de transformation.',
        level: 'Intermédiaire'
      },
      {
        text: 'Nos leaders développent une feuille de route digitale transformationnelle alignée avec la stratégie globale.',
        level: 'Avancé'
      },
      {
        text: 'Nos leaders déploient la transformation digitale à grande échelle avec une mesurabilité claire des résultats attendus.',
        level: 'Expert'
      }
    ]
  },
  {
    universe: 'Transformation Digitale',
    profile: 'Managers',
    question: 'Quelle affirmation décrit le mieux la capacité de vos managers à faciliter la transformation digitale de l\'entreprise ?',
    answers: [
      {
        text: 'Nos managers sont familiers avec les bonnes pratiques de transformation digitale et facilitent la mise en œuvre des premières initiatives.',
        level: 'Débutant'
      },
      {
        text: 'Les managers organisent leurs équipes pour l\'implémentation des initiatives digitales, créant un environnement propice.',
        level: 'Intermédiaire'
      },
      {
        text: 'Nos managers alignent les processus numériques avec les objectifs de l\'entreprise pour encourager la collaboration transversale.',
        level: 'Avancé'
      },
      {
        text: 'Les managers gèrent le déploiement à grande échelle des initiatives digitales, en assurant cohérence et alignement entre les départements.',
        level: 'Expert'
      }
    ]
  },
  {
    universe: 'Transformation Digitale',
    profile: 'Équipes Spécialisées',
    question: 'Quelle affirmation décrit le mieux la capacité de vos équipes spécialisées à appliquer la transformation digitale dans l\'organisation ?',
    answers: [
      {
        text: 'Nos équipes adoptent des outils digitaux pour renforcer la collaboration et la gestion de projets.',
        level: 'Débutant'
      },
      {
        text: 'Les équipes savent prototyper et expérimenter des projets pilotes de transformation digitale.',
        level: 'Intermédiaire'
      },
      {
        text: 'Nos équipes spécialisées automatisent les processus numériques et les optimisent continuellement.',
        level: 'Avancé'
      },
      {
        text: 'Nos équipes déploient des solutions numériques avancées, en collaborant avec d\'autres départements pour étendre l\'automatisation.',
        level: 'Expert'
      }
    ]
  },
  {
    universe: 'Transformation Digitale',
    profile: 'Collaborateurs (Tous)',
    question: 'Quelle affirmation décrit le mieux la capacité de vos collaborateurs à intégrer les pratiques de transformation digitale dans leur travail quotidien ?',
    answers: [
      {
        text: 'Nos collaborateurs sont sensibilisés à l\'importance de la transformation digitale pour l\'avenir de l\'entreprise.',
        level: 'Débutant'
      },
      {
        text: 'Les collaborateurs utilisent des outils digitaux pour collaborer sur les projets.',
        level: 'Intermédiaire'
      },
      {
        text: 'Nos collaborateurs contribuent activement à l\'optimisation des processus numériques internes.',
        level: 'Avancé'
      },
      {
        text: 'Les collaborateurs participent à l\'amélioration continue des initiatives de transformation digitale en proposant des idées.',
        level: 'Expert'
      }
    ]
  },
  {
    universe: 'Agilité',
    profile: 'Leaders',
    question: 'Quelle affirmation décrit le mieux la capacité de vos leaders à intégrer l\'agilité dans la stratégie de transformation de l\'entreprise ?',
    answers: [
      {
        text: 'Nos leaders comprennent les principes de l\'agilité et leur utilité dans la stratégie de transformation.',
        level: 'Débutant'
      },
      {
        text: 'Les leaders pilotent des initiatives agiles et adoptent un leadership favorable à l\'agilité.',
        level: 'Intermédiaire'
      },
      {
        text: 'Nos leaders développent une stratégie agile globale pour intégrer la culture agile.',
        level: 'Avancé'
      },
      {
        text: 'Les leaders déploient des pratiques agiles à grande échelle pour maximiser l\'efficacité organisationnelle.',
        level: 'Expert'
      }
    ]
  },
  {
    universe: 'Agilité',
    profile: 'Managers',
    question: 'Quelle affirmation décrit le mieux la capacité de vos managers à coordonner les pratiques agiles au sein de l\'organisation ?',
    answers: [
      {
        text: 'Nos managers sont initiés aux pratiques agiles avec une bonne compréhension des concepts clés.',
        level: 'Débutant'
      },
      {
        text: 'Les managers organisent leurs équipes pour appliquer les pratiques agiles sur les projets.',
        level: 'Intermédiaire'
      },
      {
        text: 'Nos managers optimisent les processus agiles pour garantir une transition réussie en interne.',
        level: 'Avancé'
      },
      {
        text: 'Les managers coordonnent des initiatives agiles multi-équipes, en assurant la cohérence entre les départements.',
        level: 'Expert'
      }
    ]
  },
  {
    universe: 'Agilité',
    profile: 'Équipes Spécialisées',
    question: 'Quelle affirmation décrit le mieux la capacité de vos équipes spécialisées à appliquer les méthodes agiles dans leurs projets ?',
    answers: [
      {
        text: 'Nos équipes connaissent les pratiques agiles et utilisent des frameworks comme Scrum ou Kanban.',
        level: 'Débutant'
      },
      {
        text: 'Nos équipes appliquent les méthodes agiles dans leurs projets quotidiens.',
        level: 'Intermédiaire'
      },
      {
        text: 'Nos équipes spécialisées optimisent les processus agiles grâce à des techniques d\'automatisation.',
        level: 'Avancé'
      },
      {
        text: 'Nos équipes déploient des pratiques agiles standardisées à grande échelle, en collaboration avec d\'autres équipes.',
        level: 'Expert'
      }
    ]
  },
  {
    universe: 'Agilité',
    profile: 'Collaborateurs (Tous)',
    question: 'Quelle affirmation décrit le mieux la capacité de vos collaborateurs à adopter les pratiques agiles dans leur quotidien ?',
    answers: [
      {
        text: 'Nos collaborateurs comprennent les principes de base de l\'agilité et leur impact sur l\'entreprise.',
        level: 'Débutant'
      },
      {
        text: 'Les collaborateurs participent à des projets agiles en collaborant avec des équipes spécialisées.',
        level: 'Intermédiaire'
      },
      {
        text: 'Nos collaborateurs adoptent les pratiques agiles, participant activement aux rituels agiles.',
        level: 'Avancé'
      },
      {
        text: 'Les collaborateurs soutiennent la transformation agile de l\'entreprise en contribuant à l\'amélioration continue.',
        level: 'Expert'
      }
    ]
  },
  {
    universe: 'Innovation',
    profile: 'Leaders',
    question: 'Quelle affirmation décrit le mieux la capacité de vos leaders à promouvoir l\'innovation dans l\'entreprise ?',
    answers: [
      {
        text: 'Nos leaders comprennent les opportunités d\'innovation et encouragent une culture d\'innovation.',
        level: 'Débutant'
      },
      {
        text: 'Nos leaders pilotent des initiatives et programmes d\'innovation pour promouvoir l\'expérimentation.',
        level: 'Intermédiaire'
      },
      {
        text: 'Nos leaders structurent une feuille de route stratégique pour intégrer l\'innovation dans la stratégie globale.',
        level: 'Avancé'
      },
      {
        text: 'Nos leaders orchestrent des initiatives d\'innovation à grande échelle en favorisant l\'open innovation.',
        level: 'Expert'
      }
    ]
  },
  {
    universe: 'Innovation',
    profile: 'Managers',
    question: 'Quelle affirmation décrit le mieux la capacité de vos managers à faciliter l\'innovation au sein de leurs équipes ?',
    answers: [
      {
        text: 'Nos managers supervisent les premières initiatives d\'innovation avec efficacité.',
        level: 'Débutant'
      },
      {
        text: 'Les managers organisent des équipes pour expérimenter des pratiques innovantes et encourager le droit à l\'erreur.',
        level: 'Intermédiaire'
      },
      {
        text: 'Nos managers alignent les processus d\'innovation au sein de leurs équipes.',
        level: 'Avancé'
      },
      {
        text: 'Les managers supervisent l\'innovation à grande échelle, assurant l\'alignement inter-départemental.',
        level: 'Expert'
      }
    ]
  },
  {
    universe: 'Innovation',
    profile: 'Équipes Spécialisées',
    question: 'Quelle affirmation décrit le mieux la capacité de vos équipes spécialisées à contribuer activement à l\'innovation ?',
    answers: [
      {
        text: 'Nos équipes adoptent des pratiques d\'innovation comme le Design Thinking et Lean Startup.',
        level: 'Débutant'
      },
      {
        text: 'Les équipes savent tester et mettre en œuvre des idées innovantes de bout en bout.',
        level: 'Intermédiaire'
      },
      {
        text: 'Nos équipes spécialisées optimisent les processus d\'innovation pour innover en continu.',
        level: 'Avancé'
      },
      {
        text: 'Nos équipes déploient des pratiques d\'open innovation à grande échelle avec des partenaires externes.',
        level: 'Expert'
      }
    ]
  },
  {
    universe: 'Innovation',
    profile: 'Collaborateurs (Tous)',
    question: 'Quelle affirmation décrit le mieux la capacité de vos collaborateurs à adopter les pratiques d\'innovation dans leur travail quotidien ?',
    answers: [
      {
        text: 'Nos collaborateurs sont sensibilisés aux principes de base de l\'innovation et à leur impact.',
        level: 'Débutant'
      },
      {
        text: 'Les collaborateurs participent à des initiatives d\'innovation avec les outils disponibles.',
        level: 'Intermédiaire'
      },
      {
        text: 'Nos collaborateurs contribuent activement aux projets et processus d\'innovation.',
        level: 'Avancé'
      },
      {
        text: 'Les collaborateurs appliquent des pratiques d\'innovation structurées dans leurs services et processus.',
        level: 'Expert'
      }
    ]
  },
  {
    universe: 'Expérience Client',
    profile: 'Leaders',
    question: 'Quelle affirmation décrit le mieux la capacité de vos leaders à intégrer l\'expérience client dans la stratégie de l\'entreprise ?',
    answers: [
      {
        text: 'Nos leaders comprennent l\'importance de l\'expérience client et l\'intègrent dans la vision globale.',
        level: 'Débutant'
      },
      {
        text: 'Les leaders encouragent des initiatives qui améliorent l\'omnicanalité de l\'expérience client.',
        level: 'Intermédiaire'
      },
      {
        text: 'Nos leaders sont capables de structurer une stratégie de personnalisation alignée à la stratégie d\'entreprise.',
        level: 'Avancé'
      },
      {
        text: 'Les leaders déploient des stratégies d\'innovation centrées sur l\'expérience client à grande échelle.',
        level: 'Expert'
      }
    ]
  },
  {
    universe: 'Expérience Client',
    profile: 'Managers',
    question: 'Quelle affirmation décrit le mieux la capacité de vos managers à gérer les initiatives d\'expérience client ?',
    answers: [
      {
        text: 'Nos managers pilotent les initiatives d\'expérience client cross-canal pour garantir une expérience cohérente.',
        level: 'Débutant'
      },
      {
        text: 'Les managers organisent leurs équipes pour faciliter une expérience omnicanale et l\'engagement client.',
        level: 'Intermédiaire'
      },
      {
        text: 'Nos managers coordonnent la personnalisation de l\'expérience client à l\'échelle en optimisant chaque point de contact.',
        level: 'Avancé'
      },
      {
        text: 'Les managers supervisent la co-création avec des partenaires et clients pour des innovations d\'expérience client.',
        level: 'Expert'
      }
    ]
  },
  {
    universe: 'Expérience Client',
    profile: 'Équipes Spécialisées',
    question: 'Quelle affirmation décrit le mieux la capacité de vos équipes spécialisées à optimiser l\'expérience client ?',
    answers: [
      {
        text: 'Nos équipes synchronisent les canaux digitaux pour offrir une expérience client cross-canal.',
        level: 'Débutant'
      },
      {
        text: 'Les équipes mettent en œuvre des pratiques d\'automatisation et de personnalisation omnicanale pour chaque point de contact.',
        level: 'Intermédiaire'
      },
      {
        text: 'Nos équipes spécialisées possèdent l\'expertise nécessaire pour personnaliser les parcours clients et automatiser les interactions.',
        level: 'Avancé'
      },
      {
        text: 'Nos équipes collaborent activement avec des partenaires et clients pour co-créer des expériences client innovantes.',
        level: 'Expert'
      }
    ]
  },
  {
    universe: 'Expérience Client',
    profile: 'Collaborateurs (Tous)',
    question: 'Quelle affirmation décrit le mieux la capacité de vos collaborateurs à contribuer à l\'expérience client ?',
    answers: [
      {
        text: 'Nos collaborateurs comprennent l\'importance de l\'expérience client et son impact.',
        level: 'Débutant'
      },
      {
        text: 'Les collaborateurs utilisent des outils digitaux pour assurer une cohérence omnicanale dans les interactions client.',
        level: 'Intermédiaire'
      },
      {
        text: 'Nos collaborateurs exploitent les outils et données dans leurs interactions, contribuant à la stratégie de personnalisation.',
        level: 'Avancé'
      },
      {
        text: 'Les collaborateurs participent activement à la co-création avec les clients, en proposant des idées pour enrichir l\'expérience client.',
        level: 'Expert'
      }
    ]
  },
  {
    universe: 'Technologie',
    profile: 'Leaders',
    question: 'Quelle affirmation décrit le mieux la capacité de vos leaders à guider l\'intégration des technologies dans l\'entreprise ?',
    answers: [
      {
        text: 'Nos leaders comprennent l\'impact stratégique des technologies émergentes.',
        level: 'Débutant'
      },
      {
        text: 'Les leaders supervisent des programmes expérimentaux en technologie et suivent leur performance.',
        level: 'Intermédiaire'
      },
      {
        text: 'Nos leaders structurent une vision technologique alignée avec la stratégie globale de l\'entreprise.',
        level: 'Avancé'
      },
      {
        text: 'Les leaders déploient des technologies avancées et industrialisent leur adoption à grande échelle.',
        level: 'Expert'
      }
    ]
  },
  {
    universe: 'Technologie',
    profile: 'Managers',
    question: 'Quelle affirmation décrit le mieux la capacité de vos managers à intégrer les technologies dans les processus métiers ?',
    answers: [
      {
        text: 'Nos managers mettent en œuvre des solutions technologiques de base.',
        level: 'Débutant'
      },
      {
        text: 'Les managers optimisent l\'intégration des technologies dans les processus métiers pour accroître l\'efficacité.',
        level: 'Intermédiaire'
      },
      {
        text: 'Nos managers supervisent les équipes dans l\'utilisation des technologies avancées.',
        level: 'Avancé'
      },
      {
        text: 'Les managers pilotent la coordination des projets technologiques entre plusieurs départements.',
        level: 'Expert'
      }
    ]
  },
  {
    universe: 'Technologie',
    profile: 'Équipes Spécialisées',
    question: 'Quelle affirmation décrit le mieux la capacité de vos équipes spécialisées à appliquer et optimiser les technologies ?',
    answers: [
      {
        text: 'Nos équipes se familiarisent avec les technologies de base pour améliorer les processus.',
        level: 'Débutant'
      },
      {
        text: 'Les équipes testent et appliquent des technologies avancées pour optimiser l\'efficacité.',
        level: 'Intermédiaire'
      },
      {
        text: 'Nos équipes spécialisées automatisent les processus grâce aux technologies avancées.',
        level: 'Avancé'
      },
      {
        text: 'Les équipes standardisent et intègrent les technologies à l\'échelle de l\'organisation.',
        level: 'Expert'
      }
    ]
  },
  {
    universe: 'Technologie',
    profile: 'Collaborateurs (Tous)',
    question: 'Quelle affirmation décrit le mieux la capacité de vos collaborateurs à adopter et utiliser les technologies dans leur travail quotidien ?',
    answers: [
      {
        text: 'Nos collaborateurs sont sensibilisés aux bases des technologies émergentes.',
        level: 'Débutant'
      },
      {
        text: 'Les collaborateurs utilisent des outils technologiques pour améliorer leur productivité quotidienne.',
        level: 'Intermédiaire'
      },
      {
        text: 'Nos collaborateurs contribuent activement à l\'implémentation des technologies avancées.',
        level: 'Avancé'
      },
      {
        text: 'Les collaborateurs soutiennent l\'adoption des pratiques technologiques avancées dans leurs processus quotidiens.',
        level: 'Expert'
      }
    ]
  },
  {
    universe: 'Data',
    profile: 'Leaders',
    question: 'Quelle affirmation décrit le mieux la capacité de vos leaders à orienter une stratégie data-driven pour l\'entreprise ?',
    answers: [
      {
        text: 'Nos leaders comprennent l\'importance stratégique des données et les utilisent pour évaluer les performances.',
        level: 'Débutant'
      },
      {
        text: 'Les leaders initient des plans d\'investissement pour centraliser et moderniser les données de l\'entreprise.',
        level: 'Intermédiaire'
      },
      {
        text: 'Nos leaders structurent une stratégie data-driven en intégrant des modèles prédictifs pour soutenir les décisions.',
        level: 'Avancé'
      },
      {
        text: 'Les leaders déploient des analyses avancées, basées sur l\'IA, pour automatiser les décisions stratégiques à grande échelle.',
        level: 'Expert'
      }
    ]
  },
  {
    universe: 'Data',
    profile: 'Managers',
    question: 'Quelle affirmation décrit le mieux la capacité de vos managers à intégrer l\'usage des données dans les projets ?',
    answers: [
      {
        text: 'Nos managers utilisent les données pour suivre les performances dans leurs projets.',
        level: 'Débutant'
      },
      {
        text: 'Les managers organisent et centralisent les données dans les processus métiers.',
        level: 'Intermédiaire'
      },
      {
        text: 'Nos managers testent des modèles prédictifs pour anticiper les besoins opérationnels.',
        level: 'Avancé'
      },
      {
        text: 'Les managers coordonnent des opérations de data-driven à l\'échelle, intégrant des analyses en temps réel.',
        level: 'Expert'
      }
    ]
  },
  {
    universe: 'Data',
    profile: 'Équipes Spécialisées',
    question: 'Quelle affirmation décrit le mieux la capacité de vos équipes spécialisées à exploiter les données pour optimiser les opérations ?',
    answers: [
      {
        text: 'Nos équipes se forment aux outils d\'analyse pour interpréter des données de base.',
        level: 'Débutant'
      },
      {
        text: 'Les équipes collectent et analysent des données pour améliorer l\'efficacité des opérations.',
        level: 'Intermédiaire'
      },
      {
        text: 'Nos équipes spécialisées automatisent les processus grâce à des analyses prédictives avancées.',
        level: 'Avancé'
      },
      {
        text: 'Les équipes utilisent des analyses basées sur l\'IA pour optimiser les opérations en temps réel.',
        level: 'Expert'
      }
    ]
  },
  {
    universe: 'Data',
    profile: 'Collaborateurs (Tous)',
    question: 'Quelle affirmation décrit le mieux la capacité de vos collaborateurs à utiliser les données dans leurs tâches quotidiennes ?',
    answers: [
      {
        text: 'Nos collaborateurs comprennent l\'importance des données et les utilisent pour améliorer leurs performances.',
        level: 'Débutant'
      },
      {
        text: 'Les collaborateurs collectent et partagent des données dans leurs projets quotidiens.',
        level: 'Intermédiaire'
      },
      {
        text: 'Nos collaborateurs appliquent des analyses basiques pour guider leurs décisions.',
        level: 'Avancé'
      },
      {
        text: 'Les collaborateurs soutiennent l\'intégration de données avancées dans les processus quotidiens.',
        level: 'Expert'
      }
    ]
  }
] 