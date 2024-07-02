
import './Preferences.css';
import { useState, useEffect } from 'react';
import Select from 'react-select';


//const navigate = useNavigate();




function Preferences() {
    const [courses, setCourses] = useState([]);
    const [selectedOptions, setSelectedOptions] = useState([]);

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
                const courseNumbers = data.map(course => ({
                    value: course.courseNum,
                    label: course.courseName,
                }));
                setCourses(courseNumbers);
            } else {
                console.error('Error fetching courses');
            }
        };

        fetchCourses();
    }, []);

    const handleSubmit = async (event) => {
        event.preventDefault(); // prevent form submission
        if (await validate() === true) {
            // navigate('/');
        } // call the validation function
    };

    const validate = async function() {
        const res = await fetch('http://localhost:12345/Courses', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (res.status === 200) {
            const data = await res.json();
            console.log(data);
            return data;
        }
        return [];
    };

    const handleSelectChange = (selectedOptions) => {
        setSelectedOptions(selectedOptions);
    };

    return (
        <div className="preferences-container">
            <h1 className="headline">Preferences</h1>
            <form className="preferences-form" onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="chosen-courses">Choose courses</label>
                    <Select
                        id="chosen-courses"
                        name="chosen-courses"
                        className="input-field"
                        isMulti
                        options={courses}
                        value={selectedOptions}
                        onChange={handleSelectChange}
                        closeMenuOnSelect={false}
                        placeholder="Choose courses"
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="NumDays">How many days in schedule</label>
                    <select id="NumDays" name="NumDays" defaultValue="-1" className="input-field">
                        <option value="-1" disabled>Select number of days...</option>
                        <option value="1">1</option>
                        <option value="2">2</option>
                        <option value="3">3</option>
                        <option value="4">4</option>
                        <option value="5">5</option>
                        <option value="6">6</option>
                    </select>
                </div>
                <div className="form-group">
                    <label htmlFor="less-days-more-courses">More courses or less days</label>
                    <select id="less-days-more-courses" name="less-days-more-courses" defaultValue="-1" className="input-field">
                        <option value="-1">Select option...</option>
                        <option value="0">More courses</option>
                        <option value="1">Less days</option>
                    </select>
                </div>
                <div className="form-group">
                    <label htmlFor="courses-to-give-up">How many courses you are willing to give up if at all</label>
                    <input type="number" id="courses-to-give-up" className="input-field" placeholder="Enter amount of courses" />
                </div>
                <div className="form-group">
                    <label htmlFor="courses-must-be-in-schedule">Courses that must be in schedule</label>
                    <input type="text" id="courses-must-be-in-schedule" className="input-field" placeholder="Enter id of courses e.g: 81274, 81381, ..." />
                </div>
                <div className="form-group">
                    <label htmlFor="non-related-anchors">Non related anchors in schedule</label>
                    <input type="text" id="non-related-anchors" className="input-field" placeholder="Day, HH:MM, Duration in minutes, Task Name" />
                </div>
                <button type="submit" className="submit-button">Save Preferences</button>
            </form>
        </div>
    );
}

export default Preferences;
