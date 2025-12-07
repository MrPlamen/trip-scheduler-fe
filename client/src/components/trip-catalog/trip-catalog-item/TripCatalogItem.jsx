import { Link } from 'react-router';
import { shortFormatDate } from "../../../utils/dateUtil";

export default function TripCatalogItem({
    _id,
    title,
    category,
    imageUrl,
    startDate,
    endDate,
    duration,
    summary
}) {
    return (
        <div className="allTrips">
            <div className="allTrips-info">
                <img src={imageUrl} />
                <h2>{title}</h2>
                <h6>{category}</h6>
                <h6>
                    {shortFormatDate(startDate)} - {shortFormatDate(endDate)}
                    {` (${duration} days)`}
                </h6>
                <Link to={`/trips/${_id}/details`} className="details-button">Details</Link>
            </div>
        </div>
    );
}
