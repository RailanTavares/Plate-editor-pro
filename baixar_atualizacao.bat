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
    curl -s "https://api.github.com/repos/%GITHUB_USER%/%GITHUB_REPO%/releases/latest" ^| ^
    powershell -Command "$json = ConvertFrom-Json -InputObject (Get-Content -Path 'pipe:0' | Out-String); $json.assets | Where-Object { $_.name -eq '%RELEASE_ASSET_EXPECTED_NAME%' } | Select-Object -ExpandProperty browser_download_url"
`) DO (
    SET "DOWNLOAD_URL=%%L"
)

IF "%DOWNLOAD_URL%"=="" (
    ECHO ERRO: Nao foi possivel encontrar a URL de download para '%RELEASE_ASSET_EXPECTED_NAME%'.
    ECHO Certifique-se de que o nome do asset na release esta correto e o repositorio e publico.
    ECHO Para repositorios privados, pode ser necessaria autenticacao (token).
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
ECHO Instalando/atualizando dependencias Python (requirements.txt)...
pushd "%APP_DIR%"
pip install -r requirements.txt
popd

IF %ERRORLEVEL% NEQ 0 (
    ECHO AVISO: Erro ao instalar dependencias Python. Isso pode causar problemas no app.
)

ECHO.
ECHO Reiniciando o servidor Flask para aplicar as mudancas...
REM Chama o seu script existente para parar o servidor antigo e iniciar o novo
CALL "%APP_DIR%\iniciar servidor.bat"

ECHO.
ECHO ===============================================
ECHO   ATUALIZACAO CONCLUIDA COM SUCESSO!
ECHO ===============================================
ECHO.

PAUSE
ENDLOCAL