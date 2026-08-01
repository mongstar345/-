import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  CheckCircle2, XCircle, Clock, Trophy, RotateCcw, 
  ChevronRight, AlertCircle 
} from 'lucide-react';
import { Button } from '../ui/button';

interface Question {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation?: string;
}

interface QuizViewProps {
  courseId: string;
  lessonId: string;
  questions: Question[];
  passingScore?: number;
  onComplete?: (score: number, passed: boolean) => void;
}

export function QuizView({ 
  questions, 
  passingScore = 70,
  onComplete 
}: QuizViewProps) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, number>>({});
  const [showResults, setShowResults] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(600); // 10 minutes
  const [quizStarted, setQuizStarted] = useState(false);

  const currentQuestion = questions[currentQuestionIndex];
  const isLastQuestion = currentQuestionIndex === questions.length - 1;

  // Calculate score
  const calculateScore = () => {
    let correct = 0;
    questions.forEach((question) => {
      if (selectedAnswers[question.id] === question.correctAnswer) {
        correct++;
      }
    });
    return Math.round((correct / questions.length) * 100);
  };

  // Start quiz
  const handleStartQuiz = () => {
    setQuizStarted(true);
    setSelectedAnswers({});
    setCurrentQuestionIndex(0);
    setShowResults(false);
    
    // Start timer
    const interval = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          handleSubmitQuiz();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  // Select answer
  const handleSelectAnswer = (optionIndex: number) => {
    setSelectedAnswers({
      ...selectedAnswers,
      [currentQuestion.id]: optionIndex,
    });
  };

  // Next question
  const handleNextQuestion = () => {
    if (isLastQuestion) {
      handleSubmitQuiz();
    } else {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  // Previous question
  const handlePreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  // Submit quiz
  const handleSubmitQuiz = () => {
    setShowResults(true);
    const score = calculateScore();
    const passed = score >= passingScore;
    
    if (onComplete) {
      onComplete(score, passed);
    }

    // TODO: Save results to backend
    // await saveQuizResults(courseId, lessonId, score, passed);
  };

  // Retry quiz
  const handleRetry = () => {
    handleStartQuiz();
  };

  // Format time
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // Quiz intro screen
  if (!quizStarted) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-2xl mx-auto p-8 bg-white dark:bg-gray-900 rounded-2xl shadow-lg"
      >
        <div className="text-center">
          <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
            <Trophy className="h-10 w-10 text-blue-600" />
          </div>
          
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            Ready to Test Your Knowledge?
          </h2>
          
          <div className="space-y-3 mb-8 text-left bg-gray-50 dark:bg-gray-800 p-6 rounded-xl">
            <div className="flex items-center gap-3 text-gray-700 dark:text-gray-300">
              <AlertCircle className="h-5 w-5 text-blue-600" />
              <span>{questions.length} questions</span>
            </div>
            <div className="flex items-center gap-3 text-gray-700 dark:text-gray-300">
              <Clock className="h-5 w-5 text-blue-600" />
              <span>Time limit: {formatTime(timeRemaining)}</span>
            </div>
            <div className="flex items-center gap-3 text-gray-700 dark:text-gray-300">
              <CheckCircle2 className="h-5 w-5 text-blue-600" />
              <span>Passing score: {passingScore}%</span>
            </div>
          </div>

          <Button size="lg" className="w-full" onClick={handleStartQuiz}>
            Start Quiz
          </Button>
        </div>
      </motion.div>
    );
  }

  // Results screen
  if (showResults) {
    const score = calculateScore();
    const passed = score >= passingScore;
    const correctCount = Math.round((score / 100) * questions.length);

    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-2xl mx-auto p-8 bg-white dark:bg-gray-900 rounded-2xl shadow-lg"
      >
        <div className="text-center">
          {/* Score circle */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', duration: 0.5 }}
            className="relative w-40 h-40 mx-auto mb-6"
          >
            <svg className="w-full h-full transform -rotate-90">
              <circle
                cx="80"
                cy="80"
                r="70"
                stroke="currentColor"
                strokeWidth="10"
                fill="none"
                className="text-gray-200 dark:text-gray-700"
              />
              <motion.circle
                cx="80"
                cy="80"
                r="70"
                stroke="currentColor"
                strokeWidth="10"
                fill="none"
                strokeDasharray={`${2 * Math.PI * 70}`}
                strokeDashoffset={`${2 * Math.PI * 70 * (1 - score / 100)}`}
                className={passed ? 'text-green-500' : 'text-red-500'}
                initial={{ strokeDashoffset: 2 * Math.PI * 70 }}
                animate={{ strokeDashoffset: 2 * Math.PI * 70 * (1 - score / 100) }}
                transition={{ duration: 1, ease: 'easeOut' }}
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-4xl font-bold text-gray-900 dark:text-white">
                {score}%
              </span>
              <span className="text-sm text-gray-500 dark:text-gray-400">
                Your Score
              </span>
            </div>
          </motion.div>

          {/* Result message */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            {passed ? (
              <div className="mb-6">
                <CheckCircle2 className="w-12 h-12 text-green-500 mx-auto mb-3" />
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                  Congratulations! 🎉
                </h2>
                <p className="text-gray-600 dark:text-gray-400">
                  You passed the quiz with flying colors!
                </p>
              </div>
            ) : (
              <div className="mb-6">
                <XCircle className="w-12 h-12 text-red-500 mx-auto mb-3" />
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                  Keep Learning
                </h2>
                <p className="text-gray-600 dark:text-gray-400">
                  You need {passingScore}% to pass. Review the material and try again.
                </p>
              </div>
            )}

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4 mb-8">
              <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-xl">
                <div className="text-2xl font-bold text-gray-900 dark:text-white">
                  {correctCount}
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  Correct
                </div>
              </div>
              <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-xl">
                <div className="text-2xl font-bold text-gray-900 dark:text-white">
                  {questions.length - correctCount}
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  Incorrect
                </div>
              </div>
              <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-xl">
                <div className="text-2xl font-bold text-gray-900 dark:text-white">
                  {questions.length}
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  Total
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="space-y-3">
              {!passed && (
                <Button size="lg" className="w-full" onClick={handleRetry}>
                  <RotateCcw className="h-5 w-5 mr-2" />
                  Try Again
                </Button>
              )}
              <Button 
                size="lg" 
                variant="outline" 
                className="w-full"
                onClick={() => window.history.back()}
              >
                Continue Learning
              </Button>
            </div>
          </motion.div>
        </div>
      </motion.div>
    );
  }

  // Quiz question screen
  return (
    <div className="max-w-3xl mx-auto">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
            Question {currentQuestionIndex + 1} of {questions.length}
          </span>
          {/* Progress bar */}
          <div className="w-32 h-2 bg-gray-200 dark:bg-gray-800 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-blue-600"
              initial={{ width: 0 }}
              animate={{ 
                width: `${((currentQuestionIndex + 1) / questions.length) * 100}%` 
              }}
              transition={{ duration: 0.3 }}
            />
          </div>
        </div>

        {/* Timer */}
        <div className="flex items-center gap-2 px-3 py-1.5 bg-orange-50 dark:bg-orange-900/20 text-orange-700 dark:text-orange-400 rounded-lg">
          <Clock className="h-4 w-4" />
          <span className="text-sm font-semibold">{formatTime(timeRemaining)}</span>
        </div>
      </div>

      {/* Question card */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentQuestionIndex}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          className="bg-white dark:bg-gray-900 rounded-2xl shadow-lg p-8 mb-6"
        >
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
            {currentQuestion.question}
          </h2>

          <div className="space-y-3">
            {currentQuestion.options.map((option, index) => {
              const isSelected = selectedAnswers[currentQuestion.id] === index;

              return (
                <button
                  key={index}
                  onClick={() => handleSelectAnswer(index)}
                  className={`w-full p-4 text-left rounded-xl border-2 transition-all ${
                    isSelected
                      ? 'border-blue-600 bg-blue-50 dark:bg-blue-900/20'
                      : 'border-gray-200 dark:border-gray-800 hover:border-blue-300 dark:hover:border-blue-700'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                        isSelected
                          ? 'border-blue-600 bg-blue-600'
                          : 'border-gray-300 dark:border-gray-700'
                      }`}
                    >
                      {isSelected && (
                        <CheckCircle2 className="h-4 w-4 text-white" />
                      )}
                    </div>
                    <span className="text-gray-900 dark:text-white font-medium">
                      {option}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Navigation buttons */}
      <div className="flex items-center justify-between">
        <Button
          variant="outline"
          onClick={handlePreviousQuestion}
          disabled={currentQuestionIndex === 0}
        >
          Previous
        </Button>

        <Button
          onClick={handleNextQuestion}
          disabled={selectedAnswers[currentQuestion.id] === undefined}
        >
          {isLastQuestion ? 'Submit Quiz' : 'Next Question'}
          <ChevronRight className="h-4 w-4 ml-2" />
        </Button>
      </div>
    </div>
  );
}
