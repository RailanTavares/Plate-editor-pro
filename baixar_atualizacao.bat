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
SET "RELEASE_ASSET_EXPECTED_NAME=Plate-editor-pro.zip"

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

REM Obter detalhes da ultima release e salvar em um arquivo temporario
SET "TEMP_JSON_FILE=%TEMP%\github_release_data.json"
curl -s "https://api.github.com/repos/%GITHUB_USER%/%GITHUB_REPO%/releases/latest" > "%TEMP_JSON_FILE%"

REM Verificar se o arquivo JSON temporario foi criado e tem conteudo
IF NOT EXIST "%TEMP_JSON_FILE%" (
    ECHO ERRO: Falha ao obter os dados da release do GitHub.
    ECHO Verifique sua conexao com a internet ou se o repositorio/release existem.
    PAUSE
    GOTO :EOF
)

FOR /F %%Z IN ("%TEMP_JSON_FILE%") DO (
    IF %%~zZ EQU 0 (
        ECHO ERRO: O arquivo de dados da release esta vazio.
        ECHO Isso pode indicar que nao ha releases publicadas ou um problema na API do GitHub.
        PAUSE
        GOTO :EOF
    )
)

REM Extrair a URL de download do arquivo JSON temporario usando PowerShell
SET "DOWNLOAD_URL="
REM *** DEBUG TEMPORARIO: Exibir o JSON baixado e o nome do asset esperado ***
ECHO.
ECHO =========================================================
ECHO   DEBUG: Conteudo do arquivo JSON baixado do GitHub
ECHO =========================================================
TYPE "%TEMP_JSON_FILE%"
ECHO.
ECHO Nome do asset que o script esta procurando: "%RELEASE_ASSET_EXPECTED_NAME%"
ECHO =========================================================
ECHO.
PAUSE
REM *** FIM DO DEBUG TEMPORARIO ***

FOR /F "usebackq tokens=*" %%L IN (`
    powershell -Command "$json = ConvertFrom-Json (Get-Content -Raw '%TEMP_JSON_FILE%'); $asset = $json.assets | Where-Object { $_.name -eq '%RELEASE_ASSET_EXPECTED_NAME%' }; if ($asset) { $asset.browser_download_url }"
`) DO (
    SET "DOWNLOAD_URL=%%L"
)

REM Limpar arquivo JSON temporario
IF EXIST "%TEMP_JSON_FILE%" DEL "%TEMP_JSON_FILE%"

IF "%DOWNLOAD_URL%"=="" (
    ECHO ERRO: Nao foi possivel encontrar a URL de download para '%RELEASE_ASSET_EXPECTED_NAME%'.
    ECHO Verifique se o arquivo .zip com este nome foi anexado a sua ultima release publicada.
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

ECHO Arquivo baixado. Descompactando para "%APP_DIR%\"...
REM Descompacta o arquivo ZIP sobrescrevendo os arquivos existentes
powershell -Command "Expand-Archive -Path 'new_version.zip' -DestinationPath '%APP_DIR%' -Force"

IF %ERRORLEVEL% NEQ 0 (
    ECHO ERRO: Falha ao descompactar a nova versao.
    ECHO Verifique se a pasta de destino esta correta e se voce tem permissoes de escrita.
    PAUSE
    GOTO :EOF
)

ECHO Limpando arquivos temporarios...
IF EXIST new_version.zip DEL new_version.zip

ECHO.
ECHO ========================================================
ECHO   CONFIGURANDO AMBIENTE VIRTUAL E DEPENDENCIAS PYTHON
ECHO ========================================================
ECHO.

REM Navega para o diretorio do aplicativo
pushd "%APP_DIR%"

REM Verifica se o venv ja existe, se nao, cria
IF NOT EXIST "venv\Scripts\activate.bat" (
    ECHO Criando ambiente virtual (venv)...
    python -m venv venv
    IF %ERRORLEVEL% NEQ 0 (
        ECHO ERRO: Nao foi possivel criar o ambiente virtual.
        ECHO Verifique se o Python esta instalado e no PATH.
        PAUSE
        popd
        GOTO :EOF
    )
) ELSE (
    ECHO Ambiente virtual (venv) ja existe.
)

REM Ativa o ambiente virtual
CALL "venv\Scripts\activate.bat"

REM Instala/atualiza dependencias
ECHO Instalando/atualizando dependencias Python (requirements.txt)...
pip install -r requirements.txt

IF %ERRORLEVEL% NEQ 0 (
    ECHO AVISO: Erro ao instalar dependencias Python. Isso pode causar problemas no aplicativo.
    ECHO Verifique seu arquivo requirements.txt ou a conexao com a internet.
    PAUSE
) ELSE (
    ECHO Dependencias Python instaladas/atualizadas com sucesso.
)

REM Desativa o ambiente virtual (opcional, pois o script vai reiniciar o servidor)
CALL deactivate

REM Retorna ao diretorio original
popd


ECHO.
ECHO ========================================================
ECHO   REINICIANDO SERVIDOR FLASK
ECHO ========================================================
ECHO.

REM Chama o script de inicio/parada do servidor
REM O caminho deve ser ajustado se "iniciar servidor.bat" nao estiver na raiz de APP_DIR
CALL "%APP_DIR%\iniciar servidor.bat"

ECHO.
ECHO ===============================================
ECHO   ATUALIZACAO CONCLUIDA!
ECHO ===============================================
ECHO.
ECHO Por favor, verifique o aplicativo no navegador: http://127.0.0.1:5000
ECHO.
PAUSE
GOTO :EOF