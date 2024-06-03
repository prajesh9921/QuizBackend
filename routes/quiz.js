const express = require('express');
const router = express.Router();
const QuizController = require('../controller/quizController');
const Verify = require('../middleware/verifyToken');

router.post('/addquiz', Verify, QuizController.AddQuiz);

router.get('/quizbyid/:quizId', QuizController.GetQuizById);

router.get('/getUserQuiz/:userId', QuizController.GetAllQuizCreatedByUser);

router.get('/gethomepagedata/:userId', QuizController.GetHomePageData);

router.put('/quizsubmit/:quizId', QuizController.QuizSubmitEdit);

router.put('/impression/:quizId', QuizController.AddImpression);

router.put('/pollsubmit/:quizId', QuizController.QuizPollSubmit);

router.put('/editQuiz', QuizController.EditQuiz);

router.delete('/deleteQuiz/:quizId', QuizController.DeleteQuiz);


module.exports = router;