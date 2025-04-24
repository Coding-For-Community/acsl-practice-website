import os

# Paths for contest problems and solutions
base_paths = [
    "src/assets/contest-problems",
    "src/assets/contest-solutions"
]

# Enum values from Topic.ts
topics = [
    "Computer Number Systems",
    "Recursive Functions",
    "What Does This Program Do",
    "Prefix/Infix/Postfix Notation",
    "Bit-String Flicking",
    "LISP",
    "Boolean Algebra",
    "Data Structures",
    "FSAs and Regular Expressions",
    "Graph Theory",
    "Digital Electronics",
    "Assembly Language"
]

# Division variants from Division.ts
divisions = [
    "Senior",
    "Intermediate",
    "Junior",
    "Senior (All star)",
    "Intermediate (All star)",
    "Junior (All star)"
]

if __name__ == "__main__":
    # Create folders
    for base_path in base_paths:
        for topic in topics:
            topic_path = base_path + "/" + topic
            os.makedirs(topic_path, exist_ok=True)
            for division in divisions:
                division_path = topic_path + "/" + division
                os.makedirs(division_path, exist_ok=True)