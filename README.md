<h1 align="center">Plate Editor Pro</h1>

<p align="center">
  <img src="logo.png" width="180"/>
</p>
 
É uma aplicação web local desenvolvida em Flask (Python), HTML, CSS e JavaScript, projetada para facilitar a criação rápida e personalizável de placas de ofertas para supermercados. Ele permite aos usuários gerenciar informações de produtos, preços e detalhes de contato, além de exportar as placas em formatos PNG e PDF. Esta solução foi criada para otimizar o processo de comunicação visual e a agilidade na atualização de promoções.

---
## Modelos
<p align="center">
  <img src="placa_1.png" width="250"/> <img src="placa_2.png" width="250"/>
</p>

# 🚀 Instalação e Execução
Siga os passos abaixo para instalar e rodar a aplicação no seu computador.

Pré-requisitos
Certifique-se de ter o Python instalado em seu sistema. Você pode baixá-lo do site oficial do Python. Recomendamos usar a versão 3.6 ou superior.

# Passo 1: Baixe o Projeto para o Diretório Padrão
Para que a aplicação funcione corretamente com os scripts de inicialização, é crucial que você baixe o projeto e coloque a pasta principal **Plate editor pro** diretamente na raiz do seu disco C:.

O caminho final da pasta do projeto deve ser exatamente este:
**C:\Plate editor pro**

Baixe ou Clone o repositório do Git diretamente para o seu disco C:

se preferir, faça o Downloads o arquivo ZIP do GitHub e descompacte-o, garantindo que a pasta **Plate editor pro** resultante esteja em C:\.

# Passo 2: Instale as Dependências
Navegue até a pasta do projeto e execute o script de instalação. Este script vai instalar todas as bibliotecas Python necessárias listadas no arquivo requirements.txt.

Abra a pasta C:\Plate editor pro e execute o arquivo instalar_bibliotecas.bat.

instalar_bibliotecas.bat
caso preferir, se você estiver em outro sistema operacional ou preferir fazer manualmente, abra o terminal na pasta do projeto e execute o seguinte comando:

**pip install -r requirements.txt**

# Passo 3: Inicie o Servidor
Para iniciar a aplicação, você pode usar os scripts de conveniência fornecidos.

**Opção 1:** Início Simples (Recomendado para uso geral)
Execute o arquivo iniciar **servidor.bat** Ele vai parar qualquer instância anterior do servidor e iniciar uma nova em segundo plano.

iniciar servidor.bat

**Opção 2:** Início Silencioso (Sem janelas visíveis)
Se você não quiser ver nenhuma janela de terminal, execute o script IniciarServidorSilencioso.vbs. Este script iniciará a aplicação completamente em segundo plano.

IniciarServidorSilencioso.vbs
Observação:

Para desligar o servidor, execute o arquivo iniciar servidor.bat novamente ou use o Gerenciador de Tarefas para finalizar o processo pythonw.exe.


**Passo 4: Acesse a Aplicação**

Para acessar usar o programa, você pode ir ate a pasta **icon** no diretorio do programa a copiar o atalho para a área de trabalho

Você verá a interface do Plate editor pro!


**Início Automático com o Windows**
Para que a aplicação inicie automaticamente sempre que o Windows for ligado, você pode colocar o atalho do script de inicialização na pasta Startup.


Pressione Windows + R, digite **shell:startup** e pressione Enter.

Copie o arquivo iniciar_servidor_startup.bat.bat e cole-o nesta pasta que se abriu.

Pronto! Na próxima vez que o sistema for reiniciado, o servidor será iniciado automaticamente em segundo plano.

# 😃 Boa sorte!!

