import fs from 'fs';
import { spawn } from 'child_process';
import path from 'path';
import Course from '../models/course.js';

const getCourses = async () => {
    const courses = await Course.find({});
    //console.log(courses);
    return courses;
};

const createSolutions = async (input) => {
    try {
        // Extract the values from selectedCourses
        const selectedCourseValues = input.selectedCourses.map(course => course.value);

        // Query the database for all courses
        const courses = await Course.find({});

        // Generate the package template content
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

        // Add the install section
        packageContent += 'Install: ' + selectedCourseValues.join(', ') + '\n';

        // Write the package content to a temporary file
        const tempFilePath = path.join(process.cwd(), 'temp_packages.dep');
        fs.writeFileSync(tempFilePath, packageContent);
        console.log(packageContent);

        // Path to the Python script
        const pythonScriptPath = path.join(process.cwd(), 'main.py');

        // console.log('Current working directory:', process.cwd());
        // console.log('Python script path:', pythonScriptPath);
        // console.log('Temporary file path:', tempFilePath);

        return new Promise( (resolve, reject) => {
            let output = "";

            // Run the Python script with the temporary file as input
            const pythonProcess = spawn('python', [pythonScriptPath, tempFilePath]);

            // Capture stdout and stderr
            pythonProcess.stdout.on('data', (data) => {
                output += data;
            });

            pythonProcess.stderr.on('data', (data) => {
                console.error(`stderr: ${data}`);
            });

            pythonProcess.on('close', (code) => {
                console.log(`Python script exited with code ${code}`);
                // Optionally, delete the temporary file after processing
                fs.unlinkSync(tempFilePath);

                const lines = output.split('\r\n');
                lines.shift(); // Remove the first line
                const filteredLines = lines.filter(line => line.trim() !== '');

                const filteredCourses = courses.filter(course => filteredLines.includes(course.courseNum));
                console.log(filteredCourses);
                resolve(filteredCourses);



                // const courseString = filteredLines.join(', ');

                //console.log(courses);
                //const allCourses = await Course.find({});


                // resolve(courseString); // Resolve the promise with courseString
            });

            pythonProcess.on('error', (error) => {
                reject(error); // Reject the promise if there's an error
            });
        });
    } catch (error) {
        console.error('Error:', error);
    }
};



export default { getCourses, createSolutions };
