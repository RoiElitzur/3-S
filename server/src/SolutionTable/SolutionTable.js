import './SolutionTable.css';
import { useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect } from 'react';


function SolutionTable () {
    const location = useLocation();
    const { solution = [], dependencies = {} } = location.state || {};
    const [names, setNames] = useState([]);
    // console.log('Solution:', solution);
    // console.log('Dependencies:', dependencies);
    const navigate = useNavigate();

    const handleGoBackToSolutions = () => {
        navigate('/solutions');
    };

    const handleGoBack = () => {
        // Clear solutions from local storage when navigating back to preferences
        localStorage.removeItem('solutions');
        navigate('/preferences');
    };

    const handleLogout = () => {
        // Clear solutions from local storage on logout
        localStorage.removeItem('solutions');
        navigate('/');
    };
    const timeSlots = [
        '08:00 – 09:00', '09:00 – 10:00', '10:00 – 11:00',
        '11:00 – 12:00', '12:00 – 13:00', '13:00 – 14:00',
        '14:00 – 15:00', '15:00 – 16:00', '16:00 – 17:00',
        '17:00 – 18:00', '18:00 – 19:00', '19:00 – 20:00'
    ];

    const timeSlots1 = [
        '08:00 – 09:00', '09:00 – 10:00', '10:00 – 11:00',
        '11:00 – 12:00', '12:00 – 13:00', '13:00 – 14:00',
        '14:00 – 15:00', '15:00 – 16:00', '16:00 – 17:00',
        '17:00 – 18:00', '18:00 – 19:00', '19:00 – 20:00', '20:00 - 20:00'
    ];

    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

    const getDayIndex = (day) => days.indexOf(day);
    const getTimeSlotIndex = (time) => timeSlots1.findIndex(slot => slot.startsWith(time));

    const table = Array(timeSlots.length).fill(null).map(() => Array(7).fill(''));


    useEffect(() => {
        const fetchDependencies = async () => {
            const allDependencies = {};
            let dependencyIndex = 1;

            // Assuming 'solution' is available globally or passed as a prop
            solution
                .filter(course => course.dependencies.length > 0)
                .forEach(course => {
                    course.dependencies.forEach(dep => {
                        allDependencies[dependencyIndex] = dep;
                        dependencyIndex++;
                    });
                });

            try {
                const res = await fetch('http://localhost:12345/Courses/names', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(allDependencies),
                });

                if (res.status !== 200) {
                    return;
                }

                const data = await res.json(); // Assuming the response is JSON
                setNames(data);

            } catch (error) {
                console.error('Error during HTTP request:', error);
            }
        };

        fetchDependencies();
    }, []); // Empty array ensures the effect only runs once on component mount

    try {
        solution.forEach(course => {
            // console.log(course)
            const dayIndex = getDayIndex(course.day);
            const startTimeIndex = getTimeSlotIndex(course.startTime);
            const endTimeIndex = getTimeSlotIndex(course.endTime);

            if (dayIndex !== -1 && startTimeIndex !== -1 && endTimeIndex !== -1) {
                for (let i = startTimeIndex; i < endTimeIndex; i++) {
                    if (table[i]) {
                        table[i][dayIndex] = course.courseName;
                    }
                }
            } else {
                console.error('Invalid indices calculated:', { dayIndex, startTimeIndex, endTimeIndex });
            }
        });
    } catch (error) {
        console.error('Failed to set table values:', error);
        return <div>Error: Invalid data format</div>;
    }


    const dependencyList = solution
        .filter(course => course.dependencies.length > 0) // Filter out courses without dependencies
        .map((course, courseIndex) => (
            <div key={`course-container-${courseIndex}`}> {/* Use div as a container */}
                <li key={`course-${courseIndex}`} className="course-name">
                    {course.courseName} -> {/* Course name bold */}
                </li>
                {course.dependencies.map((dep, depIndex) => (
                    <li key={`dep-${courseIndex}-${depIndex}`} className="dependency">
                        {names[dep] || dep} {/* Use course name from `names` or fallback to course number */}
                    </li>
                ))}
            </div>
        ));


    return (
        <div className="solution-container">
            <div className="dependencies-list">
                <h2>Dependencies</h2>
                <ul>
                    {dependencyList.length > 0 ? (
                        dependencyList
                    ) : (
                        <li>No dependencies found</li>
                    )}
                </ul>
            </div>

            <div className="schedule-container">
                <h1 className="headline">Solution Preview</h1>
                <div className="button-container">
                    <button onClick={handleGoBackToSolutions} className="back-button">Back to Solutions</button>
                    <button onClick={handleGoBack} className="back-button">Back to Preferences</button>
                    <button onClick={handleLogout} className="back-button">Logout</button>
                </div>
                <table className="schedule-table">
                    <thead>
                    <tr>
                        <th>Time</th>
                        {days.map(day => <th key={day}>{day}</th>)}
                    </tr>
                    </thead>
                    <tbody>
                    {timeSlots.map((timeSlot, rowIndex) => (
                        <tr key={timeSlot}>
                            <td>{timeSlot}</td>
                            {table[rowIndex].map((course, colIndex) => (
                                <td key={colIndex}>{course}</td>
                            ))}
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default SolutionTable;
