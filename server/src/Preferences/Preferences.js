import './Preferences.css'



function Preferences() {
    return (
        <div className="preferences-container">
            <h1 className="headline">Preferences</h1>
            <form className="preferences-form">
                <div className="form-group">
                    <label htmlFor="days-in-schedule">How many days in schedule</label>
                    <input type="number" id="days-in-schedule" className="input-field" placeholder="Enter amount of days" />
                </div>
                <div className="form-group">
                    <label htmlFor="courses-to-give-up">How many courses you are willing to give up if at all</label>
                    <input type="number" id="courses-to-give-up" className="input-field" placeholder="Enter amount of courses" />
                </div>
                <div className="form-group">
                    <label htmlFor="less-days-more-courses">Less days or more courses</label>
                    <input type="text" id="less-days-more-courses" className="input-field" placeholder="Days/Courses" />
                </div>
                <div className="form-group">
                    <label htmlFor="courses-must-be-in-schedule">Courses that must be in schedule</label>
                    <input type="text" id="courses-must-be-in-schedule" className="input-field" placeholder="Enter id of courses e.g: 81274, 81381, ..." />
                </div>
                <div className="form-group">
                    <label htmlFor="non-related-anchors">Non related anchors in schedule</label>
                    <input type="text" id="non-related-anchors" className="input-field" placeholder="Day, HH:MM, Duration in mintues, Task Name" />
                </div>
                <button type="submit" className="submit-button">Save Preferences</button>
            </form>
        </div>
    );
}

export default Preferences;