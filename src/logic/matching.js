/**
 * InternshipMatcher - DSA driven matching engine
 */
export class InternshipMatcher {
  constructor(internships) {
    this.internships = internships;
    this.skillIndex = new Map();
    this.sortedInternships = [...internships].sort((a, b) => 
      a.company.localeCompare(b.company)
    );
    this._buildIndex();
  }

  /**
   * O(S*I) where S is avg skills per internship and I is number of internships
   * Build an inverted index for O(1) skill lookup
   */
  _buildIndex() {
    this.internships.forEach(internship => {
      internship.skills.forEach(skill => {
        const normalizedSkill = skill.toLowerCase();
        if (!this.skillIndex.has(normalizedSkill)) {
          this.skillIndex.set(normalizedSkill, []);
        }
        this.skillIndex.get(normalizedSkill).push(internship.id);
      });
    });
  }

  /**
   * Jaccard Similarity Algorithm: |A ∩ B| / |A ∪ B|
   * O(min(m, n)) where m, n are sizes of skill sets
   */
  calculateSimilarity(studentSkills, requiredSkills) {
    const studentSet = new Set(studentSkills.map(s => s.toLowerCase()));
    const requiredSet = new Set(requiredSkills.map(s => s.toLowerCase()));

    const intersection = new Set(
      [...studentSet].filter(skill => requiredSet.has(skill))
    );
    
    const union = new Set([...studentSet, ...requiredSet]);

    if (union.size === 0) return 0;
    return intersection.size / union.size;
  }

  /**
   * Binary Search implementation for keyword search over sorted companies
   * O(log n)
   */
  searchByCompany(query) {
    let low = 0;
    let high = this.sortedInternships.length - 1;
    const lowerQuery = query.toLowerCase();

    while (low <= high) {
      const mid = Math.floor((low + high) / 2);
      const companyName = this.sortedInternships[mid].company.toLowerCase();

      if (companyName.includes(lowerQuery)) {
        // Found a match, but need to find the range or just return the first one found
        // For simplicity, we return the match and could expand to find all neighbors with same prefix
        return this.sortedInternships[mid];
      }

      if (companyName < lowerQuery) {
        low = mid + 1;
      } else {
        high = mid - 1;
      }
    }
    return null;
  }

  /**
   * Core recommendation logic
   * 1. Score all internships using Jaccard Similarity
   * 2. Sort by descending score (O(n log n))
   */
  getRecommendations(userSkills) {
    if (!userSkills || userSkills.length === 0) return [];

    const scored = this.internships.map(internship => {
      const score = this.calculateSimilarity(userSkills, internship.skills);
      return { ...internship, score };
    });

    // Sort by score descending
    return scored.sort((a, b) => b.score - a.score);
  }
}
