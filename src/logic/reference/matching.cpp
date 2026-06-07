#include <iostream>
#include <vector>
#include <string>
#include <set>
#include <algorithm>
#include <iterator>

/**
 * Coverage Score in C++: |A ∩ B| / |B|
 * Measures what fraction of the job's REQUIRED skills the student covers.
 * Unlike Jaccard, does NOT penalise knowing extra skills.
 */
double calculateCoverage(std::set<std::string> studentSkills, std::set<std::string> requiredSkills) {
    if (requiredSkills.empty()) return 0.0;

    std::vector<std::string> intersect;
    std::set_intersection(studentSkills.begin(), studentSkills.end(),
                          requiredSkills.begin(), requiredSkills.end(),
                          std::back_inserter(intersect));

    return (double)intersect.size() / (double)requiredSkills.size();
}

/**
 * Binary Search on sorted vector of objects
 */
struct Internship {
    std::string company;
    std::string role;
};

int binarySearch(const std::vector<Internship>& internships, std::string target) {
    int low = 0;
    int high = internships.size() - 1;

    while (low <= high) {
        int mid = low + (high - low) / 2;
        if (internships[mid].company == target) return mid;
        if (internships[mid].company < target) low = mid + 1;
        else high = mid - 1;
    }
    return -1;
}

int main() {
    std::set<std::string> student = {"React", "JavaScript"};
    std::set<std::string> job = {"React", "JavaScript", "Tailwind"};
    
    // student covers 2 of 3 required skills => 0.666...
    std::cout << "Coverage Score: " << calculateCoverage(student, job) << std::endl;
    return 0;
}
