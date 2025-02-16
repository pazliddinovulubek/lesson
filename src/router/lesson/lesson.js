import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import './lesson.css';

const teacherSchedules = {
  "Ulug'bek": {
    schedule: ["Dushanba: 2-4", "Chorshanba: 2-4", "Juma: 2-4"],
    lessons: 120,
    topics: Array.from({ length: 120 }, (_, i) => ({
      id: i + 1,
      title: `Dars ${i + 1}`,
      description: `Mavzu tafsifi ${i + 1}`,
      date: new Date(2025, 1, 17 + i * 2).toLocaleDateString('uz-UZ'),
      day: ["Dushanba", "Chorshanba", "Juma"][(i % 3)]
    }))
  }
};

function LessonPage() {
  const { teacherName } = useParams();
  const teacher = teacherSchedules[teacherName];

  const [completedLessons, setCompletedLessons] = useState(() => {
    const savedCompleted = localStorage.getItem(`${teacherName}-completedLessons`);
    return savedCompleted ? JSON.parse(savedCompleted) : [];
  });

  const [topics, setTopics] = useState(() => {
    const savedTopics = localStorage.getItem(`${teacherName}-topics`);
    return savedTopics ? JSON.parse(savedTopics) : (teacher ? [...teacher.topics] : []);
  });

  const [newTopic, setNewTopic] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  useEffect(() => {
    if (teacherName && topics.length > 0) {
      localStorage.setItem(`${teacherName}-topics`, JSON.stringify(topics));
    }
  }, [topics, teacherName]);

  useEffect(() => {
    if (teacherName) {
      localStorage.setItem(`${teacherName}-completedLessons`, JSON.stringify(completedLessons));
    }
  }, [completedLessons, teacherName]);

  if (!teacher) return <div className="error-message">O‘qituvchi topilmadi</div>;

  const today = new Date().toLocaleDateString('uz-UZ', { weekday: 'long' });
  const todayTopics = topics.filter(topic => topic.day === today);

  const toggleCompletion = (id) => {
    setCompletedLessons((prev) =>
      prev.includes(id) ? prev.filter(lessonId => lessonId !== id) : [...prev, id]
    );
  };

  const updateTopic = () => {
    if (newTopic && selectedDate) {
      const updatedTopics = topics.map(topic =>
        topic.date === selectedDate ? { ...topic, description: newTopic } : topic
      );
      setTopics(updatedTopics);
      localStorage.setItem(`${teacherName}-topics`, JSON.stringify(updatedTopics));
      setNewTopic("");
      setSelectedDate("");
    }
  };

  return (
    <div className="lesson-container">
      <h3 className="section-title">Yangi Mavzu Kiritish:</h3>
      <div className="input-container">
        <input
          type="text"
          placeholder="Mavzu tafsifi"
          value={newTopic}
          onChange={(e) => setNewTopic(e.target.value)}
          className="input-field"
        />
        <input
          type="date"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
          className="input-field"
        />
        <button className="update-btn" onClick={updateTopic}>Mavzuni Yangilash</button>
      </div>
      
      <h2 className="lesson-title">{teacherName} dars jadvali (9 oy)</h2>
      <ul className="schedule-list">
        {teacher.schedule.map((item, index) => (
          <li key={index}>{item}</li>
        ))}
      </ul>

      <h3 className="section-title">Bugungi Mavzular:</h3>
      {todayTopics.length > 0 ? (
        <ul className="topic-list">
          {todayTopics.map((topic) => (
            <li key={topic.id} className="topic-item">
              <strong>{topic.title} ({topic.date}):</strong> {topic.description}
            </li>
          ))}
        </ul>
      ) : (
        <p className="no-lesson">Bugun dars yo'q.</p>
      )}

      <h3 className="section-title">9 Oylik Dars Jadvali:</h3>
      <ul className="topic-list">
        {topics.map((topic) => (
          <li key={topic.id} className="topic-item">
            <strong>{topic.title} ({topic.date}):</strong> {topic.description}
            <button className="complete-btn" onClick={() => toggleCompletion(topic.id)}>
              {completedLessons.includes(topic.id) ? "✅ O‘tildi" : "O‘tgani belgilash"}
            </button>
            {completedLessons.includes(topic.id) && <hr />}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default LessonPage;
