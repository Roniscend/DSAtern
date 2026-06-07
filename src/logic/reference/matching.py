import math

def coverage_score(student_skills: set, required_skills: set) -> float:
    """
    Coverage Score: |A ∩ B| / |B|
    Measures what fraction of the job's REQUIRED skills (B) the student (A) covers.
    Unlike Jaccard, does NOT penalise students for knowing extra skills.
    """
    if not required_skills:
        return 0.0
    intersection = len(student_skills.intersection(required_skills))
    return intersection / len(required_skills)

def binary_search_internships(sorted_internships, target_company):
    """
    Binary search for an internship by company name
    Complexity: O(log n)
    """
    low = 0
    high = len(sorted_internships) - 1
    
    while low <= high:
        mid = (low + high) // 2
        mid_company = sorted_internships[mid]['company'].lower()
        
        if mid_company == target_company.lower():
            return sorted_internships[mid]
        elif mid_company < target_company.lower():
            low = mid + 1
        else:
            high = mid - 1
    return None

# Example usage
student_skills = {"Python", "SQL", "Data Analysis"}
internship_skills = {"Python", "PyTorch", "SQL", "Machine Learning"}

# Coverage: student covers 2/4 required skills = 0.50
score = coverage_score(student_skills, internship_skills)
print(f"Coverage Score: {score:.2f}")
