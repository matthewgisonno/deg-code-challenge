import PrintDoctor from "./printdoctor";

/*
 * Prints the search results using the props passed to it.  Uses .map() and then calls PrintDoctor to
 * output the individual doctor results.
 */
function PrintSearchResults(props) {
    return (
        <div>
            {props.filters}
            <p className="text-xl text-gray-350 text-center sm:text-center md:text-left lg:text-left mt-5 sm:mt-5 md:mt-0 lg:mt-0">
                Total Results for {props.zipcode}: 
                <span className="ml-3" id="total-results-num">
                    {props.doctors
                    .sort((a, b) => a.locations[0].distance - b.locations[0].distance)
                    .length}
                </span>
            </p>
            {props.doctors
            .sort((a, b) => a.locations[0].distance - b.locations[0].distance)
            .map((doctor, key) => (
                <PrintDoctor 
                    image={doctor.image} 
                    url={doctor.url}
                    fullName={doctor.fullName} 
                    specialties={doctor.specialties} 
                    locations={doctor.locations}
                    gender={doctor.gender}
                    defaultavatar={props.defaultavatar}
                    key={key}
                />
            ))}
        </div>
    );
}
export default PrintSearchResults