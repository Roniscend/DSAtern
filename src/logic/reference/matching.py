import math

def jaccard_similarity(set1, set2):
    """
    Calculate Jaccard Similarity Score: |A ∩ B| / |A ∪ B|
    """
    intersection = len(set1.intersection(set2))
    union = len(set1.union(set2))
    return intersection / union if union > 0 else 0

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

score = jaccard_similarity(student_skills, internship_skills)
print(f"Matching Score: {score:.2f}")
