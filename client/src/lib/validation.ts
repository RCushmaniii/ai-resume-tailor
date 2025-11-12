/**
 * Validation utilities for resume and job description inputs
 * Includes security checks for injection attacks and malicious content
 */

export const VALIDATION_RULES = {
  MIN_RESUME_LENGTH: 200,
  MIN_JOB_LENGTH: 100,
  MAX_LENGTH: 10000,
} as const;

/**
 * Suspicious patterns that might indicate injection attempts
 */
const SUSPICIOUS_PATTERNS = [
  /<script[\s\S]*?>[\s\S]*?<\/script>/gi,  // Script tags
  /javascript:/gi,                          // JavaScript protocol
  /on\w+\s*=/gi,                           // Event handlers (onclick, onerror, etc.)
  /<iframe[\s\S]*?>/gi,                    // Iframe tags
  /eval\s*\(/gi,                           // eval() calls
  /expression\s*\(/gi,                     // CSS expressions
  /<embed[\s\S]*?>/gi,                     // Embed tags
  /<object[\s\S]*?>/gi,                    // Object tags
] as const;

export interface ValidationError {
  field: 'resume' | 'job';
  message: string;
}

/**
 * Detects suspicious patterns that might indicate injection attempts
 */
function detectSuspiciousContent(text: string): boolean {
  for (const pattern of SUSPICIOUS_PATTERNS) {
    // Reset regex lastIndex to ensure consistent behavior
    pattern.lastIndex = 0;
    if (pattern.test(text)) {
      return true;
    }
  }
  return false;
}

/**
 * Detects if text contains accidental file paste markers
 */
function detectFilePaste(text: string): boolean {
  const trimmed = text.trim();
  
  // Check for PDF markers
  if (trimmed.startsWith('%PDF-')) return true;
  
  // Check for HTML document structure
  if (
    trimmed.toLowerCase().includes('<!doctype html') ||
    trimmed.toLowerCase().includes('<html') ||
    (trimmed.includes('<head>') && trimmed.includes('<body>'))
  ) {
    return true;
  }
  
  return false;
}

/**
 * Validates resume text input
 */
export function validateResumeText(text: string): string | null {
  const trimmed = text.trim();
  
  if (!trimmed) {
    return 'Please paste your resume text';
  }
  
  if (detectSuspiciousContent(trimmed)) {
    return 'Invalid content detected. Please paste plain text only';
  }
  
  if (detectFilePaste(trimmed)) {
    return 'It looks like you pasted a file. Please paste plain text instead';
  }
  
  if (trimmed.length < VALIDATION_RULES.MIN_RESUME_LENGTH) {
    return `Resume seems too short (minimum ${VALIDATION_RULES.MIN_RESUME_LENGTH} characters)`;
  }
  
  if (trimmed.length > VALIDATION_RULES.MAX_LENGTH) {
    return `Resume is too long (maximum ${VALIDATION_RULES.MAX_LENGTH.toLocaleString()} characters)`;
  }
  
  return null;
}

/**
 * Validates job description text input
 */
export function validateJobText(text: string): string | null {
  const trimmed = text.trim();
  
  if (!trimmed) {
    return 'Please paste the job description text';
  }
  
  if (detectSuspiciousContent(trimmed)) {
    return 'Invalid content detected. Please paste plain text only';
  }
  
  if (detectFilePaste(trimmed)) {
    return 'It looks like you pasted a file. Please paste plain text instead';
  }
  
  if (trimmed.length < VALIDATION_RULES.MIN_JOB_LENGTH) {
    return `Job description seems too short (minimum ${VALIDATION_RULES.MIN_JOB_LENGTH} characters)`;
  }
  
  if (trimmed.length > VALIDATION_RULES.MAX_LENGTH) {
    return `Job description is too long (maximum ${VALIDATION_RULES.MAX_LENGTH.toLocaleString()} characters)`;
  }
  
  return null;
}

/**
 * Validates both inputs and returns all errors
 */
export function validateInputs(
  resumeText: string,
  jobText: string
): ValidationError[] {
  const errors: ValidationError[] = [];
  
  const resumeError = validateResumeText(resumeText);
  if (resumeError) {
    errors.push({ field: 'resume', message: resumeError });
  }
  
  const jobError = validateJobText(jobText);
  if (jobError) {
    errors.push({ field: 'job', message: jobError });
  }
  
  return errors;
}

/**
 * Quick check if inputs are valid for submission
 */
export function canSubmit(resumeText: string, jobText: string): boolean {
  return validateInputs(resumeText, jobText).length === 0;
}
