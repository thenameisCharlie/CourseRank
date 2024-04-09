import { useState, useEffect } from "react";
import { supabase } from "../client";

const MajorList = ({ onMajorChange }) => {
  const [major, setMajor] = useState([]);

  useEffect(() => {
    const fetchMajor = async () => {
      const { data, error } = await supabase.from("school majors ").select("*");
      if (error) console.log("error", error);
      else setMajor(data);
    };
    fetchMajor();
  }, []);

  return (
    <div>
      <label htmlFor="major-select">Choose a Major:</label>
      <select id="major-select" onChange={(e) => onMajorChange(e.target.value)}>
        <option value="">Select a Major</option>
        {major.map((majorItem) => (
          <option key={majorItem.id} value={majorItem.id}>
            {majorItem.name}
          </option>
        ))}
      </select>
    </div>
  );
};
export default MajorList;
