import fs from 'fs';
import { spawn } from 'child_process';
import path from 'path';
import Course from '../models/course.js';

const getCourses = async () => {
    const courses = await Course.find({});
    return courses;
};

const getNames = async (input) => {
    try {
        // Extract all course numbers (dependencies) from the input
        const courseNums = Object.values(input);

        // Find only the courses whose courseNum matches the input dependencies
        const courses = await Course.find({ courseNum: { $in: courseNums } });

        // Create a map {courseNum: courseName}
        const courseMap = {};

        courses.forEach(course => {
            courseMap[course.courseNum] = course.courseName;
        });

        return courseMap;
    } catch (error) {
        console.error('Error fetching courses:', error);
        throw error;
    }
};

// Helper function to generate all subsets of selectedExcludedCourses
const getSubsets = (excludedCourses) => {
    const subsets = [[]];
    for (const course of excludedCourses) {
        const currentLength = subsets.length;
        for (let i = 0; i < currentLength; i++) {
            subsets.push([...subsets[i], course]);
        }
    }
    return subsets.filter(subset => subset.length > 0); // Exclude the empty set
};

// Function to create solutions without exclusions
const createSolutionsWithoutExclusions = async (input) => {
    return await createSolutions(input); // Reuse the existing createSolutions function
};

// Function to create solutions with exclusions
const createSolutionsWithExclusions = async (input) => {
    try {
        const selectedExcludedCourses = input.excludedCourses;
        const selectedCourseValues = input.selectedCourses.map(course => course.value);

        // Generate all subsets of selectedExcludedCourses
        const excludedSubsets = getSubsets(selectedExcludedCourses);
        const solutionsWithExclusions = [];

        for (const excludedSubset of excludedSubsets) {

            const adjustedCourseValues = selectedCourseValues.filter(course =>
                !excludedSubset.some(excluded => excluded.value === course)
            );

            // If adjustedCourseValues is empty, continue to the next iteration
            if (adjustedCourseValues.length === 0) {
                continue;
            }

            // Adjust the input object for each case
            const adjustedInput = {
                ...input,
                selectedCourses: adjustedCourseValues.map(course => ({ value: course })),
            };

            // Call createSolutions with adjusted course values
            const solution = await createSolutions(adjustedInput);
            solution.forEach(sol => {
                solutionsWithExclusions.push(sol);
            });
        }

        return solutionsWithExclusions; // Return all solutions for each exclusion case
    } catch (error) {
        console.error('Error in createSolutionsWithExclusions:', error);
    }
};

const filterSolutionsByDays = (solutions, selectedDaysLimit) => {
    return solutions.filter(solution => {
        let days = solution.map(course => course.day);
        let uniqueDays = new Set(days);
        return uniqueDays.size <= selectedDaysLimit;
    });
};


const createSolutionsWithDaysLimitation =  (input, solutionsWithoutExclusions) => {
    try {
        const selectedDaysLimit = input.numDays?.value;
        if (selectedDaysLimit == null) {
            return [];
        }

        return filterSolutionsByDays(solutionsWithoutExclusions, selectedDaysLimit)

    } catch (error) {
        console.error('Error in createSolutionsWithDaysLimitation:', error);
    }
};




// Main function to generate all solutions (with and without exclusions)
const generateAllSolutions = async (input) => {
    try {
        // Generate solutions without exclusions
        const solutionsWithoutExclusions = await createSolutionsWithoutExclusions(input);

        // Generate solutions with exclusions
        const solutionsWithExclusions = await createSolutionsWithExclusions(input);

        // Generate solutions with days limit
        const solutionsWithDaysLimit =  await createSolutionsWithDaysLimitation(input, solutionsWithoutExclusions);


        return {
            noExclusions: solutionsWithoutExclusions, // Key for solutions without exclusions
            withExclusions: solutionsWithExclusions, // Key for solutions with exclusions
            daysLimit: solutionsWithDaysLimit // Key for solutions with days limit
        };
    } catch (error) {
        console.error('Error in generateAllSolutions:', error);
    }
};

const getUniqueFileName = (baseName) => {
    const timestamp = Date.now(); // Using current timestamp for uniqueness
    return `${baseName}_${timestamp}.dep`; // Append timestamp to the base file name
};

// The existing createSolutions function
const createSolutions = async (input) => {
    try {
        const selectedYear = input.selectedYear;
        const selectedSemester = input.selectedSemester;
        const selectedCourseValues = input.selectedCourses.map(course => course.value);

        // Fetch all courses
        const courses = await Course.find({});
        let packageContent = '';
        const courseMap = new Map();

        // Filter and organize courses
        courses.forEach(course => {
            const courseYear = String(course.year).trim(); // Convert to string and trim spaces
            const courseSemester = String(course.semester).trim();
            const courseNum = course.courseNum; // Get the course number

            // Check if the course fits the selected year and semester
            if ((courseYear === selectedYear || course.year === '0') &&
                (courseSemester === selectedSemester) &&
                selectedCourseValues.includes(courseNum)) {

                if (!courseMap.has(course.courseNum)) {
                    courseMap.set(course.courseNum, []);
                }
                courseMap.get(course.courseNum).push(course);
            }
        });

        // Generate packageContent
        courseMap.forEach((courseInstances, courseNum) => {
            courseInstances.forEach(courseInstance => {
                packageContent += `Package: ${courseInstance.courseNum}-${courseInstance.index}\n`;
                const conflicts = courseInstance.conflicts?.join(',') || '';
                packageContent += `Conflicts: ${conflicts}\n\n`;
            });
        });

        let installCourses = [];
        selectedCourseValues.forEach(value => {
            const courseInstances = courseMap.get(value);
            // create the logic which based on that ,the algorithm will choose one instance from all possibilities for specific course
            if (courseInstances && courseInstances.length > 1) {
                const courseWithIndexes = courseInstances.map(course => `${course.courseNum}-${course.index}`).join(' | ');
                installCourses.push(courseWithIndexes);
            } else if (courseInstances && courseInstances.length === 1) {
                installCourses.push(`${courseInstances[0].courseNum}-${courseInstances[0].index}`);
            }
        });

        packageContent += 'Install: ' + installCourses.join(',');

        // Generate a unique file name
        const tempFileName = getUniqueFileName('temp_packages2');
        const tempFilePath = path.join(process.cwd(), tempFileName);

        // Write the package content to the uniquely named file
        fs.writeFileSync(tempFilePath, packageContent);

        const pythonScriptPath = path.join(process.cwd(), 'main.py');

        return new Promise((resolve, reject) => {
            let output = "";

            const pythonProcess = spawn('python', [pythonScriptPath, tempFilePath]);

            pythonProcess.stdout.on('data', (data) => {
                output += data;
            });

            pythonProcess.stderr.on('data', (data) => {
                console.error(`stderr: ${data}`);
            });

            pythonProcess.on('close', (code) => {
                console.log(`Python script exited with code ${code}`);

                if (fs.existsSync(tempFilePath)) {
                    fs.unlinkSync(tempFilePath);
                } else {
                    console.warn(`File ${tempFilePath} not found, cannot delete.`);
                }

                const lines = output.split('\n');
                const solutions = [];
                let currentSolution = [];

                lines.forEach(line => {
                    line = line.trim();
                    if (line.includes('Installation plan with required dependencies:')) {
                        if (currentSolution.length > 0) {
                            solutions.push([...currentSolution]);
                            currentSolution = [];
                        }
                    } else if (line !== '' && !line.includes('There is no installation plan')) {
                        currentSolution.push(line);
                    }
                });

                if (currentSolution.length > 0) {
                    solutions.push([...currentSolution]);
                }

                const detailedSolutions = solutions.map(solution => {
                    const courseDetails = solution.map(courseNum => {
                        const index = courseNum.slice(-1); // Get the last character (index)
                        const baseCourseNum = courseNum.slice(0, -2); // Get all characters except the last one
                        return { baseCourseNum, index };
                    });

                    return courseDetails.map(({ baseCourseNum, index }) => {
                        return courses.find(course => {
                            const indexStr = String(course.index).trim();
                            return course.courseNum === baseCourseNum && indexStr === index;
                        });
                    }).filter(course => course !== undefined); // Remove undefined entries
                });

                //console.log(detailedSolutions);
                resolve(Array.isArray(detailedSolutions) ? detailedSolutions : []);



                resolve(detailedSolutions);
            });

            pythonProcess.on('error', (error) => {
                reject(error);
            });
        });
    } catch (error) {
        console.error('Error:', error);
    }
};


export default { getCourses, createSolutions, getNames,generateAllSolutions };
