import React, { useState } from 'react'
import CourseForm from 'src/components/DashBoard/CourseForm'
import CurriculumBuilder from 'src/components/DashBoard/CurriculumBuilder'

export default function CourseCreatePage() {
  const [course, setCourse] = useState<any>(null)
  const [topics, setTopics] = useState<any[]>([])

  // Demo các hàm xử lý, sau này sẽ gọi API thật
  const handleAddTopic = (topic: any) => {
    setTopics((prev) => [...prev, { ...topic, _id: Date.now().toString(), lessons: [] }])
  }
  const handleAddLesson = (topic: any, lesson: any) => {
    setTopics((prev) =>
      prev.map((t) =>
        t._id === topic._id ? { ...t, lessons: [...t.lessons, { ...lesson, _id: Date.now().toString() }] } : t
      )
    )
  }
  const handleEditTopic = (topic: any) => {
    /* TODO */
  }
  const handleEditLesson = (lesson: any, topic: any) => {
    /* TODO */
  }
  const handleDeleteTopic = (topic: any) => {
    setTopics((prev) => prev.filter((t) => t._id !== topic._id))
  }
  const handleDeleteLesson = (lesson: any, topic: any) => {
    setTopics((prev) =>
      prev.map((t) => (t._id === topic._id ? { ...t, lessons: t.lessons.filter((l: any) => l._id !== lesson._id) } : t))
    )
  }

  return (
    <div>
      {!course ? (
        <CourseForm
          onSuccess={(course) => {
            setCourse(course)
            setTopics([])
          }}
          mode='add'
        />
      ) : (
        <CurriculumBuilder
          course={course}
          topics={topics}
          onAddTopic={handleAddTopic}
          onAddLesson={handleAddLesson}
          onEditTopic={handleEditTopic}
          onEditLesson={handleEditLesson}
          onDeleteTopic={handleDeleteTopic}
          onDeleteLesson={handleDeleteLesson}
        />
      )}
    </div>
  )
}
