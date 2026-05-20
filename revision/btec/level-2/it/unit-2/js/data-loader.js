// Data Loader for IT Level 2 Unit 2
(function() {
'use strict';

window.DataLoader = {
  // Load questions from data files
  async loadQuestions(aims) {
    const data = {};
    try {
      for (const aim of aims) {
        const response = await fetch(`data/aim_${aim}.json`);
        if (!response.ok) throw new Error(`Failed to load aim ${aim}`);
        data[aim] = await response.json();
      }
      return data;
    } catch (e) {
      console.error('Data loading error:', e);
      return null;
    }
  },

  // Load flashcards
  async loadFlashcards() {
    try {
      const response = await fetch('data/flashcards.json');
      if (!response.ok) throw new Error('Failed to load flashcards');
      return await response.json();
    } catch (e) {
      console.error('Flashcard loading error:', e);
      return [];
    }
  },

  // Load quiz questions
  async loadQuiz() {
    try {
      const response = await fetch('data/quiz.json');
      if (!response.ok) throw new Error('Failed to load quiz');
      return await response.json();
    } catch (e) {
      console.error('Quiz loading error:', e);
      return [];
    }
  },

  // Load multiple choice questions
  async loadMultipleChoice() {
    try {
      const response = await fetch('data/mc.json');
      if (!response.ok) throw new Error('Failed to load MC');
      return await response.json();
    } catch (e) {
      console.error('MC loading error:', e);
      return [];
    }
  },

  // Filter questions by criteria
  filterQuestions(questions, criteria) {
    let filtered = questions;

    if (criteria.aim) {
      filtered = filtered.filter(q => q.learning_aim === criteria.aim);
    }

    if (criteria.type) {
      filtered = filtered.filter(q => q.type === criteria.type);
    }

    if (criteria.marks) {
      filtered = filtered.filter(q => q.marks === criteria.marks);
    }

    if (criteria.topic) {
      filtered = filtered.filter(q => q.topic.includes(criteria.topic));
    }

    return filtered;
  },

  // Get random questions
  getRandomQuestions(questions, count) {
    const shuffled = [...questions].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, Math.min(count, questions.length));
  },

  // Calculate statistics
  getStatistics(questions) {
    const stats = {
      total: questions.length,
      byAim: {},
      byType: {},
      byMarks: {},
      totalMarks: 0
    };

    questions.forEach(q => {
      stats.byAim[q.learning_aim] = (stats.byAim[q.learning_aim] || 0) + 1;
      stats.byType[q.type] = (stats.byType[q.type] || 0) + 1;
      stats.byMarks[q.marks] = (stats.byMarks[q.marks] || 0) + 1;
      stats.totalMarks += q.marks;
    });

    return stats;
  }
};

})();
