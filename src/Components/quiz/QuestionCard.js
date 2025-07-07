import React from "react";
import { Button } from "@/components/ui/button";
import PropTypes from 'prop-types';

export default function QuestionCard({
  question,
  questionIndex,
  selectedAnswer,
  onAnswerSelect,
}) {
  const handleAnswerClick = (optionIndex) => {
    const optionLetter = String.fromCharCode(65 + optionIndex); // A, B, C, D
    onAnswerSelect(questionIndex, optionLetter);
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium text-slate-900 mb-4 leading-relaxed">
          {question.question}
        </h3>

        <div className="space-y-3">
          {question.options?.map((option, index) => {
            const optionLetter = String.fromCharCode(65 + index);
            const isSelected = selectedAnswer === optionLetter;

            return (
              <Button
                key={index}
                variant={isSelected ? "default" : "outline"}
                className={`w-full text-left justify-start h-auto p-4 ${
                  isSelected
                    ? "bg-blue-600 text-white hover:bg-blue-700"
                    : "bg-white hover:bg-slate-50"
                }`}
                onClick={() => handleAnswerClick(index)}
              >
                <div className="flex items-start gap-3">
                  <span className={`font-semibold min-w-6 ${
                    isSelected ? "text-white" : "text-slate-600"
                  }`}>
                    {optionLetter}.
                  </span>
                  <span className="text-left leading-relaxed">
                    {option}
                  </span>
                </div>
              </Button>
            );
          })}
        </div>
      </div>

      {selectedAnswer && (
        <div className="pt-4 border-t">
          <p className="text-sm text-slate-600">
            Selected: <span className="font-medium">Option {selectedAnswer}</span>
          </p>
        </div>
      )}
    </div>
  );
}

QuestionCard.propTypes = {
  question: PropTypes.shape({
    question: PropTypes.string.isRequired,
    options: PropTypes.arrayOf(PropTypes.string).isRequired,
  }).isRequired,
  questionIndex: PropTypes.number.isRequired,
  selectedAnswer: PropTypes.string,
  onAnswerSelect: PropTypes.func.isRequired,
};