import { useState, useEffect } from "react";

export function useScrollSpy(ids, offset = 0) {
  const [activeId, setActiveId] = useState("");

  useEffect(() => {
    const handleScroll = () => {
      let current = "";
      ids.forEach(id => {
        const elem = document.getElementById(id);
        if (elem) {
          const top = elem.getBoundingClientRect().top;
          if (top <= offset + 10) current = id;
        }
      });
      setActiveId(current);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll(); // initialise à la première section
    return () => window.removeEventListener("scroll", handleScroll);
  }, [ids, offset]);

  return activeId;
}
