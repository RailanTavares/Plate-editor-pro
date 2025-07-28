@echo off
REM Este script baixa a ultima release do GitHub, descompacta e reinicia o servidor Flask.

SETLOCAL

REM Configura a codificacao do console para UTF-8 (para exibir caracteres especiais corretamente)
chcp 65001 > nul

REM ========================================================
REM             CONFIGURACOES DO SEU PROJETO
REM ========================================================
SET "GITHUB_USER=RailanTavares"
SET "GITHUB_REPO=Plate-editor-pro"
SET "APP_DIR=C:\Plate editor pro"

REM Nome esperado do arquivo .zip na sua release do GitHub.
REM MUITO IMPORTANTE: Mantenha este nome consistente ao criar suas releases!
SET "RELEASE_ASSET_EXPECTED_NAME=plate-editor-pro-release.zip"

REM Nome da pasta do ambiente virtual
SET "VENV_DIR=venv"

REM ========================================================
REM             INICIANDO PROCESSO DE ATUALIZACAO
REM ========================================================
ECHO.
ECHO ===============================================
ECHO   INICIANDO ATUALIZACAO DO SISTEMA VIA GITHUB
ECHO ===============================================
ECHO.

ECHO Verificando a ultima release no GitHub para %GITHUB_USER%/%GITHUB_REPO%...
ECHO.

REM Tenta obter os detalhes da ultima release usando curl e Powershell para parsear o JSON
SET "DOWNLOAD_URL="
FOR /F "usebackq tokens=*" %%L IN (`
    curl -s "https://api.github.com/repos/%GITHUB_USER%/%GITHUB_REPO%/releases/latest" ^
    ^| powershell -Command "$json = ConvertFrom-Json -InputObject $input; $json.assets | Where-Object { $_.name -eq '%RELEASE_ASSET_EXPECTED_NAME%' } | Select-Object -ExpandProperty browser_download_url"
`) DO (
    SET "DOWNLOAD_URL=%%L"
)

IF "%DOWNLOAD_URL%"=="" (
    ECHO ERRO: Nao foi possivel encontrar a URL de download para %RELEASE_ASSET_EXPECTED_NAME%.
    ECHO Certifique-se de que a release mais recente no GitHub contem este arquivo.
    ECHO Pode ser necessaria autenticacao (token) se o repositorio for privado.
    PAUSE
    GOTO :EOF
)

ECHO URL de Download encontrada: %DOWNLOAD_URL%
ECHO.
ECHO Baixando a nova versao para new_version.zip...
curl -L -o new_version.zip "%DOWNLOAD_URL%"

IF NOT EXIST new_version.zip (
    ECHO ERRO: Falha ao baixar o arquivo da release. Verifique a conexao ou o link.
    PAUSE
    GOTO :EOF
)

ECHO Arquivo baixado. Descompactando para "%APP_DIR%"...
REM Descompacta o arquivo ZIP sobrescrevendo os arquivos existentes
powershell -Command "Expand-Archive -Path 'new_version.zip' -DestinationPath '%APP_DIR%' -Force"

IF %ERRORLEVEL% NEQ 0 (
    ECHO ERRO: Falha ao descompactar a nova versao.
    ECHO Verifique se a pasta de destino esta correta e se voce tem permissoes.
    PAUSE
    GOTO :EOF
)

ECHO Limpando arquivos temporarios...
IF EXIST new_version.zip DEL new_version.zip

ECHO.
ECHO Instalando/atualizando dependencias Python (requirements.txt) no ambiente virtual...
pushd "%APP_DIR%"

REM Verifica se o ambiente virtual existe, se nao, cria
IF NOT EXIST "%VENV_DIR%\Scripts\activate" (
    ECHO Ambiente virtual nao encontrado. Criando um novo...
    python -m venv "%VENV_DIR%"
    IF %ERRORLEVEL% NEQ 0 (
        ECHO ERRO: Falha ao criar o ambiente virtual. Verifique a instalacao do Python.
        PAUSE
        popd
        GOTO :EOF
    )
    ECHO Ambiente virtual criado.
)

REM Ativa o ambiente virtual e instala as dependencias
call "%VENV_DIR%\Scripts\activate"
IF %ERRORLEVEL% NEQ 0 (
    ECHO ERRO: Falha ao ativar o ambiente virtual.
    PAUSE
    popd
    GOTO :EOF
)

pip install -r requirements.txt
IF %ERRORLEVEL% NEQ 0 (
    ECHO AVISO: Erro ao instalar dependencias Python. Isso pode causar problemas no app.
    ECHO Por favor, verifique o arquivo requirements.txt e as mensagens de erro acima.
    PAUSE
)

popd

ECHO.
ECHO ===============================================
ECHO   PARANDO INSTANCIAS ANTERIORES DO SERVIDOR...
ECHO ===============================================
REM Tenta encontrar e finalizar processos Python (python.exe e pythonw.exe)
REM que estao rodando com o titulo especifico (do nosso servidor).
REM O "nul 2>&1" esconde mensagens de sucesso/erro para uma saida mais limpa.
REM NOTA: O script 'iniciar servidor.bat' usa 'pythonw.exe'.
taskkill /F /IM python.exe /FI "WINDOWTITLE eq GeradorDePlacas_Server_BACKGROUND" > nul 2>&1
taskkill /F /IM pythonw.exe /FI "WINDOWTITLE eq GeradorDePlacas_Server_BACKGROUND" > nul 2>&1
REM Adicione uma pequena pausa para dar tempo ao sistema de finalizar os processos
timeout /t 2 /nobreak > nul

ECHO.
ECHO ===============================================
ECHO   INICIANDO O SERVIDOR COM A NOVA VERSAO...
ECHO ===============================================
REM Inicia o servidor Flask usando o script dedicado.
REM O script 'iniciar servidor.bat' ja contem a logica para usar pythonw.exe e manter em segundo plano.
REM Certifique-se de que 'iniciar servidor.bat' esteja na pasta do seu projeto (%APP_DIR%).
start "" "%APP_DIR%\iniciar servidor.bat"

ECHO.
ECHO ===============================================
ECHO   ATUALIZACAO CONCLUIDA!
ECHO ===============================================
ECHO O aplicativo deve estar rodando a nova versao.
ECHO Verifique o endereco: http://127.0.0.1:5000
ECHO.
PAUSE
ENDLOCAL