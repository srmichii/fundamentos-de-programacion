@echo off
title CYBERFREIGHT // Local Web Server
echo ========================================================
echo  Iniciando servidor local CYBERFREIGHT en http://localhost:8080
echo ========================================================
powershell -ExecutionPolicy Bypass -File "%~dp0start-server.ps1"
pause
