import { useContext } from "react";
import { UserContext } from "../../contexts/UserContext";  
import { useVisitItems } from "../../api/visitItemApi";
import VisitItemCatalogItem from "./visititem-catalog-item/VisitItemCatalogItem";

export default function VisitItemCatalog() {
    const { visitItems } = useVisitItems(); 
    const { email } = useContext(UserContext);  

    const visitItemsArray = Array.isArray(visitItems) ? visitItems : [];

    const userItems = visitItemsArray.filter(
        visitItem =>
            Array.isArray(visitItem.members) &&
            visitItem.members.some(member => member.email === email)
    );

    return (
        <section id="catalog-page">
            <h1>Visit points you are a part of</h1>

            {userItems.length > 0
                ? userItems.map(visitItem => (
                    <VisitItemCatalogItem key={visitItem.id} {...visitItem} />
                ))
                : <h3 className="no-articles">You are not a member of any points for visit yet.</h3>
            }
        </section>
    );
}
