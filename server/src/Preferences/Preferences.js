import './Preferences.css'
import {useState} from 'react';
import {useRef} from 'react';
import { Link , useNavigate} from 'react-router-dom';
import React from 'react';
import Select from 'react-select';
//import Dropdown from 'react-bootstrap/Dropdown';

// const numDays = useRef("");
// const numCoursesToGiveup = useRef("");
// const DaysOrCourses = useRef("");
// const ListOfMustCourses = useRef("");
// const ExtraActivites = useRef("");

//const navigate = useNavigate();
const options = [
    { value: 1, label: '1' },
    { value: 2, label: '2' },
    { value: 3, label: '3' },
    { value: 4, label: '4' },
    { value: 5, label: '5' },
    { value: 6, label: '6' }
];
const handleSubmit = async (event) => {
    event.preventDefault(); // prevent form submission
    if(await validate() === true) {
        //navigate('/');
    } // call the validation function
}



const validate = async function(){



    const res = await fetch('http://localhost:12345/Courses', {
        method: "POST",
        headers: {
            'Content-Type': 'application/json',
        },
        //'body': JSON.stringify(data),
    });
    //if res.status !== 200 it means that there is a conflict because the username already exists
    if(res.status !== 200) {
        //setErrosList("Username already exist");
        return false;
    }
}


function Preferences() {

    const [selectedOptions, setSelectedOptions] = useState([]);

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
                        options={options}
                        value={selectedOptions}
                        onChange={handleSelectChange}
                        closeMenuOnSelect={false}
                        placeholder="Choose courses"
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="NumDays">How many days in schedule</label>
                    <select id="NumDays" name="NumDays" defaultValue="6" className="input-field">
                        <option value="-1">Select number of days...</option>
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
                    <select id="less-days-more-courses" name="less-days-more-courses" defaultValue="0"
                            className="input-field">
                        <option value="-1">Select option...</option>
                        <option value="0">More courses</option>
                        <option value="1">Less days</option>
                    </select>
                </div>
                <div className="form-group">
                    <label htmlFor="courses-to-give-up">How many courses you are willing to give up if at all</label>
                    <input type="number" id="courses-to-give-up" className="input-field"
                           placeholder="Enter amount of courses"/>
                </div>
                <div className="form-group">
                    <label htmlFor="courses-must-be-in-schedule">Courses that must be in schedule</label>
                    <input type="text" id="courses-must-be-in-schedule" className="input-field"
                           placeholder="Enter id of courses e.g: 81274, 81381, ..."/>
                </div>
                <div className="form-group">
                    <label htmlFor="non-related-anchors">Non related anchors in schedule</label>
                    <input type="text" id="non-related-anchors" className="input-field"
                           placeholder="Day, HH:MM, Duration in mintues, Task Name"/>
                </div>
                <button type="submit" className="submit-button">Save Preferences</button>
            </form>
        </div>
    );
}

export default Preferences;