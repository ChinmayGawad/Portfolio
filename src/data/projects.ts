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

export const experiences: ExperienceItem[] = [
  {
    id: 'enjay-android-intern',
    role: 'Android App Development Intern',
    company: 'Enjay IT Solutions Ltd',
    period: 'May 2026 – Current',
    location: 'Vapi, India',
    isCurrent: true,
    highlights: [
      'Developed user-friendly interfaces using Android Studio, Java, and Kotlin to enhance mobile application functionality.',
      'Engaged in learning new technologies and tools, contributing to personal development and team knowledge base expansion.',
      'Developed software solutions using Kotlin and Firebase to enhance operational efficiency.',
    ],
    skills: ['Kotlin', 'Android Studio', 'Java', 'Firebase', 'Mobile App Architecture'],
  },
  {
    id: 'alpha-cybersecurity-intern',
    role: 'Cybersecurity Intern',
    company: 'ALPHA INNOVATION',
    period: 'May 2026 – Jul 2026',
    location: 'Remote',
    isCurrent: false,
    highlights: [
      'Monitored network security alerts and incidents to identify and flag potential threats.',
      'Evaluated new cybersecurity tools and technologies, ensuring that the organization remained up-to-date on industry best practices.',
    ],
    skills: ['Cybersecurity', 'Network Security', 'Threat Monitoring', 'Security Audit'],
  },
];

export const GITHUB_REPOSITORIES: Repository[] = [
  {
    id: 1,
    name: 'Student_Room_Sharing_App',
    description: 'Native Android application in Kotlin with MVVM and Room DB for room sharing, roommate matching, and expense allocation.',
    language: 'Kotlin',
    stargazers_count: 5,
    forks_count: 2,
    size: 1420,
    html_url: 'https://github.com/ChinmayGawad',
    clone_url: 'https://github.com/ChinmayGawad/Student_Room_Sharing_App.git',
  },
  {
    id: 2,
    name: 'nutrivision-capstone',
    description: 'AI & Machine Learning vision app analyzing food meals, nutrients, and ML-driven dietary recommendations.',
    language: 'Python',
    stargazers_count: 8,
    forks_count: 3,
    size: 3200,
    html_url: 'https://github.com/ChinmayGawad',
    clone_url: 'https://github.com/ChinmayGawad/nutrivision-capstone.git',
  },
  {
    id: 3,
    name: 'Password-Strength-Analyzer',
    description: 'Security utility examining password entropy, dictionary leak databases, and strength metrics.',
    language: 'Java',
    stargazers_count: 4,
    forks_count: 1,
    size: 850,
    html_url: 'https://github.com/ChinmayGawad',
    clone_url: 'https://github.com/ChinmayGawad/Password-Strength-Analyzer.git',
  },
  {
    id: 4,
    name: 'Travel_expense_Splitter',
    description: 'Kotlin mobile utility for group trip bill splitting and offline ledger calculation.',
    language: 'Kotlin',
    stargazers_count: 3,
    forks_count: 1,
    size: 1100,
    html_url: 'https://github.com/ChinmayGawad',
    clone_url: 'https://github.com/ChinmayGawad/Travel_expense_Splitter.git',
  },
  {
    id: 5,
    name: 'ChinmayGawad',
    description: 'Developer software repository and personal profile configuration hosted on GitHub.',
    language: 'Markdown',
    stargazers_count: 1,
    forks_count: 0,
    size: 40854,
    html_url: 'https://github.com/ChinmayGawad/ChinmayGawad',
    clone_url: 'https://github.com/ChinmayGawad/ChinmayGawad.git',
  },
  {
    id: 6,
    name: 'Portfolio',
    description: 'High-performance interactive 3D WebGL developer portfolio website.',
    language: 'TypeScript',
    stargazers_count: 2,
    forks_count: 0,
    size: 15400,
    html_url: 'https://github.com/ChinmayGawad/Portfolio',
    clone_url: 'https://github.com/ChinmayGawad/Portfolio.git',
  },
  {
    id: 7,
    name: 'help-desk',
    description: 'Automated IT ticket support portal with status tracking and ticket management.',
    language: 'JavaScript',
    stargazers_count: 1,
    forks_count: 0,
    size: 2100,
    html_url: 'https://github.com/ChinmayGawad',
    clone_url: 'https://github.com/ChinmayGawad/help-desk.git',
  },
  {
    id: 8,
    name: 'Notes',
    description: 'Native mobile offline notes application built with SQLite and Jetpack Room.',
    language: 'Kotlin',
    stargazers_count: 1,
    forks_count: 0,
    size: 980,
    html_url: 'https://github.com/ChinmayGawad',
    clone_url: 'https://github.com/ChinmayGawad/Notes.git',
  },
];

const baseUrl = import.meta.env.BASE_URL || '/';

export const profileDetails = {
  name: 'Chinmay Gawad',
  username: 'ChinmayGawad',
  title: 'AI & Machine Learning Developer · Native Android Developer',
  tagline: 'Final-year BE Computer Engineering Student @ SJCEM',
  location: 'Palghar, Maharashtra, India',
  email: 'chinmaygawad365@gmail.com',
  phone: '+91 8446595303',
  whatsapp: 'https://wa.me/918446595303',
  github: 'https://github.com/ChinmayGawad',
  linkedin: 'https://www.linkedin.com/in/chinmay-gawad-7b3172256/',
  resumeUrl: `${baseUrl.endsWith('/') ? baseUrl : baseUrl + '/'}pics/Chinmay Gawad Resmue.pdf`,
  avatarUrl: `${baseUrl.endsWith('/') ? baseUrl : baseUrl + '/'}pics/IMG_6884.jpg`,
  metrics: {
    sgpa: '9.29',
    diplomaScore: '88.00%',
    sscScore: '65.20%',
    reposCount: '20+',
    graduationYear: '2027',
  },
  skills: {
    ai: ['Artificial Intelligence', 'Machine Learning', 'AI & ML Workflows', 'Prompt Engineering', 'Python AI Stack', 'Computer Vision'],
    android: ['Kotlin', 'Android Studio', 'MVVM Architecture', 'Room DB', 'REST APIs', 'Jetpack Components', 'Java'],
    core: ['OOP Concepts', 'Python', 'Java', 'C++', 'C', 'JavaScript', 'Data Structures & Algorithms', 'DBMS', 'Operating Systems'],
    tools: ['Git / GitHub', 'MySQL', 'Postman API', 'VS Code', '.NET Framework', 'Gradle'],
  },
  education: [
    {
      institution: 'St. John College of Engineering & Management',
      degree: 'BE in Computer Engineering',
      period: '2024 — 2027',
      score: '9.29 SGPA / 10.0',
      status: 'Pursuing BE Degree',
      details: 'Specializing in Artificial Intelligence & Machine Learning, LLM Workflows, and native Android App Development with Kotlin & MVVM.',
    },
    {
      institution: 'Diploma in Computer Engineering',
      degree: 'Engineering Diploma',
      period: '2021 — 2024',
      score: '88.00% (Distinction)',
      status: 'Completed',
      details: 'Comprehensive engineering diploma providing a strong core foundation in C, C++, Java, Advanced Java, Python, C#, database management, and hardware.',
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
