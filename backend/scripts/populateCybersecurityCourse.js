import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Course from '../src/models/Course.js';
import Module from '../src/models/Module.js';
import Lesson from '../src/models/Lesson.js';
import User from '../src/models/User.js';

dotenv.config();

const populateCybersecurityCourse = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/lms');
    console.log('MongoDB Connected');

    // Find the Cybersecurity course
    const cybersecurityCourse = await Course.findOne({ title: /Cybersecurity/i });
    if (!cybersecurityCourse) {
      console.error('Cybersecurity course not found!');
      process.exit(1);
    }

    console.log(`Found course: ${cybersecurityCourse.title}`);

    // Find an instructor
    const instructor = await User.findOne({ role: 'instructor' });
    if (!instructor) {
      console.error('Instructor not found!');
      process.exit(1);
    }

    console.log(`Instructor: ${instructor.name}\n`);

    // Delete existing modules and lessons for this course
    const existingModules = await Module.find({ course: cybersecurityCourse._id });
    for (const module of existingModules) {
      await Lesson.deleteMany({ module: module._id });
    }
    await Module.deleteMany({ course: cybersecurityCourse._id });
    console.log('Cleared existing modules and lessons\n');

    // Course structure with modules and lessons
    const courseStructure = [
      {
        title: 'Introduction to Cybersecurity',
        description: 'Foundational concepts of cybersecurity and information security',
        lessons: [
          {
            title: 'What is Cybersecurity?',
            description: 'Understanding the fundamentals of cybersecurity and its importance',
            type: 'recorded',
            videoUrl: 'https://www.youtube.com/embed/inWWhr5tnEA',
            duration: 20,
            content: `# What is Cybersecurity?

Cybersecurity is the practice of protecting systems, networks, and programs from digital attacks.

## Key Concepts

### The CIA Triad
The foundation of information security:
- **Confidentiality**: Ensuring data is accessible only to authorized parties
- **Integrity**: Maintaining accuracy and completeness of data
- **Availability**: Ensuring authorized users have access when needed

## Types of Cyber Threats
- **Malware**: Viruses, worms, trojans, ransomware
- **Phishing**: Social engineering attacks via email
- **Man-in-the-Middle**: Intercepting communications
- **Denial of Service**: Overwhelming systems with traffic
- **SQL Injection**: Exploiting database vulnerabilities

## Why Cybersecurity Matters
- Protecting sensitive data
- Maintaining business continuity
- Compliance with regulations
- Preserving reputation and trust
- Financial security`,
            objectives: [
              'Understand the CIA triad',
              'Identify common cyber threats',
              'Recognize the importance of cybersecurity'
            ],
            isFree: true
          },
          {
            title: 'Information Security Principles',
            description: 'Core principles and best practices in information security',
            type: 'recorded',
            videoUrl: 'https://www.youtube.com/embed/U_P23SqJaDc',
            duration: 25,
            content: `# Information Security Principles

## Defense in Depth
Multiple layers of security controls:
- **Perimeter Security**: Firewalls, IDS/IPS
- **Network Security**: VLANs, encryption
- **Endpoint Security**: Antivirus, EDR
- **Application Security**: Secure coding, WAF
- **Data Security**: Encryption, access controls

## Least Privilege Principle
Users should have only the minimum access necessary:
\`\`\`bash
# Example: Linux file permissions
chmod 640 sensitive_file.txt
# Owner: read/write, Group: read, Others: no access
\`\`\`

## Security by Design
- Incorporate security from the start
- Threat modeling
- Secure coding practices
- Regular security assessments

## Zero Trust Architecture
- Never trust, always verify
- Verify explicitly
- Use least privileged access
- Assume breach`,
            objectives: [
              'Apply defense in depth strategy',
              'Implement least privilege principle',
              'Understand zero trust architecture'
            ],
            isFree: true
          },
          {
            title: 'Cybersecurity Frameworks and Standards',
            description: 'Overview of NIST, ISO 27001, and other security frameworks',
            type: 'recorded',
            videoUrl: 'https://www.youtube.com/embed/4udKGMN7vGE',
            duration: 30,
            content: `# Cybersecurity Frameworks and Standards

## NIST Cybersecurity Framework
Five core functions:
1. **Identify**: Asset management, risk assessment
2. **Protect**: Access control, data security
3. **Detect**: Continuous monitoring, anomaly detection
4. **Respond**: Incident response planning
5. **Recover**: Recovery planning, improvements

## ISO/IEC 27001
International standard for information security management:
- Risk assessment methodology
- Security controls
- Management responsibility
- Continuous improvement

## CIS Controls
20 critical security controls:
- Inventory of assets
- Secure configurations
- Vulnerability management
- Access control management

## Compliance Requirements
- **GDPR**: Data protection and privacy
- **HIPAA**: Healthcare data security
- **PCI DSS**: Payment card security
- **SOC 2**: Service organization controls`,
            objectives: [
              'Understand NIST Cybersecurity Framework',
              'Learn about ISO 27001 requirements',
              'Identify compliance obligations'
            ],
            isFree: false
          }
        ]
      },
      {
        title: 'Network Security Fundamentals',
        description: 'Securing networks and understanding network-based attacks',
        lessons: [
          {
            title: 'Network Security Basics',
            description: 'Understanding network protocols and security concepts',
            type: 'recorded',
            videoUrl: 'https://www.youtube.com/embed/qiQR5rTSshw',
            duration: 35,
            content: `# Network Security Basics

## OSI Model and Security
Understanding security at each layer:
- **Layer 7 (Application)**: WAF, API security
- **Layer 4 (Transport)**: TLS/SSL, port filtering
- **Layer 3 (Network)**: IPsec, routing security
- **Layer 2 (Data Link)**: MAC filtering, VLANs

## Common Network Protocols
\`\`\`
TCP/IP Suite:
- HTTP/HTTPS (80/443)
- FTP/SFTP (21/22)
- SSH (22)
- DNS (53)
- SMTP (25)
\`\`\`

## Network Segmentation
- DMZ (Demilitarized Zone)
- Internal networks
- Guest networks
- Management networks

## Virtual Private Networks (VPN)
- Site-to-site VPN
- Remote access VPN
- IPsec vs SSL VPN
- Split tunneling considerations`,
            objectives: [
              'Understand network layers and security',
              'Implement network segmentation',
              'Configure VPN solutions'
            ],
            isFree: false
          },
          {
            title: 'Firewalls and Intrusion Detection',
            description: 'Implementing firewalls, IDS, and IPS solutions',
            type: 'recorded',
            videoUrl: 'https://www.youtube.com/embed/kDEX1HXybrU',
            duration: 40,
            content: `# Firewalls and Intrusion Detection

## Firewall Types
### Packet Filtering Firewall
\`\`\`bash
# Example iptables rule
iptables -A INPUT -p tcp --dport 22 -s 192.168.1.0/24 -j ACCEPT
iptables -A INPUT -p tcp --dport 22 -j DROP
\`\`\`

### Stateful Inspection
- Tracks connection state
- More intelligent filtering
- Better performance

### Next-Generation Firewalls (NGFW)
- Deep packet inspection
- Application awareness
- Integrated IPS
- SSL inspection

## Intrusion Detection Systems (IDS)
- **Signature-based**: Known attack patterns
- **Anomaly-based**: Baseline deviation
- **NIDS**: Network-based monitoring
- **HIDS**: Host-based monitoring

## Intrusion Prevention Systems (IPS)
- Active blocking of threats
- Inline deployment
- Automated response
- Integration with SIEM`,
            objectives: [
              'Configure firewall rules',
              'Deploy IDS/IPS solutions',
              'Understand detection methodologies'
            ],
            isFree: false
          },
          {
            title: 'Wireless Network Security',
            description: 'Securing WiFi networks and understanding wireless attacks',
            type: 'recorded',
            videoUrl: 'https://www.youtube.com/embed/hKHXLz3FKk8',
            duration: 30,
            content: `# Wireless Network Security

## WiFi Security Protocols
### WPA3 (Recommended)
- SAE (Simultaneous Authentication of Equals)
- Forward secrecy
- 192-bit encryption for enterprise
- Protection against dictionary attacks

### WPA2
- AES encryption
- CCMP protocol
- Still widely used

### Deprecated Protocols
- ❌ WEP: Severely vulnerable
- ❌ WPA: Weak encryption

## Wireless Attack Types
- **Evil Twin**: Rogue access points
- **Deauthentication**: Forcing disconnections
- **Man-in-the-Middle**: Traffic interception
- **WPS Attacks**: PIN brute forcing

## Securing Wireless Networks
\`\`\`
Best Practices:
✓ Use WPA3 or WPA2-Enterprise
✓ Strong, complex passwords
✓ Disable WPS
✓ Hide SSID (security by obscurity)
✓ MAC address filtering (limited effectiveness)
✓ Regular firmware updates
✓ Network segmentation for guests
\`\`\`

## Enterprise WiFi Security
- 802.1X authentication
- RADIUS server integration
- Certificate-based authentication
- Network Access Control (NAC)`,
            objectives: [
              'Configure secure WiFi networks',
              'Identify wireless vulnerabilities',
              'Implement enterprise WiFi security'
            ],
            isFree: false
          }
        ]
      },
      {
        title: 'Cryptography and Encryption',
        description: 'Understanding encryption, hashing, and cryptographic protocols',
        lessons: [
          {
            title: 'Introduction to Cryptography',
            description: 'Basic cryptographic concepts and algorithms',
            type: 'recorded',
            videoUrl: 'https://www.youtube.com/embed/jhXCTbFnK8o',
            duration: 35,
            content: `# Introduction to Cryptography

## Cryptography Fundamentals
Cryptography is the practice of secure communication in the presence of adversaries.

## Types of Encryption
### Symmetric Encryption
Same key for encryption and decryption:
\`\`\`javascript
// Example concept (simplified)
const key = "secret_key";
const encrypted = encrypt(message, key);
const decrypted = decrypt(encrypted, key);
\`\`\`

**Common Algorithms:**
- AES (Advanced Encryption Standard)
- DES/3DES (outdated)
- Blowfish
- ChaCha20

### Asymmetric Encryption
Public key encrypts, private key decrypts:
\`\`\`bash
# RSA key generation
openssl genrsa -out private.pem 2048
openssl rsa -in private.pem -outform PEM -pubout -out public.pem
\`\`\`

**Common Algorithms:**
- RSA
- ECC (Elliptic Curve Cryptography)
- Diffie-Hellman

## Hash Functions
One-way cryptographic functions:
\`\`\`python
import hashlib

# SHA-256 example
hash_object = hashlib.sha256(b'Hello World')
hex_dig = hash_object.hexdigest()
\`\`\`

**Common Hash Algorithms:**
- SHA-256, SHA-384, SHA-512
- MD5 (obsolete, vulnerable)
- SHA-1 (deprecated)`,
            objectives: [
              'Differentiate symmetric and asymmetric encryption',
              'Understand hash functions',
              'Select appropriate cryptographic algorithms'
            ],
            isFree: false
          },
          {
            title: 'Public Key Infrastructure (PKI)',
            description: 'Digital certificates, certificate authorities, and PKI concepts',
            type: 'recorded',
            videoUrl: 'https://www.youtube.com/embed/i-rtxrEz_E8',
            duration: 30,
            content: `# Public Key Infrastructure (PKI)

## PKI Components
- **Certificate Authority (CA)**: Issues digital certificates
- **Registration Authority (RA)**: Verifies certificate requests
- **Certificate Repository**: Stores and distributes certificates
- **Certificate Revocation List (CRL)**: Lists revoked certificates

## Digital Certificates
### X.509 Certificate Structure
\`\`\`
Certificate:
  - Version
  - Serial Number
  - Signature Algorithm
  - Issuer
  - Validity Period
  - Subject
  - Public Key
  - Extensions
  - Signature
\`\`\`

## SSL/TLS Certificates
\`\`\`bash
# View certificate details
openssl x509 -in certificate.crt -text -noout

# Check certificate expiration
openssl x509 -in certificate.crt -noout -dates
\`\`\`

### Certificate Types
- **DV (Domain Validated)**: Basic validation
- **OV (Organization Validated)**: Company verification
- **EV (Extended Validation)**: Rigorous verification
- **Wildcard**: Covers subdomains
- **Multi-Domain (SAN)**: Multiple domains

## Certificate Lifecycle
1. Key pair generation
2. Certificate signing request (CSR)
3. CA validation
4. Certificate issuance
5. Certificate deployment
6. Renewal or revocation`,
            objectives: [
              'Understand PKI architecture',
              'Manage digital certificates',
              'Implement SSL/TLS'
            ],
            isFree: false
          },
          {
            title: 'Encryption Best Practices',
            description: 'Implementing encryption in applications and systems',
            type: 'recorded',
            videoUrl: 'https://www.youtube.com/embed/C4ATDMIz5wc',
            duration: 25,
            content: `# Encryption Best Practices

## Data at Rest Encryption
### File System Encryption
\`\`\`bash
# Linux LUKS encryption
cryptsetup luksFormat /dev/sdb1
cryptsetup luksOpen /dev/sdb1 encrypted_disk
\`\`\`

### Database Encryption
\`\`\`sql
-- MySQL encryption
CREATE TABLE users (
  id INT PRIMARY KEY,
  email VARCHAR(255),
  password_hash VARBINARY(255)
) ENCRYPTION='Y';
\`\`\`

## Data in Transit Encryption
### TLS Configuration
\`\`\`nginx
server {
    listen 443 ssl http2;
    ssl_certificate /path/to/cert.pem;
    ssl_certificate_key /path/to/key.pem;

    # Strong cipher suites
    ssl_ciphers HIGH:!aNULL:!MD5;
    ssl_prefer_server_ciphers on;

    # TLS 1.2 and 1.3 only
    ssl_protocols TLSv1.2 TLSv1.3;
}
\`\`\`

## Key Management
- **Key Rotation**: Regular key updates
- **Key Storage**: HSM, key vaults
- **Key Escrow**: Recovery mechanisms
- **Key Destruction**: Secure deletion

## Common Mistakes to Avoid
❌ Rolling your own crypto
❌ Hardcoded keys in code
❌ Using weak algorithms (MD5, DES)
❌ Improper IV/salt usage
❌ Insufficient key length`,
            objectives: [
              'Implement encryption for data at rest',
              'Configure TLS properly',
              'Manage cryptographic keys securely'
            ],
            isFree: false
          }
        ]
      },
      {
        title: 'Web Application Security',
        description: 'OWASP Top 10 and secure web development practices',
        lessons: [
          {
            title: 'OWASP Top 10 Vulnerabilities',
            description: 'Understanding the most critical web application security risks',
            type: 'recorded',
            videoUrl: 'https://www.youtube.com/embed/avFR_Af0KGk',
            duration: 45,
            content: `# OWASP Top 10 Vulnerabilities

## 1. Broken Access Control
Users can access unauthorized resources:
\`\`\`javascript
// Vulnerable
app.get('/api/users/:id', (req, res) => {
  const user = getUser(req.params.id); // No authorization check!
  res.json(user);
});

// Secure
app.get('/api/users/:id', authenticate, (req, res) => {
  if (req.user.id !== req.params.id && !req.user.isAdmin) {
    return res.status(403).json({ error: 'Forbidden' });
  }
  const user = getUser(req.params.id);
  res.json(user);
});
\`\`\`

## 2. Cryptographic Failures
Exposing sensitive data:
\`\`\`javascript
// Vulnerable - storing plain text password
const user = { password: req.body.password };

// Secure - hashing password
const bcrypt = require('bcrypt');
const hashedPassword = await bcrypt.hash(req.body.password, 10);
const user = { password: hashedPassword };
\`\`\`

## 3. Injection
SQL, NoSQL, command injection:
\`\`\`javascript
// Vulnerable to SQL injection
const query = "SELECT * FROM users WHERE username = '" + username + "'";

// Secure - parameterized query
const query = "SELECT * FROM users WHERE username = ?";
db.query(query, [username]);
\`\`\`

## 4. Insecure Design
Lack of security controls in architecture:
- Missing rate limiting
- No threat modeling
- Inadequate security requirements

## 5. Security Misconfiguration
\`\`\`javascript
// Vulnerable - debug mode in production
app.set('env', 'development');

// Secure
app.set('env', 'production');
app.disable('x-powered-by');
\`\`\``,
            objectives: [
              'Identify OWASP Top 10 vulnerabilities',
              'Implement secure coding practices',
              'Prevent common web attacks'
            ],
            isFree: false
          },
          {
            title: 'Cross-Site Scripting (XSS) Prevention',
            description: 'Understanding and preventing XSS attacks',
            type: 'recorded',
            videoUrl: 'https://www.youtube.com/embed/EoaDgUgS6QA',
            duration: 30,
            content: `# Cross-Site Scripting (XSS) Prevention

## Types of XSS
### Reflected XSS
\`\`\`javascript
// Vulnerable
app.get('/search', (req, res) => {
  res.send('Results for: ' + req.query.q);
});

// Attack: /search?q=<script>alert('XSS')</script>
\`\`\`

### Stored XSS
Malicious script stored in database and displayed to users.

### DOM-based XSS
\`\`\`javascript
// Vulnerable
document.getElementById('output').innerHTML = location.hash.substring(1);
\`\`\`

## Prevention Techniques
### 1. Input Validation
\`\`\`javascript
const validator = require('validator');

if (!validator.isAlphanumeric(input)) {
  throw new Error('Invalid input');
}
\`\`\`

### 2. Output Encoding
\`\`\`javascript
// React automatically escapes
<div>{userInput}</div>

// Manual encoding
const escape = require('escape-html');
const safe = escape(userInput);
\`\`\`

### 3. Content Security Policy
\`\`\`javascript
app.use((req, res, next) => {
  res.setHeader(
    "Content-Security-Policy",
    "default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'"
  );
  next();
});
\`\`\`

### 4. HTTPOnly Cookies
\`\`\`javascript
res.cookie('session', token, {
  httpOnly: true,
  secure: true,
  sameSite: 'strict'
});
\`\`\``,
            objectives: [
              'Identify XSS vulnerabilities',
              'Implement output encoding',
              'Configure Content Security Policy'
            ],
            isFree: false
          },
          {
            title: 'SQL Injection and Prevention',
            description: 'Understanding SQL injection attacks and mitigation strategies',
            type: 'recorded',
            videoUrl: 'https://www.youtube.com/embed/_jKylhJtPmI',
            duration: 35,
            content: `# SQL Injection and Prevention

## Understanding SQL Injection
### Classic SQL Injection
\`\`\`sql
-- Vulnerable query
SELECT * FROM users WHERE username = 'admin' AND password = 'pass123'

-- Malicious input: admin' OR '1'='1
SELECT * FROM users WHERE username = 'admin' OR '1'='1' AND password = 'pass123'
-- Returns all users!
\`\`\`

## Types of SQL Injection
### In-band SQLi
- Error-based: Uses database errors
- Union-based: Combines queries with UNION

### Blind SQLi
- Boolean-based: True/false responses
- Time-based: Delays in responses

### Out-of-band SQLi
- Uses different channels (DNS, HTTP)

## Prevention Methods
### 1. Parameterized Queries
\`\`\`javascript
// Node.js with MySQL
const mysql = require('mysql2');
const query = 'SELECT * FROM users WHERE username = ? AND password = ?';
connection.execute(query, [username, password]);
\`\`\`

### 2. Stored Procedures
\`\`\`sql
CREATE PROCEDURE GetUser(IN user VARCHAR(50))
BEGIN
  SELECT * FROM users WHERE username = user;
END;
\`\`\`

### 3. ORM/Query Builders
\`\`\`javascript
// Sequelize ORM
const user = await User.findOne({
  where: { username: username }
});

// Mongoose for MongoDB
const user = await User.findOne({ username });
\`\`\`

### 4. Input Validation
\`\`\`javascript
const isValidUsername = /^[a-zA-Z0-9_]{3,20}$/.test(username);
if (!isValidUsername) {
  throw new Error('Invalid username format');
}
\`\`\`

### 5. Least Privilege
\`\`\`sql
-- Application user with limited permissions
GRANT SELECT, INSERT, UPDATE ON database.* TO 'appuser'@'localhost';
-- No DROP, ALTER, or admin privileges
\`\`\``,
            objectives: [
              'Understand SQL injection techniques',
              'Use parameterized queries',
              'Implement defense in depth'
            ],
            isFree: false
          },
          {
            title: 'Authentication and Session Management',
            description: 'Secure authentication mechanisms and session handling',
            type: 'recorded',
            videoUrl: 'https://www.youtube.com/embed/501dpx2IjGY',
            duration: 40,
            content: `# Authentication and Session Management

## Secure Password Storage
\`\`\`javascript
const bcrypt = require('bcrypt');

// Registration
const saltRounds = 10;
const hashedPassword = await bcrypt.hash(password, saltRounds);
await User.create({ username, password: hashedPassword });

// Login
const user = await User.findOne({ username });
const match = await bcrypt.compare(password, user.password);
\`\`\`

## Multi-Factor Authentication (MFA)
\`\`\`javascript
const speakeasy = require('speakeasy');

// Generate secret
const secret = speakeasy.generateSecret({ name: 'MyApp' });

// Verify token
const verified = speakeasy.totp.verify({
  secret: secret.base32,
  encoding: 'base32',
  token: userToken
});
\`\`\`

## JSON Web Tokens (JWT)
\`\`\`javascript
const jwt = require('jsonwebtoken');

// Create token
const token = jwt.sign(
  { userId: user.id, role: user.role },
  process.env.JWT_SECRET,
  { expiresIn: '1h' }
);

// Verify token
const decoded = jwt.verify(token, process.env.JWT_SECRET);
\`\`\`

## Session Security
\`\`\`javascript
const session = require('express-session');

app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: true,      // HTTPS only
    httpOnly: true,    // No JavaScript access
    maxAge: 3600000,   // 1 hour
    sameSite: 'strict' // CSRF protection
  }
}));
\`\`\`

## Account Security Features
- Password strength requirements
- Account lockout after failed attempts
- Password reset with token expiration
- Session timeout
- Logout functionality
- Remember me securely

## OAuth 2.0 and OpenID Connect
\`\`\`javascript
// Example: Google OAuth
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;

passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: '/auth/google/callback'
}, (accessToken, refreshToken, profile, done) => {
  // Handle user authentication
}));
\`\`\``,
            objectives: [
              'Implement secure password storage',
              'Set up multi-factor authentication',
              'Manage sessions securely'
            ],
            isFree: false
          }
        ]
      },
      {
        title: 'Ethical Hacking and Penetration Testing',
        description: 'Introduction to ethical hacking methodologies and tools',
        lessons: [
          {
            title: 'Introduction to Ethical Hacking',
            description: 'Understanding ethical hacking principles and methodologies',
            type: 'recorded',
            videoUrl: 'https://www.youtube.com/embed/3Kq1MIfTWCE',
            duration: 30,
            content: `# Introduction to Ethical Hacking

## What is Ethical Hacking?
Authorized attempt to gain unauthorized access to systems, data, or networks to identify vulnerabilities.

## Types of Hackers
- **White Hat**: Ethical hackers
- **Black Hat**: Malicious hackers
- **Gray Hat**: Between ethical and malicious
- **Script Kiddies**: Using existing tools without understanding
- **Hacktivists**: Political/social motivations

## Ethical Hacking Methodology
### 1. Reconnaissance
- Passive: OSINT, public information
- Active: Network scanning, probing

### 2. Scanning and Enumeration
\`\`\`bash
# Nmap network scanning
nmap -sV -sC -p- target.com

# Service enumeration
nmap -sV -p 1-65535 192.168.1.1
\`\`\`

### 3. Gaining Access
- Exploiting vulnerabilities
- Password attacks
- Social engineering

### 4. Maintaining Access
- Backdoors
- Rootkits
- Persistence mechanisms

### 5. Covering Tracks
- Log deletion (for educational purposes only)
- Anti-forensics

## Legal and Ethical Considerations
- **Always get written authorization**
- Scope of engagement
- Rules of engagement
- Responsible disclosure
- Legal frameworks (CFAA, Computer Misuse Act)

## Penetration Testing Types
- **Black Box**: No prior knowledge
- **White Box**: Full knowledge
- **Gray Box**: Partial knowledge`,
            objectives: [
              'Understand ethical hacking principles',
              'Learn penetration testing methodology',
              'Recognize legal requirements'
            ],
            isFree: false
          },
          {
            title: 'Reconnaissance and Information Gathering',
            description: 'OSINT techniques and reconnaissance tools',
            type: 'recorded',
            videoUrl: 'https://www.youtube.com/embed/qwA6MmbeGNo',
            duration: 35,
            content: `# Reconnaissance and Information Gathering

## Open Source Intelligence (OSINT)
### Passive Reconnaissance
\`\`\`bash
# DNS enumeration
dig target.com ANY
nslookup target.com
whois target.com

# Subdomain enumeration
sublist3r -d target.com

# Search engine recon
site:target.com filetype:pdf
\`\`\`

## Social Media Intelligence
- LinkedIn for employee information
- Twitter for tech stack mentions
- GitHub for leaked credentials
- Facebook for social engineering

## Network Reconnaissance
\`\`\`bash
# Ping sweep
nmap -sn 192.168.1.0/24

# Port scanning
nmap -p- -T4 target.com

# Service detection
nmap -sV target.com

# OS detection
nmap -O target.com

# Aggressive scan
nmap -A -T4 target.com
\`\`\`

## Web Application Reconnaissance
\`\`\`bash
# Technology detection
whatweb target.com

# Directory bruteforcing
dirb http://target.com /usr/share/wordlists/dirb/common.txt

# Nikto web scanner
nikto -h http://target.com

# Wayback machine
# Check archive.org for historical data
\`\`\`

## Google Dorking
\`\`\`
site:target.com inurl:admin
site:target.com filetype:sql
intitle:"index of" site:target.com
\`\`\`

## Metadata Analysis
\`\`\`bash
# Extract metadata from files
exiftool document.pdf

# FOCA for metadata extraction
# (Windows tool for document metadata)
\`\`\`

## Email Harvesting
\`\`\`bash
# theHarvester
theHarvester -d target.com -b google,linkedin
\`\`\``,
            objectives: [
              'Perform passive reconnaissance',
              'Use OSINT techniques',
              'Enumerate network services'
            ],
            isFree: false
          },
          {
            title: 'Vulnerability Assessment',
            description: 'Identifying and analyzing security vulnerabilities',
            type: 'recorded',
            videoUrl: 'https://www.youtube.com/embed/PgQqSPKM7KQ',
            duration: 40,
            content: `# Vulnerability Assessment

## Vulnerability Scanning Tools
### Nessus
\`\`\`bash
# Professional vulnerability scanner
# Identifies CVEs, misconfigurations, weak passwords
\`\`\`

### OpenVAS
\`\`\`bash
# Open-source vulnerability scanner
# Start OpenVAS
openvas-start

# Access web interface at https://localhost:9392
\`\`\`

### Nikto
\`\`\`bash
# Web server scanner
nikto -h http://target.com -ssl
\`\`\`

## Web Application Scanning
### OWASP ZAP
\`\`\`bash
# Automated web app scanner
# Proxy-based testing
# Active and passive scanning
\`\`\`

### Burp Suite
- Intercepting proxy
- Scanner
- Intruder
- Repeater
- Spider

## Manual Vulnerability Testing
### SQL Injection Testing
\`\`\`
' OR '1'='1
1' UNION SELECT NULL--
admin'--
\`\`\`

### XSS Testing
\`\`\`javascript
<script>alert('XSS')</script>
<img src=x onerror=alert('XSS')>
\`\`\`

### Command Injection
\`\`\`bash
; ls -la
| cat /etc/passwd
& whoami
\`\`\`

## Vulnerability Analysis
### CVSS Scoring
- Base Score: Inherent vulnerability characteristics
- Temporal Score: Exploit maturity
- Environmental Score: Organization-specific factors

### Severity Ratings
- **Critical**: 9.0 - 10.0
- **High**: 7.0 - 8.9
- **Medium**: 4.0 - 6.9
- **Low**: 0.1 - 3.9

## Exploitation Frameworks
### Metasploit
\`\`\`bash
msfconsole

# Search for exploits
search apache

# Use exploit
use exploit/multi/handler
set PAYLOAD windows/meterpreter/reverse_tcp
set LHOST 192.168.1.100
set LPORT 4444
exploit
\`\`\`

## Reporting Findings
- Executive summary
- Vulnerability details
- Risk assessment
- Remediation recommendations
- Evidence and screenshots`,
            objectives: [
              'Use vulnerability scanning tools',
              'Perform manual security testing',
              'Analyze and report vulnerabilities'
            ],
            isFree: false
          }
        ]
      },
      {
        title: 'Security Operations and Incident Response',
        description: 'SOC operations, incident handling, and security monitoring',
        lessons: [
          {
            title: 'Security Operations Center (SOC)',
            description: 'Understanding SOC operations and security monitoring',
            type: 'recorded',
            videoUrl: 'https://www.youtube.com/embed/OmAmSYMFEXY',
            duration: 30,
            content: `# Security Operations Center (SOC)

## SOC Functions
- **Continuous Monitoring**: 24/7 security surveillance
- **Threat Detection**: Identifying malicious activity
- **Incident Response**: Handling security incidents
- **Threat Intelligence**: Gathering threat data
- **Vulnerability Management**: Identifying and patching vulnerabilities

## SOC Team Roles
### Tier 1 - Security Analysts
- Alert triage
- Initial investigation
- Ticket creation and escalation

### Tier 2 - Incident Responders
- Deep dive analysis
- Containment actions
- Forensic investigation

### Tier 3 - Threat Hunters
- Proactive threat hunting
- Advanced analysis
- Threat intelligence

## SIEM (Security Information and Event Management)
### Popular SIEM Solutions
- Splunk
- ELK Stack (Elasticsearch, Logstash, Kibana)
- IBM QRadar
- ArcSight

### SIEM Capabilities
\`\`\`
Log Collection → Normalization → Correlation → Alerting → Reporting
\`\`\`

## Log Analysis
\`\`\`bash
# Analyzing web server logs
grep "POST" access.log | grep "admin"

# Failed login attempts
grep "Failed password" /var/log/auth.log

# Firewall logs analysis
grep "DENY" /var/log/firewall.log
\`\`\`

## Security Metrics and KPIs
- Mean Time to Detect (MTTD)
- Mean Time to Respond (MTTR)
- Alert volume and false positive rate
- Incident closure rate
- Vulnerability patching time`,
            objectives: [
              'Understand SOC operations',
              'Use SIEM for security monitoring',
              'Analyze security logs effectively'
            ],
            isFree: false
          },
          {
            title: 'Incident Response Process',
            description: 'Handling security incidents from detection to recovery',
            type: 'recorded',
            videoUrl: 'https://www.youtube.com/embed/z_OHhR-qkPI',
            duration: 45,
            content: `# Incident Response Process

## NIST Incident Response Lifecycle
### 1. Preparation
- Develop IR policies and procedures
- Assemble IR team
- Deploy security tools
- Create communication plans

### 2. Detection and Analysis
\`\`\`bash
# Check for indicators of compromise (IOCs)
# Suspicious processes
ps aux | grep suspicious

# Network connections
netstat -tulpn

# Recent file modifications
find / -type f -mtime -1

# Login history
last -a | head -20
\`\`\`

### 3. Containment
**Short-term Containment:**
- Isolate affected systems
- Block malicious IPs
- Disable compromised accounts

**Long-term Containment:**
- Apply patches
- Rebuild systems
- Strengthen security controls

### 4. Eradication
\`\`\`bash
# Remove malware
# Kill malicious processes
kill -9 <PID>

# Remove malicious files
rm -f /path/to/malware

# Remove persistence mechanisms
crontab -r
\`\`\`

### 5. Recovery
- Restore from clean backups
- Verify system integrity
- Monitor for re-infection
- Gradual return to operations

### 6. Lessons Learned
- Post-incident review meeting
- Document findings
- Update procedures
- Implement improvements

## Digital Forensics Basics
\`\`\`bash
# Create disk image
dd if=/dev/sda of=/mnt/evidence/disk.img bs=4M

# Calculate hash for integrity
sha256sum disk.img > disk.img.sha256

# Memory capture
# Using LiME or similar tools

# Network capture
tcpdump -i eth0 -w capture.pcap
\`\`\`

## Incident Classification
- **Security Event**: Observable occurrence
- **Security Incident**: Event that violates security policy
- **Severity Levels**: Critical, High, Medium, Low

## Communication During Incidents
- Internal stakeholders
- Legal and compliance
- Law enforcement (if required)
- Affected customers
- Media relations`,
            objectives: [
              'Execute incident response process',
              'Perform containment and eradication',
              'Conduct post-incident analysis'
            ],
            isFree: false
          },
          {
            title: 'Threat Intelligence and Hunting',
            description: 'Proactive threat hunting and threat intelligence analysis',
            type: 'recorded',
            videoUrl: 'https://www.youtube.com/embed/1bY4L1DjNtI',
            duration: 35,
            content: `# Threat Intelligence and Hunting

## Threat Intelligence Types
### Strategic Intelligence
- Long-term trends
- Threat actor motivations
- Geopolitical context

### Tactical Intelligence
- Attacker TTPs (Tactics, Techniques, Procedures)
- Campaign information
- Attack patterns

### Operational Intelligence
- Specific attacks or campaigns
- Indicators of compromise (IOCs)
- Threat actor infrastructure

### Technical Intelligence
- IP addresses
- Domain names
- File hashes
- Malware signatures

## Threat Intelligence Platforms
- MISP (Malware Information Sharing Platform)
- ThreatConnect
- Anomali
- OpenCTI

## MITRE ATT&CK Framework
\`\`\`
Tactics (Why):
- Initial Access
- Execution
- Persistence
- Privilege Escalation
- Defense Evasion
- Credential Access
- Discovery
- Lateral Movement
- Collection
- Exfiltration
- Impact

Techniques (How):
- Specific methods used
\`\`\`

## Threat Hunting Process
### 1. Hypothesis Creation
\`\`\`
Example: "Attackers may be using PowerShell for reconnaissance"
\`\`\`

### 2. Data Collection
\`\`\`bash
# PowerShell logs
Get-WinEvent -LogName "Windows PowerShell"

# Process creation events
# Event ID 4688 in Windows Security Log
\`\`\`

### 3. Analysis
\`\`\`bash
# Look for suspicious PowerShell execution
grep -i "powershell" /var/log/syslog

# Check for base64 encoded commands
grep -E "powershell.*-enc.*" logs.txt
\`\`\`

### 4. Response
- Validate findings
- Escalate if threat confirmed
- Update detection rules

## Indicators of Compromise (IOCs)
\`\`\`yaml
File Hashes:
  MD5: d41d8cd98f00b204e9800998ecf8427e
  SHA256: e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855

Network IOCs:
  IP: 192.0.2.1
  Domain: malicious.example.com
  URL: http://evil.com/payload.exe

Behavioral IOCs:
  - Unusual outbound connections
  - Abnormal login times
  - Privilege escalation attempts
\`\`\`

## Threat Hunting Tools
\`\`\`bash
# Osquery for endpoint visibility
osquery> SELECT * FROM processes WHERE name LIKE '%powershell%';

# Hunting with Sigma rules
# YAML-based detection rules

# Yara rules for malware detection
yara -r malware_rules.yar /path/to/scan
\`\`\``,
            objectives: [
              'Understand threat intelligence types',
              'Use MITRE ATT&CK framework',
              'Conduct proactive threat hunting'
            ],
            isFree: false
          }
        ]
      }
    ];

    // Create modules and lessons
    let totalDuration = 0;
    let moduleOrder = 1;

    for (const moduleData of courseStructure) {
      const module = await Module.create({
        title: moduleData.title,
        description: moduleData.description,
        course: cybersecurityCourse._id,
        instructor: instructor._id,
        order: moduleOrder++
      });

      console.log(`Created module: ${module.title}`);

      let lessonOrder = 1;
      for (const lessonData of moduleData.lessons) {
        const lesson = await Lesson.create({
          title: lessonData.title,
          description: lessonData.description,
          module: module._id,
          course: cybersecurityCourse._id,
          instructor: instructor._id,
          type: lessonData.type,
          videoUrl: lessonData.videoUrl,
          duration: lessonData.duration,
          content: lessonData.content,
          objectives: lessonData.objectives,
          isFree: lessonData.isFree,
          order: lessonOrder++
        });

        totalDuration += lessonData.duration;
        console.log(`  - Created lesson: ${lesson.title} (${lesson.duration} min)`);
      }
    }

    console.log(`\n✅ Successfully populated Cybersecurity course!`);
    console.log(`Total modules: ${courseStructure.length}`);
    console.log(`Total lessons: ${courseStructure.reduce((sum, m) => sum + m.lessons.length, 0)}`);
    console.log(`Total duration: ${totalDuration} minutes (${(totalDuration / 60).toFixed(1)} hours)`);

    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
};

populateCybersecurityCourse();
