// src/components/Page.jsx
import { useEffect } from "react";

export default function Page({ title, children }) {
  useEffect(() => {
    if (title) document.title = `${title} | YourSiteName`;
  }, [title]);

  return children;
}
   