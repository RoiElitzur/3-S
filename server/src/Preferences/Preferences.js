import './Preferences.css';
import { useState, useEffect } from 'react';
import Select from 'react-select';

function Preferences() {
    const [courses, setCourses] = useState([]);
    const [selectedCourses, setSelectedCourses] = useState([]);
    const [numCoursesToGiveUpOptions, setNumCoursesToGiveUpOptions] = useState([]);
    const [mustCoursesOptions, setMustCoursesOptions] = useState([]);
    const [selectedNumDays,setSelectedNumDays] = useState();
    const [daysOrCourses,setDaysOrCourses] = useState();

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
                    id: course._id
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
            mustCourses: mustCoursesOptions,
        }
        console.log(data);
        const res = await fetch('http://localhost:12345/Courses', {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
            },
            'body': JSON.stringify(data),
        });
        if(res.status !== 200) {
            return;
        }
        //navigate('/Solutions');
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
                        value={selectedCourses}
                        onChange={handleSelectChange}
                        closeMenuOnSelect={false}
                        placeholder="Choose courses"
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="NumDays">How many days in schedule</label>
                    <Select
                        id="NumDays"
                        name="NumDays"
                        className="input-field"
                        options={[
                            { value: '1', label: '1' },
                            { value: '2', label: '2' },
                            { value: '3', label: '3' },
                            { value: '4', label: '4' },
                            { value: '5', label: '5' },
                            { value: '6', label: '6' }
                        ]}
                        value={selectedNumDays}
                        onChange={handleSelectChangeNumDays}
                        placeholder="Select number of days..."
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="less-days-more-courses">More courses or less days</label>
                    <Select
                        id="less-days-more-courses"
                        name="less-days-more-courses"
                        className="input-field"
                        options={[
                            { value: '0', label: 'More courses' },
                            { value: '1', label: 'Less days' }
                        ]}
                        value={daysOrCourses}
                        onChange={handleChangeDaysOrCourses}
                        placeholder="Select option..."
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="courses-to-give-up">How many courses you are willing to give up if at all</label>
                    <Select
                        id="courses-to-give-up"
                        name="courses-to-give-up"
                        className="input-field"
                        options={numCoursesToGiveUpOptions}
                        placeholder="Enter amount of courses"
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="courses-must-be-in-schedule">Courses that must be in schedule</label>
                    <Select
                        id="courses-must-be-in-schedule"
                        name="courses-must-be-in-schedule"
                        className="input-field"
                        isMulti
                        options={mustCoursesOptions}
                        placeholder="Choose courses"
                    />
                </div>
                {/*<div className="form-group">*/}
                {/*    <label htmlFor="non-related-anchors">Non related anchors in schedule</label>*/}
                {/*    <input type="text" id="non-related-anchors" className="input-field" placeholder="Day, HH:MM, Duration in minutes, Task Name" />*/}
                {/*</div>*/}
                <button type="submit" className="submit-button">Save Preferences</button>
            </form>
        </div>
    );
}

export default Preferences;
