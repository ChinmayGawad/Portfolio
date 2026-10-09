export interface Repository {
  id: number | string;
  name: string;
  description: string;
  language: string;
  stargazers_count: number;
  forks_count: number;
  size: number;
  updated_at?: string;
  html_url: string;
  clone_url?: string;
}

export interface ExperienceItem {
  id: string;
  role: string;
  company: string;
  period: string;
  location: string;
  isCurrent?: boolean;
  highlights: string[];
  skills: string[];
}

export interface CertificationItem {
  id: string;
  title: string;
  issuer: string;
  year: string;
  domain: string;
}

export const experiences: ExperienceItem[] = [
  {
    id: 'enjay-android-intern',
    role: 'Android App Development Intern',
    company: 'Enjay IT Solutions Ltd',
    period: '2026 (3 months)',
    location: 'Vapi, Gujarat, India',
    isCurrent: false,
    highlights: [
      'Developed user-friendly Android application interfaces to improve functionality and user experience.',
      'Integrated Firebase services to support data management and application operations.',
      'Tested application features, identified bugs, and improved app stability and reliability.',
    ],
    skills: ['Kotlin', 'Android Studio', 'Material Design', 'Firebase', 'MVVM'],
  },
  {
    id: 'alpha-cybersecurity-intern',
    role: 'Cybersecurity Intern',
    company: 'ALPHA INNOVATION',
    period: '2026 (2 months)',
    location: 'Remote',
    isCurrent: false,
    highlights: [
      'Monitored network security alerts and incidents to identify potential threats.',
      'Analyzed security events and flagged suspicious activities for further investigation.',
      'Evaluated cybersecurity tools and technologies to stay aligned with security best practices.',
    ],
    skills: ['Cybersecurity', 'Linux', 'Computer Networking', 'Shell', 'Threat Monitoring'],
  },
];

export const certifications: CertificationItem[] = [
  {
    id: 'google-android',
    title: 'Google Android Developer Pathway - Digital Badges',
    issuer: 'Google Developers',
    year: '2026',
    domain: 'Mobile Dev',
  },
  {
    id: 'alpha-cybersecurity',
    title: 'Alpha Innovation - Cybersecurity',
    issuer: 'ALPHA INNOVATION',
    year: '2026',
    domain: 'Cybersecurity',
  },
  {
    id: 'crm-admin',
    title: 'CRM Admin Studio: Essentials',
    issuer: 'Enjay IT Solutions Ltd.',
    year: '2026',
    domain: 'Enterprise CRM',
  },
  {
    id: 'applied-git',
    title: 'Applied Git Proficiency Certificate',
    issuer: 'KraftPixel',
    year: '2026',
    domain: 'DevOps & Git',
  },
  {
    id: 'kantascrypt-angular',
    title: 'Kantascrypt Angular API Development',
    issuer: 'Kantascrypt',
    year: '2025',
    domain: 'Web & APIs',
  },
  {
    id: 'metaverse-training',
    title: 'Metaverse Training',
    issuer: 'IOFT',
    year: '2025',
    domain: 'Emerging Tech',
  },
  {
    id: 'aws-ml-foundations',
    title: 'Machine Learning Foundations',
    issuer: 'AWS Training',
    year: '2025',
    domain: 'AI & Machine Learning',
  },
  {
    id: 'infosys-java',
    title: 'Java Programming Fundamentals',
    issuer: 'Infosys Springboard',
    year: '2024',
    domain: 'Core Java',
  },
  {
    id: 'infosys-db-sql',
    title: 'Database and SQL',
    issuer: 'Infosys Springboard',
    year: '2024',
    domain: 'Databases & SQL',
  },
  {
    id: 'aws-cloud-foundations',
    title: 'AWS Academy Graduate | Cloud Foundations',
    issuer: 'AWS Training',
    year: '2024',
    domain: 'Cloud Architecture',
  },
  {
    id: 'kantascrypt-sql-dotnet',
    title: 'SQL & Dot Net Certification',
    issuer: 'Kantascrypt',
    year: '2024',
    domain: 'Backend & .NET',
  },
];

export const GITHUB_REPOSITORIES: Repository[] = [
  {
    id: 1,
    name: 'Student_Room_Sharing_App',
    description: 'Native Android application in Kotlin with Material 3 design, Room DB, and a custom Firebase Admin server for real-time chat and push notification delivery.',
    language: 'Kotlin',
    stargazers_count: 5,
    forks_count: 2,
    size: 1420,
    html_url: 'https://github.com/ChinmayGawad/Student_Room_Sharing_App',
    clone_url: 'https://github.com/ChinmayGawad/Student_Room_Sharing_App.git',
  },
  {
    id: 2,
    name: 'Automated-Phishing-URL-Detection',
    description: 'Automated real-time phishing URL detection engine with fast-whitelisting algorithms, Python backend, and Docker containerization.',
    language: 'Python',
    stargazers_count: 6,
    forks_count: 2,
    size: 2150,
    html_url: 'https://github.com/ChinmayGawad/Automated-Phishing-URL-Detection',
    clone_url: 'https://github.com/ChinmayGawad/Automated-Phishing-URL-Detection.git',
  },
  {
    id: 3,
    name: 'AudioPlayer',
    description: 'Modern, lightweight native Android music player utilizing Kotlin and Jetpack Media3 APIs with robust background media session management.',
    language: 'Kotlin',
    stargazers_count: 4,
    forks_count: 1,
    size: 1680,
    html_url: 'https://github.com/ChinmayGawad/AudioPlayer',
    clone_url: 'https://github.com/ChinmayGawad/AudioPlayer.git',
  },
  {
    id: 4,
    name: 'Travel_expense_Splitter',
    description: 'Backend tracking and budgeting tool using C# and .NET to manage, log, and split shared travel budgets with robust data logging.',
    language: 'C#',
    stargazers_count: 3,
    forks_count: 1,
    size: 1100,
    html_url: 'https://github.com/ChinmayGawad/Travel_expense_Splitter',
    clone_url: 'https://github.com/ChinmayGawad/Travel_expense_Splitter.git',
  },
  {
    id: 5,
    name: 'Portfolio',
    description: 'Interactive responsive developer portfolio website deployed via GitHub Pages showcasing technical projects, mobile apps, and engineering skills.',
    language: 'TypeScript',
    stargazers_count: 3,
    forks_count: 0,
    size: 15400,
    html_url: 'https://github.com/ChinmayGawad/Portfolio',
    clone_url: 'https://github.com/ChinmayGawad/Portfolio.git',
  },
  {
    id: 6,
    name: 'nutrivision-capstone',
    description: 'AI & Machine Learning vision app analyzing food meals, nutrients, and ML-driven dietary recommendations.',
    language: 'Python',
    stargazers_count: 8,
    forks_count: 3,
    size: 3200,
    html_url: 'https://github.com/ChinmayGawad/nutrivision-capstone',
    clone_url: 'https://github.com/ChinmayGawad/nutrivision-capstone.git',
  },
  {
    id: 7,
    name: 'Password-Strength-Analyzer',
    description: 'Security utility examining password entropy, dictionary leak databases, and strength metrics.',
    language: 'Java',
    stargazers_count: 4,
    forks_count: 1,
    size: 850,
    html_url: 'https://github.com/ChinmayGawad/Password-Strength-Analyzer',
    clone_url: 'https://github.com/ChinmayGawad/Password-Strength-Analyzer.git',
  },
  {
    id: 8,
    name: 'Notes',
    description: 'Native mobile offline notes application built with SQLite and Jetpack Room.',
    language: 'Kotlin',
    stargazers_count: 1,
    forks_count: 0,
    size: 980,
    html_url: 'https://github.com/ChinmayGawad/Notes',
    clone_url: 'https://github.com/ChinmayGawad/Notes.git',
  },
];

const getAssetUrl = (path: string): string => {
  const cleanPath = path.startsWith('/') ? path.slice(1) : path;

  if (typeof window !== 'undefined') {
    const origin = window.location.origin;
    let pathname = window.location.pathname;

    // Strip trailing filename if present (e.g. index.html)
    if (pathname.endsWith('.html')) {
      pathname = pathname.substring(0, pathname.lastIndexOf('/') + 1);
    }
    // Ensure trailing slash on directory path
    if (!pathname.endsWith('/')) {
      pathname += '/';
    }

    return `${origin}${pathname}${cleanPath}`;
  }

  const base = import.meta.env.BASE_URL || '/';
  if (base === './' || base === '.') {
    return `./${cleanPath}`;
  }
  const formattedBase = base.endsWith('/') ? base : `${base}/`;
  return `${formattedBase}${cleanPath}`;
};

export const profileDetails = {
  name: 'Chinmay Gawad',
  username: 'ChinmayGawad',
  title: 'Software Development · Mobile Applications · Backend Integration · AI/ML',
  tagline: 'B.Tech in Computer Engineering @ St. John College of Engineering & Management',
  summary:
    'Creative Software & Android Developer with experience building native mobile applications and integrating complex backend services. Tested apps extensively and resolved identified bugs and errors to improve application stability. Bright critical thinker with adaptability and accuracy strengths.',
  location: 'Palghar, Maharashtra, India',
  email: 'chinmaygawad365@gmail.com',
  phone: '+91 8446595303',
  whatsapp: 'https://wa.me/918446595303',
  github: 'https://github.com/ChinmayGawad',
  linkedin: 'https://www.linkedin.com/in/chinmay-gawad-7b3172256/',
  get resumeUrl() {
    return getAssetUrl('pics/Chinmay_Resume_Updated.pdf');
  },
  get avatarUrl() {
    return getAssetUrl('pics/IMG_6884.jpg');
  },
  metrics: {
    cgpa: '8.56',
    sgpa: '8.56',
    diplomaScore: '83.14%',
    sscScore: '65.20%',
    reposCount: '25+',
    graduationYear: '2027',
  },
  skills: {
    languages: ['Kotlin', 'Java', 'Python', 'C++', 'C', 'HTML', 'CSS', 'JavaScript'],
    mobile: ['Android Development', 'Android Studio', 'Jetpack Compose', 'Material Design 3', 'MVVM', 'RoomDB', 'Media3'],
    aiml: ['TensorFlow', 'PyTorch', 'OpenAI API', 'Hugging Face Transformers', 'NLP', 'Computer Vision'],
    databases: ['RoomDB', 'SQLite', 'PostgreSQL', 'MySQL', 'Firebase'],
    cloudDevops: ['Git', 'GitHub Actions', 'Docker', 'CI/CD Pipeline'],
    employability: ['Problem-Solving & Critical Thinking', 'Adaptability & Quick Learning', 'Attention to Detail', 'Collaboration & Professionalism'],
    ai: ['TensorFlow', 'PyTorch', 'OpenAI API', 'Hugging Face Transformers', 'NLP', 'Computer Vision'],
    android: ['Kotlin', 'Android Studio', 'Jetpack Compose', 'Material Design 3', 'MVVM Architecture', 'Room DB', 'Media3', 'Firebase'],
    core: ['Kotlin', 'Java', 'Python', 'C++', 'C', 'JavaScript', 'HTML / CSS', 'OOP Concepts', 'Data Structures & Algorithms'],
    tools: ['Git', 'GitHub Actions', 'Docker', 'CI/CD Pipeline', 'PostgreSQL', 'MySQL', 'Firebase', 'VS Code'],
  },
  education: [
    {
      institution: 'St. John College of Engineering & Management, Palghar',
      degree: 'B.Tech in Computer Engineering',
      period: '2024 — 2027',
      score: '8.56 CGPA / 10.0',
      status: 'Pursuing B.Tech Degree',
      details: 'Specializing in native mobile applications, backend integration, AI/ML models, and computer engineering fundamentals.',
    },
    {
      institution: 'St. John College of Engineering & Management, Palghar',
      degree: 'Diploma in Computer Engineering',
      period: 'Completed 2024',
      score: '83.14%',
      status: 'Completed',
      details: 'Comprehensive diploma engineering curriculum covering C, C++, Java, Advanced Java, Python, C#, DBMS, operating systems, and computer hardware.',
    },
    {
      institution: 'Sacred Heart High School',
      degree: 'SSC (Class 10th)',
      period: '2021',
      score: '65.20%',
      status: 'Matriculation',
      details: 'Secondary school education covering fundamental scientific principles, mathematical logic, and language arts.',
    },
  ],
};
