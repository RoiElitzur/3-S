import './Solutions.css';
import { useNavigate, useLocation } from "react-router-dom";
import { useEffect, useState } from 'react';

function Solutions() {
    const navigate = useNavigate();
    const location = useLocation();
    const [solutions, setSolutions] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(10);

    useEffect(() => {
        // Retrieve solutions from local storage if available
        const storedSolutions = localStorage.getItem('solutions');
        if (storedSolutions) {
            setSolutions(JSON.parse(storedSolutions));
        } else if (location.state?.solutions) {
            // Store solutions in local storage
            const parsedSolutions = JSON.parse(location.state.solutions);
            localStorage.setItem('solutions', JSON.stringify(parsedSolutions));
            setSolutions(parsedSolutions);
        }
    }, [location.state?.solutions]);

    const handleSelectSolution = (solution) => {
        // Flatten dependencies from all courses in the selected solution
        const dependencies = solution.map(course => course.dependencies).flat();
        // Navigate to the solution-table route, passing the selected solution and dependencies
        navigate('/solution', { state: { solution, dependencies } });
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

    // Calculate paginated solutions
    const indexOfLastSolution = currentPage * itemsPerPage;
    const indexOfFirstSolution = indexOfLastSolution - itemsPerPage;
    const currentSolutions = solutions.slice(indexOfFirstSolution, indexOfLastSolution);
    const totalPages = Math.ceil(solutions.length / itemsPerPage);

    return (
        <div className="background-container">
            <div className="solutions-container">
                <h1 className="headline-solutions">Solutions</h1>
                <div className="button-container">
                    <button onClick={handleGoBack} className="action-button">Back to Preferences</button>
                    <button onClick={handleLogout} className="action-button">Logout</button>
                </div>
                <div className="solutions-table">
                    <div className="table-header">
                        <div className="header-item">Solution</div>
                        <div className="header-item">Score</div>
                        <div className="header-item">Action</div>
                    </div>
                    {currentSolutions.length > 0 ? (
                        currentSolutions.map((solution, index) => (
                            <div key={index} className="table-row">
                                <div className="table-item">Solution {indexOfFirstSolution + index + 1}</div>
                                <div className="table-item">{solution.score || 'N/A'}</div>
                                <div className="table-item">
                                    <button onClick={() => handleSelectSolution(solution)} className="view-button">
                                        View
                                    </button>
                                </div>
                            </div>
                        ))
                    ) : (
                        <p>No solutions available</p>
                    )}
                </div>
                <div className="pagination-container">
                    <button
                        className="pagination-button"
                        onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                        disabled={currentPage === 1}
                    >
                        Previous
                    </button>
                    <span>Page {currentPage} of {totalPages}</span>
                    <button
                        className="pagination-button"
                        onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                        disabled={currentPage === totalPages}
                    >
                        Next
                    </button>
                </div>
            </div>
        </div>
    );
}

export default Solutions;




// import './Solutions.css';
// import { useNavigate, useLocation } from "react-router-dom";
// import { useEffect, useState } from 'react';
//
// function Solutions() {
//     const navigate = useNavigate();
//     const location = useLocation();
//     const [solutions, setSolutions] = useState({ unlimited: [], dayLimited: [], partialCourses: [] });
//
//     const [currentPage, setCurrentPage] = useState(1);
//     const [itemsPerPage] = useState(10);
//
//     useEffect(() => {
//         // Retrieve solutions from local storage if available
//         const storedSolutions = localStorage.getItem('solutions');
//         if (storedSolutions) {
//             console.log("inside");
//             const parsedSolutions = JSON.parse(storedSolutions);
//             console.log("parsed solution are:")
//             console.log(parsedSolutions);
//             setSolutions({
//                 unlimited: parsedSolutions.unlimited || [],
//                 dayLimited: parsedSolutions.dayLimited || [],
//                 partialCourses: parsedSolutions.partialCourses || []
//             });
//         } else if (location.state?.solutions) {
//             // Store solutions in local storage
//             const parsedSolutions = JSON.parse(location.state.solutions);
//             localStorage.setItem('solutions', JSON.stringify(parsedSolutions));
//             setSolutions({
//                 unlimited: parsedSolutions.unlimited || [],
//                 dayLimited: parsedSolutions.dayLimited || [],
//                 partialCourses: parsedSolutions.partialCourses || []
//             });
//         }
//     }, [location.state?.solutions]);
//
//     const handleSelectSolution = (solution) => {
//         const dependencies = solution.map(course => course.dependencies).flat();
//         navigate('/solution', { state: { solution, dependencies } });
//     };
//
//     const handleGoBack = () => {
//         localStorage.removeItem('solutions');
//         navigate('/preferences');
//     };
//
//     const handleLogout = () => {
//         localStorage.removeItem('solutions');
//         navigate('/');
//     };
//
//
//     const renderSolutionRows = (solutions, type) => {
//         const offset = currentPage * itemsPerPage;
//         // console.log(solutions);
//         solutions = JSON.parse(solutions);
//         const solutionsToDisplay = solutions.slice(offset - itemsPerPage, offset);
//         // console.log(solutionsToDisplay);
//         if (!Array.isArray(solutionsToDisplay)) {
//             console.error('Expected an array but got:', solutionsToDisplay);
//             return <p>Error: No valid solutions to display</p>;
//         }
//
//         return solutionsToDisplay.map((solution, index) => (
//             <div key={index} className="table-row">
//                 {solution.map(course => (
//                     <div key={course._id} className="table-item">
//                         {course.courseName} - {course.day} {course.startTime}-{course.endTime}
//                     </div>
//                 ))}
//             </div>
//         ));
//     };
//
//
//     return (
//         <div className="background-container">
//             <div className="solutions-container">
//                 <h1 className="headline-solutions">Solutions</h1>
//                 <div className="button-container">
//                     <button onClick={handleGoBack} className="action-button">Back to Preferences</button>
//                     <button onClick={handleLogout} className="action-button">Logout</button>
//                 </div>
//                 {['unlimited', 'dayLimited', 'partialCourses'].map((type) => (
//                     <div key={type} className="solutions-table">
//                         <div className="table-header">
//                             <div className="header-item">Solution Type</div>
//                             <div className="header-item">Action</div>
//                         </div>
//                         {solutions[type].length > 0 ? renderSolutionRows(solutions[type], type) : <p>No {type} solutions available</p>}
//                     </div>
//                 ))}
//             </div>
//         </div>
//     );
// }
//
// export default Solutions;



