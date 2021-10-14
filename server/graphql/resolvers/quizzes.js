const Quiz = require('../../models/Quiz');

module.exports = {
  Query: {
    async getQuizzes() {
      try {
        const quizzes = await Quiz.find();
        return quizzes;
      } catch (err) {
        throw new Error(err);
      }
    },
    async getQuiz(_, { quizId }) {
      try {
        const quiz = await Quiz.findById(quizId);
        if (quiz) {
          return quiz;
        } else {
          throw new Error('Quiz not found');
        }
      } catch (err) {
        throw new Error(err);
      }
    },
  },
  Mutation: {
    async createQuiz(_, { quizInput: { title, questions } }) {
      if (title.trim() === '') {
        throw new Error('Quiz title cannot be blank');
      }

      const valid = questions.forEach((question) => {
        if (question.question.trim() === '') {
          throw new Error('A question cannot be blank');
        }
        let answerMatch = false;
        if (question.answer.trim() === '') {
          throw new Error('An answer cannot be blank');
        }
        if (question.answerChoices.length <= 1) {
          throw new Error('A question must have at least two choices');
        }
        question.answerChoices.forEach((choice) => {
          if (choice.trim() === '') {
            throw new Error('An answer choice cannot be blank');
          }
          if (choice.trim() === question.answer.trim()) {
            answerMatch = true;
          }
        });
        if (!answerMatch) {
          throw new Error(
            'A question must have an answer choice that matches the answer'
          );
        }
      });

      const newQuiz = new Quiz({
        title,
        questions,
      });

      const quiz = await newQuiz.save();

      return quiz;
    },
  },
};
