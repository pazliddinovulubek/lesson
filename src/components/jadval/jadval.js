import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './style.css';

const teachers = ["Ulug'bek", "Akmal", "Shoxrux", "Dilshod"];

function Jadval() {
  const [selectedTeacher, setSelectedTeacher] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (selectedTeacher) {
      navigate(`/lesson/${selectedTeacher}`);
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <select value={selectedTeacher} onChange={(e) => setSelectedTeacher(e.target.value)}>
          <option value="" disabled>Teacherni Tanlang</option>
          {teachers.map((teacher, index) => (
            <option key={index} value={teacher}>{teacher}</option>
          ))}
        </select>
        <button type="submit">Lesson Uchun Bo'sing</button>
      </form>
    </div>
  );
}

export default Jadval;
