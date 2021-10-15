import Head from 'next/head'
import Image from 'next/image'
import React, { useState } from "react";
import doctors from './api/doctors.json';
import PrintSearchResults from '../components/printsearchresults'

export default function Home() {
    
    /* 
     * State variables for holding the search results and the zip code.
     * Using a state variable for the returned results allows us to .sort() and .filter(),
     * which then allows React to re-render the page on-the-fly.
     */
    let [searchResults, setSearchResults] = useState('');
    let [searchZipCode, setSearchZipCode] = useState('');
    let [rangeFromMiles, setRangeFromMiles] = useState('All');
    
    /*
     * Variables used for the filtering of our data with .filter() ...
     */
    let genderSpecificFilter = 'All';
    let rangeSpecificFilter = 'All'
    const checkBoxDistanceMap = {
        1: 5,
        2: 10,
        3: 15,
        4: 20,
        5: 25,
        6: 'All'
    }
    /* 
     * Plot twist, sometimes the props.image proprty is null.  This is the default
     * Avatar picture to use in those instances.
     */
    const defaultAvatar = '../images/avatar.png';

    /*
     * Curveball... in the results[].locations[] property, sometimes the locations are not
     * ordered ASC.  This will re-order the results[].locations[] to be in ASC order.
     * Then later we can use the results[].locations[].distance[0] property for gauging
     * distance to the closest location.
     */
    /*
     * This is why you read the requirements first...
     * The requirements document does say that the first location in the list is the
     * 'primary' location, therefore I do not believe locations should be put in order
     * based on ASC distance.  I will remove this code for now, but just know that if we
     * wanted to first order the doctors locations ASC by location, this bit of logic would
     * have done it.
     */
    /*
    const sortDoctorsDistance = () => {
        {Object.keys(doctors.results).map((key) => (
            doctors.results[key].locations.sort((a, b) => a.distance - b.distance)
        ))};
    }
    sortDoctorsDistance();
    */

    /*
     * Logic for filtering the doctors based on both Gender and / or Range
     * This is passed into a .filter() in multiple functions below
     */
    function filterDoctors(theGender, range) {
        if (theGender === 'All') {
            if (range === 'All') {
                return c => c.gender >= '';
            } else {
                return c => c.gender >= '' && Math.round(c.locations[0].distance) <= range;
            }
        } else {
            if (range === 'All') {
                return c => c.gender === theGender;
            } else {
                return c => c.gender === theGender && Math.round(c.locations[0].distance) <= range;
            }
        }
    }

    /* Validates a string checking for a valid US Zip Code
     * return true if valid zip
     * return false if invalid zip
     */
    const validateUSZipCode = (zipcode) => {
        return /^\d{5}(-\d{4})?$/.test(zipcode);
    }

    /*
     * Search <button> click handler that will validate the zip code, once validated it will store
     * this in a state variable for re-use later.  Next it will execute the search by storing the JSON
     * results into a state variable.  Updating the state variable forces React to re-render the page
     * auto-magically...  but you already knew that....
     */
    function searchButtonHandleClick(event) {
        event.preventDefault();
        let zipCode = document.getElementById("search-zip-code").value;
        let errorMsgElement = document.getElementById('error-msg-zip-code');
        setSearchZipCode('');
        if (validateUSZipCode(zipCode)) {
            setSearchZipCode(zipCode);
            setSearchResults(doctors.results);
        } else {
            errorMsgElement.classList.add("text-red-500");
            return false;
        }
    }

    /*
     * This is not in the requirements document, just for funsies... Handles the onKeyUp event for the search box.
     * When the [Enter] key is pressed, it will execute the search.
     */
    function handleSearchOnKeyUp(event) {
        if (event.key === "Enter") {
            searchButtonHandleClick(event);
        }
      }

    /*
     * This little tid bit just gets the currently selected Gender value from the radio group and updates the
     * 'genderSpecificFilter' variable.
     */
    function getGenderSpecificFilter() {
        if (document.querySelector('input[name="gender-check-box"]:checked')) {
            genderSpecificFilter = document.querySelector('input[name="gender-check-box"]:checked').value;
        } else {
            genderSpecificFilter = 'All';
        }
    }

    /*
     * Make sure there are current search results on the page and then call the updateSearchResults() function
     */
    function changeGenderFilterParams() {
        if (searchResults) {
            updateSearchResults();
        }
    }

    /*
     * This converts the range slider 1,2,3,4,5,6, using the 'checkBoxDistanceMap' object above into
     * 5,10,15,20,25,All and updates the 'rangeSpecificFilter' variable.
     */
    function getRangeFilterParams() {
        rangeSpecificFilter = checkBoxDistanceMap[document.getElementById('range-miles').value]
        setRangeFromMiles(rangeSpecificFilter);
    }
    
    /*
     * Make sure there are current search results on the page and then call the updateSearchResults() function
     * Used as the onChange event for the range slider
     */
    function changeRangeFilterParams() {
        if (searchResults) {
            updateSearchResults();
        }
    }

    /*
     * Function used for updating the search results with the filter applied.  First we gather the Gender
     * and Range parameters utilizing the functions above, which set the appropriate parameters.  Then we
     * update the search results state variable.
     */
    function updateSearchResults() {
        getGenderSpecificFilter();
        getRangeFilterParams();
        setSearchResults(doctors.results.filter(filterDoctors(genderSpecificFilter, rangeSpecificFilter)))
    }

    /*
     * Simple function to show and hide the search options on small screens.
     */
    function toggleSearchOptions(event) {
        if (event) {
            event.preventDefault();
        }
        let elm = document.getElementById('search-options');
        if (elm.classList.contains('hidden')) {
            elm.classList.remove('hidden');
        } else {
            elm.classList.add('hidden');
        }
        return false;
    }

    /*
     * Home() return() statement...
     */
    return (
        <div>

            <Head>
                <title>Doctors Next.js App</title>
                <link rel="icon" href="/favicon.ico" />
                <link rel="preconnect" href="https://fonts.googleapis.com" />
                <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
                <link href="https://fonts.googleapis.com/css2?family=Cabin&display=swap" rel="stylesheet" />
            </Head>

            <header className="bg-top bg-no-repeat bg-contain text-center shadow pt-2 h-24">
                <Image src="/images/logo.svg" alt="Deterson Health Centers" width="109" height="90" />
            </header>

            <main className="mt-6 mx-5 sm:mx-5 md:mx-10 lg:mx-20">
                <div id="hero-image" className="bg-cover bg-center h-52 sm:h-52 md:h-64 lg:h-96 w-full">&nbsp;</div>
                <div id="search-box" className="mt-7 bg-gray-150 p-6">
                    <p className="text-gray-450 text-lg text-center sm:text-center md:text-left lg:text-left">Zip Code</p>
                    <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-2 justify-items-center sm:justify-items-center md:justify-items-end lg:justify-items-end">
                        <input type="text" name="search-zip-code" id="search-zip-code" maxLength="5" onKeyPress={(event) => {if (!/[0-9]/.test(event.key)) {event.preventDefault();}}} onKeyUp={handleSearchOnKeyUp} className="float-left h-10 block w-full border border-gray-400 rounded-md px-2"></input>
                        <button onClick={searchButtonHandleClick} name="search-button" id="search-button" className="w-44 h-11 text-base bg-emerald-450 text-white rounded-md mt-5 sm:mt-5 md:mt-0 lg:mt-0">Search</button>
                    </div>
                </div>
                <div className="flex flex-col sm:flex-col md:flex-row lg:flex-row mt-6">
                    <div className="flex-none w-32 sm:w-32 md:w-48 lg:w-48 mx-auto sm:mx-auto md:mx-0 lg:mx-0 pl-0 sm:pl-0 md:pl-5 lg:pl-5">
                        <a href="#" id="search-options-link" className="block sm:block md:hidden lg:hidden text-center w-28 mx-auto bg-white py-2 px-3 border border-gray-300 rounded-md shadow-sm text-xs leading-4 font-medium text-gray-700 hover:bg-gray-50" onClick={() => toggleSearchOptions(event)}>Search Options</a>
                        <div id="search-options" className="hidden sm:hidden md:block lg:block">
                            <p className="text-lg text-blue-450 font-bold">Distance</p>
                            <input onChange={changeRangeFilterParams} type="range" min="1" max="6" className="slider" defaultValue="6" id="range-miles" />
                            <ul className="text-gray-350 text-xs mt-2.5">
                                <li className="text-left float-left w-1/6">5</li>
                                <li className="float-left w-1/6">10</li>
                                <li className="text-center float-left w-1/6">15</li>
                                <li className="text-center pl-1 float-left w-1/6">20</li>
                                <li className="text-center pl-2 float-left w-1/6">25</li>
                                <li className="text-right float-left w-1/6">All</li>
                            </ul>
                            <div className="clear-both"></div>
                            <p className="text-xs mt-2.5">CURRENT: <span id="slider-miles-from-text">{rangeFromMiles}</span> MILES {searchZipCode ? <span id="slider-zip-text">FROM <br /> {searchZipCode}</span> : ''}</p>
                            <div className="bg-gray-25 w-full h-0.5 mt-7">&nbsp;</div>
                            <p className="text-lg text-blue-450 font-bold mt-6">Gender</p>
                            <div className="check" id="gender-check-boxes">
                                <input type="radio" onChange={changeGenderFilterParams} className="gender-checkbox" id="gender-check-box-male" name="gender-check-box" value="Male" />
                                <label className="text-base text-blue-150" htmlFor="gender-check-box-male"> Male</label><br />
                                <input type="radio" onChange={changeGenderFilterParams} className="gender-checkbox mt-2" id="gender-check-box-female" name="gender-check-box" value="Female" />
                                <label className="text-base text-blue-150 mt-2" htmlFor="gender-check-box-female"> Female</label><br />
                                <input type="radio" onChange={changeGenderFilterParams} className="gender-checkbox mt-2" id="gender-check-box-all" name="gender-check-box" value="All" />
                                <label className="text-base text-blue-150 mt-2" htmlFor="gender-check-box-all"> No preference</label><br />
                            </div>
                        </div>
                    </div>
                    <div className="flex-grow ml-0 sm:ml-0 md:ml-10 lg:ml-20">
                        {searchResults ? (
                            <PrintSearchResults
                                doctors={searchResults} 
                                zipcode={searchZipCode}
                                defaultavatar={defaultAvatar}
                            />
                        ) : (
                            <div id="error-msg-zip-code" className="text-center sm:text-center md:text-left lg:text-left">Please input a valid Zip Code in the above search box to show results.</div>
                        )}
                    </div>
                </div>
            </main>

            <footer>
                <div className="text-base text-center mt-10">Copyright &copy; 2021 Matthew Gisonno</div>
            </footer>
            
        </div>
    )
}