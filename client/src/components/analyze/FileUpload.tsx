/**
 * FileUpload Component
 *
 * Drag-and-drop file upload for resume PDFs and DOCX files.
 * Sends file to backend for text extraction.
 *
 * File: client/src/components/analyze/FileUpload.tsx
 */

import type { ReactElement } from 'react';
import { useCallback, useState, useRef } from 'react';
import { Upload, FileText, X, AlertCircle, CheckCircle } from 'lucide-react';
import { useTranslation } from 'react-i18next';

// ═══════════════════════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════════════════════

interface FileUploadProps {
  onTextExtracted: (text: string) => void;
  disabled?: boolean;
  className?: string;
}

interface UploadState {
  status: 'idle' | 'uploading' | 'success' | 'error';
  fileName: string | null;
  error: string | null;
  characterCount: number | null;
}

// ═══════════════════════════════════════════════════════════════════════════
// CONSTANTS
// ═══════════════════════════════════════════════════════════════════════════

const ACCEPTED_EXTENSIONS = ['pdf', 'docx'];
const ACCEPTED_MIME_TYPES = [
  'application/pdf',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
];
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

// ═══════════════════════════════════════════════════════════════════════════
// COMPONENT
// ═══════════════════════════════════════════════════════════════════════════

export function FileUpload({
  onTextExtracted,
  disabled = false,
  className = '',
}: FileUploadProps): ReactElement {
  const { t } = useTranslation();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [state, setState] = useState<UploadState>({
    status: 'idle',
    fileName: null,
    error: null,
    characterCount: null,
  });

  // Validate file before upload
  const validateFile = useCallback((file: File): string | null => {
    // Check file extension
    const extension = file.name.split('.').pop()?.toLowerCase();
    if (!extension || !ACCEPTED_EXTENSIONS.includes(extension)) {
      return t('fileUpload.errors.unsupportedFormat', 'Please upload a PDF or DOCX file.');
    }

    // Check MIME type (additional safety)
    if (!ACCEPTED_MIME_TYPES.includes(file.type) && file.type !== '') {
      return t('fileUpload.errors.unsupportedFormat', 'Please upload a PDF or DOCX file.');
    }

    // Check file size
    if (file.size > MAX_FILE_SIZE) {
      return t('fileUpload.errors.fileTooLarge', 'File is too large. Maximum size is 5MB.');
    }

    if (file.size === 0) {
      return t('fileUpload.errors.emptyFile', 'File is empty.');
    }

    return null;
  }, [t]);

  // Handle file upload
  const handleFile = useCallback(async (file: File) => {
    // Reset state
    setState({
      status: 'uploading',
      fileName: file.name,
      error: null,
      characterCount: null,
    });

    // Validate file
    const validationError = validateFile(file);
    if (validationError) {
      setState({
        status: 'error',
        fileName: file.name,
        error: validationError,
        characterCount: null,
      });
      return;
    }

    try {
      // Create form data
      const formData = new FormData();
      formData.append('file', file);

      // Send to API
      const apiUrl = import.meta.env.VITE_API_URL || '/api';
      const response = await fetch(`${apiUrl}/parse-resume`, {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || data.error || 'Failed to parse file');
      }

      // Success
      setState({
        status: 'success',
        fileName: file.name,
        error: null,
        characterCount: data.character_count,
      });

      // Pass extracted text to parent
      onTextExtracted(data.text);

    } catch (err) {
      const message = err instanceof Error
        ? err.message
        : t('fileUpload.errors.parseError', 'Failed to parse file. Please try copy-pasting your resume text instead.');

      setState({
        status: 'error',
        fileName: file.name,
        error: message,
        characterCount: null,
      });
    }
  }, [validateFile, onTextExtracted, t]);

  // Handle drag events
  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!disabled) {
      setIsDragging(true);
    }
  }, [disabled]);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    if (disabled) return;

    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleFile(files[0]);
    }
  }, [disabled, handleFile]);

  // Handle file input change
  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFile(files[0]);
    }
    // Reset input to allow re-selecting same file
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  }, [handleFile]);

  // Handle click to open file dialog
  const handleClick = useCallback(() => {
    if (!disabled && fileInputRef.current) {
      fileInputRef.current.click();
    }
  }, [disabled]);

  // Clear uploaded file
  const handleClear = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    setState({
      status: 'idle',
      fileName: null,
      error: null,
      characterCount: null,
    });
  }, []);

  // Render content based on state
  const renderContent = () => {
    switch (state.status) {
      case 'uploading':
        return (
          <div className="flex flex-col items-center gap-2">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
            <span className="text-sm text-gray-600">
              {t('fileUpload.extracting', 'Extracting text...')}
            </span>
            <span className="text-xs text-gray-400">{state.fileName}</span>
          </div>
        );

      case 'success':
        return (
          <div className="flex flex-col items-center gap-2">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-green-600" />
              <FileText className="w-5 h-5 text-gray-600" />
              <span className="text-sm text-gray-700 font-medium">{state.fileName}</span>
              <button
                type="button"
                onClick={handleClear}
                className="p-1 hover:bg-gray-200 rounded transition-colors"
                aria-label={t('fileUpload.clear', 'Clear file')}
              >
                <X className="w-4 h-4 text-gray-500" />
              </button>
            </div>
            {state.characterCount && (
              <span className="text-xs text-green-600">
                {state.characterCount.toLocaleString()} {t('fileUpload.charactersExtracted', 'characters extracted')}
              </span>
            )}
          </div>
        );

      case 'error':
        return (
          <div className="flex flex-col items-center gap-2">
            <div className="flex items-center gap-2 text-red-600">
              <AlertCircle className="w-5 h-5" />
              <span className="text-sm font-medium">
                {t('fileUpload.failed', 'Upload failed')}
              </span>
            </div>
            <span className="text-xs text-red-500 text-center max-w-xs">
              {state.error}
            </span>
            <button
              type="button"
              onClick={handleClear}
              className="text-xs text-blue-600 hover:text-blue-700 underline"
            >
              {t('fileUpload.tryAgain', 'Try again')}
            </button>
          </div>
        );

      default:
        return (
          <div className="flex flex-col items-center gap-2">
            <Upload className="w-8 h-8 text-gray-400" />
            <div className="text-center">
              <span className="text-blue-600 font-medium hover:text-blue-700">
                {t('fileUpload.uploadFile', 'Upload a file')}
              </span>
              <span className="text-gray-500">
                {' '}{t('fileUpload.orDragDrop', 'or drag and drop')}
              </span>
            </div>
            <span className="text-xs text-gray-400">
              {t('fileUpload.supportedFormats', 'PDF or DOCX up to 5MB')}
            </span>
          </div>
        );
    }
  };

  return (
    <div className={className}>
      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept=".pdf,.docx,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
        onChange={handleInputChange}
        className="hidden"
        disabled={disabled}
        aria-hidden="true"
      />

      {/* Drop zone */}
      <div
        onClick={handleClick}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        role="button"
        tabIndex={disabled ? -1 : 0}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            handleClick();
          }
        }}
        aria-label={t('fileUpload.dropZoneLabel', 'Upload resume file')}
        className={`
          relative border-2 border-dashed rounded-lg p-6 text-center
          transition-all duration-200 cursor-pointer
          focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
          ${isDragging
            ? 'border-blue-500 bg-blue-50'
            : 'border-gray-300 hover:border-gray-400 hover:bg-gray-50'
          }
          ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
          ${state.status === 'success' ? 'border-green-300 bg-green-50' : ''}
          ${state.status === 'error' ? 'border-red-300 bg-red-50' : ''}
        `}
      >
        {renderContent()}
      </div>
    </div>
  );
}

export default FileUpload;
