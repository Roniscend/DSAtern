/**
 * Real API Service to fetch jobs from Dev.to and other public job boards
 */

// Extract skills from job description using common tech keywords
const extractSkills = (description, tags = []) => {
  const techKeywords = [
    'React', 'JavaScript', 'TypeScript', 'Python', 'Java', 'C++', 'Go', 'Ruby',
    'Node.js', 'Express', 'MongoDB', 'PostgreSQL', 'SQL', 'AWS', 'Docker',
    'Kubernetes', 'Git', 'Linux', 'HTML', 'CSS', 'Tailwind', 'Vue', 'Angular',
    'GraphQL', 'REST', 'API', 'Django', 'Flask', 'Spring', 'Next.js', 'Nuxt',
    'Swift', 'Kotlin', 'Flutter', 'React Native', 'Machine Learning', 'AI',
    'Data Science', 'DevOps', 'CI/CD', 'Terraform', 'Ansible', 'Redis',
    'Elasticsearch', 'Kafka', 'Rust', 'PHP', 'Laravel', 'Symfony', '.NET'
  ];
  
  const foundSkills = new Set();
  
  // Check description
  const lowerDesc = description.toLowerCase();
  techKeywords.forEach(keyword => {
    if (lowerDesc.includes(keyword.toLowerCase())) {
      foundSkills.add(keyword);
    }
  });
  
  // Add tags as skills
  tags.forEach(tag => {
    if (techKeywords.some(kw => kw.toLowerCase() === tag.toLowerCase())) {
      foundSkills.add(tag);
    }
  });
  
  return Array.from(foundSkills).slice(0, 8); // Limit to 8 skills
};

// Determine job type from description
const determineJobType = (description) => {
  const lowerDesc = description.toLowerCase();
  if (lowerDesc.includes('remote') || lowerDesc.includes('work from home')) {
    return 'Remote';
  }
  if (lowerDesc.includes('hybrid') || lowerDesc.includes('flexible')) {
    return 'Hybrid';
  }
  return 'In-person';
};

// Fetch jobs from Dev.to API
const fetchDevToJobs = async () => {
  try {
    const response = await fetch('https://dev.to/api/articles?tag=jobs&per_page=20');
    if (!response.ok) throw new Error('Dev.to API failed');
    const data = await response.json();
    
    return data.map((job, index) => {
      const skills = extractSkills(job.description || '', job.tag_list || []);
      return {
        id: `devto-${index}`,
        company: job.user?.name || 'Unknown Company',
        role: job.title?.replace(/Job|Hiring|We're/gi, '').trim() || 'Software Developer',
        skills: skills.length > 0 ? skills : ['JavaScript', 'Web Development'],
        description: job.description || job.title || 'Software development position',
        location: 'Remote', // Dev.to jobs are mostly remote
        type: determineJobType(job.description || ''),
        source: 'Dev.to'
      };
    });
  } catch (error) {
    console.error('Dev.to API error:', error);
    return [];
  }
};

export const fetchExternalInternships = async () => {
  try {
    // Fetch from Dev.to API
    const devToJobs = await fetchDevToJobs();
    
    // Filter for internships and entry-level positions
    const filteredJobs = devToJobs.filter(job => {
      const title = job.role.toLowerCase();
      const desc = job.description.toLowerCase();
      return title.includes('intern') || 
             title.includes('junior') || 
             title.includes('entry') ||
             desc.includes('intern') ||
             desc.includes('junior') ||
             desc.includes('student') ||
             desc.includes('entry level');
    });
    
    // If no internships found, return all jobs (better than empty)
    return filteredJobs.length > 0 ? filteredJobs : devToJobs.slice(0, 15);
  } catch (error) {
    console.error('Failed to fetch external internships:', error);
    // Fallback to empty array on error
    return [];
  }
};
