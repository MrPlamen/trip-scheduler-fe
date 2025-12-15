import { Link } from 'react-router'

export default function VisitItemCatalogItem({
    id,
    title,
    category,
    imageUrl,
    description
}) {
    return (
        <div className="allTrips">
            <div className="allTrips-info">
                <img src={imageUrl} />
                <h2>{title}</h2>
                <h6>{category}</h6>
                <p>{description}</p>
                <Link to={`/visits/${id}/details`} className="details-button">Details</Link>
            </div>
        </div>
    );
}
