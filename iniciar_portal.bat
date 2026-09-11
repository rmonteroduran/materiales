@echo off
title Portal de Materiales - Servidor Local
echo ========================================================
echo   Iniciando servidor local para el Portal de Materiales
echo   URL: http://localhost:8000
echo ========================================================
echo.
start "" http://localhost:8000
python -m http.server 8000
pause
