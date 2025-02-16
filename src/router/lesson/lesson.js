import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import './lesson.css';

const lessonTopics = [
  "Dasturlashga kirish, Yo'nalishlar, VS codeni o'rnatish, Birinchi 'Hello world' dasturi",
  "Font, p, h1-h6, stamina",
  "ul, ol, li",
  "img. Audio, video, a teglari",
  "table, tr, td, th, colspan, rowspan",
  "form, legend, fieldset, input, select",
  "takrorlash",
  "CSS style tagi. Font-size, color, bg-color",
  "tag, class, id",
  "amaliyot: login form yaratish",
  "amaliyot: card va navbar yaratish",
  "amaliyot: saytni html orqali yaratish",
  "imtihon 20 test",
  "margin va padding",
  "max-width - min-width olchovlar",
  "Transition, hover, background-image",
  "amaliyot: Barber shop yaratish",
  "Transform, overflow",
  "Gradient, opacity, RGB, Transition",
  "amaliyot: flex-wrap va Apple.com sayti",
  "Position, box-sizing",
  "Font: Google font, inline vs enternal vs external",
  "Amaliy ish: Figma da sayt tayyorlash",
  "Flex box, box-sizing",
  "Filter, display property",
  "Pseudo Class: nth-child, first-child, last-child",
  "Pseudo Element: before - after, root",
  "Multiple pages website SVG",
  "Learning Figma",
  "Animation: Animatsiya va Keyframe xossalari",
  "amaliyot: Animatsiya bilan ishlash",
  "Git - Github",
  "Git - Github va Netlify",
  "Grid: Display Grid",
  "Media: Media query",
  "amaliyot: Media website yaratish",
  "Bootstrap: card, button, navbar, carousel",
  "Tailwind: shopping card, navbar, carousel",
  "SASS va SCSS",
  "Imtihon: UI dizayn yaratish"
];

const teacherSchedules = {
  "Ulug'bek": {
    schedule: ["Dushanba: 2-4", "Chorshanba: 2-4", "Juma: 2-4"],
    lessons: 120,
    topics: Array.from({ length: 120 }, (_, i) => ({
      id: i + 1,
      title: `Dars ${i + 1}`,
      description: lessonTopics[i % lessonTopics.length] || `Mavzu tafsifi ${i + 1}`,
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
    return savedTopics ? JSON.parse(savedTopics) : teacher ? [...teacher.topics] : [];
  });
  const [newTopic, setNewTopic] = useState("");
  const [selectedDate, setSelectedDate] = useState("");

  useEffect(() => {
    if (teacherName) {
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
      setTopics(prevTopics => prevTopics.map(topic =>
        topic.date === selectedDate ? { ...topic, description: newTopic } : topic
      ));
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