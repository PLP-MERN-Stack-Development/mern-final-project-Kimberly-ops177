import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import Course from '../src/models/Course.js';
import Module from '../src/models/Module.js';
import User from '../src/models/User.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config({ path: join(__dirname, '../.env') });

const addNewCourses = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('MongoDB Connected');

    // Find the instructor
    const instructor = await User.findOne({ email: 'instructor@eduhub.com' });
    if (!instructor) {
      console.error('Instructor not found. Please create an instructor account first.');
      process.exit(1);
    }

    console.log(`Found instructor: ${instructor.name}`);

    // Cybersecurity Course (10 months)
    console.log('\nCreating Cybersecurity Fundamentals to Advanced course...');
    const cybersecurityCourse = await Course.create({
      title: 'Cybersecurity Fundamentals to Advanced',
      description: 'Comprehensive 10-month cybersecurity program covering everything from networking basics to advanced penetration testing. Learn ethical hacking, security operations, incident response, and cloud security. Prepare for industry certifications like Security+, CEH, and CISSP.',
      instructor: instructor._id,
      category: 'Cybersecurity',
      level: 'beginner',
      price: 399,
      selfPacedPrice: 299,
      learningModes: ['self-paced', 'with-tutor'],
      deliveryMode: 'online',
      duration: 1200, // 10 months * 120 hours
      language: 'English',
      requirements: [
        'Basic computer literacy',
        'Understanding of networking concepts (will be covered in Month 1)',
        'Windows and Linux operating systems familiarity',
        'Willingness to learn command-line tools'
      ],
      whatYouWillLearn: [
        'Networking fundamentals and protocols',
        'Linux security and hardening',
        'Ethical hacking and penetration testing',
        'Web application security testing',
        'Cryptography and encryption',
        'Security operations and monitoring',
        'Incident response and forensics',
        'Cloud security (AWS, Azure, GCP)',
        'Prepare for Security+, CEH, CISSP certifications',
        'Build a professional cybersecurity portfolio'
      ],
      tags: [
        'cybersecurity',
        'ethical hacking',
        'penetration testing',
        'security',
        'network security',
        'web security',
        'cloud security',
        'certification prep'
      ],
      isPublished: true
    });

    // Create modules for Cybersecurity course
    const cybersecurityModules = [
      {
        course: cybersecurityCourse._id,
        title: 'Month 1: Networking & Security Fundamentals',
        description: 'TCP/IP model, OSI layers, subnetting, routing, firewalls, VPNs, security principles (CIA triad), risk management, and security frameworks.',
        order: 1
      },
      {
        course: cybersecurityCourse._id,
        title: 'Month 2: Linux Security & Command Line',
        description: 'Linux architecture, command-line mastery, user management, permissions, SSH, system hardening, security tools, and bash scripting.',
        order: 2
      },
      {
        course: cybersecurityCourse._id,
        title: 'Month 3: Information Gathering & Reconnaissance',
        description: 'OSINT techniques, passive reconnaissance, active scanning with Nmap, vulnerability assessment, enumeration, and footprinting.',
        order: 3
      },
      {
        course: cybersecurityCourse._id,
        title: 'Month 4: Exploitation & Post-Exploitation',
        description: 'Metasploit framework, exploit development basics, buffer overflows, privilege escalation, lateral movement, and maintaining access.',
        order: 4
      },
      {
        course: cybersecurityCourse._id,
        title: 'Month 5: Web Application Security',
        description: 'OWASP Top 10, SQL injection, XSS, CSRF, authentication flaws, Burp Suite, web application firewalls, and secure coding.',
        order: 5
      },
      {
        course: cybersecurityCourse._id,
        title: 'Month 6: Wireless & Network Security',
        description: 'WiFi security (WPA2, WPA3), wireless attacks, network segmentation, IDS/IPS, SIEM tools, and network monitoring.',
        order: 6
      },
      {
        course: cybersecurityCourse._id,
        title: 'Month 7: Cryptography & PKI',
        description: 'Encryption algorithms (AES, RSA), hashing, digital signatures, SSL/TLS, PKI infrastructure, key management, and cryptanalysis basics.',
        order: 7
      },
      {
        course: cybersecurityCourse._id,
        title: 'Month 8: Security Operations & Incident Response',
        description: 'SOC operations, log analysis, threat hunting, malware analysis, digital forensics, incident handling, and disaster recovery.',
        order: 8
      },
      {
        course: cybersecurityCourse._id,
        title: 'Month 9: Cloud Security & Compliance',
        description: 'AWS/Azure/GCP security, IAM, container security, serverless security, compliance frameworks (ISO 27001, GDPR, HIPAA), and security auditing.',
        order: 9
      },
      {
        course: cybersecurityCourse._id,
        title: 'Month 10: Advanced Topics & Certification Prep',
        description: 'Red team vs blue team, threat intelligence, security automation, DevSecOps, bug bounty hunting, certification exam preparation, and capstone penetration testing project.',
        order: 10
      }
    ];

    for (const moduleData of cybersecurityModules) {
      await Module.create(moduleData);
    }
    console.log('✓ Cybersecurity course and modules created');

    // DevOps Engineering Course (8 months)
    console.log('\nCreating DevOps Engineering Bootcamp course...');
    const devopsCourse = await Course.create({
      title: 'DevOps Engineering Bootcamp',
      description: 'Master DevOps practices in 8 months! Learn CI/CD, infrastructure as code, containerization, orchestration, monitoring, and cloud platforms. Build automated pipelines, manage Kubernetes clusters, and implement site reliability engineering practices.',
      instructor: instructor._id,
      category: 'DevOps',
      level: 'intermediate',
      price: 349,
      selfPacedPrice: 249,
      learningModes: ['self-paced', 'with-tutor'],
      deliveryMode: 'online',
      duration: 960, // 8 months * 120 hours
      language: 'English',
      requirements: [
        'Basic programming knowledge (Python or JavaScript)',
        'Understanding of web applications',
        'Familiarity with Linux command line',
        'Basic networking concepts',
        'Git version control basics'
      ],
      whatYouWillLearn: [
        'CI/CD pipeline design and implementation',
        'Docker containerization and best practices',
        'Kubernetes orchestration and management',
        'Infrastructure as Code with Terraform and Ansible',
        'Cloud platforms (AWS, Azure, GCP)',
        'Monitoring and observability (Prometheus, Grafana)',
        'Configuration management',
        'GitOps workflows',
        'Site Reliability Engineering (SRE)',
        'Security and compliance automation'
      ],
      tags: [
        'devops',
        'ci/cd',
        'docker',
        'kubernetes',
        'terraform',
        'ansible',
        'aws',
        'cloud',
        'automation',
        'sre'
      ],
      isPublished: true
    });

    // Create modules for DevOps course
    const devopsModules = [
      {
        course: devopsCourse._id,
        title: 'Month 1: DevOps Foundations & Version Control',
        description: 'DevOps culture and principles, Agile methodologies, Git advanced workflows, branching strategies, Git hooks, GitHub/GitLab CI, and collaboration best practices.',
        order: 1
      },
      {
        course: devopsCourse._id,
        title: 'Month 2: CI/CD Fundamentals',
        description: 'Continuous integration concepts, Jenkins setup and configuration, pipeline as code, automated testing, artifact management, and deployment strategies (blue-green, canary).',
        order: 2
      },
      {
        course: devopsCourse._id,
        title: 'Month 3: Containerization with Docker',
        description: 'Docker architecture, Dockerfile optimization, multi-stage builds, Docker Compose, container networking, volumes, security best practices, and registry management.',
        order: 3
      },
      {
        course: devopsCourse._id,
        title: 'Month 4: Container Orchestration with Kubernetes',
        description: 'Kubernetes architecture, pods, services, deployments, ConfigMaps, secrets, ingress, persistent volumes, StatefulSets, and cluster management.',
        order: 4
      },
      {
        course: devopsCourse._id,
        title: 'Month 5: Infrastructure as Code',
        description: 'Terraform fundamentals, HCL syntax, modules, state management, workspaces, Ansible playbooks, inventory management, roles, and configuration management.',
        order: 5
      },
      {
        course: devopsCourse._id,
        title: 'Month 6: Cloud Platforms & Services',
        description: 'AWS core services (EC2, S3, RDS, Lambda), Azure fundamentals, GCP basics, cloud-native architectures, serverless computing, and cost optimization.',
        order: 6
      },
      {
        course: devopsCourse._id,
        title: 'Month 7: Monitoring, Logging & Observability',
        description: 'Prometheus metrics collection, Grafana dashboards, ELK stack (Elasticsearch, Logstash, Kibana), distributed tracing, alerting, and SLI/SLO/SLA.',
        order: 7
      },
      {
        course: devopsCourse._id,
        title: 'Month 8: Advanced DevOps & SRE',
        description: 'GitOps with ArgoCD/Flux, service mesh (Istio), chaos engineering, security automation (DevSecOps), incident management, and building a complete production-grade infrastructure project.',
        order: 8
      }
    ];

    for (const moduleData of devopsModules) {
      await Module.create(moduleData);
    }
    console.log('✓ DevOps course and modules created');

    console.log('\n✅ All new courses and modules created successfully!');
    console.log('\nCourse Summary:');
    console.log(`- Cybersecurity: 10 months, With Tutor: $399, Self-Paced: $299`);
    console.log(`- DevOps: 8 months, With Tutor: $349, Self-Paced: $249`);

    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
};

addNewCourses();
