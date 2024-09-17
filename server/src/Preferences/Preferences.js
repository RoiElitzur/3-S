import './Preferences.css';
import { useState, useEffect } from 'react';
import Select from 'react-select';
import { useNavigate } from 'react-router-dom';

function Preferences() {
    const navigate = useNavigate();
    const [selectedYear, setSelectedYear] = useState(null);
    const [selectedSemester, setSelectedSemester] = useState(null);
    const [courses, setCourses] = useState([]);
    const [coursesBySemester, setCoursesBySemester] = useState([]);
    const [selectedCourses, setSelectedCourses] = useState([]);
    const [mustCoursesOptions, setMustCoursesOptions] = useState([]);
    const [selectedExcludedCourses, setSelectedExcludedCourses] = useState([]);
    const [selectedNumDays, setSelectedNumDays] = useState();
    const [errorMessage, setErrorMessage] = useState(null);
    const handleLogout = () => {
        navigate('/'); // Redirect to landing page after logout
    };

    useEffect(() => {
        const fetchCourses = async () => {
            const res = await fetch('http://localhost:12345/Courses', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            if (res.status === 200) {
                const data = await res.json();
                const uniqueCourses = new Map();
                data.forEach(course => {
                    if (!uniqueCourses.has(course.courseNum)) {
                        uniqueCourses.set(course.courseNum, {
                            value: course.courseNum,
                            label: course.courseName,
                            id: course._id,
                            year: course.year,
                            semester: course.semester,
                            dependencies: course.dependencies
                        });
                    }
                });
                const courseOptions = Array.from(uniqueCourses.values());
                setCourses(courseOptions);
                // Initialize courseBySemester with all courses
                setCoursesBySemester(courseOptions);
            } else {
                console.error('Error fetching courses');
            }
        };

        fetchCourses();
    }, []);

    useEffect(() => {

        const mustCourses = selectedCourses.map(course => ({
            value: course.value,
            label: course.label,
            id: course.id
        }));
        setMustCoursesOptions(mustCourses);
    }, [selectedCourses]);

    useEffect(() => {
        const filterCourses = () => {
            let filtered = courses.filter(course => {
                if (selectedYear && selectedSemester) {
                    return (course.year === selectedYear || course.year === "0") &&
                        course.semester === selectedSemester.value;
                } else if (selectedYear) {
                    return (course.year === selectedYear || course.year === "0");
                } else if (selectedSemester) {
                    return course.semester === selectedSemester.value;
                } else {
                    return true;
                }
            });

            // Ensure no duplicate courses
            const uniqueFilteredCourses = new Map();
            filtered.forEach(course => {
                if (!uniqueFilteredCourses.has(course.value)) {
                    uniqueFilteredCourses.set(course.value, course);
                }
            });

            setCoursesBySemester(Array.from(uniqueFilteredCourses.values()));
        };

        filterCourses();
    }, [courses, selectedYear, selectedSemester]);

    const handleChangeExcludedCourses = (selectedOptions) => {
        setSelectedExcludedCourses(selectedOptions);
    };

    const handleSelectYearChange = (selectedOptions) => {
        setSelectedYear(selectedOptions ? selectedOptions.value : null);
    };

    const handleSelectSemesterChange = (selectedOptions) => {
        setSelectedSemester(selectedOptions);
        setCoursesBySemester(courses.filter(course => course.semester === selectedOptions.value));
        setSelectedExcludedCourses([]);
        setSelectedCourses([]);
    };

    const handleSelectChange = (selectedOptions) => {
        setSelectedCourses(selectedOptions);
    };

    const handleSelectChangeNumDays = (selectedOptions) => {
        setSelectedNumDays(selectedOptions);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        // Validate if year, semester, and courses are selected
        if (!selectedYear || !selectedSemester || selectedCourses.length === 0) {
            setErrorMessage('Please select a year, semester, and at least one course.');
            return; // Do not proceed with submission
        }

        // Clear error message
        setErrorMessage(null);
        // Create the data object with selected year and semester
        const data = {
            selectedYear: selectedYear,
            selectedSemester: selectedSemester ? selectedSemester.value : null,
            selectedCourses: selectedCourses,
            numDays: selectedNumDays,
            excludedCourses: selectedExcludedCourses
        };

        try {
            const res = await fetch('http://localhost:12345/Courses', {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            });

            if (res.status !== 200) {
                // Handle error
                console.error('Error submitting courses data');
                return;
            }

            const solution = await res.text();
            // Navigate to the new page with the results
            console.log(solution);
            navigate('/solutions', { state: { 'solutions7': solution } });

        } catch (error) {
            console.error("Error during HTTP requests:", error);
        }
    };

    return (
        <div className="preferences-container">
            <h1 className="headline">Preferences</h1>
            <div className="button-container">
                <button onClick={handleLogout} className="back-button">Logout</button>
            </div>
            <form className="preferences-form" onSubmit={handleSubmit}>
                {errorMessage && <div className="error-message">{errorMessage}</div>} {/* Display error message if any */}
                <div className="form-group">
                    <label htmlFor="chosen-year">Choose year</label>
                    <Select
                        id="chosen-year"
                        name="chosen-year"
                        className="input-field"
                        options={[
                            { value: '1', label: 'Year 1' },
                            { value: '2', label: 'Year 2' },
                            { value: '3', label: 'Year 3' }
                        ]}
                        value={selectedYear ? { value: selectedYear, label: `Year ${selectedYear}` } : null}
                        onChange={handleSelectYearChange}
                        closeMenuOnSelect={true}
                        placeholder="Choose year"
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="chosen-semester">Choose semester</label>
                    <Select
                        id="chosen-semester"
                        name="chosen-semester"
                        className="input-field"
                        options={[
                            { value: 'a', label: 'Semester A' },
                            { value: 'b', label: 'Semester B' }
                        ]}
                        value={selectedSemester}
                        onChange={handleSelectSemesterChange}
                        closeMenuOnSelect={true}
                        placeholder="Choose semester"
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="chosen-courses">Choose courses</label>
                    <Select
                        id="chosen-courses"
                        name="chosen-courses"
                        className="input-field"
                        isMulti
                        options={coursesBySemester}
                        value={selectedCourses}
                        onChange={handleSelectChange}
                        closeMenuOnSelect={false}
                        placeholder="Choose courses"
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="NumDays">Number of days in the schedule</label>
                    <Select
                        id="NumDays"
                        name="NumDays"
                        className="input-field"
                        options={[
                            { value: '1', label: '1' },
                            { value: '2', label: '2' },
                            { value: '3', label: '3' },
                            { value: '4', label: '4' },
                            { value: '5', label: '5' }
                        ]}
                        value={selectedNumDays}
                        onChange={handleSelectChangeNumDays}
                        placeholder="Select number of days..."
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="courses-must-be-in-schedule">Courses that can be excluded from the schedule</label>
                    <Select
                        id="courses-must-be-in-schedule"
                        name="courses-must-be-in-schedule"
                        className="input-field"
                        isMulti
                        value={selectedExcludedCourses}
                        onChange={handleChangeExcludedCourses}
                        options={mustCoursesOptions}
                        closeMenuOnSelect={false}
                        placeholder="Choose courses"
                    />
                </div>
                <button type="submit" className="submit-button">Submit Preferences</button>
            </form>
        </div>
    );
}

export default Preferences;
