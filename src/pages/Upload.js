import React, { useState, useRef } from "react";
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

export default function Upload() {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const [dragActive, setDragActive] = useState(false);
  const [file, setFile] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState(null);

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
    setError(null);

    // Simulate processing for demo
    setTimeout(() => {
      setIsProcessing(false);
      alert("Quiz generation feature coming soon! This is a demo version.");
    }, 2000);
  };

  const removeFile = () => {
    setFile(null);
    setError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Upload Document</h1>
        <p className="text-gray-600">
          Upload a PDF document to generate reading comprehension questions
        </p>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center gap-3">
          <AlertCircle className="h-5 w-5 text-red-500" />
          <span className="text-red-700">{error}</span>
        </div>
      )}

      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center gap-2 mb-4">
          <UploadIcon className="w-5 h-5" />
          <h2 className="text-lg font-semibold">Document Upload</h2>
        </div>
        
        {!file ? (
          <div
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
            className={`relative border-2 border-dashed rounded-xl p-8 text-center transition-all duration-200 ${
              dragActive 
                ? "border-blue-400 bg-blue-50" 
                : "border-gray-300 hover:border-gray-400"
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
              <div className="w-16 h-16 bg-blue-500 rounded-2xl flex items-center justify-center mx-auto">
                <FileText className="w-8 h-8 text-white" />
              </div>
              
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Upload PDF Document
                </h3>
                <p className="text-gray-600 mb-4">
                  Drag and drop your PDF here, or click to browse
                </p>
                
                <button 
                  onClick={() => fileInputRef.current?.click()}
                  className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg font-medium transition-colors"
                >
                  <UploadIcon className="w-4 h-4 mr-2 inline" />
                  Choose File
                </button>
              </div>
              
              <div className="text-sm text-gray-500 space-y-1">
                <p>• PDF files only</p>
                <p>• Maximum size: 10MB</p>
                <p>• Text-based PDFs work best</p>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                  <FileText className="w-5 h-5 text-red-600" />
                </div>
                <div>
                  <p className="font-medium text-gray-900">{file.name}</p>
                  <p className="text-sm text-gray-500">
                    {(file.size / (1024 * 1024)).toFixed(2)} MB
                  </p>
                </div>
              </div>
              {!isProcessing && (
                <button 
                  onClick={removeFile}
                  className="p-2 text-gray-500 hover:text-gray-700 rounded-lg"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {isProcessing && (
              <div className="flex items-center gap-3 p-4 bg-blue-50 rounded-lg">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
                <span className="font-medium text-blue-900">
                  Processing document...
                </span>
              </div>
            )}

            {!isProcessing && (
              <button 
                onClick={processDocument}
                className="w-full bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
              >
                <BookOpen className="w-4 h-4" />
                Generate Quiz
                <ArrowRight className="w-4 h-4" />
              </button>
            )}
          </div>
        )}
      </div>

      {/* Info Cards */}
      <div className="grid md:grid-cols-3 gap-4">
        <div className="bg-white rounded-lg shadow p-4 text-center">
          <Clock className="w-8 h-8 text-blue-600 mx-auto mb-2" />
          <p className="text-sm font-medium text-gray-900">Quick Processing</p>
          <p className="text-xs text-gray-600">Usually takes 30-60 seconds</p>
        </div>
        
        <div className="bg-white rounded-lg shadow p-4 text-center">
          <Target className="w-8 h-8 text-green-600 mx-auto mb-2" />
          <p className="text-sm font-medium text-gray-900">Smart Questions</p>
          <p className="text-xs text-gray-600">AI-generated comprehension tests</p>
        </div>
        
        <div className="bg-white rounded-lg shadow p-4 text-center">
          <CheckCircle className="w-8 h-8 text-purple-600 mx-auto mb-2" />
          <p className="text-sm font-medium text-gray-900">Instant Feedback</p>
          <p className="text-xs text-gray-600">Detailed explanations included</p>
        </div>
      </div>
    </div>
  );
}
