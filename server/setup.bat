@echo off
echo ========================================
echo AI Resume Tailor - Backend Setup
echo ========================================
echo.

echo Step 1: Creating Python virtual environment...
python -m venv venv
if %errorlevel% neq 0 (
    echo ERROR: Failed to create virtual environment
    echo Make sure Python 3.9+ is installed
    pause
    exit /b 1
)
echo ✓ Virtual environment created
echo.

echo Step 2: Activating virtual environment...
call venv\Scripts\activate.bat
echo ✓ Virtual environment activated
echo.

echo Step 3: Installing Python dependencies...
pip install -r requirements.txt
if %errorlevel% neq 0 (
    echo ERROR: Failed to install dependencies
    pause
    exit /b 1
)
echo ✓ Dependencies installed
echo.

echo Step 4: Downloading spaCy English model...
python -m spacy download en_core_web_sm
if %errorlevel% neq 0 (
    echo ERROR: Failed to download spaCy model
    pause
    exit /b 1
)
echo ✓ spaCy model downloaded
echo.

echo Step 5: Creating .env file...
if not exist .env (
    copy .env.example .env
    echo ✓ .env file created from .env.example
    echo.
    echo IMPORTANT: Edit .env and add your OpenAI API key
) else (
    echo ✓ .env file already exists
)
echo.

echo ========================================
echo Setup Complete!
echo ========================================
echo.
echo To start the Flask backend:
echo   1. Activate venv: venv\Scripts\activate
echo   2. Run server: python app.py
echo.
echo Or from project root:
echo   pnpm dev:server
echo.
pause
