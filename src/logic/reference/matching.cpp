#include <iostream>
#include <vector>
#include <string>
#include <set>
#include <algorithm>
#include <iterator>

/**
 * Jaccard Similarity in C++
 * Uses std::set_intersection and std::set_union
 */
double calculateJaccard(std::set<std::string> set1, std::set<std::string> set2) {
    std::vector<std::string> intersect;
    std::set_intersection(set1.begin(), set1.end(),
                          set2.begin(), set2.end(),
                          std::back_inserter(intersect));

    std::vector<std::string> uni;
    std::set_union(set1.begin(), set1.end(),
                   set2.begin(), set2.end(),
                   std::back_inserter(uni));

    if (uni.empty()) return 0.0;
    return (double)intersect.size() / (double)uni.size();
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
    
    std::cout << "Match Score: " << calculateJaccard(student, job) << std::endl;
    return 0;
}
