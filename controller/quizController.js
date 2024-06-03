const Quiz = require("../models/quiz");

const AddQuiz = async (req, res, next) => {
  try {
    const { quizName, quizType, timer, createdBy, questions } = req.body;

    if (!quizName || !quizType || !createdBy || !questions) {
      return res
        .status(400)
        .json({ message: "bad request: required all parameters" });
    }

    const newQuiz = new Quiz({
      quizName: quizName,
      quizType: quizType,
      timer: timer,
      createdBy: createdBy,
      questions: questions,
    });

    await newQuiz
      .save()
      .then((resposne) => {
        res.json({ message: "Quiz added successfully", quizId: resposne._id });
      })
      .catch((err) => {
        next(err);
      });
  } catch (err) {
    console.log("Error creating quiz" + err);
    next(err);
  }
};

const GetQuizById = async (req, res, next) => {
  try {
    const quizId = req.params.quizId;
    const resposne = await Quiz.findById({ _id: quizId });
    res.status(200).json({ data: resposne });
  } catch (err) {
    next(err);
  }
};

const GetAllQuizCreatedByUser = async (req, res, next) => {
  try {
    const userId = req.params.userId;

    if (!userId) {
      return res.status(400).json({ message: "Bad request" });
    }

    const resposne = await Quiz.find({ createdBy: userId });
    res.status(200).json({ data: resposne });
  } catch (err) {
    console.log("error fetching user quizes", err);
    next(err);
  }
};

const GetHomePageData = async (req, res, next) => {
  try {
    const userId = req.params.userId;
    let totalQuestion = 0;
    let totalImpressions = 0;

    if (!userId) {
      return res.status(400).json({ message: "Bad request" });
    }

    const yourQuizes = await Quiz.find({ createdBy: userId });

    yourQuizes.map(item => {
      const questioncount = item.questions.length;
      totalQuestion += questioncount
      totalImpressions += item.impression
    })

    res.status(200).json({
      totalImpressions: totalImpressions,
      questionsCreated: totalQuestion,
      quizCreated: yourQuizes.length,
      data: yourQuizes
    });
  } catch (err) {
    console.log("Error fetching home page data");
    next(err);
  }
}

const QuizSubmitEdit = async (req, res, next) => {
  try {
    const quizId = req.params.quizId;
    const increments = req.body.increments;

    if (!quizId) {
      res.status(400).json({ message: "Bad request" });
    }

    const quiz = await Quiz.findById(quizId);

    if (!quiz) {
      return res.status(404).send('Quiz not found');
    }

    increments.forEach((inc, index) => {
      if (quiz.questions[index]) {
        if (parseInt(inc) !== -1) {
          quiz.questions[index].attempted += 1;
          quiz.questions[index].answerCorrected += inc == 1 ? 1 : 0;
          quiz.questions[index].answerIncorrectly += inc == 0 ? 1 : 0
        }
      }
    });

    // Save the updated quiz document
    const updatedQuiz = await quiz.save();

    res.status(200).json({ message: "Updated increments in quiz's question" });
  } catch (error) {
    console.log("Error in quiz submit");
    next(error);
  }
};

const QuizPollSubmit = async (req, res, next) => {
  try {
    const quizId = req.params.quizId;
    const selected = req.body.selected;

    if (!quizId) {
      res.status(400).json({ message: "Bad request" });
    }

    const quiz = await Quiz.findById(quizId);

    if (!quiz) {
      return res.status(404).send('Quiz not found');
    }

    selected.forEach((inc, index) => {
      if (quiz.questions[index]) {
        if (parseInt(inc) !== -1) {
          quiz.questions[index].options[inc].selectedInPoll += 1;
        }
      }
    });

    // Save the updated quiz document
    const updatedQuiz = await quiz.save();

    res.status(200).json({ message: "Updated poll in quiz's question" });
  } catch (error) {
    console.log("Error in poll submit");
    next(error);
  }
};

const AddImpression = async (req, res, next) => {
  try {
    const quizId = req.params.quizId;
    if (!quizId) {
      return res.status(400).json({ message: "Bad request" });
    }

    const updatedImpression = await Quiz.findByIdAndUpdate(
      { _id: quizId },
      { $inc: { impression: 1 } },
      { new: true }
    );

    res.status(200).json({ message: "Impression captured" });
  } catch (err) {
    next(err);
  }
}

const EditQuiz = async (req, res, next) => {
  try {
    const { quizId, timer, questions } = req.body;

    if (!questions) {
      return res
        .status(400)
        .json({ message: "bad request: required all parameters" });
    }

    const update = {
      $set: {
        questions: questions,
        timer: timer
      }
    };

    const result = await Quiz.updateOne({ _id: quizId }, update);
    return res.status(200).json({ message: 'Quiz edited successfully!', res: result });

  } catch (err) {
    console.log("Error editing quiz" + err);
  }
};

const DeleteQuiz = async (req, res, next) => {
  try {
    const quizId = req.params.quizId;

    if (!quizId) {
      return res.status(400).json({ message: "Bad request" });
    }

    const result = await Quiz.deleteOne({ _id: quizId });
    return res.status(200).json({message: "Quiz deleted successfully!"})
  } catch (error) {
    console.log("Error deleting the quiz", error);
  }
}


module.exports = {
  AddQuiz,
  GetQuizById,
  GetAllQuizCreatedByUser,
  QuizSubmitEdit,
  AddImpression,
  QuizPollSubmit,
  GetHomePageData,
  EditQuiz,
  DeleteQuiz
};
