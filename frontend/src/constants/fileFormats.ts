// File format constants for document uploads
export const SUPPORTED_FILE_FORMATS = {
  // Display formats
  display: {
    full: "PDF, DOC, DOCX, or TXT",
    short: "PDF, DOC, DOCX, TXT",
    withSize: "PDF, DOC, DOCX, or TXT up to 10MB"
  },
  
  // File extensions
  extensions: [".pdf", ".doc", ".docx", ".txt"],
  accept: ".pdf,.doc,.docx,.txt",
  
  // MIME types
  mimeTypes: [
    "application/pdf",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    "text/plain"
  ],
  
  // Size limit
  maxSize: 10 * 1024 * 1024, // 10MB in bytes
  maxSizeDisplay: "10MB"
};

// Helper function to validate file type
export const isValidFileType = (file: File): boolean => {
  return SUPPORTED_FILE_FORMATS.mimeTypes.includes(file.type);
};

// Helper function to validate file size
export const isValidFileSize = (file: File): boolean => {
  return file.size <= SUPPORTED_FILE_FORMATS.maxSize;
};

// Helper function to get validation error
export const getFileValidationError = (file: File): string | null => {
  if (!isValidFileType(file)) {
    return `Please upload a ${SUPPORTED_FILE_FORMATS.display.full} file`;
  }
  if (!isValidFileSize(file)) {
    return `File size must be less than ${SUPPORTED_FILE_FORMATS.maxSizeDisplay}`;
  }
  return null;
};