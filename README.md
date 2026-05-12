# Student Skill Matching & Internship Recommendation System

A high-performance, DSA-driven internship matching platform built with **React 19**, **Tailwind CSS 4**, and **Framer Motion**.

## 🚀 Key Features
- **Real-time Skill Matching**: Instant ranking of internships based on student skill sets.
- **Premium UI**: Modern glassmorphic design with dynamic animations and dark mode aesthetics.
- **Multi-language Logic**: Core matching engine implemented in JavaScript, Python, and C++.

## 🧠 DSA Concepts Used

### 1. HashMap-based Skill Indexing
- **Structure**: `Map<Skill, List<InternshipID>>`
- **Purpose**: Enables O(1) average-time lookup for which internships require a specific skill, eliminating the need for linear scans.
- **Implementation**: Located in `src/logic/matching.js` -> `_buildIndex()`.

### 2. Jaccard Similarity Algorithm
- **Formula**: `Score = |A ∩ B| / |A ∪ B|`
- **Purpose**: Provides a normalized match percentage (0-100%) by comparing the intersection and union of student skills vs. required skills.
- **Complexity**: `O(min(m, n))` using Sets.

### 3. Binary Search Optimization
- **Purpose**: Reduces keyword search time for companies from `O(n)` to `O(log n)`.
- **Requirement**: The internship list is pre-sorted alphabetically by company name.
- **Implementation**: `src/logic/matching.js` -> `searchByCompany()`.

### 4. Comparator-based Sorting
- **Algorithm**: `Array.sort` (typically Timsort or Quicksort depending on engine).
- **Purpose**: Ranks internships in descending order of their compatibility score.
- **Complexity**: `O(n log n)`.

## 🛠️ Tech Stack
- **Frontend**: Vite + React 19
- **Styling**: Tailwind CSS 4 (CSS-first engine)
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **Logic**: JavaScript (Core), Python & C++ (Reference)

## 📂 Project Structure
- `src/logic/matching.js`: The heart of the recommendation engine.
- `src/data/internships.js`: Mock database of industry-relevant internships.
- `src/logic/reference/`: Implementation of the algorithm in Python and C++.
- `src/App.jsx`: Interactive UI with real-time state management.
