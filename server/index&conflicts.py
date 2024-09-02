import json
from datetime import datetime

# Function to check if two time periods overlap
def times_overlap(start1, end1, start2, end2):
    start1 = datetime.strptime(start1, "%H:%M")
    end1 = datetime.strptime(end1, "%H:%M")
    start2 = datetime.strptime(start2, "%H:%M")
    end2 = datetime.strptime(end2, "%H:%M")
    return start1 < end2 and start2 < end1

# Load the JSON data
with open('coursesList.json', 'r', encoding='utf-8') as f:
    courses = json.load(f)

# Index courses with the same courseNum
course_indices = {}
for course in courses:
    course_num = course["courseNum"]
    if course_num not in course_indices:
        course_indices[course_num] = 0
    course["index"] = str(course_indices[course_num])
    course_indices[course_num] += 1

# Update conflicts attribute
for course in courses:
    course_conflicts = []
    for other_course in courses:
        # Skip if it's the same course instance
        if course["courseNum"] == other_course["courseNum"] and course["index"] == other_course["index"]:
            continue

        # Check for conflicts: same semester, same day, overlapping time
        time_conflict = (course["semester"] == other_course["semester"] and
                         course["day"] == other_course["day"] and
                         times_overlap(course["startTime"], course["endTime"], other_course["startTime"], other_course["endTime"]))

        # Check if they are in the same year or one of them is in year 0 (optional courses)
        year_conflict = (course["year"] == other_course["year"] or
                         (course["year"] == "0" and other_course["year"] in ["1", "2", "3"]) or
                         (course["year"] in ["1", "2", "3"] and other_course["year"] == "0"))

        # Add to conflicts if there's both a time and a year conflict
        if time_conflict and year_conflict:
            conflict_entry = f'{other_course["courseNum"]}-{other_course["index"]}'
            course_conflicts.append(conflict_entry)

    course["conflicts"] = course_conflicts

# Save the updated JSON data
with open('updated_courses.json', 'w', encoding='utf-8') as f:
    json.dump(courses, f, ensure_ascii=False, indent=4)

print("Updated JSON data has been saved to 'updated_courses.json'")
