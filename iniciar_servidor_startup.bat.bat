@echo off
REM Este script e para ser colocado na pasta de inicializacao do Windows.
REM Ele ira chamar o seu script principal 'iniciar_servidor.bat' de forma minimizada.
REM A janela do CMD aparecera brevemente e depois sera minimizada na barra de tarefas.

REM *** IMPORTANTE: AJUSTE O CAMINHO ABAIXO PARA O SEU ARQUIVO 'iniciar_servidor.bat' ***
SET "PATH_TO_MAIN_SERVER_BAT=C:\Plate editor pro\iniciar_servidor.bat"

REM Inicia o servidor principal de forma minimizada.
REM O titulo vazio ("") e necessario quando o caminho do comando esta entre aspas.
start "" /min "%PATH_TO_MAIN_SERVER_BAT%"

REM O 'exit' garante que esta janela do script de inicializacao se feche apos lancar o outro script.
exit
