import './Preferences.css';
import { useState, useEffect } from 'react';
import Select from 'react-select';
import {useNavigate} from 'react-router-dom';

function Preferences() {
    const navigate = useNavigate();
    const [selectedSemester, setSelectedSemester] = useState(null);
    const [courses, setCourses] = useState([]);
    const [coursesBySemester, setCoursesBySemester] = useState([]);
    const [selectedCourses, setSelectedCourses] = useState([]);
    const [numCoursesToGiveUpOptions, setNumCoursesToGiveUpOptions] = useState([]);
    const [mustCoursesOptions, setMustCoursesOptions] = useState([]);
    const [selectedMustCourses, setSelectedMustCourses] = useState([]);
    const [selectedNumDays,setSelectedNumDays] = useState();
    const [daysOrCourses,setDaysOrCourses] = useState();

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
                const courseOptions = data.map(course => ({
                    value: course.courseNum,
                    label: course.courseName,
                    id: course._id,
                    semester: course.semester
                }));
                setCourses(courseOptions);
            } else {
                console.error('Error fetching courses');
            }
        };

        fetchCourses();
    }, []);

    useEffect(() => {
        const giveUpOptions = Array.from({ length: selectedCourses.length + 1 }, (_, i) => ({
            value: i,
            label: i.toString(),
        }));
        setNumCoursesToGiveUpOptions(giveUpOptions);

        const mustCourses = selectedCourses.map(course => ({
            value: course.value,
            label: course.label,
            id: course._id
        }));
        setMustCoursesOptions(mustCourses);
    }, [selectedCourses]);


    const handleChangeMustCourses = (selectedOptions) => {
        setSelectedMustCourses(selectedOptions);
    };

    const handleSelectSemesterChange = (selectedOptions) => {
        setSelectedSemester(selectedOptions);
        setCoursesBySemester(courses.filter(course => course.semester === selectedOptions.value));
        setSelectedMustCourses([]);
        setSelectedCourses([]);
    };

    const handleSelectChange = (selectedOptions) => {
        setSelectedCourses(selectedOptions);
    };
    const handleSelectChangeNumDays = (selectedOptions) =>{
        setSelectedNumDays(selectedOptions);
    }
    const handleChangeDaysOrCourses = (selectedOptions) =>{
        setDaysOrCourses(selectedOptions);
    }

    const handleSubmit = async (event) => {
        event.preventDefault();

        const data = {
            selectedCourses: selectedCourses,
            numDays: selectedNumDays,
            daysOrCourses : daysOrCourses,
            giveUpOptions: numCoursesToGiveUpOptions,
            mustCourses: selectedMustCourses,
        };

        try {
            // First HTTP request
            const res = await fetch('http://localhost:12345/Courses', {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            });

            if (res.status !== 200) {
                // Handle error
                return;
            }

            const solution = await res.text();

            // Second HTTP request
            const additionalRes = await fetch('http://localhost:12345/Courses/dependencies', {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json',

                },
                body: JSON.stringify( data ),
            });

            if (additionalRes.status !== 200) {
                // Handle error
                return;
            }

            const dependencies = await additionalRes.text();

            // console.log(dependencies);

            // Navigate to the new page with both results
            navigate('/solution', { state: { 'solution':solution, 'dependencies': dependencies } });

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
                <div className="form-group">
                    <label htmlFor="chosen-semester">Choose semester</label>
                    <Select
                        id="chosen-semester"
                        name="chosen-semester"
                        className="input-field"
                        options={[
                            {value: 'a', label: 'Semester A'},
                            {value: 'b', label: 'Semester B'}
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
                            {value: '1', label: '1'},
                            {value: '2', label: '2'},
                            {value: '3', label: '3'},
                            {value: '4', label: '4'},
                            {value: '5', label: '5'},
                            {value: '6', label: '6'}
                        ]}
                        value={selectedNumDays}
                        onChange={handleSelectChangeNumDays}
                        placeholder="Select number of days..."
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="less-days-more-courses">More courses or fewer days</label>
                    <Select
                        id="less-days-more-courses"
                        name="less-days-more-courses"
                        className="input-field"
                        options={[
                            {value: '0', label: 'More courses'},
                            {value: '1', label: 'Less days'}
                        ]}
                        value={daysOrCourses}
                        onChange={handleChangeDaysOrCourses}
                        placeholder="Select option..."
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="courses-to-give-up">How many courses are you willing to give up, if any</label>
                    <Select
                        id="courses-to-give-up"
                        name="courses-to-give-up"
                        className="input-field"
                        options={numCoursesToGiveUpOptions}
                        placeholder="Enter amount of courses"
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="courses-must-be-in-schedule">Courses that must be included in the schedule</label>
                    <Select
                        id="courses-must-be-in-schedule"
                        name="courses-must-be-in-schedule"
                        className="input-field"
                        isMulti
                        value={selectedMustCourses}
                        onChange={handleChangeMustCourses}
                        options={mustCoursesOptions}
                        placeholder="Choose courses"
                    />
                </div>
                <button type="submit" className="submit-button">Submit Preferences</button>
            </form>
        </div>
    );
}

export default Preferences;
