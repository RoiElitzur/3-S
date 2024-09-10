import './Solutions.css';
import { useNavigate, useLocation } from "react-router-dom";
import { useEffect, useState } from 'react';

function Solutions() {
    const navigate = useNavigate();
    const location = useLocation();
    const [solutions, setSolutions] = useState([]);
    const [solutionsWithoutDemands, setSolutionsWithoutDemands] = useState([]);
    const [solutionsWithDaysLimit, setSolutionsWithDaysLimit] = useState([]);
    const [solutionsWithExcludedCourses, setSolutionsWithExcludedCourses] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(10);

    useEffect(() => {
        // Retrieve solutions from local storage if available
        const storedSolutions = localStorage.getItem('solutions123');
        if (storedSolutions) {
            const afterParse = JSON.parse(storedSolutions);
            //setSolutions(afterParse);
            setSolutionsWithoutDemands(afterParse.noExclusions);
            setSolutionsWithExcludedCourses(afterParse.withExclusions);
        } else if (location.state?.solutions123) {
            // Store solutions in local storage
            const parsedSolutions = JSON.parse(location.state.solutions123);
            localStorage.setItem('solutions123', JSON.stringify(parsedSolutions));
            setSolutionsWithoutDemands(parsedSolutions.noExclusions);
            setSolutionsWithExcludedCourses(parsedSolutions.withExclusions);
        }
    }, [location.state?.solutions123]);

    const handleSelectSolution = (solution) => {
        // Navigate to the solution-table route, passing the selected solution and dependencies
        navigate('/solution', {state: {solution}});
    };

    const handleGoBack = () => {
        // Clear solutions from local storage when navigating back to preferences
        localStorage.removeItem('solutions123');
        navigate('/preferences');
    };

    const handleLogout = () => {
        // Clear solutions from local storage on logout
        localStorage.removeItem('solutions123');
        navigate('/');
    };

    // Calculate paginated solutions
    // const indexOfLastSolution = currentPage * itemsPerPage;
    // const indexOfFirstSolution = indexOfLastSolution - itemsPerPage;
    // const currentSolutions = solutions.slice(indexOfFirstSolution, indexOfLastSolution);
    // const totalPages = Math.ceil(solutions.length / itemsPerPage);

    // const currentNoDemandsSolutions = solutionsWithoutDemands.slice(indexOfFirstSolution, indexOfLastSolution);
    // console.log("currentNoDemandsSolutions is:");
    // console.log(currentNoDemandsSolutions);
    //
    // console.log("solutions is:");
    // console.log(solutions);

    // const NoDemandsTotalPages = Math.ceil(solutionsWithoutDemands.length / itemsPerPage);

//

    function renderTable(solutions) {
        return (
            <>
                <div className="table-header">
                    <div className="header-item">Solution</div>
                    <div className="header-item">Action</div>
                </div>
                {solutions.length > 0 ? (
                    solutions.map((solution, index) => (
                        <div key={index} className="table-row">
                            <div className="table-item">Solution {index + 1}</div>
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
            </>
        );
    }


    return (

        <div className="background-container">
            <h1 className="headline">Solutions</h1>
            <div className="solutions-container">
                <div className="button-container">
                    <button onClick={handleGoBack} className="action-button">Back to Preferences</button>
                    <button onClick={handleLogout} className="action-button">Logout</button>
                </div>
                <div className="solutions-flex-container">
                    {/* Solutions without demands */}
                    <div className="solutions-table-container">
                        <h2>No demands</h2>
                        <div className="solutions-table">
                            {renderTable(solutionsWithoutDemands)}
                        </div>
                    </div>
                    {/* Solutions with days limit */}
                    <div className="solutions-table-container">
                        <h2>Days limitation</h2>
                        <div className="solutions-table">
                            {renderTable(solutionsWithDaysLimit)}
                        </div>
                    </div>
                    {/* Solutions with excluded courses */}
                    <div className="solutions-table-container">
                        <h2>Exclude courses</h2>
                        <div className="solutions-table">
                            {renderTable(solutionsWithExcludedCourses)}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Solutions;


// return (
//         <div className="background-container">
//             <div className="solutions-container">
//                 <h1 className="headline-solutions">Solutions</h1>
//                 <div className="button-container">
//                     <button onClick={handleGoBack} className="action-button">Back to Preferences</button>
//                     <button onClick={handleLogout} className="action-button">Logout</button>
//                 </div>
//                 <div className="solutions-table">
//                     <div className="table-header">
//                         <div className="header-item">Solution</div>
//                         <div className="header-item">Action</div>
//                     </div>
//                     {currentSolutions.length > 0 ? (
//                         currentSolutions.map((solution, index) => (
//                             <div key={index} className="table-row">
//                                 <div className="table-item">Solution {indexOfFirstSolution + index + 1}</div>
//                                 <div className="table-item">
//                                     <button onClick={() => handleSelectSolution(solution)} className="view-button">
//                                         View
//                                     </button>
//                                 </div>
//                             </div>
//                         ))
//                     ) : (
//                         <p>No solutions available</p>
//                     )}
//                 </div>
//                 <div className="pagination-container">
//                     <button
//                         className="pagination-button"
//                         onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
//                         disabled={currentPage === 1}
//                     >
//                         Previous
//                     </button>
//                     <span>Page {currentPage} of {totalPages}</span>
//                     <button
//                         className="pagination-button"
//                         onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
//                         disabled={currentPage === totalPages}
//                     >
//                         Next
//                     </button>
//                 </div>
//             </div>
//         </div>
//     );
// }
