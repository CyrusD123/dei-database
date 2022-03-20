import { useState } from "react";
import axios from "axios";
import './FindSchoolForm.css'

function FindSchoolForm() {
    // useState takes an initial value for the state as a parameter
    // it returns an array, with the first item in it being the current value of the state, and the second item being a setter to update that value
    const [LState, setLState] = useState('');
    const [NMCnty, setNMCnty] = useState([]);
    const [selectedNMCnty, setSelectedNMCnty] = useState('');
    const [SCHName, setSCHName] = useState([]);
    const [selectedSCHName, setSelectedSCHName] = useState('');

    var counties = [];
    var schools = [];
    var featureSetState = [];
    var featureSetCounty = [];
    var encodedUrlComponent = '';
    var url = '';

    // Arrow function (a different way to write functions)
    const handleSubmit = (evt) => {
        evt.preventDefault();
        console.log('submitted');
        console.log(LState);
        console.log(selectedNMCnty);
        console.log(selectedSCHName);
    }

    // useEffect re-renders the page by completing the enclosed function when LState changes
    const handleLStateChange = (evt) => {
        // Set county and school to blank when a new state is selected
        setLState(evt.target.value)
        setSelectedNMCnty('');
        setSelectedSCHName('');
        // Even though we updated LState with setLState, we can't access the new value becuase of a stale closure. We could use useEffect to get around this, but we don't have to. Just use evt.target.value instead
        // https://stackoverflow.com/questions/54069253/usestate-set-method-not-reflecting-change-immediately
        console.log(evt.target.value);
        url = `https://nces.ed.gov/opengis/rest/services/K12_School_Locations/EDGE_ADMINDATA_PUBLICSCH_1819/MapServer/0/query?where=LSTATE%20%3D%20%27${evt.target.value}%27&outFields=NMCNTY&outSR=4326&f=json`
        console.log(url);
        axios.get(url)
            .then(function (response) {
                featureSetState = response.data.features;

                // Code doesn't execute when reponse is empty (like when the page loads)
                if (featureSetState.length != 0) {
                    
                    counties.push(featureSetState[0].attributes.NMCNTY);
                    // This starts at for i=1
                    for (let i = 1; i < featureSetState.length; i++) {
                        // Response isn't in alphabetical order, so we're limiting which counties need to be pushed
                        if (counties[counties.length - 1] != featureSetState[i].attributes.NMCNTY) {
                            counties.push(featureSetState[i].attributes.NMCNTY);
                        }
                    }

                    // Javascript Sets require unique values
                    counties = [...new Set(counties)];
                    console.log(counties);
                    setNMCnty(counties);
                }
            })
            .catch(function (error) {
                // handle error for the response itself and the response function
                console.log(error);
            });
    }

    const handleNMCntyChange = (evt) => {
        setSelectedNMCnty(evt.target.value);
        setSelectedSCHName('');
        console.log(evt.target.value);
        // Because counties have spaces in them
        encodedUrlComponent = encodeURIComponent(evt.target.value);
        url = `https://nces.ed.gov/opengis/rest/services/K12_School_Locations/EDGE_ADMINDATA_PUBLICSCH_1819/MapServer/0/query?where=NMCNTY%20%3D%20%27${encodedUrlComponent}%27&outFields=SCH_NAME&outSR=4326&f=json`
        console.log(url);
        axios.get(url)
            .then(function (response) {
                featureSetCounty = response.data.features;

                if (featureSetCounty.length != 0) {
                    for (let i=0; i < featureSetCounty.length; i++){
                        schools.push(featureSetCounty[i].attributes.SCH_NAME);
                    }
                    setSCHName(schools);
                }
            })
            .catch(function (error) {
                // handle error for the response itself and the response function
                console.log(error);
            });
    }

    return (
        // Will need to call two functions on change of LState dropdown: setLState and another to change values for the next dropdown
        <form onSubmit={handleSubmit} className="Form">
            <label>
                State {LState}
                <select value={LState} onChange={handleLStateChange} required>
                    <option disabled value=''> -- select an option -- </option>
                    <option value="AL">Alabama</option>
                    <option value="AK">Alaska</option>
                    <option value="AZ">Arizona</option>
                    <option value="AR">Arkansas</option>
                    <option value="CA">California</option>
                    <option value="CO">Colorado</option>
                    <option value="CT">Connecticut</option>
                    <option value="DE">Delaware</option>
                    <option value="DC">District Of Columbia</option>
                    <option value="FL">Florida</option>
                    <option value="GA">Georgia</option>
                    <option value="HI">Hawaii</option>
                    <option value="ID">Idaho</option>
                    <option value="IL">Illinois</option>
                    <option value="IN">Indiana</option>
                    <option value="IA">Iowa</option>
                    <option value="KS">Kansas</option>
                    <option value="KY">Kentucky</option>
                    <option value="LA">Louisiana</option>
                    <option value="ME">Maine</option>
                    <option value="MD">Maryland</option>
                    <option value="MA">Massachusetts</option>
                    <option value="MI">Michigan</option>
                    <option value="MN">Minnesota</option>
                    <option value="MS">Mississippi</option>
                    <option value="MO">Missouri</option>
                    <option value="MT">Montana</option>
                    <option value="NE">Nebraska</option>
                    <option value="NV">Nevada</option>
                    <option value="NH">New Hampshire</option>
                    <option value="NJ">New Jersey</option>
                    <option value="NM">New Mexico</option>
                    <option value="NY">New York</option>
                    <option value="NC">North Carolina</option>
                    <option value="ND">North Dakota</option>
                    <option value="OH">Ohio</option>
                    <option value="OK">Oklahoma</option>
                    <option value="OR">Oregon</option>
                    <option value="PA">Pennsylvania</option>
                    <option value="RI">Rhode Island</option>
                    <option value="SC">South Carolina</option>
                    <option value="SD">South Dakota</option>
                    <option value="TN">Tennessee</option>
                    <option value="TX">Texas</option>
                    <option value="UT">Utah</option>
                    <option value="VT">Vermont</option>
                    <option value="VA">Virginia</option>
                    <option value="WA">Washington</option>
                    <option value="WV">West Virginia</option>
                    <option value="WI">Wisconsin</option>
                    <option value="WY">Wyoming</option>
                </select>
            </label>
            <label>
                County {selectedNMCnty}
                <select value={selectedNMCnty} onChange={handleNMCntyChange} required>
                    <option disabled value=''> -- select an option -- </option>
                    {NMCnty.map((county, key) => (
                        <option key={key} value={county}>
                            {county}
                        </option>
                    ))}
                </select>
            </label>
            <label>
                School {selectedSCHName}
                <select value={selectedSCHName} onChange={evt => setSelectedSCHName(evt.target.value)} required>
                    <option disabled value=''> -- select an option -- </option>
                    {SCHName.map((school, key) => (
                        <option key={key} value={school}>
                            {school}
                        </option>
                    ))}
                </select>
            </label>
            <input type="submit" value="Submit" />
        </form>
    );
}

export default FindSchoolForm;