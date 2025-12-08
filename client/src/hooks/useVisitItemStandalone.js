import { useEffect, useState } from "react";

export const useVisitItemStandalone = (visitItemId) => {
  const [visitItem, setVisitItem] = useState(null);

  useEffect(() => {
    if (!visitItemId) return;

    const fetchVisitItem = async () => {
      try {
        const res = await fetch(`http://localhost:8080/visit-items/${visitItemId}`);
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        const data = await res.json();
        setVisitItem(data);
      } catch (err) {
        console.error("Error fetching visit item:", err);
      }
    };

    fetchVisitItem();
  }, [visitItemId]);

  const refetchVisitItem = async () => {
    if (!visitItemId) return;
    try {
      const res = await fetch(`http://localhost:8080/visit-items/${visitItemId}`);
      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }
      const data = await res.json();
      setVisitItem(data);
    } catch (err) {
      console.error("Error fetching visit item:", err);
    }
  };

  return { visitItem, refetchVisitItem };
};
