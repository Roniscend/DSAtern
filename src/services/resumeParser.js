/**
 * Resume Parser Service
 * Extracts raw text from PDF/TXT files and detects tech skills client-side.
 * No data ever leaves the browser.
 */

// Extended tech keyword list for skill detection
const TECH_KEYWORDS = [
  // Languages
  'JavaScript', 'TypeScript', 'Python', 'Java', 'C++', 'C#', 'C', 'Go', 'Golang',
  'Ruby', 'Rust', 'Swift', 'Kotlin', 'PHP', 'R', 'Scala', 'Perl', 'Dart', 'Lua',
  // Frontend
  'React', 'Vue', 'Angular', 'Next.js', 'Nuxt', 'Svelte', 'HTML', 'CSS',
  'Tailwind CSS', 'Tailwind', 'Bootstrap', 'SASS', 'SCSS', 'jQuery', 'Redux',
  'Webpack', 'Vite', 'Babel', 'GraphQL', 'REST', 'REST APIs',
  // Backend
  'Node.js', 'Express', 'Django', 'Flask', 'FastAPI', 'Spring', 'Laravel',
  'Symfony', '.NET', 'ASP.NET', 'Rails', 'NestJS',
  // Databases
  'MongoDB', 'PostgreSQL', 'MySQL', 'SQLite', 'SQL', 'Redis', 'Elasticsearch',
  'Firebase', 'Supabase', 'DynamoDB', 'Cassandra',
  // Cloud & DevOps
  'AWS', 'Azure', 'GCP', 'Docker', 'Kubernetes', 'Linux', 'Bash', 'CI/CD',
  'Terraform', 'Ansible', 'Jenkins', 'GitHub Actions', 'Nginx', 'Apache',
  // Data & ML
  'Machine Learning', 'Deep Learning', 'TensorFlow', 'PyTorch', 'NumPy',
  'Pandas', 'Scikit-learn', 'Data Analysis', 'Data Science', 'NLP',
  'Computer Vision', 'Statistics',
  // Mobile
  'React Native', 'Flutter', 'SwiftUI', 'Xcode', 'Android', 'Mobile Design',
  // Tools & Other
  'Git', 'GitHub', 'GitLab', 'Figma', 'Adobe XD', 'Jira', 'Agile', 'Scrum',
  'Kafka', 'RabbitMQ', 'gRPC', 'WebSockets', 'Microservices',
  'User Research', 'Security Auditing', 'Networking', 'Algorithms',
];

/**
 * Extract text content from a PDF file using pdfjs-dist.
 * @param {File} file
 * @returns {Promise<string>}
 */
export async function extractTextFromPDF(file) {
  // Dynamically import pdfjs-dist to allow code-splitting
  const pdfjsLib = await import('pdfjs-dist');

  // Point the worker to the bundled worker (Vite will handle this)
  pdfjsLib.GlobalWorkerOptions.workerSrc = new URL(
    'pdfjs-dist/build/pdf.worker.min.mjs',
    import.meta.url
  ).toString();

  const arrayBuffer = await file.arrayBuffer();
  const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;

  const textParts = [];
  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i);
    const content = await page.getTextContent();
    const pageText = content.items.map(item => item.str).join(' ');
    textParts.push(pageText);
  }

  return textParts.join('\n');
}

/**
 * Extract text content from a plain-text file.
 * @param {File} file
 * @returns {Promise<string>}
 */
export function extractTextFromTXT(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => resolve(e.target.result);
    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsText(file);
  });
}

/**
 * Detect tech skills from raw resume text using keyword matching.
 * Uses whole-word, case-insensitive matching.
 * @param {string} rawText
 * @returns {string[]} Array of detected skill names (original casing from keyword list)
 */
export function detectSkillsFromText(rawText) {
  if (!rawText) return [];
  const found = new Set();

  TECH_KEYWORDS.forEach(keyword => {
    // Escape special regex chars in the keyword, then match whole-word
    const escaped = keyword.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const pattern = new RegExp(`(?<![\\w.])${escaped}(?![\\w.])`, 'i');
    if (pattern.test(rawText)) {
      found.add(keyword);
    }
  });

  return Array.from(found);
}

/**
 * Main entry point: parse a resume file and return detected skills.
 * Supports PDF and TXT files.
 * @param {File} file
 * @returns {Promise<{ rawText: string, detectedSkills: string[] }>}
 */
export async function parseResume(file) {
  const ext = file.name.split('.').pop().toLowerCase();

  if (!['pdf', 'txt'].includes(ext)) {
    throw new Error(`Unsupported file type ".${ext}". Please upload a PDF or TXT file.`);
  }

  const rawText = ext === 'pdf'
    ? await extractTextFromPDF(file)
    : await extractTextFromTXT(file);

  const detectedSkills = detectSkillsFromText(rawText);
  return { rawText, detectedSkills };
}
