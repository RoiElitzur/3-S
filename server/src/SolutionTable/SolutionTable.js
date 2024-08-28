import './SolutionTable.css';
import { useLocation, useNavigate } from "react-router-dom";

function SolutionTable() {
    const location = useLocation();
    const { solution, dependencies } = location.state || {};
    const navigate = useNavigate();

    const handleGoBack = () => {
        navigate('/preferences');
    };

    const handleLogout = () => {
        navigate('/');
    };

    const timeSlots = [
        '08:00 – 09:00', '09:00 – 10:00', '10:00 – 11:00',
        '11:00 – 12:00', '12:00 – 13:00', '13:00 – 14:00',
        '14:00 – 15:00', '15:00 – 16:00', '16:00 – 17:00',
        '17:00 – 18:00', '18:00 – 19:00', '19:00 – 20:00','20:00 - 20:00'
    ];

    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

    const getDayIndex = (day) => days.indexOf(day);
    const getTimeSlotIndex = (time) => timeSlots.findIndex(slot => slot.startsWith(time));

    const table = Array(timeSlots.length).fill(null).map(() => Array(7).fill(''));

    try {
        const parsedSolution = JSON.parse(solution);

        parsedSolution.forEach(course => {
            const dayIndex = getDayIndex(course.day);
            const startTimeIndex = getTimeSlotIndex(course.startTime);
            const endTimeIndex = getTimeSlotIndex(course.endTime);

            if (dayIndex !== -1 && startTimeIndex !== -1 && endTimeIndex !== -1) {
                for (let i = startTimeIndex; i <= endTimeIndex; i++) {
                    if (table[i]) {
                        table[i][dayIndex] = course.courseName;
                    }
                }
            } else {
                console.error('Invalid indices calculated:', { dayIndex, startTimeIndex, endTimeIndex });
            }
        });
    } catch (error) {
        console.error('Failed to parse solution or set table values:', error);
        return <div>Error: Invalid data format</div>;
    }

    const parsedDependencies = JSON.parse(dependencies);
    const dependencyList = Array.isArray(parsedDependencies) ? parsedDependencies.map(dep => dep.courseName) : [];

    return (
        <div className="solution-container">
            <div className="dependencies-list">
                <h2>Dependencies</h2>
                <ul>
                    {dependencyList.length > 0 ? (
                        dependencyList.map((courseName, index) => (
                            <li key={index}>{courseName}</li>
                        ))
                    ) : (
                        <li>No dependencies found</li>
                    )}
                </ul>
            </div>

            <div className="schedule-container">
                <h1 className="headline">Solution Preview</h1>
                <div className="button-container">
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