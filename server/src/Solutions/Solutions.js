import './Solutions.css';
import { useNavigate, useLocation } from "react-router-dom";
import { useEffect, useState } from 'react';

function Solutions() {
    const navigate = useNavigate();
    const location = useLocation();
    const [solutionsWithoutDemands, setSolutionsWithoutDemands] = useState([]);
    const [solutionsWithDaysLimit, setSolutionsWithDaysLimit] = useState([]);
    const [solutionsWithExcludedCourses, setSolutionsWithExcludedCourses] = useState([]);

    useEffect(() => {
        // Retrieve solutions from local storage if available
        const storedSolutions = localStorage.getItem('solutions7');
        if (storedSolutions) {
            const afterParse = JSON.parse(storedSolutions);
            //setSolutions(afterParse);
            setSolutionsWithoutDemands(afterParse.noExclusions);
            setSolutionsWithExcludedCourses(afterParse.withExclusions);
            setSolutionsWithDaysLimit(afterParse.daysLimit);
        } else if (location.state?.solutions7) {
            // Store solutions in local storage
            const parsedSolutions = JSON.parse(location.state.solutions7);
            localStorage.setItem('solutions7', JSON.stringify(parsedSolutions));
            setSolutionsWithoutDemands(parsedSolutions.noExclusions);
            setSolutionsWithExcludedCourses(parsedSolutions.withExclusions);
            setSolutionsWithDaysLimit(parsedSolutions.daysLimit);
        }
    }, [location.state?.solutions7]);

    const handleSelectSolution = (solution) => {
        // Navigate to the solution-table route, passing the selected solution and dependencies
        navigate('/solution', {state: {solution}});
    };

    const handleGoBack = () => {
        // Clear solutions from local storage when navigating back to preferences
        localStorage.removeItem('solutions7');
        navigate('/preferences');
    };

    const handleLogout = () => {
        // Clear solutions from local storage on logout
        localStorage.removeItem('solutions7');
        navigate('/');
    };

    function renderTable(solutions) {
        console.log("in render:");
        console.log(solutions);
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
                                    Views
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

