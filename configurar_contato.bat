@echo off
REM Este script permite configurar ou atualizar as informacoes de contato
REM (Telefone, Endereco, Instagram) no arquivo .env.
REM Este .env agora e lido pelo aplicativo Flask.

SETLOCAL

REM Define a codificacao do console para UTF-8. Crucial para arquivos .env.
chcp 65001 > nul

SET "script_dir=%~dp0"
REM O .env deve estar na mesma pasta do app.py, que é um nível acima do script
SET "env_file=%script_dir%..\\.env"
REM Se o app.py estiver na pasta "Plate editor pro" e o script .bat na raiz:
REM SET "env_file=%script_dir%app.py\\.env" (se .bat estiver fora da pasta raiz do app.py)
REM ou se o .bat estiver dentro da pasta raiz:
REM SET "env_file=%script_dir%.env"

echo ========================================================
echo   CONFIGURADOR DE INFORMACOES DE CONTATO
echo ========================================================
echo.
echo As informacoes de contato sao armazenadas no arquivo: %env_file%
echo Este arquivo e lido pelo aplicativo principal.
echo.

REM Verifica se o arquivo .env existe. Se nao, informa que sera criado/atualizado.
if not exist "%env_file%" (
    echo ATENCAO: O arquivo .env nao foi encontrado no diretorio do executavel!
    echo Ele sera criado ou atualizado com as novas informacoes.
    echo.
)

:GET_TELEFONE
set /p NEW_TELEFONE="Digite o NOVO Telefone/WhatsApp (Ex: (89) 98803-0512): "
if "%NEW_TELEFONE%"=="" (
    echo O telefone nao pode ser vazio. Por favor, digite um valor.
    goto GET_TELEFONE
)

:GET_ENDERECO
set /p NEW_ENDERECO="Digite o NOVO Endereco (Ex: Rua Desembargador Amaral, 2037 - Centro): "
if "%NEW_ENDERECO%"=="" (
    echo O endereco nao pode ser vazio. Por favor, digite um valor.
    goto GET_ENDERECO
)

:GET_INSTAGRAM
set /p NEW_INSTAGRAM="Digite o NOVO Instagram (Ex: @fonsecasupermercado.corrente): "
if "%NEW_INSTAGRAM%"=="" (
    echo O Instagram nao pode ser vazio. Por favor, digite um valor.
    goto GET_INSTAGRAM
)

echo.
echo Configurando informacoes de contato...
echo.

REM Para garantir que o diretorio do .env exista
REM Assumindo que o .env está na mesma pasta que o app.py, que é o diretório pai deste script
if not exist "%script_dir%..\" mkdir "%script_dir%..\"

REM Usa findstr para remover linhas antigas e garantir que apenas as novas sejam escritas.
REM Remove apenas as linhas especificas para APP_TELEFONE, APP_ENDERECO, APP_INSTAGRAM.
(for /f "delims=" %%a in ('type "%env_file%" 2^>nul ^| findstr /v /b /c:"APP_TELEFONE=" /c:"APP_ENDERECO=" /c:"APP_INSTAGRAM="') do @echo %%a)>"%env_file%.tmp"

REM Adiciona as novas informacoes ao arquivo temporario
echo APP_TELEFONE=%NEW_TELEFONE%>>"%env_file%.tmp"
echo APP_ENDERECO=%NEW_ENDERECO%>>"%env_file%.tmp"
echo APP_INSTAGRAM=%NEW_INSTAGRAM%>>"%env_file%.tmp"

REM Move o arquivo temporario para sobrescrever o .env original
move /y "%env_file%.tmp" "%env_file%" >nul

echo Informacoes de contato configuradas com sucesso!
echo.
echo ========================================================
echo   ATENCAO: Para que as alteracoes tenham efeito,
echo   voce precisara REINICIAR o servidor Flask.
echo   Execute o script 'iniciar_servidor.bat' novamente.
echo ========================================================

pause

ENDLOCAL