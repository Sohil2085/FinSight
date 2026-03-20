@echo off
echo ==============================================
echo        Starting FinSight Project
echo ==============================================

echo [1/2] Starting Backend Server...
start "FinSight Backend" cmd /k "cd backend && npm run dev"

echo [2/2] Starting Frontend Server...
start "FinSight Frontend" cmd /k "cd frontend && npm run dev"

echo.
echo Both servers are starting up! 
echo Two new terminal windows have opened.
echo Keep those windows open to keep the project running.
echo You can now close this window safely.
echo ==============================================
pause
