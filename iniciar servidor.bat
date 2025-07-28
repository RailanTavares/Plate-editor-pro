@echo off
REM Este script gerencia o servidor Flask para o Gerador de Placas.
REM Ele para instancias antigas e inicia uma nova em segundo plano.

REM ========================================================
REM             CONFIGURACOES DO SERVIDOR
REM ========================================================

REM Titulo da janela que sera usado para identificar e matar processos antigos
SET "WINDOW_TITLE=GeradorDePlacas_Server_BACKGROUND"

REM *** IMPORTANTE: Defina o caminho COMPLETO para a pasta onde esta seu 'app.py' ***
REM Exemplo: SET "flask_app_dir=C:\Plate editor pro"
REM Assegure-se que este caminho aponte para o diretório raiz do seu projeto Flask,
REM onde o arquivo 'app.py' está localizado.
SET "flask_app_dir=C:\Plate editor pro"


REM ========================================================
REM        PARANDO INSTANCIAS ANTERIORES DO SERVIDOR
REM ========================================================

echo ========================================================
echo   PARANDO INSTANCIAS ANTERIORES DO SERVIDOR (se houver)...
echo ========================================================

REM Tenta encontrar e finalizar processos Python (python.exe e pythonw.exe)
REM que estao rodando com o titulo especifico (do nosso servidor).
REM O "nul 2>&1" esconde mensagens de sucesso/erro para uma saida mais limpa.
taskkill /F /IM python.exe /FI "WINDOWTITLE eq %WINDOW_TITLE%" > nul 2>&1
taskkill /F /IM pythonw.exe /FI "WINDOWTITLE eq %WINDOW_TITLE%\" > nul 2>&1

REM Adicionando o kill para o nome do executavel, caso a versao compilada esteja rodando.
taskkill /F /IM GeradorPlacasSupermercado.exe > nul 2>&1

REM Pequena pausa de 2 segundos para garantir que os processos tenham tempo de terminar.
timeout /t 2 /nobreak > nul

echo.


REM ========================================================
REM        INICIANDO O SERVIDOR EM SEGUNDO PLANO
REM ========================================================

echo ========================================================
echo   INICIANDO O SERVIDOR DO GERADOR DE PLACAS EM SEGUNDO PLANO...
echo ========================================================

REM Navega para o diretorio do aplicativo.
REM 'pushd' muda o diretorio e guarda o caminho atual para 'popd' retornar depois.
pushd "%flask_app_dir%"

IF %ERRORLEVEL% NEQ 0 (
    echo ERRO: Nao foi possivel acessar o diretorio "%flask_app_dir%".
    echo Por favor, verifique se o caminho esta correto e existe.
    pause
    goto :eof
)

REM Inicia o servidor Flask em uma nova janela (invisivel) usando 'start' e definindo o titulo.
REM Usamos 'pythonw.exe' para que NENHUMA janela de console Python apareca.
start "%WINDOW_TITLE%" pythonw.exe app.py

REM Retorna ao diretorio original onde o script .bat foi executado.
popd

echo.


REM ========================================================
REM             INFORMACOES IMPORTANTES
REM ========================================================

echo ========================================================
echo   SERVIDOR INICIADO EM SEGUNDO PLANO.
echo ========================================================
echo.
echo O aplicativo deve estar rodando.
echo Abra seu navegador e acesse o endereco:
echo.
echo    http://127.0.0.1:5000
echo.
echo ========================================================
echo   Para DESLIGAR o servidor:
echo   1. Execute este mesmo script novamente (ele vai parar o processo ativo).
echo   2. Ou use o Gerenciador de Tarefas para finalizar 'pythonw.exe'
echo      ou 'GeradorPlacasSupermercado.exe' (se a versao compilada estiver ativa).
echo ========================================================

pause