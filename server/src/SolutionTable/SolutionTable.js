import './SolutionTable.css'
import {useLocation, useNavigate} from "react-router-dom";

function SolutionTable() {
    const location = useLocation();
    const { newData } = location.state || {};
    const navigate = useNavigate();

    const handleGoBack = () => {
        navigate('/preferences');  // Replace with your actual preferences page route
    };

    const handleLogout = () => {
        // Add your logout logic here
        navigate('/'); // Redirect to landing page after logout
    };

    // console.log(newData);
    // console.log('Type of newData:', typeof newData);

    const timeSlots = [
        '08:00 – 09:00', '09:00 – 10:00', '10:00 – 11:00',
        '11:00 – 12:00', '12:00 – 13:00', '13:00 – 14:00',
        '14:00 – 15:00', '15:00 – 16:00', '16:00 – 17:00',
        '17:00 – 18:00', '18:00 – 19:00'
    ];

    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

    // Function to get the column index for a given day
    const getDayIndex = (day) => days.indexOf(day);

    // Function to get the row index for a given start time
    const getTimeSlotIndex = (time) => {
        return timeSlots.findIndex(slot => slot.startsWith(time));
    };

    // Initialize the table with empty strings
    const table = Array(timeSlots.length).fill(null).map(() => Array(7).fill(''));

    // Safely parse and fill the table
    try {
        const parsedArray = JSON.parse(newData);

        parsedArray.forEach(course => {
            const dayIndex = getDayIndex(course.day);
            const startTimeIndex = getTimeSlotIndex(course.startTime);
            const endTimeIndex = getTimeSlotIndex(course.endTime);

            // Check for valid indices
            if (dayIndex !== -1 && startTimeIndex !== -1 && endTimeIndex !== -1) {
                // Fill the appropriate time slots for the course
                for (let i = startTimeIndex; i <= endTimeIndex; i++) {
                    if (table[i]) {  // Ensure the row exists
                        table[i][dayIndex] = course.courseName;
                    }
                }
            } else {
                console.error('Invalid indices calculated:', { dayIndex, startTimeIndex, endTimeIndex });
            }
        });
    } catch (error) {
        console.error('Failed to parse newData or set table values:', error);
        return <div>Error: Invalid data format</div>;
    }

    // Render the table
    return (
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
    );
}


export default SolutionTable;

// function SolutionTable({solution}) {
//
//
//     const location = useLocation();
//     const {newData} = location.state || {};
//
//     console.log(newData);
//     console.log('Type of newData:', typeof newData);
//
//     const timeSlots = [
//         '08:00 – 09:00', '09:00 – 10:00', '10:00 – 11:00',
//         '11:00 – 12:00', '12:00 – 13:00', '13:00 – 14:00',
//         '14:00 – 15:00', '15:00 – 16:00', '16:00 – 17:00',
//         '17:00 – 18:00', '18:00 – 19:00'
//     ];
//
//     const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
//
//     // Function to get the column index for a given day
//     const getDayIndex = (day) => days.indexOf(day);
//
//     // Function to get the row index for a given start time
//     const getTimeSlotIndex = (time) => {
//         return timeSlots.findIndex(slot => slot.startsWith(time));
//     };
//
//     // Initialize the table with empty strings
//     const table = Array(timeSlots.length).fill(null).map(() => Array(7).fill(''));
//
//     // Fill the table with courses
//     const parsedArray = JSON.parse(newData);
//     parsedArray.forEach(course => {
//         const dayIndex = getDayIndex(course.day);
//         const startTimeIndex = getTimeSlotIndex(course.startTime);
//         const endTimeIndex = getTimeSlotIndex(course.endTime);
//
//         // Fill the appropriate time slots for the course
//         for (let i = startTimeIndex; i <= endTimeIndex; i++) {
//             table[i][dayIndex] = course.courseName;
//         }
//     });
//
//     // Render the table
//     return (
//         <div className="schedule-container">
//             <h1 className="headline">Solution Preview</h1>
//             <table className="schedule-table">
//                 <thead>
//                 <tr>
//                     <th>Time</th>
//                     {days.map(day => <th key={day}>{day}</th>)}
//                 </tr>
//                 </thead>
//                 <tbody>
//                 {timeSlots.map((timeSlot, rowIndex) => (
//                     <tr key={timeSlot}>
//                         <td>{timeSlot}</td>
//                         {table[rowIndex].map((course, colIndex) => (
//                             <td key={colIndex}>{course}</td>
//                         ))}
//                     </tr>
//                 ))}
//                 </tbody>
//             </table>
//         </div>
//     );
// }

    // return(
    // <div className="schedule-container">
    //     <h1 className="headline">Solution Preview</h1>
    //     <table className="schedule-table">
    //         <thead>
    //         <tr>
    //             <th>Time</th>
    //             <th>Sunday</th>
    //             <th>Monday</th>
    //             <th>Tuesday</th>
    //             <th>Wednesday</th>
    //             <th>Thursday</th>
    //             <th>Friday</th>
    //             <th>Saturday</th>
    //         </tr>
    //         </thead>
    //         <tbody>
    //         <tr>
    //             <td>08:00 – 09:00</td>
    //             <td></td>
    //             <td></td>
    //             <td></td>
    //             <td>Work</td>
    //             <td>Communication network</td>
    //             <td></td>
    //             <td></td>
    //         </tr>
    //         <tr>
    //             <td>09:00 – 10:00</td>
    //             <td>Linear algebra</td>
    //             <td>Data Structures</td>
    //             <td></td>
    //             <td>Work</td>
    //             <td>Communication networks</td>
    //             <td></td>
    //             <td></td>
    //         </tr>
    //         <tr>
    //             <td>10:00 – 11:00</td>
    //             <td>Computer structure</td>
    //             <td>Data Structures</td>
    //             <td></td>
    //             <td>Work</td>
    //             <td>Communication networks</td>
    //             <td></td>
    //             <td></td>
    //         </tr>
    //         <tr>
    //             <td>11:00 – 12:00</td>
    //             <td>Computer structure</td>
    //             <td>Data Structures</td>
    //             <td></td>
    //             <td>Work</td>
    //             <td>Algorithms</td>
    //             <td></td>
    //             <td></td>
    //         </tr>
    //         <tr>
    //             <td>12:00 – 13:00</td>
    //             <td>Computer structure</td>
    //             <td>Computer science Introduction</td>
    //             <td>Discrete mathematics</td>
    //             <td>Work</td>
    //             <td>Algorithms</td>
    //             <td></td>
    //             <td></td>
    //         </tr>
    //         <tr>
    //             <td>13:00 – 14:00</td>
    //             <td>Computer structure</td>
    //             <td>Computer science Introduction</td>
    //             <td>Discrete mathematics</td>
    //             <td>Work</td>
    //             <td>Algorithms</td>
    //             <td></td>
    //             <td></td>
    //         </tr>
    //         <tr>
    //             <td>14:00 – 15:00</td>
    //             <td>Work</td>
    //             <td>Operating Systems</td>
    //             <td>Discrete mathematics</td>
    //             <td>Work</td>
    //             <td></td>
    //             <td></td>
    //             <td></td>
    //         </tr>
    //         <tr>
    //             <td>15:00 – 16:00</td>
    //             <td>Work</td>
    //             <td>Operating Systems</td>
    //             <td>Discrete mathematics</td>
    //             <td>Work</td>
    //             <td></td>
    //             <td></td>
    //             <td></td>
    //         </tr>
    //         <tr>
    //             <td>16:00 – 17:00</td>
    //             <td>Work</td>
    //             <td>Operating Systems</td>
    //             <td></td>
    //             <td>Work</td>
    //             <td></td>
    //             <td></td>
    //             <td></td>
    //         </tr>
    //         <tr>
    //             <td>17:00 – 18:00</td>
    //             <td>Work</td>
    //             <td></td>
    //             <td></td>
    //             <td>Work</td>
    //             <td>Introduction to artificial intelligence</td>
    //             <td></td>
    //             <td></td>
    //         </tr>
    //         <tr>
    //             <td>18:00 – 19:00</td>
    //             <td>Work</td>
    //             <td></td>
    //             <td></td>
    //             <td>Work</td>
    //             <td>Introduction to artificial intelligence</td>
    //             <td></td>
    //             <td></td>
    //         </tr>
    //         </tbody>
    //     </table>
    // </div>
    // )



