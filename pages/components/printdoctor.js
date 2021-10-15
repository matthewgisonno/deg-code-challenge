/*
 * PrintDoctor is used for printing a single row of the search results.  
 * Called from PrintSearchResults component
 */
function PrintDoctor(props) {
    return (
        <div className="doctor-listing">
            <div className="flex mt-10">
                <div className="flex-none w-24 mr-5">
                    <img src={props.image ? props.image : props.defaultavatar} alt="Dr Avatar Picture" className="w-full" />
                </div>
                <div className="flex-grow">
                    <h3 className="text-blue-150 text-lg"><a href={props.url}>{props.fullName}</a></h3>
                    {props.specialties.map((prop, key) => (
                        <h4 className="text-lg" key={key}>
                            <div>{prop}</div>
                        </h4>
                    ))}
                </div>
                <div className="flex-none w-40 sm:w-40 md:w-56 lg:w-56">
                    <div className="flex flex-col space-y-4">
                        {props.locations.map((prop, key) => (
                            <div className="doctor-locations-block" key={key}>
                                <a href={prop.url} className="text-base text-blue-150">{prop.name}</a>
                                <p className="text-xs">{Math.round(prop.distance)} {Math.round(prop.distance) > 1 ? 'MILES' : 'MILE'}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
            <div className="bg-gray-25 w-full h-0.5 mt-7">&nbsp;</div>
        </div>
    );
}
export default PrintDoctor