import fs from 'fs';
import { spawn } from 'child_process';
import path from 'path';
import Course from '../models/course.js';

const getCourses = async () => {
    const courses = await Course.find({});
    return courses;
};

const createSolutions = async (input) => {
    try {
        const selectedCourseValues = input.selectedCourses.map(course => course.value);
        const courses = await Course.find({});
        let packageContent = '';

        courses.forEach(course => {
            packageContent += `Package: ${course.courseNum}\n`;

            if (course.conflicts && course.conflicts.length > 0) {
                const conflicts = course.conflicts.join(', ');
                packageContent += `Conflicts: ${conflicts}\n`;
            } else {
                packageContent += `Conflicts: \n`;
            }

            packageContent += '\n';
        });

        packageContent += 'Install: ' + selectedCourseValues.join(', ') + '\n';

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
                if (fs.existsSync(tempFilePath)) {
                    fs.unlinkSync(tempFilePath);
                } else {
                    console.warn(`File ${tempFilePath} not found, cannot delete.`);
                }

                const lines = output.split('\n');
                const startIndex = lines.findIndex(line => line.includes('Installation plan with required dependencies:')) + 1;
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

export default { getCourses, createSolutions, getDependencies };
