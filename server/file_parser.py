"""
File Parser Module

Extracts text from PDF and DOCX resume files.
Processes files in memory without storing them.

File: server/file_parser.py
"""

import io
import logging
from typing import Optional, Tuple

# Configure logging
logger = logging.getLogger(__name__)

# Constants
MAX_FILE_SIZE = 5 * 1024 * 1024  # 5MB
MIN_TEXT_LENGTH = 100  # Minimum characters for a valid resume
SUPPORTED_EXTENSIONS = {'pdf', 'docx'}


class FileParserError(Exception):
    """Custom exception for file parsing errors."""
    pass


def extract_text_from_pdf(file_bytes: bytes) -> str:
    """
    Extract text from PDF file bytes.

    Args:
        file_bytes: Raw PDF file content

    Returns:
        Extracted text from all pages

    Raises:
        FileParserError: If PDF parsing fails
    """
    try:
        import pdfplumber
    except ImportError:
        raise FileParserError("PDF parsing library not installed. Please install pdfplumber.")

    text_parts = []

    try:
        with pdfplumber.open(io.BytesIO(file_bytes)) as pdf:
            for page_num, page in enumerate(pdf.pages, 1):
                try:
                    page_text = page.extract_text()
                    if page_text:
                        text_parts.append(page_text.strip())
                except Exception as e:
                    logger.warning(f"Failed to extract text from page {page_num}: {e}")
                    continue
    except Exception as e:
        logger.error(f"PDF parsing error: {e}")
        raise FileParserError(f"Failed to parse PDF: {str(e)}")

    return "\n\n".join(text_parts)


def extract_text_from_docx(file_bytes: bytes) -> str:
    """
    Extract text from DOCX file bytes.

    Args:
        file_bytes: Raw DOCX file content

    Returns:
        Extracted text from document

    Raises:
        FileParserError: If DOCX parsing fails
    """
    try:
        from docx import Document
    except ImportError:
        raise FileParserError("DOCX parsing library not installed. Please install python-docx.")

    text_parts = []

    try:
        doc = Document(io.BytesIO(file_bytes))

        # Extract paragraphs
        for paragraph in doc.paragraphs:
            text = paragraph.text.strip()
            if text:
                text_parts.append(text)

        # Extract text from tables (common in resumes)
        for table in doc.tables:
            for row in table.rows:
                row_texts = []
                for cell in row.cells:
                    cell_text = cell.text.strip()
                    if cell_text:
                        row_texts.append(cell_text)
                if row_texts:
                    text_parts.append(" | ".join(row_texts))

    except Exception as e:
        logger.error(f"DOCX parsing error: {e}")
        raise FileParserError(f"Failed to parse DOCX: {str(e)}")

    return "\n".join(text_parts)


def validate_file(file_bytes: bytes, filename: str) -> Tuple[str, str]:
    """
    Validate file size and type.

    Args:
        file_bytes: Raw file content
        filename: Original filename

    Returns:
        Tuple of (extension, mime_type)

    Raises:
        FileParserError: If validation fails
    """
    # Check file size
    if len(file_bytes) > MAX_FILE_SIZE:
        size_mb = MAX_FILE_SIZE // (1024 * 1024)
        raise FileParserError(f"File too large. Maximum size is {size_mb}MB.")

    if len(file_bytes) == 0:
        raise FileParserError("File is empty.")

    # Get and validate extension
    if '.' not in filename:
        raise FileParserError("File must have an extension (.pdf or .docx).")

    extension = filename.lower().rsplit('.', 1)[-1]

    if extension not in SUPPORTED_EXTENSIONS:
        raise FileParserError(
            f"Unsupported file format: .{extension}. "
            f"Please use PDF or DOCX files."
        )

    return extension


def parse_resume_file(file_bytes: bytes, filename: str) -> dict:
    """
    Parse resume file and extract text.

    This is the main entry point for file parsing.

    Args:
        file_bytes: Raw file bytes
        filename: Original filename (for extension detection)

    Returns:
        Dictionary with:
        - text: Extracted text content
        - character_count: Length of extracted text
        - file_type: Type of file processed

    Raises:
        FileParserError: If parsing fails
    """
    # Validate file
    extension = validate_file(file_bytes, filename)

    # Extract text based on file type
    if extension == 'pdf':
        text = extract_text_from_pdf(file_bytes)
        file_type = 'application/pdf'
    elif extension == 'docx':
        text = extract_text_from_docx(file_bytes)
        file_type = 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    else:
        raise FileParserError(f"Unsupported file type: {extension}")

    # Clean up text
    text = text.strip()

    # Validate extracted content
    if not text:
        raise FileParserError(
            "Could not extract any text from the file. "
            "The file may be image-based or corrupted. "
            "Please try copy-pasting your resume text instead."
        )

    if len(text) < MIN_TEXT_LENGTH:
        raise FileParserError(
            f"Extracted text is too short ({len(text)} characters). "
            f"A valid resume should have at least {MIN_TEXT_LENGTH} characters. "
            "Please ensure the file contains your full resume."
        )

    return {
        'text': text,
        'character_count': len(text),
        'file_type': file_type
    }


# Quick test function for development
if __name__ == '__main__':
    import sys

    if len(sys.argv) < 2:
        print("Usage: python file_parser.py <filename>")
        sys.exit(1)

    filename = sys.argv[1]

    try:
        with open(filename, 'rb') as f:
            file_bytes = f.read()

        result = parse_resume_file(file_bytes, filename)
        print(f"File type: {result['file_type']}")
        print(f"Character count: {result['character_count']}")
        print(f"\n--- Extracted Text ---\n")
        print(result['text'][:2000])
        if len(result['text']) > 2000:
            print(f"\n... (truncated, total {result['character_count']} chars)")

    except FileParserError as e:
        print(f"Error: {e}")
        sys.exit(1)
    except FileNotFoundError:
        print(f"File not found: {filename}")
        sys.exit(1)
