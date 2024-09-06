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

        //console.log(courseMap);

        return courseMap;
    } catch (error) {
        console.error('Error fetching courses:', error);
        throw error;
    }
};

// const createSolutions = async (input) => {
//     try {
//         const selectedYear = input.selectedYear;
//         const selectedSemester = input.selectedSemester;
//         const selectedCourseValues = input.selectedCourses.map(course => course.value);
//
//         // Fetch all courses
//         const courses = await Course.find({});
//         let packageContent = '';
//         const courseMap = new Map();
//
//         // Filter and organize courses
//         courses.forEach(course => {
//             const courseYear = String(course.year).trim();
//             const courseSemester = String(course.semester).trim();
//             const courseNum = course.courseNum;
//
//             // Check if the course fits the selected year and semester
//             if ((courseYear === selectedYear || course.year === '0') &&
//                 (courseSemester === selectedSemester) &&
//                 selectedCourseValues.includes(courseNum)) {
//
//                 if (!courseMap.has(course.courseNum)) {
//                     courseMap.set(course.courseNum, []);
//                 }
//                 courseMap.get(course.courseNum).push(course);
//             }
//         });
//         console.log(courseMap);
//
//         // Generate packageContent
//         courseMap.forEach((courseInstances, courseNum) => {
//             courseInstances.forEach(courseInstance => {
//                 packageContent += `Package: ${courseInstance.courseNum}-${courseInstance.index}\n`;
//                 const conflicts = courseInstance.conflicts?.join(', ') || '';
//                 packageContent += `Conflicts: ${conflicts}\n\n`;
//             });
//         });
//
//         let installCourses = [];
//         selectedCourseValues.forEach(value => {
//             const courseInstances = courseMap.get(value);
//             if (courseInstances && courseInstances.length > 1) {
//                 const courseWithIndexes = courseInstances.map(course => `${course.courseNum}-${course.index}`).join(' | ');
//                 installCourses.push(courseWithIndexes);
//             } else if (courseInstances && courseInstances.length === 1) {
//                 installCourses.push(`${courseInstances[0].courseNum}-${courseInstances[0].index}`);
//             }
//         });
//
//         packageContent += 'Install: ' + installCourses.join(', ');
//
//         console.log(packageContent);
//         const tempFilePath = path.join(process.cwd(), 'temp_packages2.dep');
//         fs.writeFileSync(tempFilePath, packageContent);
//
//         const pythonScriptPath = path.join(process.cwd(), 'main.py');
//
//         return new Promise((resolve, reject) => {
//             let output = "";
//
//             const pythonProcess = spawn('python', [pythonScriptPath, tempFilePath]);
//
//             pythonProcess.stdout.on('data', (data) => {
//                 output += data;
//             });
//
//             pythonProcess.stderr.on('data', (data) => {
//                 console.error(`stderr: ${data}`);
//             });
//
//             pythonProcess.on('close', (code) => {
//                 console.log(`Python script exited with code ${code}`);
//
//                 const lines = output.split('\n');
//                 const solutions = [];
//                 let currentSolution = [];
//
//                 lines.forEach(line => {
//                     line = line.trim();
//                     if (line.includes('Installation plan with required dependencies:')) {
//                         if (currentSolution.length > 0) {
//                             solutions.push([...currentSolution]);
//                             currentSolution = [];
//                         }
//                     } else if (line !== '' && !line.includes('There is no installation plan')) {
//                         currentSolution.push(line);
//                     }
//                 });
//
//                 if (currentSolution.length > 0) {
//                     solutions.push([...currentSolution]);
//                 }
//
//                 // Create dependency mapping
//                 let dependenciesMap = {};
//
//                 // Helper function to recursively get dependencies
//                 const getDependencies = (courseNum, visited = new Set()) => {
//                     if (visited.has(courseNum)) return;
//                     visited.add(courseNum);
//
//                     const course = courses.find(c => c.courseNum === courseNum);
//                     if (course && course.dependencies.length > 0) {
//                         dependenciesMap[courseNum] = course.dependencies.map(dep => {
//                             const depCourse = courses.find(c => c.courseNum === dep);
//                             return depCourse ? {
//                                 courseNum: depCourse.courseNum,
//                                 courseName: depCourse.courseName,
//                                 // Include any other attributes if needed
//                             } : { courseNum: dep };
//                         });
//                         course.dependencies.forEach(dep => getDependencies(dep, visited));
//                     }
//                 };
//
//                 // Process each solution to map course details
//                 const detailedSolutions = solutions.map(solution => {
//                     // Reset dependencies map for each solution
//                     dependenciesMap = {};
//
//                     // Extract course numbers from the solution and map to course details
//                     const courseNumbers = solution.map(courseLine => {
//                         const index = courseLine.slice(-1);
//                         const baseCourseNum = courseLine.slice(0, -2);
//                         return baseCourseNum;
//                     });
//
//                     // Build the dependency map for each course in the solution
//                     courseNumbers.forEach(courseNum => getDependencies(courseNum));
//
//                     // Format the solution as required
//                     return {
//                         solution: courseNumbers.map(courseNum => {
//                             const courseInstance = courses.find(c => c.courseNum === courseNum);
//                             return courseInstance;
//                         }),
//                         dependencies: { ...dependenciesMap }
//                     };
//                 });
//                 resolve(Array.isArray(detailedSolutions) ? detailedSolutions : []);
//             });
//
//             pythonProcess.on('error', (error) => {
//                 reject(error);
//             });
//         });
//     } catch (error) {
//         console.error('Error:', error);
//     }
// };
const createSolutions = async (input) => {
    try {
        const selectedYear = input.selectedYear;
        const selectedSemester = input.selectedSemester;
        const selectedCourseValues = input.selectedCourses.map(course => course.value);
        // console.log('Selected Year:', selectedYear, 'Type:', typeof selectedYear);
        // console.log('Selected Semester:', selectedSemester, 'Type:', typeof selectedSemester);
        // console.log('Selected Course Values:', selectedCourseValues, 'Type:', typeof selectedCourseValues);

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
                (courseSemester === selectedSemester)&&
                selectedCourseValues.includes(courseNum)) {

                if (!courseMap.has(course.courseNum)) {
                    courseMap.set(course.courseNum, []);
                }
                courseMap.get(course.courseNum).push(course);
            }
        });
        //console.log(courseMap);
        // Generate packageContent
        courseMap.forEach((courseInstances, courseNum) => {
            // Write the Package and Conflicts lines for each courseNum instance
            courseInstances.forEach(courseInstance => {
                packageContent += `Package: ${courseInstance.courseNum}-${courseInstance.index}\n`;

                // Write the Conflicts line for the current instance directly from the JSON data
                const conflicts = courseInstance.conflicts?.join(',') || '';
                packageContent += `Conflicts: ${conflicts}\n\n`;
            });
        });

        // Build the Install string with | for different time instances of the same course, and , for different courses
        let installCourses = [];

        selectedCourseValues.forEach(value => {
            const courseInstances = courseMap.get(value);
            //console.log(courseInstances);
            if (courseInstances && courseInstances.length > 1) {
                // If there are duplicates, join them with |
                const courseWithIndexes = courseInstances.map(course => `${course.courseNum}-${course.index}`).join(' | ');
                installCourses.push(courseWithIndexes);
            } else if (courseInstances && courseInstances.length === 1) {
                // If there's only one instance, add it normally
                installCourses.push(`${courseInstances[0].courseNum}-${courseInstances[0].index}`);
            }
        });

        // Combine the installCourses array into the final installation plan string
        packageContent += 'Install: ' + installCourses.join(',');
        //console.log(packageContent);
        const tempFilePath = path.join(process.cwd(), 'temp_packages2.dep');
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

                // Check if the file exists before attempting to delete it
                // if (fs.existsSync(tempFilePath)) {
                //     fs.unlinkSync(tempFilePath);
                // } else {
                //     console.warn(`File ${tempFilePath} not found, cannot delete.`);
                // }
                const lines = output.split('\n');
                const solutions = [];
                let currentSolution = [];

                // Parse multiple solutions from the output
                lines.forEach(line => {
                    line = line.trim();
                    if (line.includes('Installation plan with required dependencies:')) {
                        // Push the current solution and start a new one
                        if (currentSolution.length > 0) {
                            solutions.push([...currentSolution]);
                            currentSolution = [];
                        }
                    } else if (line !== '' && !line.includes('There is no installation plan')) {
                        currentSolution.push(line); // Add course to the current solution
                    }
                });

                // Add the last solution if it exists
                if (currentSolution.length > 0) {
                    solutions.push([...currentSolution]);
                }

                // Process each solution to map course details
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

                console.log(detailedSolutions);
                resolve(Array.isArray(detailedSolutions) ? detailedSolutions : []);
            });

            pythonProcess.on('error', (error) => {
                reject(error); // Reject the promise if there's an error
            });
        });
    } catch (error) {
        console.error('Error:', error);
    }
};
//
// const createSolutions = async (input) => {
//     try {
//         const selectedYear = input.selectedYear;
//         const selectedSemester = input.selectedSemester;
//         const selectedCourseValues = input.selectedCourses.map(course => course.value);
//         // console.log('Selected Year:', selectedYear, 'Type:', typeof selectedYear);
//         // console.log('Selected Semester:', selectedSemester, 'Type:', typeof selectedSemester);
//         // console.log('Selected Course Values:', selectedCourseValues, 'Type:', typeof selectedCourseValues);
//
//         // Fetch all courses
//         const courses = await Course.find({});
//         let packageContent = '';
//         const courseMap = new Map();
//
//
//         // Filter and organize courses
//         courses.forEach(course => {
//             const courseYear = String(course.year).trim(); // Convert to string and trim spaces
//             const courseSemester = String(course.semester).trim();
//             const courseNum = course.courseNum; // Get the course number
//
//             // Check if the course fits the selected year and semester
//             if ((courseYear === selectedYear || course.year === '0') &&
//                 (courseSemester === selectedSemester)&&
//                 selectedCourseValues.includes(courseNum)) {
//
//                 if (!courseMap.has(course.courseNum)) {
//                     courseMap.set(course.courseNum, []);
//                 }
//                 courseMap.get(course.courseNum).push(course);
//             }
//         });
//         console.log(courseMap);
//         // Generate packageContent
//         courseMap.forEach((courseInstances, courseNum) => {
//             // Write the Package and Conflicts lines for each courseNum instance
//             courseInstances.forEach(courseInstance => {
//                 packageContent += `Package: ${courseInstance.courseNum}-${courseInstance.index}\n`;
//
//                 // Write the Conflicts line for the current instance directly from the JSON data
//                 const conflicts = courseInstance.conflicts?.join(', ') || '';
//                 packageContent += `Conflicts: ${conflicts}\n\n`;
//             });
//         });
//
//         // Build the Install string with | for different time instances of the same course, and , for different courses
//         let installCourses = [];
//
//         selectedCourseValues.forEach(value => {
//             const courseInstances = courseMap.get(value);
//             if (courseInstances && courseInstances.length > 1) {
//                 // If there are duplicates, join them with |
//                 const courseWithIndexes = courseInstances.map(course => `${course.courseNum}-${course.index}`).join(' | ');
//                 installCourses.push(courseWithIndexes);
//             } else if (courseInstances && courseInstances.length === 1) {
//                 // If there's only one instance, add it normally
//                 installCourses.push(`${courseInstances[0].courseNum}-${courseInstances[0].index}`);
//             }
//         });
//
//         // Combine the installCourses array into the final installation plan string
//         packageContent += 'Install: ' + installCourses.join(', ');
//         console.log(packageContent);
//         const tempFilePath = path.join(process.cwd(), 'temp_packages2.dep');
//         fs.writeFileSync(tempFilePath, packageContent);
//
//         const pythonScriptPath = path.join(process.cwd(), 'main.py');
//
//         return new Promise((resolve, reject) => {
//             let output = "";
//
//             const pythonProcess = spawn('python', [pythonScriptPath, tempFilePath]);
//
//             pythonProcess.stdout.on('data', (data) => {
//                 output += data;
//             });
//
//             pythonProcess.stderr.on('data', (data) => {
//                 console.error(`stderr: ${data}`);
//             });
//
//             pythonProcess.on('close', (code) => {
//                 console.log(`Python script exited with code ${code}`);
//
//                 // Check if the file exists before attempting to delete it
//                 // if (fs.existsSync(tempFilePath)) {
//                 //     fs.unlinkSync(tempFilePath);
//                 // } else {
//                 //     console.warn(`File ${tempFilePath} not found, cannot delete.`);
//                 // }
//                 const lines = output.split('\n');
//                 const solutions = [];
//                 let currentSolution = [];
//
//                 // Parse multiple solutions from the output
//                 lines.forEach(line => {
//                     line = line.trim();
//                     if (line.includes('Installation plan with required dependencies:')) {
//                         // Push the current solution and start a new one
//                         if (currentSolution.length > 0) {
//                             solutions.push([...currentSolution]);
//                             currentSolution = [];
//                         }
//                     } else if (line !== '' && !line.includes('There is no installation plan')) {
//                         currentSolution.push(line); // Add course to the current solution
//                     }
//                 });
//
//                 // Add the last solution if it exists
//                 if (currentSolution.length > 0) {
//                     solutions.push([...currentSolution]);
//                 }
//
//                 // Process each solution to map course details
//                 const detailedSolutions = solutions.map(solution => {
//                     const courseDetails = solution.map(courseNum => {
//                         const index = courseNum.slice(-1); // Get the last character (index)
//                         const baseCourseNum = courseNum.slice(0, -2); // Get all characters except the last one
//                         return { baseCourseNum, index };
//                     });
//
//                     return courseDetails.map(({ baseCourseNum, index }) => {
//                         return courses.find(course => {
//                             const indexStr = String(course.index).trim();
//                             return course.courseNum === baseCourseNum && indexStr === index;
//                         });
//                     }).filter(course => course !== undefined); // Remove undefined entries
//                 });
//
//                 console.log(detailedSolutions);
//                 resolve(Array.isArray(detailedSolutions) ? detailedSolutions : []);
//             });
//
//             pythonProcess.on('error', (error) => {
//                 reject(error); // Reject the promise if there's an error
//             });
//         });
//     } catch (error) {
//         console.error('Error:', error);
//     }
// };

const getDependencies = async (input) => {
    try {
        const selectedCourseValues = input.selectedCourses.map(course => course.value);
        const courses = await Course.find({});
        let packageContent = '';

        courses.forEach(course => {
            packageContent += `Package: ${course.courseNum}\n`;

            if (course.dependencies && course.dependencies.length > 0) {
                const dependencies = course.dependencies.join(', ');
                packageContent += `Depends: ${dependencies}\n`;
            } else {
                packageContent += `Depends: \n`;
            }

            if (course.conflicts && course.conflicts.length > 0) {
                const conflicts = course.conflicts.join(', ');
                packageContent += `Conflicts: ${conflicts}\n`;
            } else {
                packageContent += `Conflicts: \n`;
            }

            packageContent += '\n';
        });

        packageContent += 'Install: ' + selectedCourseValues.join(', ') + '\n';

        const tempFilePath = path.join(process.cwd(), 'temp_packages.dep');
        fs.writeFileSync(tempFilePath, packageContent);

        const pythonScriptPath = path.join(process.cwd(), 'findDepends.py');

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

                // Check if the file exists before attempting to delete it
                if (fs.existsSync(tempFilePath)) {
                    fs.unlinkSync(tempFilePath);
                } else {
                    console.warn(`File ${tempFilePath} not found, cannot delete.`);
                }

                const lines = output.split('\n');
                const startIndex = lines.findIndex(line => line.includes('dependencies:')) + 1;
                const courseLines = lines.slice(startIndex).filter(line => line.trim() !== '');
                const courseNumbers = courseLines.map(line => line.trim());
                const filteredCourses = courses.filter(course => courseNumbers.includes(course.courseNum));

                resolve(filteredCourses);
            });

            pythonProcess.on('error', (error) => {
                reject(error); // Reject the promise if there's an error
            });
        });
    } catch (error) {
        console.error('Error:', error);
    }
};

export default { getCourses, createSolutions, getDependencies, getNames };
