import FeedbackWidget from './components/FeedbackWidget';

import React, { useState, useMemo, useEffect } from 'react';
import { Application, Candidate, Job, NewJobData, NewCandidateData, Interview, Interviewer, InterviewType, JobStatus, InterviewStatus, Recommendation, Task, TaskStatus, Stage, Requisition, NewRequisitionData, EmploymentType, ActiveTab, Project } from './types';
import Header from './components/Header';
import Dashboard from './components/Dashboard';
import Sidebar from './components/Sidebar';
import JobApplicationForm from './pages/JobApplicationForm';
import LandingPage from './pages/LandingPage';
import UserLoginPage from './pages/UserLoginPage';
// AdminLoginPage intentionally removed - admin portal is separate (frontend-admin/)
import { useLocalStorage } from './hooks/useLocalStorage';
import { useToast } from './components/ui/Toast';
import { motion, AnimatePresence } from 'motion/react';
import { SparklesIcon, XMarkIcon } from './components/icons/Icons';
import { User } from './types';
import {
  apiGetCurrentUser,
  apiGetJobs,
  apiGetCandidates,
  apiGetApplications,
  apiGetRequisitions,
  apiGetProjects,
  apiGetInterviews,
  apiGetTasks,
  apiSubmitApplication,
  apiUpdateApplication,
  apiDeleteApplication,
  apiCreateJob,
  apiUpdateJob,
  apiCreateInterview,
  apiUpdateRequisition,
  apiCreateProject,
  apiCreateCandidate,
  apiCreateRequisition,
  apiGetStages
} from './services/api';

const MOCK_STAGES_INITIAL: Stage[] = [
    { id: 'applied', name: 'Applied', color: '#64748b' }, // slate-500
    { id: 'screening', name: 'Screening', color: '#3b82f6' }, // blue-500
    { id: 'assessment', name: 'Assessment', color: '#8b5cf6' }, // purple-500
    { id: 'interview', name: 'Interview', color: '#eab308' }, // yellow-500
    { id: 'offer', name: 'Offer', color: '#f97316' }, // orange-500
    { id: 'hired', name: 'Hired', color: '#22c55e' }, // green-500
];

const MOCK_PROJECTS_INITIAL: Project[] = [
    {
        id: 'proj01',
        name: 'Q3 Engineering Expansion',
        description: 'Hiring push for senior engineers to build out new microservices architecture.',
        status: 'Active',
        ownerId: 'int01', // Alex Greene
        companyId: 'demo-user',
        createdDate: '2024-07-10T10:00:00Z',
    },
    {
        id: 'proj02',
        name: 'Core Product Team Growth',
        description: 'Expanding the core product and design teams to accelerate feature development.',
        status: 'Active',
        ownerId: 'int05', // Edward King
        companyId: 'demo-user',
        createdDate: '2024-07-28T14:00:00Z',
    },
    {
        id: 'proj03',
        name: 'New Market Entry (Surabaya)',
        description: 'Building a foundational team for our new office and operations in Surabaya.',
        status: 'On Hold',
        ownerId: 'int01', // Alex Greene
        companyId: 'demo-user',
        createdDate: '2024-06-15T09:00:00Z',
    },
];

const MOCK_REQUISITIONS_INITIAL: Requisition[] = [
    {
      id: 'req01',
      title: 'Senior Backend Engineer',
      department: 'Technology',
      location: 'Jakarta, Indonesia',
      employmentType: EmploymentType.FullTime,
      headcount: 1,
      experienceLevel: 'Senior',
      salaryMin: 100000,
      salaryMax: 140000,
      deadline: '2026-09-30',
      status: 'Approved',
      jobId: 'fsd01',
      companyId: 'demo-user',
    },
     {
      id: 'req02',
      title: 'UI/UX Designer',
      department: 'Design',
      location: 'Remote',
      employmentType: EmploymentType.Contract,
      headcount: 1,
      experienceLevel: 'Mid-level',
      salaryMin: 70000,
      salaryMax: 95000,
      deadline: '2026-08-31',
      status: 'Approved',
      jobId: 'ux01',
      companyId: 'demo-user',
    },
    {
      id: 'req03',
      title: 'Product Manager',
      department: 'Product',
      location: 'Remote',
      employmentType: EmploymentType.FullTime,
      headcount: 1,
      experienceLevel: 'Senior',
      salaryMin: 110000,
      salaryMax: 150000,
      deadline: '2026-10-15',
      status: 'Approved',
      jobId: 'pm01',
      companyId: 'demo-user',
    },
    {
      id: 'req04',
      title: 'Sales Development Representative',
      department: 'Sales',
      location: 'Surabaya, Indonesia',
      employmentType: EmploymentType.FullTime,
      headcount: 2,
      experienceLevel: 'Entry-level',
      salaryMin: 40000,
      salaryMax: 55000,
      deadline: '2026-09-20',
      status: 'Pending',
      companyId: 'demo-user',
    },
    {
      id: 'req05',
      title: 'Data Analyst Intern',
      department: 'Analytics',
      location: 'Bandung, Indonesia (Hybrid)',
      employmentType: EmploymentType.Internship,
      headcount: 1,
      experienceLevel: 'Intern',
      salaryMin: 15000,
      salaryMax: 20000,
      deadline: '2026-08-25',
      status: 'Rejected',
      companyId: 'demo-user',
    },
    {
      id: 'req06',
      title: 'DevOps Engineer',
      department: 'Technology',
      location: 'Jakarta, Indonesia (Hybrid)',
      employmentType: EmploymentType.FullTime,
      headcount: 1,
      experienceLevel: 'Mid-level',
      salaryMin: 95000,
      salaryMax: 125000,
      deadline: '2026-10-10',
      status: 'Approved',
      companyId: 'demo-user',
    }
];

// Mock Data based on the user's detailed specification
const MOCK_JOBS_INITIAL: Job[] = [
    {
      id: 'fsd01',
      title: 'Full-Stack Developer',
      department: 'Technology',
      level: 'Senior',
      location: 'Remote',
      status: JobStatus.Open,
      employmentType: EmploymentType.FullTime,
      totalApplicants: 0,
      daysOpen: 21,
      salaryMin: 90000,
      salaryMax: 130000,
      deadline: '2024-09-15',
      projectId: 'proj01',
      jobDescription: 'We are looking for a seasoned Full-Stack Developer to build out and manage our web infrastructure. You will be responsible for both front-end and back-end development, including the design of user interactions on websites, developing servers, and databases for website functionality, and coding for mobile platforms.',
      competencies: ['React', 'Node.js', 'TypeScript', 'SQL', 'System Design', 'CI/CD', 'Communication', 'Problem-Solving'],
      interviewQuestions: [
        { type: 'Behavioral', questions: ['Describe a complex project you led.', 'How do you handle tight deadlines?'] },
        { type: 'Technical', questions: ['Explain the difference between SQL and NoSQL databases.', 'Design a simple REST API for a blog.'] }
      ]
    },
    {
      id: 'css01',
      title: 'Customer Service Specialist',
      department: 'Customer Service',
      level: 'Junior',
      location: 'Surabaya, Indonesia',
      status: JobStatus.Open,
      employmentType: EmploymentType.FullTime,
      totalApplicants: 0,
      daysOpen: 15,
      salaryMin: 45000,
      salaryMax: 60000,
      deadline: '2024-08-30',
      projectId: 'proj03',
      jobDescription: "We are seeking a friendly and efficient Customer Service Specialist to join our team. You will be the first point of contact for our customers, addressing their inquiries, resolving issues, and providing an exceptional service experience via chat, email, and phone.",
      competencies: ['Communication', 'Empathy', 'Problem-Solving', 'Patience', 'CRM Software', 'Typing Speed'],
      interviewQuestions: [
        { type: 'Behavioral (STAR method)', questions: ["Describe a time you dealt with a very angry customer. What was the situation and how did you resolve it?"] },
        { type: 'Technical/Role-Specific', questions: ["How would you handle three incoming support chats at the same time with different priority levels?"] }
      ]
    },
    {
      id: 'dma01',
      title: 'Digital Marketing Admin',
      department: 'Digital Marketing',
      level: 'Mid-level',
      location: 'Jakarta, Indonesia',
      status: JobStatus.OnHold,
      employmentType: EmploymentType.FullTime,
      totalApplicants: 0,
      daysOpen: 30,
      salaryMin: 65000,
      salaryMax: 85000,
      deadline: '2024-09-10',
      projectId: 'proj02',
      jobDescription: "We're looking for a detail-oriented Digital Marketing Admin to support our marketing campaigns. You will be responsible for managing social media schedules, preparing campaign performance reports, and ensuring our CRM data is clean and up-to-date.",
      competencies: ['Social Media Management', 'Google Analytics', 'Content Calendar', 'Data Entry', 'Meta Ads', 'SEO Basics'],
      interviewQuestions: [
        { type: 'Behavioral (STAR method)', questions: ["Tell me about a campaign you worked on. What was your specific contribution and what were the results?"] },
        { type: 'Technical/Role-Specific', questions: ["If a campaign's CPC suddenly increased by 30%, what steps would you take to diagnose the issue?"] }
      ]
    },
    {
      id: 'fin01',
      title: 'Finance Staff',
      department: 'Finance',
      level: 'Mid-level',
      location: 'Bandung, Indonesia (Hybrid)',
      status: JobStatus.Closed,
      employmentType: EmploymentType.FullTime,
      totalApplicants: 0,
      daysOpen: 25,
      salaryMin: 70000,
      salaryMax: 90000,
      deadline: '2024-07-20',
      projectId: 'proj03',
      jobDescription: "Join our finance team as a Finance Staff member. Your primary duties will include managing accounts payable/receivable, performing bank reconciliations, and assisting with monthly financial closing procedures. Accuracy and integrity are key for this role.",
      competencies: ['Accounting Principles (GL/AP/AR)', 'Excel (VLOOKUP, Pivot)', 'Financial Reporting', 'Bank Reconciliation', 'Attention to Detail', 'Jurnal.id/Accurate'],
      interviewQuestions: [
        { type: 'Behavioral (STAR method)', questions: ["Describe a time you found a significant error in a financial report. What did you do?"] },
        { type: 'Technical/Role-Specific', questions: ["Walk me through the steps you would take to perform a monthly bank reconciliation."] }
      ]
    },
    {
      id: 'ux01',
      title: 'UI/UX Designer',
      department: 'Design',
      level: 'Mid-level',
      location: 'Remote',
      status: JobStatus.Open,
      employmentType: EmploymentType.Contract,
      totalApplicants: 0,
      daysOpen: 5,
      salaryMin: 70000,
      salaryMax: 95000,
      deadline: '2024-08-31',
      projectId: 'proj02',
      jobDescription: "We're looking for a creative UI/UX Designer to shape the user experience of our digital products. You will turn user insights into elegant, effective design solutions, from concept to launch.",
      competencies: ['Figma', 'User Research', 'Wireframing', 'Prototyping', 'Usability Testing', 'Design Systems'],
      interviewQuestions: [
        { type: 'Behavioral', questions: ['Walk us through your design process for a recent project.', 'How do you handle negative feedback on your designs?'] },
        { type: 'Technical', questions: ['What is the difference between UI and UX?', 'Present a project from your portfolio.'] }
      ]
    },
    {
      id: 'pm01',
      title: 'Product Manager',
      department: 'Product',
      level: 'Senior',
      location: 'Remote',
      status: JobStatus.Open,
      employmentType: EmploymentType.FullTime,
      totalApplicants: 0,
      daysOpen: 2,
      salaryMin: 110000,
      salaryMax: 150000,
      deadline: '2024-10-15',
      projectId: 'proj02',
      jobDescription: "As a Senior Product Manager, you will drive the product strategy and roadmap for one of our core products. You will work with engineering, design, and marketing to launch new features and grow the business.",
      competencies: ['Product Roadmap', 'Agile Methodologies', 'User Stories', 'Market Research', 'A/B Testing', 'Stakeholder Management'],
      interviewQuestions: [
        { type: 'Behavioral', questions: ['How would you decide which feature to build next?', 'Describe a product you launched from scratch.'] },
        { type: 'Technical', questions: ['How do you measure the success of a product?', 'What is your favorite product and how would you improve it?'] }
      ]
    }
];

const MOCK_CANDIDATES_INITIAL: Candidate[] = [
  { id: 'cand01', name: 'Anya Forger', avatarUrl: 'https://picsum.photos/seed/anya/100', email: 'anya.f@example.com', phone: '+123456789', experienceYears: 5, expectedSalary: 95000, portfolioUrl: 'https://github.com/anya', skills: 'React, Node.js, TypeScript, GraphQL, SQL, System Design', linkedinUrl: 'https://linkedin.com/in/anyaforger', strengths: 'Fast learner, collaborative, proficient in modern web technologies.', weaknesses: 'Overthinks problems sometimes, public speaking.', aspirations: 'To become a principal engineer and lead a high-impact team.', major: 'Computer Science', address: '123 Maple Street, Jakarta, Indonesia', dateOfBirth: '1998-04-01' },
  { id: 'cand02', name: 'Loid Forger', avatarUrl: 'https://picsum.photos/seed/loid/100', email: 'loid.f@example.com', phone: '+123456789', experienceYears: 8, expectedSalary: 120000, portfolioUrl: 'https://github.com/loid', skills: 'Go, Python, Kubernetes, AWS, Microservices, CI/CD', linkedinUrl: 'https://linkedin.com/in/loidforger', strengths: 'Strategic thinking, problem-solving under pressure, highly disciplined.', weaknesses: 'Can be too independent, sometimes delegates less than he should.', aspirations: 'Architecting large-scale, resilient systems.', major: 'Software Engineering', address: '456 Oak Avenue, Jakarta, Indonesia', dateOfBirth: '1992-11-11' },
  { id: 'cand03', name: 'Yor Forger', avatarUrl: 'https://picsum.photos/seed/yor/100', email: 'yor.f@example.com', phone: '+123456789', experienceYears: 3, expectedSalary: 80000, portfolioUrl: 'https://github.com/yor', skills: 'JavaScript, Vue.js, CSS, HTML, REST APIs', linkedinUrl: 'https://linkedin.com/in/yorforger', strengths: 'Detail-oriented, efficient, strong work ethic.', weaknesses: 'Sometimes shy to ask for help.', aspirations: 'Specialize in frontend performance and accessibility.', major: 'Information Systems', address: '789 Pine Lane, Remote', dateOfBirth: '1999-02-14' },
  { id: 'cand04', name: 'Franky Franklin', avatarUrl: 'https://picsum.photos/seed/franky/100', email: 'franky.f@example.com', phone: '+123456789', experienceYears: 7, expectedSalary: 110000, portfolioUrl: 'https://github.com/franky', skills: 'Python, Django, Flask, PostgreSQL, Docker', linkedinUrl: 'https://linkedin.com/in/frankyfranklin', strengths: 'Inventive and resourceful.', weaknesses: 'Easily distracted by side projects.', aspirations: 'Build a revolutionary data platform.', major: 'Data Science', address: '101 Gadget Street, Remote', dateOfBirth: '1994-07-20' },
  { id: 'cand05', name: 'Damian Desmond', avatarUrl: 'https://picsum.photos/seed/damian/100', email: 'damian.d@example.com', phone: '+123456789', experienceYears: 2, expectedSalary: 75000, skills: 'React, JavaScript, TailwindCSS, Next.js', linkedinUrl: 'https://linkedin.com/in/damiandesmond', strengths: 'Ambitious, quick learner.', weaknesses: 'A bit arrogant, needs to improve teamwork.', aspirations: 'Become a senior frontend developer in 3 years.', major: 'Computer Science', address: 'Eden Academy Dorms', dateOfBirth: '2001-05-15' },
  { id: 'cand06', name: 'Becky Blackbell', avatarUrl: 'https://picsum.photos/seed/becky/100', email: 'becky.b@example.com', phone: '+123456789', experienceYears: 6, expectedSalary: 105000, skills: 'Figma, Sketch, Adobe XD, User Research, Prototyping, Design Systems', linkedinUrl: 'https://linkedin.com/in/beckyblackbell', portfolioUrl: 'https://dribbble.com/becky', strengths: 'Creative, empathetic, excellent communicator.', weaknesses: 'Can be sensitive to critique.', aspirations: 'Lead a design team for a major product.', major: 'Human-Computer Interaction', address: '555 Glamour Ave, Remote', dateOfBirth: '1996-09-09' },
  { id: 'cand07', name: 'Yuri Briar', avatarUrl: 'https://picsum.photos/seed/yuri/100', email: 'yuri.b@example.com', phone: '+123456789', experienceYears: 9, expectedSalary: 130000, skills: 'Java, Spring Boot, Kafka, Microservices, OracleDB, System Security', linkedinUrl: 'https://linkedin.com/in/yuribriar', strengths: 'Dedicated, thorough, high attention to security principles.', weaknesses: 'Can be rigid in his approach.', aspirations: 'Become a security architect.', major: 'Cybersecurity', address: 'Secret State Service HQ', dateOfBirth: '1991-03-22' },
  { id: 'cand08', name: 'Sylvia Sherwood', avatarUrl: 'https://picsum.photos/seed/sylvia/100', email: 'sylvia.s@example.com', phone: '+123456789', experienceYears: 10, expectedSalary: 150000, skills: 'Product Strategy, Agile, Scrum, Market Research, Roadmapping, P&L Management', linkedinUrl: 'https://linkedin.com/in/sylviasherwood', strengths: 'Exceptional leader, strategic mastermind, calm under pressure.', weaknesses: 'Work-life balance is a challenge.', aspirations: 'Become a Chief Product Officer.', major: 'Business Administration', address: '1 Wise Way, Remote', dateOfBirth: '1988-12-01' },
  { id: 'cand09', name: 'Budi Santoso', avatarUrl: 'https://picsum.photos/seed/budi/100', email: 'budi.s@example.com', phone: '+6281234567', experienceYears: 2, expectedSalary: 55000, skills: 'Customer Support, Zendesk, Intercom, Communication, Empathy', linkedinUrl: 'https://linkedin.com/in/budisantoso', address: 'Jl. Pahlawan No. 10, Surabaya, Indonesia', strengths: 'Patient and empathetic, excellent problem-solver.', dateOfBirth: '2000-08-17' },
  { id: 'cand10', name: 'Citra Lestari', avatarUrl: 'https://picsum.photos/seed/citra/100', email: 'citra.l@example.com', phone: '+6281234568', experienceYears: 4, expectedSalary: 75000, skills: 'SEO, SEM, Google Analytics, Meta Ads, Content Marketing', linkedinUrl: 'https://linkedin.com/in/citralestari', address: 'Kuningan, Jakarta Selatan, Indonesia', major: 'Marketing Communication', aspirations: 'To become a Head of Digital Marketing.', strengths: 'Data-driven and creative.' },
  { id: 'cand11', name: 'Dewi Anggraini', avatarUrl: 'https://picsum.photos/seed/dewi/100', email: 'dewi.a@example.com', phone: '+6281234569', experienceYears: 5, expectedSalary: 80000, skills: 'Financial Reporting, Accounting, Excel, SAP, Tax Compliance', linkedinUrl: 'https://linkedin.com/in/dewianggraini', address: 'Jl. Dago No. 15, Bandung, Indonesia', major: 'Accounting', strengths: 'Meticulous and highly organized.' },
  { id: 'cand12', name: 'Eko Nugroho', avatarUrl: 'https://picsum.photos/seed/eko/100', email: 'eko.n@example.com', phone: '+6281234570', experienceYears: 7, expectedSalary: 115000, portfolioUrl: 'https://github.com/ekonugroho', skills: 'React Native, Flutter, Swift, Kotlin, Mobile UI/UX' },
  { id: 'cand13', name: 'Rina Hartono', avatarUrl: 'https://picsum.photos/seed/rina/100', email: 'rina.h@example.com', phone: '+6281234571', experienceYears: 1, expectedSalary: 48000, skills: 'Data Entry, Microsoft Office, Communication', hobbies: 'Reading, hiking' },
  { id: 'cand14', name: 'Siti Aminah', avatarUrl: 'https://picsum.photos/seed/siti/100', email: 'siti.a@example.com', phone: '+6281234572', experienceYears: 10, expectedSalary: 140000, portfolioUrl: 'https://github.com/sitiaminah', skills: 'Ruby on Rails, Heroku, Sidekiq, RSpec, JavaScript', linkedinUrl: 'https://linkedin.com/in/sitiaminah' },
  { id: 'cand15', name: 'Agus Setiawan', avatarUrl: 'https://picsum.photos/seed/agus/100', email: 'agus.s@example.com', phone: '+6281234573', experienceYears: 4, expectedSalary: 90000, portfolioUrl: 'https://behance.net/agussetiawan', skills: 'UI Design, Figma, Design Systems, Visual Branding', major: 'Visual Communication Design' },
  { id: 'cand16', name: 'Maya Sari', avatarUrl: 'https://picsum.photos/seed/maya/100', email: 'maya.s@example.com', phone: '+6281234574', experienceYears: 6, expectedSalary: 100000, portfolioUrl: 'https://dribbble.com/mayasari', skills: 'User Research, Usability Testing, Wireframing, Journey Mapping', major: 'Psychology' },
  { id: 'cand17', name: 'Joko Widodo', avatarUrl: 'https://picsum.photos/seed/joko/100', email: 'joko.w@example.com', phone: '+6281234575', experienceYears: 12, expectedSalary: 160000, skills: 'Product Leadership, Go-to-market Strategy, P&L Management', linkedinUrl: 'https://linkedin.com/in/jokowidodo' },
  { id: 'cand18', name: 'Ani Yudhoyono', avatarUrl: 'https://picsum.photos/seed/ani/100', email: 'ani.y@example.com', phone: '+6281234576', experienceYears: 0, expectedSalary: 45000, skills: 'Eager to learn, Good communication skills', major: 'Fresh Graduate, Management' },
  { id: 'cand19', name: 'Hadi Pranoto', avatarUrl: 'https://picsum.photos/seed/hadi/100', email: 'hadi.p@example.com', phone: '+6281234577', experienceYears: 3, expectedSalary: 85000, skills: 'Google Ads, Facebook Ads, SEO, Content Writing', linkedinUrl: 'https://linkedin.com/in/hadipranoto' },
  { id: 'cand20', name: 'Tono Sutono', avatarUrl: 'https://picsum.photos/seed/tono/100', email: 'tono.s@example.com', phone: '+6281234578', experienceYears: 5, expectedSalary: 92000, skills: 'Bookkeeping, Payroll, Financial Statements, MYOB', major: 'Finance' },
];

const MOCK_INTERVIEWERS: Interviewer[] = [
    { id: 'int01', name: 'Alex Greene', role: 'Hiring Manager' },
    { id: 'int02', name: 'Brenda Smith', role: 'Senior Engineer' },
    { id: 'int03', name: 'Charles Brown', role: 'Lead Engineer' },
    { id: 'int04', name: 'Diana Prince', role: 'HR Specialist' },
    { id: 'int05', name: 'Edward King', role: 'Product Manager' },
    { id: 'int06', name: 'Fiona Glenanne', role: 'Recruiter' },
];

const generateScorecard = () => {
  const scorecard = [
    { name: 'Relevant Experience', weight: 0.25, score: Math.floor(Math.random() * 50) + 50 },
    { name: 'Hard Skill / Test', weight: 0.30, score: Math.floor(Math.random() * 60) + 40 },
    { name: 'Soft Skill / Competency', weight: 0.20, score: Math.floor(Math.random() * 50) + 50 },
    { name: 'Culture & Value Fit', weight: 0.15, score: Math.floor(Math.random() * 40) + 60 },
    { name: 'Salary & Availability', weight: 0.10, score: Math.floor(Math.random() * 30) + 70 },
  ];
  const totalScore = scorecard.reduce((acc, cr) => acc + (cr.score * cr.weight), 0);
  return { scorecard, totalScore: Math.round(totalScore) };
};

const MOCK_APPLICATIONS_INITIAL: Application[] = [
  { id: 'app01', candidateId: 'cand01', jobId: 'fsd01', stageId: 'interview', appliedDate: '2024-07-15T09:00:00Z', source: 'LinkedIn', ...generateScorecard(),
    stageHistory: [ { stageId: 'applied', date: '2024-07-15T09:00:00Z', changedBy: 'System' }, { stageId: 'screening', date: '2024-07-16T11:00:00Z', changedBy: 'Diana Prince' }, { stageId: 'assessment', date: '2024-07-20T14:00:00Z', changedBy: 'Alex Greene' }, { stageId: 'interview', date: '2024-07-22T16:00:00Z', changedBy: 'Alex Greene' } ],
    notes: [ { author: 'Diana Prince', content: 'Strong initial screening call. Candidate seems very knowledgeable about React.', date: '2024-07-16T10:00:00Z' }, { author: 'Alex Greene', content: 'Anya passed the technical assessment with flying colors. Proceeding to technical interview.', date: '2024-07-22T15:30:00Z' } ]
  },
  { id: 'app02', candidateId: 'cand02', jobId: 'fsd01', stageId: 'offer', appliedDate: '2024-07-12T08:00:00Z', source: 'Referral', ...generateScorecard(),
    stageHistory: [ { stageId: 'applied', date: '2024-07-12T08:00:00Z', changedBy: 'Yuri Briar' }, { stageId: 'screening', date: '2024-07-13T10:00:00Z', changedBy: 'Diana Prince' }, { stageId: 'assessment', date: '2024-07-18T11:00:00Z', changedBy: 'Alex Greene' }, { stageId: 'interview', date: '2024-07-25T09:00:00Z', changedBy: 'Alex Greene' }, { stageId: 'offer', date: '2024-07-30T17:00:00Z', changedBy: 'Alex Greene' } ],
    notes: [ { author: 'Diana Prince', content: 'Referral from Yuri. Strong resume, looks very promising. Scheduled screen.', date: '2024-07-13T09:30:00Z' }, { author: 'Alex Greene', content: 'Excellent technical interview. Deep knowledge of system architecture. Making an offer.', date: '2024-07-30T16:00:00Z' } ]
  },
  { id: 'app03', candidateId: 'cand03', jobId: 'fsd01', stageId: 'assessment', appliedDate: '2024-07-20T13:00:00Z', source: 'Career Site', ...generateScorecard(),
    stageHistory: [ { stageId: 'applied', date: '2024-07-20T13:00:00Z', changedBy: 'System' }, { stageId: 'screening', date: '2024-07-21T15:00:00Z', changedBy: 'Diana Prince' }, { stageId: 'assessment', date: '2024-07-24T10:00:00Z', changedBy: 'Diana Prince' } ],
    notes: [{ author: 'Diana Prince', content: 'Good, clean resume. Solid fundamentals in frontend. Sent assessment link.', date: '2024-07-21T15:05:00Z' }]
  },
  { id: 'app04', candidateId: 'cand04', jobId: 'fsd01', stageId: 'interview', appliedDate: '2024-07-18T10:00:00Z', source: 'LinkedIn', ...generateScorecard(),
    stageHistory: [ { stageId: 'applied', date: '2024-07-18T10:00:00Z', changedBy: 'System' }, { stageId: 'screening', date: '2024-07-19T11:00:00Z', changedBy: 'Diana Prince' }, { stageId: 'interview', date: '2024-07-23T11:00:00Z', changedBy: 'Diana Prince' } ],
    notes: [{author: 'Diana Prince', content: 'Good screening call, seems like a solid engineer with relevant experience.', date: '2024-07-19T11:00:00Z'}]
  },
  { id: 'app05', candidateId: 'cand05', jobId: 'fsd01', stageId: 'screening', appliedDate: '2024-07-22T14:00:00Z', source: 'Indeed', knockedOut: true, ...generateScorecard(),
    notes: [{author: 'Diana Prince', content: 'Experience not quite at the level we need for this senior role. Knocked out after initial resume screen.', date: '2024-07-22T14:05:00Z'}]
  },
  { id: 'app06', candidateId: 'cand06', jobId: 'ux01', stageId: 'offer', appliedDate: '2024-07-19T12:00:00Z', source: 'Referral', ...generateScorecard(),
    stageHistory: [ { stageId: 'applied', date: '2024-07-19T12:00:00Z', changedBy: 'Edward King' }, { stageId: 'screening', date: '2024-07-20T10:00:00Z', changedBy: 'Fiona Glenanne' }, { stageId: 'assessment', date: '2024-07-22T14:00:00Z', changedBy: 'Edward King' }, { stageId: 'interview', date: '2024-07-26T10:00:00Z', changedBy: 'Edward King' }, { stageId: 'offer', date: '2024-07-31T11:00:00Z', changedBy: 'Edward King' } ],
    notes: [{ author: 'Edward King', content: 'Portfolio is exceptional. A clear leader in the design space. Fast-tracking.', date: '2024-07-20T10:05:00Z' }]
  },
  { id: 'app07', candidateId: 'cand07', jobId: 'fsd01', stageId: 'interview', appliedDate: '2024-07-10T11:00:00Z', source: 'Career Site', ...generateScorecard(), knockedOut: true,
    notes: [{ author: 'Alex Greene', content: 'Phenomenal backend skills, but not enough frontend experience for this specific role. Would consider for a pure backend position.', date: '2024-07-18T16:00:00Z' }]
  },
  { id: 'app08', candidateId: 'cand08', jobId: 'pm01', stageId: 'interview', appliedDate: '2024-07-25T17:00:00Z', source: 'LinkedIn', ...generateScorecard(),
    stageHistory: [ { stageId: 'applied', date: '2024-07-25T17:00:00Z', changedBy: 'System' }, { stageId: 'screening', date: '2024-07-26T11:00:00Z', changedBy: 'Edward King' }, { stageId: 'interview', date: '2024-07-29T10:00:00Z', changedBy: 'Edward King' } ],
  },
  { id: 'app09', candidateId: 'cand09', jobId: 'css01', stageId: 'hired', appliedDate: '2024-07-24T09:00:00Z', source: 'Career Site', ...generateScorecard(),
    stageHistory: [{ stageId: 'applied', date: '2024-07-24T09:00:00Z', changedBy: 'System' }, { stageId: 'screening', date: '2024-07-25T11:00:00Z', changedBy: 'Fiona Glenanne' }, { stageId: 'interview', date: '2024-07-28T14:00:00Z', changedBy: 'Fiona Glenanne' }, { stageId: 'offer', date: '2024-07-30T10:00:00Z', changedBy: 'Alex Greene' }, { stageId: 'hired', date: '2024-07-31T15:00:00Z', changedBy: 'Alex Greene' }]
  },
  { id: 'app10', candidateId: 'cand10', jobId: 'dma01', stageId: 'assessment', appliedDate: '2024-07-25T08:00:00Z', source: 'LinkedIn', ...generateScorecard(),
    notes: [{ author: 'Fiona Glenanne', content: 'Good experience with Meta Ads, looks promising. Sent assessment.', date: '2024-07-26T12:00:00Z' }]
  },
  { id: 'app11', candidateId: 'cand11', jobId: 'fin01', stageId: 'interview', appliedDate: '2024-07-20T18:00:00Z', source: 'Referral', ...generateScorecard() },
  { id: 'app12', candidateId: 'cand12', jobId: 'fsd01', stageId: 'applied', appliedDate: '2024-07-28T20:00:00Z', source: 'Indeed', ...generateScorecard() },
  { id: 'app13', candidateId: 'cand14', jobId: 'fsd01', stageId: 'interview', appliedDate: '2024-07-26T13:00:00Z', source: 'Referral', ...generateScorecard(), knockedOut: true },
  { id: 'app14', candidateId: 'cand13', jobId: 'css01', stageId: 'hired', appliedDate: '2024-07-15T09:30:00Z', source: 'Career Site', ...generateScorecard() },
  { id: 'app15', candidateId: 'cand18', jobId: 'css01', stageId: 'screening', appliedDate: '2024-07-29T10:00:00Z', source: 'LinkedIn', ...generateScorecard() },
  { id: 'app16', candidateId: 'cand15', jobId: 'ux01', stageId: 'assessment', appliedDate: '2024-07-28T11:00:00Z', source: 'Dribbble', ...generateScorecard() },
  { id: 'app17', candidateId: 'cand16', jobId: 'ux01', stageId: 'interview', appliedDate: '2024-07-25T14:00:00Z', source: 'LinkedIn', ...generateScorecard() },
  { id: 'app18', candidateId: 'cand06', jobId: 'ux01', stageId: 'offer', appliedDate: '2024-07-20T16:00:00Z', source: 'Referral', ...generateScorecard() },
  { id: 'app19', candidateId: 'cand17', jobId: 'pm01', stageId: 'interview', appliedDate: '2024-07-29T13:00:00Z', source: 'LinkedIn', ...generateScorecard() },
  { id: 'app20', candidateId: 'cand08', jobId: 'pm01', stageId: 'screening', appliedDate: '2024-07-30T10:30:00Z', source: 'Referral', ...generateScorecard() },
  { id: 'app21', candidateId: 'cand19', jobId: 'dma01', stageId: 'assessment', appliedDate: '2024-07-27T19:00:00Z', source: 'Indeed', ...generateScorecard() },
  { id: 'app22', candidateId: 'cand20', jobId: 'fin01', stageId: 'hired', appliedDate: '2024-07-10T15:00:00Z', source: 'JobStreet', ...generateScorecard() },
];

const MOCK_INTERVIEWS_INITIAL: Interview[] = [
    { id: 'iv01', applicationId: 'app01', type: InterviewType.Technical, dateTime: '2024-08-05T14:00:00Z', interviewers: [MOCK_INTERVIEWERS[1], MOCK_INTERVIEWERS[2]], locationOrLink: 'https://meet.google.com/xyz-abc-def', status: InterviewStatus.Completed, recommendation: Recommendation.Hire,
      scorecard: [ { competency: 'React', rating: 4, notes: 'Strong understanding of hooks and state management.' }, { competency: 'Node.js', rating: 3, notes: 'Good, but could be more familiar with advanced concepts.' }, { competency: 'System Design', rating: 4, notes: 'Excellent approach to a sample problem.' }, ]
    },
    { id: 'iv02', applicationId: 'app04', type: InterviewType.Screen, dateTime: '2024-08-02T10:30:00Z', interviewers: [MOCK_INTERVIEWERS[3]], locationOrLink: 'Phone Call', status: InterviewStatus.Completed, recommendation: Recommendation.Hire,
      scorecard: [ { competency: 'Communication', rating: 5, notes: 'Very clear and concise communicator. Friendly demeanor.' }, { competency: 'Problem-Solving', rating: 4, notes: 'Quick to understand the role requirements and align his experience.' } ]
    },
    { id: 'iv03', applicationId: 'app11', type: InterviewType.Behavioral, dateTime: '2024-08-06T11:00:00Z', interviewers: [MOCK_INTERVIEWERS[0], MOCK_INTERVIEWERS[3]], locationOrLink: 'https://meet.google.com/ghi-jkl-mno', status: InterviewStatus.Completed, recommendation: Recommendation.Hire,
      scorecard: [ { competency: 'Attention to Detail', rating: 5, notes: 'Provided very specific examples of finding errors.' }, { competency: 'Teamwork', rating: 4, notes: 'Good examples of collaboration with other departments.' } ]
    },
    { id: 'iv04', applicationId: 'app13', type: InterviewType.Technical, dateTime: '2024-08-08T09:00:00Z', interviewers: [MOCK_INTERVIEWERS[1]], locationOrLink: 'https://meet.google.com/pqr-stu-vwx', status: InterviewStatus.Completed, recommendation: Recommendation.NoHire,
      scorecard: [ { competency: 'React', rating: 2, notes: 'Struggled with basic state management concepts.' }, { competency: 'SQL', rating: 1, notes: 'Could not write a simple join query.' } ]
    },
    { id: 'iv05', applicationId: 'app17', type: InterviewType.Panel, dateTime: '2024-08-07T13:00:00Z', interviewers: [MOCK_INTERVIEWERS[0], MOCK_INTERVIEWERS[4]], locationOrLink: 'On-site: Jakarta Office', status: InterviewStatus.Scheduled
    },
    { id: 'iv06', applicationId: 'app19', type: InterviewType.Behavioral, dateTime: '2024-08-01T15:00:00Z', interviewers: [MOCK_INTERVIEWERS[0]], locationOrLink: 'Phone Call', status: InterviewStatus.Completed, recommendation: Recommendation.StrongHire,
      scorecard: [ { competency: 'Product Roadmap', rating: 5, notes: 'Clear vision and prioritization skills.' }, { competency: 'Market Research', rating: 4, notes: 'Solid understanding of competitive landscape.' }, ]
    },
    { id: 'iv07', applicationId: 'app02', type: InterviewType.Panel, dateTime: '2024-07-28T10:00:00Z', interviewers: [MOCK_INTERVIEWERS[0], MOCK_INTERVIEWERS[2], MOCK_INTERVIEWERS[4]], locationOrLink: 'On-site: Jakarta Office', status: InterviewStatus.Completed, recommendation: Recommendation.StrongHire,
      scorecard: [ { competency: 'System Design', rating: 5, notes: 'Deeply impressive architectural knowledge.' }, { competency: 'CI/CD', rating: 5, notes: 'Expert level understanding of deployment pipelines.' }, { competency: 'Communication', rating: 4, notes: 'Communicates complex topics clearly.' } ]
    },
    { id: 'iv08', applicationId: 'app06', type: InterviewType.Technical, dateTime: '2024-07-26T10:00:00Z', interviewers: [MOCK_INTERVIEWERS[4]], locationOrLink: 'https://meet.google.com/ux-design-int', status: InterviewStatus.Completed, recommendation: Recommendation.StrongHire,
      scorecard: [ { competency: 'Figma', rating: 5, notes: 'Expert user, very fluent.' }, { competency: 'User Research', rating: 4, notes: 'Solid process for user interviews.' }, { competency: 'Design Systems', rating: 5, notes: 'Showed great examples of contributing to a design system.' } ]
    },
    { id: 'iv09', applicationId: 'app09', type: InterviewType.Behavioral, dateTime: '2024-07-28T14:00:00Z', interviewers: [MOCK_INTERVIEWERS[5]], locationOrLink: 'On-site: Surabaya Office', status: InterviewStatus.Completed, recommendation: Recommendation.StrongHire,
      scorecard: [ { competency: 'Empathy', rating: 5, notes: 'Naturally empathetic and customer-focused.' }, { competency: 'Problem-Solving', rating: 4, notes: 'Good logical approach to resolving customer issues.' } ]
    },
];

const MOCK_TASKS_INITIAL: Task[] = [
    { id: 'task01', applicationId: 'app01', title: 'Review technical assessment results', dueDate: '2024-08-10', assigneeId: 'int01', status: TaskStatus.ToDo },
    { id: 'task02', applicationId: 'app01', title: 'Follow up with candidate about availability', dueDate: '2024-08-08', assigneeId: 'int04', status: TaskStatus.Completed },
    { id: 'task03', applicationId: 'app04', title: 'Prepare for recruiter screen call', dueDate: '2024-08-01', assigneeId: 'int04', status: TaskStatus.Completed },
    { id: 'task04', applicationId: 'app16', title: 'Send design take-home test', dueDate: '2024-08-05', assigneeId: 'int04', status: TaskStatus.Completed },
    { id: 'task05', applicationId: 'app19', title: 'Schedule follow-up with engineering lead', dueDate: '2024-08-09', assigneeId: 'int01', status: TaskStatus.ToDo },
    { id: 'task06', applicationId: 'app02', title: 'Prepare offer letter details for Loid Forger', dueDate: '2024-07-31', assigneeId: 'int04', status: TaskStatus.Completed },
    { id: 'task07', applicationId: 'app06', title: 'Check references for Becky Blackbell', dueDate: '2024-07-30', assigneeId: 'int06', status: TaskStatus.Completed },
    { id: 'task08', applicationId: 'app08', title: 'Schedule technical interview with Sylvia', dueDate: '2024-08-02', assigneeId: 'int05', status: TaskStatus.ToDo },
];


const DashboardSkeleton = () => (
  <div className="p-8 space-y-8 animate-pulse">
    <div className="flex justify-between items-center">
      <div className="space-y-2">
        <div className="h-8 w-64 bg-slate-200 dark:bg-slate-800 rounded-lg"></div>
        <div className="h-4 w-96 bg-slate-100 dark:bg-slate-800/50 rounded-lg"></div>
      </div>
      <div className="h-10 w-32 bg-slate-200 dark:bg-slate-800 rounded-lg"></div>
    </div>
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {[1, 2, 3].map(i => (
        <div key={i} className="h-48 bg-slate-100 dark:bg-slate-800/50 rounded-2xl border border-slate-200 dark:border-slate-800"></div>
      ))}
    </div>
    <div className="space-y-4">
      <div className="h-6 w-48 bg-slate-200 dark:bg-slate-800 rounded-lg"></div>
      <div className="h-64 bg-slate-100 dark:bg-slate-800/50 rounded-2xl border border-slate-200 dark:border-slate-800"></div>
    </div>
  </div>
);

// Global check removed to prevent unwanted refreshes
const App: React.FC = () => {
  const { addToast } = useToast();
  const [theme, setTheme] = useLocalStorage<'light' | 'dark'>('ts_theme', 'light');
  const [activeTab, setActiveTab] = useState<ActiveTab>('requisition');
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  // Real users ALWAYS get empty arrays as default — data comes from API only.
  // Demo user gets MOCK data injected in useEffect below.
  const [projects, setProjects] = useState<Project[]>([]);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [requisitions, setRequisitions] = useState<Requisition[]>([]);
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [applications, setApplications] = useState<Application[]>([]);
  const [interviews, setInterviews] = useState<Interview[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [stages, setStages] = useState<Stage[]>(MOCK_STAGES_INITIAL);
  const [onboardingComplete, setOnboardingComplete] = useLocalStorage<boolean>('ts_onboarding', false);
  const [language, setLanguage] = useLocalStorage<'en' | 'id'>('ts_lang', 'en');
  const [user, setUser] = useLocalStorage<User | null>('ts_session', null);
  const [authMode, setAuthMode] = useState<'none' | 'user' | 'admin'>('none');
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingData, setIsLoadingData] = useState(false);

  // SECURITY: Jika user mengakses /admin di portal user, redirect ke portal admin (port 3001)
  // Admin portal sepenuhnya terpisah - tidak ada admin login di sini
  useEffect(() => {
    const checkAdminRoute = () => {
      const path = window.location.pathname.toLowerCase();
      const hash = window.location.hash.toLowerCase();
      const search = window.location.search.toLowerCase();
      const params = new URLSearchParams(window.location.search);
      const portal = params.get('portal') || params.get('auth');

      if (
        path === '/admin' || 
        path.startsWith('/admin/') || 
        hash === '#admin' || 
        hash === '#/admin' || 
        portal === 'admin' || 
        portal === 'superadmin' ||
        search.includes('admin')
      ) {
        // Redirect ke portal admin yang terpisah
        const adminPortalUrl = window.location.port === '3000' 
          ? 'http://localhost:3001'  // Development: port 3001
          : `${window.location.protocol}//${window.location.hostname}/admin-portal`; // Production
        window.location.href = adminPortalUrl;
      }
    };

    checkAdminRoute();
    window.addEventListener('popstate', checkAdminRoute);
    window.addEventListener('hashchange', checkAdminRoute);
    return () => {
      window.removeEventListener('popstate', checkAdminRoute);
      window.removeEventListener('hashchange', checkAdminRoute);
    };
  }, []);

  // Sync with Laravel Backend
  // - Demo user: inject MOCK data locally (no backend needed)
  // - Real users: ALWAYS fetch fresh from API, never fall back to mock
  useEffect(() => {
    let isMounted = true;
    const syncWithBackend = async () => {
      // 1. Demo user — inject local MOCK data, no API calls
      if (user?.id === 'demo-user') {
        sessionStorage.setItem('ts_demo_active', '1');
        setProjects(MOCK_PROJECTS_INITIAL);
        setJobs(MOCK_JOBS_INITIAL);
        setRequisitions(MOCK_REQUISITIONS_INITIAL);
        setCandidates(MOCK_CANDIDATES_INITIAL);
        setApplications(MOCK_APPLICATIONS_INITIAL);
        setInterviews(MOCK_INTERVIEWS_INITIAL);
        setTasks(MOCK_TASKS_INITIAL);
        setStages(MOCK_STAGES_INITIAL);
        return;
      }

      // 2. Pengunjung umum tanpa login: hanya fetch jika membuka link pelamar publik
      if (!user) {
        // Clear semua data agar tidak ada sisa mock dari sesi sebelumnya
        setProjects([]);
        setJobs([]);
        setRequisitions([]);
        setCandidates([]);
        setApplications([]);
        setInterviews([]);
        setTasks([]);
        const params = new URLSearchParams(window.location.search);
        const pubJobId = params.get('jobId') || params.get('job_id');
        if (pubJobId) {
          apiGetJobs('all').then(d => { if (isMounted && d && d.length > 0) setJobs(d); }).catch(() => {});
          apiGetStages().then(s => { if (isMounted && s && s.length > 0) setStages(s); }).catch(() => {});
        }
        return;
      }

      // 3. Akun NYATA — reset state dulu agar tidak ada sisa mock, lalu fetch dari API
      setProjects([]);
      setJobs([]);
      setRequisitions([]);
      setCandidates([]);
      setApplications([]);
      setInterviews([]);
      setTasks([]);
      setIsLoadingData(true);

      const targetId = user.role === 'super_admin' ? 'all' : user.id;

      try {
        const dJobs = await apiGetJobs(targetId);
        if (isMounted && dJobs !== null) setJobs(dJobs);

        const dCands = await apiGetCandidates(targetId);
        if (isMounted && dCands !== null) setCandidates(dCands);

        const dApps = await apiGetApplications(targetId);
        if (isMounted && dApps !== null) setApplications(dApps);

        const dReqs = await apiGetRequisitions(targetId);
        if (isMounted && dReqs !== null) setRequisitions(dReqs);

        const dProjs = await apiGetProjects(targetId);
        if (isMounted && dProjs !== null) setProjects(dProjs);

        const dInts = await apiGetInterviews(targetId);
        if (isMounted && dInts !== null) setInterviews(dInts);

        const dTasks = await apiGetTasks(targetId);
        if (isMounted && dTasks !== null) setTasks(dTasks);

        const dStages = await apiGetStages();
        if (isMounted && dStages !== null && dStages.length > 0) setStages(dStages);

        // Refresh user subscription from backend (normalize format)
        const res = await apiGetCurrentUser();
        if (isMounted && res?.success && res.user && res.user.id === user.id) {
          setUser(res.user);
          localStorage.setItem('ts_session', JSON.stringify(res.user));
        }
      } catch (e) {
        console.warn('Sync failed', e);
      } finally {
        if (isMounted) setIsLoadingData(false);
      }
    };

    syncWithBackend();

    const handleRefresh = () => { if (isMounted) syncWithBackend(); };
    window.addEventListener('adminUsersRefresh', handleRefresh);

    return () => {
      isMounted = false;
      window.removeEventListener('adminUsersRefresh', handleRefresh);
    };
  }, [user?.id]); // Re-sync setiap user berganti (login/logout)

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  const handleTabChange = (tab: ActiveTab) => {
    // Role protection: prevent non-super-admin from switching to super admin tabs
    if (user && user.role !== 'super_admin' && (tab === 'admin_users' || tab === 'admin_analytics')) {
      tab = 'requisition';
    }
    setIsLoading(true);
    setActiveTab(tab);
    setIsMobileSidebarOpen(false);
    setTimeout(() => setIsLoading(false), 300);
  };

  // Strict Role-Based Tab Guard: Non-super_admin accounts must NEVER access super admin tabs
  useEffect(() => {
    if (user && user.role !== 'super_admin') {
      if (activeTab === 'admin_users' || activeTab === 'admin_analytics') {
        setActiveTab('requisition');
      }
    }
  }, [user, activeTab]);

  // Multi-Tenant Isolation Logic
  // Super Admin (user.role === 'super_admin') sees all records across all client companies.
  // Client Admin (user.role === 'admin') only sees jobs, applications, candidates, requisitions, projects belonging to their company/user ID.
  const isSuperAdmin = user?.role === 'super_admin';
  const currentCompanyId = user?.id;

  const tenantJobs = useMemo(() => {
    if (!user) return jobs;
    if (user.id === 'demo-user') {
      return jobs.filter(j => (j.companyId || (j as any).company_id) === 'demo-user' || !j.companyId);
    }
    return jobs.filter(j => {
      const cId = j.companyId || (j as any).company_id;
      return cId === currentCompanyId;
    });
  }, [jobs, user, currentCompanyId]);

  const tenantJobIds = useMemo(() => new Set(tenantJobs.map(j => j.id)), [tenantJobs]);

  const tenantApplications = useMemo(() => {
    if (!user) return applications;
    if (user.id === 'demo-user') {
      return applications.filter(a => (a.companyId || (a as any).company_id) === 'demo-user' || !a.companyId);
    }
    return applications.filter(app => {
      const cId = app.companyId || (app as any).company_id;
      if (cId) return cId === currentCompanyId;
      return tenantJobIds.has(app.jobId);
    });
  }, [applications, user, currentCompanyId, tenantJobIds]);

  const tenantJobsWithCounts = useMemo(() => {
    const applicantCounts = tenantApplications.reduce((acc, app) => {
      acc[app.jobId] = (acc[app.jobId] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return tenantJobs.map(job => ({
      ...job,
      totalApplicants: applicantCounts[job.id] || 0,
    }));
  }, [tenantJobs, tenantApplications]);

  const tenantCandidateIds = useMemo(() => new Set(tenantApplications.map(a => a.candidateId)), [tenantApplications]);

  const tenantCandidates = useMemo(() => {
    if (!user) return candidates;
    if (user.id === 'demo-user') {
      return candidates.filter(c => (c.companyId || (c as any).company_id) === 'demo-user' || !c.companyId);
    }
    return candidates.filter(c => {
      const cId = c.companyId || (c as any).company_id;
      if (cId) return cId === currentCompanyId;
      return tenantCandidateIds.has(c.id);
    });
  }, [candidates, user, currentCompanyId, tenantCandidateIds]);

  const tenantRequisitions = useMemo(() => {
    if (!user) return requisitions;
    if (user.id === 'demo-user') {
      return requisitions.filter(r => (r.companyId || (r as any).company_id) === 'demo-user' || !r.companyId);
    }
    return requisitions.filter(r => {
      const cId = r.companyId || (r as any).company_id;
      if (cId) return cId === currentCompanyId;
      const jId = r.jobId || (r as any).job_id;
      return jId && tenantJobIds.has(jId);
    });
  }, [requisitions, user, currentCompanyId, tenantJobIds]);

  const tenantProjects = useMemo(() => {
    if (!user) return projects;
    if (user.id === 'demo-user') {
      return projects.filter(p => (p.companyId || (p as any).company_id) === 'demo-user' || !p.companyId);
    }
    return projects.filter(p => {
      const cId = p.companyId || (p as any).company_id;
      if (cId) return cId === currentCompanyId;
      return tenantJobs.some(j => (j.projectId || (j as any).project_id) === p.id);
    });
  }, [projects, user, currentCompanyId, tenantJobs]);

  const applicationsWithDetails = useMemo(() => {
    return tenantApplications.map(app => {
      const candidate = tenantCandidates.find(c => c.id === app.candidateId);
      const job = tenantJobsWithCounts.find(j => j.id === app.jobId);
      const stage = stages.find(s => s.id === app.stageId);
      const appInterviewsFromState = interviews.filter(i => (i.applicationId || (i as any).application_id) === app.id);
      const appInterviews = appInterviewsFromState.length > 0 ? appInterviewsFromState : (app.interviews || []);
      const appTasksFromState = tasks.filter(t => (t.applicationId || (t as any).application_id) === app.id);
      const appTasks = appTasksFromState.length > 0 ? appTasksFromState : (app.tasks || []);
      return { ...app, candidate, job, stage, interviews: appInterviews, tasks: appTasks };
    }).filter(app => app.candidate && app.job && app.stage);
  }, [tenantApplications, tenantCandidates, interviews, tenantJobsWithCounts, tasks, stages]);

  const handleAddRequisition = (data: NewRequisitionData) => {
    const newRequisition: Requisition = {
      ...data,
      id: `req${Date.now()}`,
      status: 'Pending',
      companyId: user?.id,
    };
    setRequisitions(prev => [newRequisition, ...prev]);
    addToast('Requisition created successfully', 'success');

    // Asynchronously save to Laravel backend
    if (user?.id !== 'demo-user') {
      apiCreateRequisition({ ...data, companyId: user?.id }).then(createdReq => {
        if (createdReq) {
          setRequisitions(prev => prev.map(r => r.id === newRequisition.id ? createdReq : r));
        }
      }).catch(err => console.warn('Failed to sync requisition creation to backend:', err));
    }
  };

  const handleUpdateRequisition = (requisitionId: string, updates: Partial<Requisition>) => {
    setRequisitions(prev =>
      prev.map(req => (req.id === requisitionId ? { ...req, ...updates } : req))
    );
    if (updates.status === 'Approved') {
        addToast('Requisition approved', 'success');
    }

    // Asynchronously update in Laravel backend
    if (user?.id !== 'demo-user') {
      apiUpdateRequisition(requisitionId, updates).catch(err => {
        console.warn('Failed to sync requisition update to backend:', err);
      });
    }
  };

  const handleAddCandidate = (newCandidateData: NewCandidateData) => {
    const newCandidate: Candidate = {
      ...newCandidateData,
      id: `cand${Date.now()}`,
      avatarUrl: `https://picsum.photos/seed/${encodeURIComponent(newCandidateData.name)}/100`,
      companyId: user?.id,
    };
    setCandidates(prev => [...prev, newCandidate]);

    const targetJobId = tenantJobsWithCounts[0]?.id || jobs[0]?.id;
    if (targetJobId) {
      const { scorecard, totalScore } = generateScorecard();
      const newApplication: Application = {
          id: `app${Date.now()}`,
          candidateId: newCandidate.id,
          jobId: targetJobId,
          stageId: stages[0]?.id || 'applied',
          appliedDate: new Date().toISOString(),
          source: 'Manual Entry',
          scorecard,
          totalScore,
          companyId: user?.id,
      };
      setApplications(prev => [...prev, newApplication]);
      addToast('Candidate added successfully', 'success');

      // Asynchronously sync to backend
      if (user?.id !== 'demo-user') {
        apiSubmitApplication(targetJobId, newCandidateData, 'Manual Entry').then(createdApp => {
          if (createdApp) {
            setApplications(prev => prev.map(a => a.id === newApplication.id ? createdApp : a));
            if ((createdApp as any).candidate) {
              const c = (createdApp as any).candidate;
              setCandidates(prev => prev.map(cand => cand.id === newCandidate.id ? {
                ...cand,
                id: c.id,
                avatarUrl: c.avatar_url || c.avatarUrl || cand.avatarUrl
              } : cand));
            }
          }
        }).catch(err => console.warn('Failed to sync candidate & application to backend:', err));
      }
    } else {
      if (user?.id !== 'demo-user') {
        apiCreateCandidate(newCandidateData).then(createdCand => {
          if (createdCand) {
            setCandidates(prev => prev.map(c => c.id === newCandidate.id ? createdCand : c));
          }
        }).catch(err => console.warn('Failed to sync candidate to backend:', err));
      }
      addToast('Candidate added successfully', 'success');
    }
  };

  const handleAddCandidateAndApplication = (jobId: string, newCandidateData: NewCandidateData, source: string = 'Career Site') => {
    const targetJob = jobs.find(j => j.id === jobId);
    const targetCompanyId = targetJob?.companyId || targetJob?.company_id || user?.id;

    const newCandidate: Candidate = {
      ...newCandidateData,
      id: `cand${Date.now()}`,
      avatarUrl: `https://picsum.photos/seed/${encodeURIComponent(newCandidateData.name)}/100`,
      companyId: targetCompanyId,
    };
    setCandidates(prev => [...prev, newCandidate]);

    const { scorecard, totalScore } = generateScorecard();
    const newApplication: Application = {
        id: `app${Date.now()}`,
        candidateId: newCandidate.id,
        jobId: jobId,
        stageId: stages[0]?.id || 'applied',
        appliedDate: new Date().toISOString(),
        source: source,
        scorecard,
        totalScore,
        companyId: targetCompanyId,
    };
    setApplications(prev => [...prev, newApplication]);
    addToast('Application submitted successfully', 'success');

    // Asynchronously save to Laravel backend on Aiven MySQL
    if (user?.id !== 'demo-user') {
      apiSubmitApplication(jobId, newCandidateData, source).then(createdApp => {
        if (createdApp) {
          setApplications(prev => prev.map(a => a.id === newApplication.id ? createdApp : a));
        }
      }).catch(err => console.warn('Failed to sync application to backend:', err));
    }
  };
  
  const handleAddJob = (jobData: NewJobData, projectId: string, requisitionId?: string): Job => {
    const targetCompanyId = user?.id;
    const newJob: Job = {
        ...jobData,
        id: `job${Date.now()}`,
        status: JobStatus.Open,
        totalApplicants: 0,
        daysOpen: 0,
        projectId,
        companyId: targetCompanyId,
    };
    setJobs(prev => [newJob, ...prev]);

    if (requisitionId) {
      handleUpdateRequisition(requisitionId, { jobId: newJob.id, status: 'Approved' });
    }
    addToast('Job posting created', 'success');

    // Asynchronously save to Laravel backend
    if (user?.id !== 'demo-user') {
      apiCreateJob({ ...jobData, company_id: targetCompanyId }, projectId, requisitionId).then(createdJob => {
        if (createdJob) {
          setJobs(prev => prev.map(j => j.id === newJob.id ? createdJob : j));
        }
      }).catch(err => console.warn('Failed to sync job creation to backend:', err));
    }

    return newJob;
  };
  
  const handleUpdateJob = (jobId: string, updates: Partial<Job>) => {
      setJobs(prevJobs =>
          prevJobs.map(job =>
              job.id === jobId ? { ...job, ...updates } : job
          )
      );
      addToast('Job updated', 'success');

      // Asynchronously update in Laravel backend
      if (user?.id !== 'demo-user') {
        apiUpdateJob(jobId, updates).catch(err => {
          console.warn('Failed to sync job update to backend:', err);
        });
      }
  };

  const handleAddProject = (projectData: Omit<Project, 'id'>, requisitionIds: string[]) => {
    const newProject: Project = {
        ...projectData,
        id: `proj${Date.now()}`,
        companyId: user?.id,
    };
    setProjects(prev => [newProject, ...prev]);

    // Asynchronously save to Laravel backend
    if (user?.id !== 'demo-user') {
      apiCreateProject({
        name: projectData.name,
        description: projectData.description,
        owner_id: projectData.ownerId,
        company_id: user?.id
      }).then(createdProj => {
        if (createdProj) {
          setProjects(prev => prev.map(p => p.id === newProject.id ? createdProj : p));
        }
      }).catch(err => console.warn('Failed to sync project creation to backend:', err));
    }

    const requisitionsToConvert = requisitions.filter(r => requisitionIds.includes(r.id));
    requisitionsToConvert.forEach(req => {
        const jobData: NewJobData = {
            title: req.title,
            department: req.department,
            level: req.experienceLevel,
            location: req.location,
            employmentType: req.employmentType,
            salaryMin: req.salaryMin,
            salaryMax: req.salaryMax,
            deadline: req.deadline,
            jobDescription: `Job description for ${req.title}. Based on requisition #${req.id}.`,
        };
        handleAddJob(jobData, newProject.id, req.id);
    });
    addToast('Project created successfully', 'success');
};

  const handleScheduleInterview = (interviewData: Omit<Interview, 'id' | 'status'>) => {
    const newInterview: Interview = {
        ...interviewData,
        id: `iv${Date.now()}`,
        status: InterviewStatus.Scheduled,
    };
    setInterviews(prev => [...prev, newInterview]);
    addToast('Interview scheduled', 'success');

    // Asynchronously save to Laravel backend
    if (user?.id !== 'demo-user') {
      apiCreateInterview(interviewData).then(createdIv => {
        if (createdIv) {
          setInterviews(prev => prev.map(iv => iv.id === newInterview.id ? createdIv : iv));
        }
      }).catch(err => console.warn('Failed to sync interview to backend:', err));
    }
  };
  
  const handleUpdateApplication = (applicationId: string, updates: Partial<Application>) => {
    setApplications(prevApps => 
      prevApps.map(app => {
        if (app.id !== applicationId) return app;

        if (updates.stageId && updates.stageId !== app.stageId) {
            const newHistoryEntry = {
                stageId: updates.stageId,
                date: new Date().toISOString(),
                changedBy: 'Alex Greene',
            };
            const newStageHistory = [...(app.stageHistory || []), newHistoryEntry];
            addToast(`Candidate moved to ${stages.find(s => s.id === updates.stageId)?.name}`, 'info');
            return { ...app, ...updates, stageHistory: newStageHistory };
        }
        
        return { ...app, ...updates };
      })
    );

    // Asynchronously update in Laravel backend
    if (user?.id !== 'demo-user') {
      apiUpdateApplication(applicationId, updates).catch(err => {
        console.warn('Failed to sync application update to backend:', err);
      });
    }
  };

  const handleDeleteApplication = (applicationId: string) => {
    setApplications(prev => prev.filter(app => app.id !== applicationId));
    addToast(language === 'id' ? 'Lamaran berhasil dihapus' : 'Application deleted successfully', 'info');
    if (user?.id !== 'demo-user') {
      apiDeleteApplication(applicationId).catch(err => {
        console.warn('Failed to delete application on backend:', err);
      });
    }
  };

  const handleBulkDeleteApplications = (applicationIds: string[]) => {
    const idSet = new Set(applicationIds);
    setApplications(prev => prev.filter(app => !idSet.has(app.id)));
    addToast(language === 'id' ? (applicationIds.length + ' lamaran berhasil dihapus') : (applicationIds.length + ' applications deleted'), 'info');
    if (user?.id !== 'demo-user') {
      Promise.all(applicationIds.map(id => apiDeleteApplication(id))).catch(err => {
        console.warn('Failed to bulk delete applications on backend:', err);
      });
    }
  };

  const handleBulkRejectApplications = (applicationIds: string[]) => {
    const idSet = new Set(applicationIds);
    setApplications(prev => prev.map(app => {
      if (idSet.has(app.id)) {
        return { ...app, knockedOut: true };
      }
      return app;
    }));
    addToast(language === 'id' ? (applicationIds.length + ' lamaran ditolak') : (applicationIds.length + ' applications rejected'), 'warning');
    if (user?.id !== 'demo-user') {
      Promise.all(applicationIds.map(id => apiUpdateApplication(id, { knockedOut: true } as any))).catch(err => {
        console.warn('Failed to bulk reject applications on backend:', err);
      });
    }
  };
  
  const handleUpdateInterview = (interviewId: string, updates: Partial<Omit<Interview, 'id'>>) => {
     setInterviews(prevInts => 
      prevInts.map(iv => 
        iv.id === interviewId ? { ...iv, ...updates } : iv
      )
    );
    if (updates.status === InterviewStatus.Completed) {
        addToast('Interview feedback saved', 'success');
    }
  };

  const handleAddTask = (taskData: Omit<Task, 'id' | 'status'>) => {
    const newTask: Task = {
        ...taskData,
        id: `task${Date.now()}`,
        status: TaskStatus.ToDo,
    };
    setTasks(prev => [...prev, newTask]);
    addToast('Task created', 'success');
  };

  const handleUpdateTask = (taskId: string, updates: Partial<Task>) => {
      setTasks(prevTasks =>
          prevTasks.map(task =>
              task.id === taskId ? { ...task, ...updates } : task
          )
      );
      if (updates.status === TaskStatus.Completed) {
          addToast('Task completed', 'success');
      }
  };

  const handleDeleteTask = (taskId: string) => {
    setTasks(prevTasks => prevTasks.filter(task => task.id !== taskId));
    addToast('Task deleted', 'info');
  };

  const handleResetData = () => {
    localStorage.clear();
    window.location.reload();
  };

  const handleLogout = () => {
    sessionStorage.removeItem('ts_demo_active');
    // Bersihkan semua data sesi dan cache ATS (kecuali preferensi bahasa & tema) agar tidak bocor antar akun
    Object.keys(localStorage).forEach(key => {
      if (key.startsWith('ts_') && key !== 'ts_lang' && key !== 'ts_theme') {
        localStorage.removeItem(key);
      }
    });
    setUser(null);
    setActiveTab('requisition');
    addToast(language === 'id' ? 'Berhasil keluar' : 'Logged out successfully', 'info');
    window.location.reload();
  };

  const handleUpgrade = (planType: string) => {
    if (!user) return;
    const updatedUser: User = {
      ...user,
      subscription: {
        ...user.subscription,
        type: planType as any,
        status: 'active',
        expiryDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
        limitJobs: planType === 'pro' ? 999 : planType === 'enterprise' ? 9999 : 3,
        limitCandidates: planType === 'pro' ? 9999 : planType === 'enterprise' ? 99999 : 100
      }
    };
    setUser(updatedUser);
    addToast(`Upgraded to ${planType} plan!`, 'success');
  };

  const urlParams = new URLSearchParams(window.location.search);
  const publicJobId = urlParams.get('jobId');

  const jobForPublicForm = useMemo(() => {
      if (!publicJobId) return null;
      return jobs.find(j => j.id === publicJobId);
  }, [publicJobId, jobs]);

  // Render public job application form if jobId is in URL
  if (publicJobId) {
    if (!jobForPublicForm) {
      return (
        <div className="h-screen w-screen flex items-center justify-center bg-slate-100 dark:bg-slate-950 text-slate-800 dark:text-slate-200">
          <div className="text-center p-8">
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Job Not Found</h1>
            <p className="text-slate-500 dark:text-slate-400 mt-2">The job posting you are looking for does not exist or has been closed.</p>
            <a href={window.location.pathname} className="mt-6 inline-block px-5 py-2.5 text-sm font-semibold text-white bg-primary-600 rounded-md shadow-sm hover:bg-primary-700">Return Home</a>
          </div>
        </div>
      );
    }
    return <JobApplicationForm job={jobForPublicForm} onSubmit={handleAddCandidateAndApplication} />;
  }

  const handleAuthSuccess = (authenticatedUser: User) => {
    setUser(authenticatedUser);
    setAuthMode('none');
    if (authenticatedUser.role === 'super_admin') {
      setActiveTab('admin_users');
    } else {
      setActiveTab('requisition');
    }
  };

  if (!user) {
    // Admin portal is completely separate (frontend-admin/) - no admin login here
    if (authMode === 'user') {
      return <UserLoginPage language={language} onAuthSuccess={handleAuthSuccess} onBack={() => setAuthMode('none')} />;
    }
    return (
      <LandingPage 
        language={language} 
        onLanguageChange={setLanguage} 
        theme={theme} 
        toggleTheme={toggleTheme} 
        onGetStarted={() => setAuthMode('user')} 
        onLogin={() => setAuthMode('user')} 
      />
    );
  }

  // Render main dashboard
  return (
    <div className="bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-50 h-[100dvh] w-full flex font-sans transition-colors duration-300 overflow-hidden relative">
      <Sidebar activeTab={activeTab} onTabChange={handleTabChange} isOpen={isMobileSidebarOpen} onClose={() => setIsMobileSidebarOpen(false)} language={language} user={user} />
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden relative w-full lg:w-auto">
        <Header 
          theme={theme} 
          toggleTheme={toggleTheme} 
          language={language} 
          onLanguageChange={setLanguage} 
          user={user}
          onLogout={handleLogout}
          onMenuToggle={() => setIsMobileSidebarOpen(true)}
          onUpdateUser={setUser}
          addToast={addToast}
        />
        
        <main className="flex-1 overflow-y-auto overflow-x-hidden w-full relative">
          <AnimatePresence mode="wait">
            {isLoading || (isLoadingData && user?.id !== 'demo-user') ? (
              <motion.div
                key="skeleton"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <DashboardSkeleton />
              </motion.div>
            ) : (
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                transition={{ duration: 0.2, ease: "easeOut" }}
                className="p-4 sm:p-6 lg:p-8 w-full max-w-screen-2xl mx-auto"
              >
                <Dashboard
                  activeTab={activeTab}
                  onTabChange={handleTabChange}
                  jobs={tenantJobsWithCounts}
                  projects={tenantProjects}
                  applications={applicationsWithDetails}
                  interviewers={MOCK_INTERVIEWERS}
                  stages={stages}
                  requisitions={tenantRequisitions}
                  language={language}
                  onLanguageChange={setLanguage}
                  user={user}
                  onUpgrade={handleUpgrade}
                  onResetData={handleResetData}
                  onUpdateUser={setUser}
                  addToast={addToast}
                  onSetStages={setStages}
                  onAddCandidate={handleAddCandidate}
                  onAddCandidateAndApplication={handleAddCandidateAndApplication}
                  onAddProject={handleAddProject}
                  onAddJob={handleAddJob}
                  onUpdateJob={handleUpdateJob}
                  onAddRequisition={handleAddRequisition}
                  onUpdateRequisition={handleUpdateRequisition}
                  onScheduleInterview={handleScheduleInterview}
                  onUpdateApplication={handleUpdateApplication}
                  onDeleteApplication={handleDeleteApplication}
                  onBulkDeleteApplications={handleBulkDeleteApplications}
                  onBulkRejectApplications={handleBulkRejectApplications}
                  onUpdateInterview={handleUpdateInterview}
                  onAddTask={handleAddTask}
                  onUpdateTask={handleUpdateTask}
                  onDeleteTask={handleDeleteTask}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </main>
        <FeedbackWidget 
          currentTab={activeTab} 
          user={user} 
          language={language} 
          addToast={addToast} 
        />

        <AnimatePresence>
          {!onboardingComplete && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm"
              onClick={(e) => { if (e.target === e.currentTarget) setOnboardingComplete(true); }}
            >
              <motion.div
                initial={{ scale: 0.9, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl max-w-md w-full overflow-hidden"
                style={{ maxHeight: '90vh', overflowY: 'auto' }}
              >
                <div className="p-6 text-center space-y-4">
                  <div className="w-12 h-12 bg-white dark:bg-slate-800 rounded-2xl flex items-center justify-center mx-auto shadow-sm p-2">
                    <img src="/logo.png" alt="TalentStream Logo" className="w-full h-full object-contain" />
                  </div>
                  <div className="space-y-2">
                    <h2 className="text-xl font-bold text-slate-900 dark:text-white">Welcome to TalentStream</h2>
                    <p className="text-slate-500 dark:text-slate-400 text-sm">
                      Your end-to-end recruitment workspace. We've pre-loaded some sample data to help you explore the features.
                    </p>
                  </div>
                  <button
                    id="onboarding-get-started"
                    onClick={() => setOnboardingComplete(true)}
                    className="w-full py-3 px-4 bg-primary-600 hover:bg-primary-700 text-white font-semibold rounded-xl transition-all shadow-lg shadow-primary-600/20"
                  >
                    Get Started
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default App;



