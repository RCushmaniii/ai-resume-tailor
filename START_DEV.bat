@echo off
echo ========================================
echo AI Resume Tailor - Starting Dev Servers
echo ========================================
echo.

echo This will start both frontend and backend servers.
echo.
echo Frontend: http://localhost:3000
echo Backend:  http://localhost:5000
echo Test API: http://localhost:3000/test-api
echo.
echo Press Ctrl+C in each window to stop servers.
echo.
pause

echo Starting Flask backend in new window...
start "Flask Backend (Port 5000)" cmd /k "cd /d %~dp0server && venv\Scripts\activate && python app.py"

timeout /t 2 /nobreak >nul

echo Starting React frontend in new window...
start "React Frontend (Port 3000)" cmd /k "cd /d %~dp0client && pnpm dev"

echo.
echo ========================================
echo Both servers are starting!
echo ========================================
echo.
echo Check the new terminal windows for logs.
echo.
echo Open your browser to:
echo   http://localhost:3000/test-api
echo.
pause
