@echo off
REM Este script instala ou atualiza as bibliotecas Python necessarias para o projeto.

REM Configura a codificacao do console para UTF-8 (para exibir caracteres especiais corretamente)
chcp 65001 > nul

REM Define o diretorio do seu aplicativo.
REM Se este script estiver na mesma pasta do 'requirements.txt',
REM a linha abaixo ira definir o diretorio corretamente.
SET "APP_DIR=%~dp0"

ECHO.
ECHO =========================================================
ECHO   INICIANDO INSTALACAO/ATUALIZACAO DAS BIBLIOTECAS PYTHON
ECHO =========================================================
ECHO.

REM Navega para o diretorio do aplicativo
pushd "%APP_DIR%"

REM Verifica se o requirements.txt existe
IF NOT EXIST "requirements.txt" (
    ECHO ERRO: O arquivo 'requirements.txt' nao foi encontrado em "%APP_DIR%".
    ECHO Certifique-se de que este script esta na mesma pasta do 'requirements.txt'.
    popd
    PAUSE
    GOTO :EOF
)

ECHO Instalando/atualizando dependencias Python (requirements.txt)...
pip install -r requirements.txt

IF %ERRORLEVEL% NEQ 0 (
    ECHO.
    ECHO =========================================================
    ECHO   AVISO: Ocorreu um erro ao instalar as dependencias Python.
    ECHO          Isso pode significar que:
    ECHO          - O Python/pip nao esta instalado ou nao esta no PATH.
    ECHO          - Houve um problema de conexao com a internet.
    ECHO          - Alguma dependencia nao pode ser instalada.
    ECHO =========================================================
    ECHO.
    popd
    PAUSE
    GOTO :EOF
)

ECHO.
ECHO =========================================================
ECHO   INSTALACAO/ATUALIZACAO DAS BIBLIOTECAS CONCLUIDA!
ECHO =========================================================
ECHO.

REM Retorna para o diretorio original
popd

PAUSE