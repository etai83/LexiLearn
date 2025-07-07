
import React, { useState, useRef } from "react";
import { Document, Quiz } from "@/entities/all";
import { UploadFile, ExtractDataFromUploadedFile, InvokeLLM } from "@/integrations/Core";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { 
  Upload as UploadIcon, 
  FileText, 
  AlertCircle, 
  CheckCircle, 
  BookOpen,
  Clock,
  Target,
  ArrowRight,
  X
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";

export default function Upload() {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const [dragActive, setDragActive] = useState(false);
  const [file, setFile] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState(null);
  const [document, setDocument] = useState(null);
  const [currentStep, setCurrentStep] = useState(0);

  const steps = [
    "Uploading document...",
    "Extracting text content...",
    "Analyzing reading level...",
    "Generating questions...",
    "Finalizing quiz..."
  ];

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    const files = e.dataTransfer.files;
    if (files && files[0]) {
      handleFile(files[0]);
    }
  };

  const handleFileInput = (e) => {
    const files = e.target.files;
    if (files && files[0]) {
      handleFile(files[0]);
    }
  };

  const handleFile = (selectedFile) => {
    if (selectedFile.type !== "application/pdf") {
      setError("Please upload a PDF file only.");
      return;
    }

    if (selectedFile.size > 10 * 1024 * 1024) {
      setError("File size must be less than 10MB.");
      return;
    }

    setFile(selectedFile);
    setError(null);
  };

  const processDocument = async () => {
    if (!file) return;

    setIsProcessing(true);
    setProgress(0);
    setCurrentStep(0);
    setError(null);

    try {
      // Step 1: Upload file
      setProgress(20);
      const { file_url } = await UploadFile({ file });
      
      // Step 2: Extract text
      setCurrentStep(1);
      setProgress(40);
      const extractResult = await ExtractDataFromUploadedFile({
        file_url,
        json_schema: {
          type: "object",
          properties: {
            title: { type: "string" },
            content: { type: "string" },
            word_count: { type: "number" }
          }
        }
      });

      if (extractResult.status !== "success") {
        throw new Error("Failed to extract text from PDF");
      }
      
      const content = extractResult.output.content;
      const isHebrew = /[\u0590-\u05FF]/.test(content);

      const promptInstruction = isHebrew
        ? `בהתבסס על הטקסט הבא, צור בדיוק 5 שאלות רב-ברירה (אמריקאיות) לבדיקת הבנת הנקרא. כל שאלה צריכה לבחון הבנה של התוכן. עבור כל שאלה, ספק 4 אפשרויות עם תשובה נכונה אחת בלבד. בנוסף, ספק הסבר קצר לתשובה הנכונה וציין את קטע הטקסט התומך מהמאמר.

טקסט: "${content}"

אנא פרמט את תגובתך כאובייקט JSON. חשוב מאוד: השדה 'correct_answer' צריך להכיל את הטקסט המלא של התשובה הנכונה, לא את האינדקס או האות שלה.`
        : `Based on the following text, create exactly 5 multiple choice reading comprehension questions. Each question should test understanding of the content, not trivial details. For each question, provide 4 options with only one correct answer. Also provide a brief explanation for the correct answer and identify the supporting text from the passage.

Text: "${content}"

Please format your response as a JSON object. VERY IMPORTANT: The 'correct_answer' field must contain the full text of the correct option, not its index or letter.`;

      const jsonStructure = `{
  "questions": [
    {
      "question": "The question text.",
      "options": ["Option 1", "Option 2", "Option 3", "Option 4"],
      "correct_answer": "The full text of the correct option.",
      "explanation": "An explanation of why the answer is correct.",
      "supporting_text": "A relevant quote from the source text."
    }
  ]
}`;

      const finalPrompt = `${promptInstruction}\n\nYour response MUST be a JSON object with the following structure:\n${jsonStructure}`;

      // Step 3: Analyze reading level and create document
      setCurrentStep(2);
      setProgress(60);
      const documentData = {
        title: extractResult.output.title || file.name.replace('.pdf', ''),
        content: content,
        file_url: file_url,
        word_count: extractResult.output.word_count || content.split(' ').length,
        reading_level: "Intermediate" // Could be enhanced with actual analysis
      };

      const createdDocument = await Document.create(documentData);
      setDocument(createdDocument);

      // Step 4: Generate questions
      setCurrentStep(3);
      setProgress(80);
      const questionsResult = await InvokeLLM({
        prompt: finalPrompt,
        response_json_schema: {
          type: "object",
          properties: {
            questions: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  question: { type: "string" },
                  options: { type: "array", items: { type: "string" } },
                  correct_answer: { type: "string" },
                  explanation: { type: "string" },
                  supporting_text: { type: "string" }
                },
                required: ["question", "options", "correct_answer"]
              }
            }
          }
        }
      });

      // Step 5: Create quiz
      setCurrentStep(4);
      setProgress(100);
      const quizData = {
        document_id: createdDocument.id,
        title: documentData.title,
        total_questions: 5,
        questions: questionsResult.questions || []
      };

      const createdQuiz = await Quiz.create(quizData);
      
      // Navigate to quiz
      setTimeout(() => {
        navigate(createPageUrl(`Quiz?id=${createdQuiz.id}`));
      }, 1000);

    } catch (error) {
      console.error("Error processing document:", error);
      setError("Failed to process document. Please try again.");
      setIsProcessing(false);
    }
  };

  const removeFile = () => {
    setFile(null);
    setError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Upload Document</h1>
          <p className="text-slate-600">
            Upload a PDF document to generate reading comprehension questions
          </p>
        </div>

        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <Card className="mb-6 bg-white/70 backdrop-blur-sm border-white/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <UploadIcon className="w-5 h-5" />
              Document Upload
            </CardTitle>
          </CardHeader>
          <CardContent>
            {!file ? (
              <div
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
                className={`relative border-2 border-dashed rounded-xl p-8 text-center transition-all duration-200 ${
                  dragActive 
                    ? "border-blue-400 bg-blue-50" 
                    : "border-slate-300 hover:border-slate-400"
                }`}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".pdf"
                  onChange={handleFileInput}
                  className="hidden"
                />
                
                <div className="space-y-4">
                  <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl flex items-center justify-center mx-auto">
                    <FileText className="w-8 h-8 text-white" />
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-semibold text-slate-900 mb-2">
                      Upload PDF Document
                    </h3>
                    <p className="text-slate-600 mb-4">
                      Drag and drop your PDF here, or click to browse
                    </p>
                    
                    <Button 
                      onClick={() => fileInputRef.current?.click()}
                      className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
                    >
                      <UploadIcon className="w-4 h-4 mr-2" />
                      Choose File
                    </Button>
                  </div>
                  
                  <div className="text-sm text-slate-500 space-y-1">
                    <p>• PDF files only</p>
                    <p>• Maximum size: 10MB</p>
                    <p>• Text-based PDFs work best</p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                {/* File Preview */}
                <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                      <FileText className="w-5 h-5 text-red-600" />
                    </div>
                    <div>
                      <p className="font-medium text-slate-900">{file.name}</p>
                      <p className="text-sm text-slate-500">
                        {(file.size / (1024 * 1024)).toFixed(2)} MB
                      </p>
                    </div>
                  </div>
                  {!isProcessing && (
                    <Button variant="ghost" size="sm" onClick={removeFile}>
                      <X className="w-4 h-4" />
                    </Button>
                  )}
                </div>

                {/* Processing Status */}
                {isProcessing && (
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
                      <span className="font-medium text-slate-900">
                        {steps[currentStep]}
                      </span>
                    </div>
                    <Progress value={progress} className="h-2" />
                    <div className="text-sm text-slate-600">
                      Step {currentStep + 1} of {steps.length}
                    </div>
                  </div>
                )}

                {/* Action Button */}
                {!isProcessing && (
                  <Button 
                    onClick={processDocument}
                    className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
                  >
                    <BookOpen className="w-4 h-4 mr-2" />
                    Generate Quiz
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Info Cards */}
        <div className="grid md:grid-cols-3 gap-4">
          <Card className="bg-white/50 backdrop-blur-sm border-white/20">
            <CardContent className="p-4 text-center">
              <Clock className="w-8 h-8 text-blue-600 mx-auto mb-2" />
              <p className="text-sm font-medium text-slate-900">Quick Processing</p>
              <p className="text-xs text-slate-600">Usually takes 30-60 seconds</p>
            </CardContent>
          </Card>
          
          <Card className="bg-white/50 backdrop-blur-sm border-white/20">
            <CardContent className="p-4 text-center">
              <Target className="w-8 h-8 text-green-600 mx-auto mb-2" />
              <p className="text-sm font-medium text-slate-900">Smart Questions</p>
              <p className="text-xs text-slate-600">AI-generated comprehension tests</p>
            </CardContent>
          </Card>
          
          <Card className="bg-white/50 backdrop-blur-sm border-white/20">
            <CardContent className="p-4 text-center">
              <CheckCircle className="w-8 h-8 text-purple-600 mx-auto mb-2" />
              <p className="text-sm font-medium text-slate-900">Instant Feedback</p>
              <p className="text-xs text-slate-600">Detailed explanations included</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
