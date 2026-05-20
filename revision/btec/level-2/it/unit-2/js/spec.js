// BTEC IT Level 2 Unit 2 — Specification
// Learning Aims: A, B, C

window.SPEC = {
  unit: 'it_l2_u2',
  title: 'BTEC IT Level 2 Unit 2 — Technology Systems',
  subtitle: 'Digital Exam Preparation',
  level: 2,
  framework: 'BTEC',
  subject: 'IT',
  unitNumber: 2,
  aims: ['A', 'B', 'C'],
  
  // Session type identifiers for tracking
  sessionTypes: {
    quiz: 'quiz_it_l2_u2',
    practice: 'practice_it_l2_u2',
    mock: 'mock_it_l2_u2',
    flashcard: 'flashcard_it_l2_u2'
  },

  // Learning aim metadata
  aimMetadata: {
    A: {
      title: 'Applications and Issues',
      description: 'Understand how technology is used in different sectors and the issues/risks associated with technology systems',
      topics: [
        'A1.1 Hardware devices in applications',
        'A1.2 Software in applications',
        'A1.3 Cloud services',
        'A1.4 Data security',
        'A1.5 Data privacy',
        'A1.6 Backup and recovery',
        'A1.7 Networking in organisations'
      ],
      free: true
    },
    B: {
      title: 'Hardware and Software',
      description: 'Detailed knowledge of hardware components and software types',
      topics: [
        'B1.1 CPU and processors',
        'B1.2 Memory types and function',
        'B1.3 Storage devices',
        'B1.4 Input/output devices',
        'B2.1 System software',
        'B2.2 Application software',
        'B2.3 Software licensing'
      ],
      free: false
    },
    C: {
      title: 'Programming Basics',
      description: 'Programming concepts and code analysis',
      topics: [
        'C1.1 Programming languages',
        'C1.2 Program structure',
        'C1.3 Variables and data types',
        'C1.4 Control flow',
        'C1.5 Functions and procedures',
        'C2.1 Code analysis',
        'C2.2 Flowcharts and pseudocode'
      ],
      free: false
    }
  },

  // Question type configurations
  questionTypes: {
    multipleChoice: { 
      marks: 1, 
      format: 'Select one answer (A-D)',
      commonAcrossUnit: true
    },
    shortAnswer: { 
      marks: [1, 2, 3, 4], 
      format: 'Type or select structured response',
      commonAcrossUnit: true
    },
    extended: { 
      marks: 8, 
      format: 'Discuss/evaluate question',
      commonAcrossUnit: true
    }
  },

  // Digital exam context
  examFormat: {
    totalQuestions: 18,
    totalMarks: 60,
    duration: 'Variable (depends on candidate)',
    deliveryMode: 'Computer-based (Pearson OnVUE or similar)',
    questionSequence: 'All 18 questions presented in order',
    navigation: 'Can navigate forward and backward',
    autoSave: true,
    calculatorAllowed: true
  },

  // Sector examples used in questions
  sectors: [
    'Retail',
    'Healthcare',
    'Finance',
    'Education',
    'Manufacturing',
    'Construction',
    'Entertainment',
    'Transport',
    'Hospitality',
    'Legal'
  ],

  // Common command verbs for this unit
  commandVerbs: [
    'State',
    'Identify',
    'Give',
    'List',
    'Describe',
    'Explain',
    'Calculate',
    'Analyse',
    'Discuss',
    'Evaluate'
  ],

  // Calculation topics
  calculationTopics: [
    'Binary to denary conversion',
    'Denary to binary conversion',
    'Memory capacity calculations',
    'File size calculations',
    'Data transfer rate calculations'
  ],

  // Key vocabulary (for auto-marking stop word removal)
  stopWords: [
    'a', 'an', 'the', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for',
    'is', 'are', 'was', 'were', 'be', 'been', 'being',
    'have', 'has', 'had', 'do', 'does', 'did',
    'can', 'could', 'will', 'would', 'should', 'may', 'might', 'must',
    'it', 'its', 'that', 'this', 'these', 'those',
    'by', 'from', 'with', 'of', 'as'
  ],

  // Key terms for synonym matching in marking
  keyTerms: {
    'CPU|processor|central processing unit|microprocessor': 'CPU',
    'RAM|random access memory|memory': 'RAM',
    'SSD|solid state drive|solid state|flash storage': 'SSD',
    'HDD|hard disk|hard drive|magnetic storage': 'HDD',
    'GPU|graphics processor|graphics processing unit': 'GPU',
    'ROM|read only memory|fixed storage': 'ROM',
    'malware|virus|spyware|trojan|ransomware|worm': 'Malware',
    'encryption|encrypted|cipher|encrypted data': 'Encryption',
    'firewall|network security': 'Firewall',
    'backup|recovery|restore': 'Backup',
    'authentication|login|password|biometric': 'Authentication',
    'bandwidth|data transfer rate|speed': 'Bandwidth',
    'network|internet|connectivity': 'Network',
    'database|data storage': 'Database',
    'cloud|cloud storage|cloud computing': 'Cloud',
    'algorithm|logical sequence|step by step': 'Algorithm'
  }
};
