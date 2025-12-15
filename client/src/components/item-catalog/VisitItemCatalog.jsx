import { useContext } from "react";
import { UserContext } from "../../contexts/UserContext";  
import { useVisitItems } from "../../api/visitItemApi";
import VisitItemCatalogItem from "./visititem-catalog-item/VisitItemCatalogItem";

export default function VisitItemCatalog() {
    const { visitItems } = useVisitItems(); 
    const { id } = useContext(UserContext);  

    const visitItemsArray = Array.isArray(visitItems) ? visitItems : [];

    const userItems = visitItemsArray.filter(
        (visitItem) => visitItem.ownerId === id
    );

    return (
        <section id="catalog-page">
            <h1>Visit points you have created</h1>

            {userItems.length > 0
                ? userItems.map(visitItem => (
                    <VisitItemCatalogItem key={visitItem.id} {...visitItem} />
                ))
                : <h3 className="no-articles">You are not a member of any points for visit yet.</h3>
            }
        </section>
    );
}
