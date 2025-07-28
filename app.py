# -*- coding: utf-8 -*-
# Este arquivo acima declara que o arquivo esta codificado em UTF-8.
# E crucial que seja a primeira linha e que o arquivo seja salvo como UTF-8.

# Importa o modulo Flask e outras funcoes necessarias do Flask
import os # Importa o modulo 'os' para lidar com caminhos de arquivo
from flask import Flask, render_template, request, redirect, url_for, send_from_directory, jsonify
from dotenv import load_dotenv, set_key # Importa a funcao load_dotenv e set_key para carregar/salvar variaveis de ambiente

# Carrega as variaveis de ambiente do arquivo .env
load_dotenv()

# Cria uma instancia da aplicacao Flask
# Especifica o diretorio de templates como 'templates' (onde index.html deve estar)
# e o diretorio de arquivos estaticos como 'static'
app = Flask(__name__, template_folder='templates', static_folder='static')

# Define o caminho para o arquivo .env
# É importante que esta variável de ambiente seja lida para o local correto
# No ambiente de produção, este caminho pode precisar ser ajustado.
# Assumimos que o .env está na mesma pasta do app.py
DOTENV_PATH = os.path.join(os.path.dirname(__file__), '.env')

# Define a rota principal para a pagina inicial (login e editor)
# Esta rota sera acessada quando o usuario navegar para a URL base (ex: http://127.0.0.1:5000/)
@app.route('/')
def index():
    """
    Renderiza a pagina inicial (index.html).
    Este e o ponto de entrada que contem tanto o login quanto o editor.
    A logica de exibicao da tela de boas-vindas/editor e controlada pelo JavaScript no lado do cliente.
    """
    return render_template('index.html')

# Rota para servir arquivos estaticos (CSS, JavaScript)
# Nao e estritamente necessario se voce usar a convencao de pastas 'static',
# mas e bom ter para controle explicito ou para servir arquivos de subdiretorios.
@app.route('/static/<path:filename>')
def static_files(filename):
    """
    Serve arquivos estaticos do diretorio 'static'.
    Ex: /static/style.css, /static/script.js
    """
    return send_from_directory(app.static_folder, filename)

# REMOVIDA: A rota '/verify_serial' e toda a logica de serial foram removidas.

# ROTA EXISTENTE: Endpoint para obter informacoes de contato
@app.route('/get_contact_info', methods=['GET'])
def get_contact_info():
    """
    Retorna as informacoes de contato (telefone, endereco, instagram)
    lidas do arquivo .env.
    """
    # Usamos os.getenv para ler as variáveis de ambiente.
    # Fornecemos valores padrão caso as variáveis não existam no .env
    telefone = os.getenv('APP_TELEFONE', '(89) 98803-0512')
    endereco = os.getenv('APP_ENDERECO', 'Rua Desembargador Amaral, 2037 - Centro')
    instagram = os.getenv('APP_INSTAGRAM', '@fonsecasupermercado.corrente')

    return jsonify({
        "telefone": telefone,
        "endereco": endereco,
        "instagram": instagram
    })

# NOVA ROTA: Endpoint para salvar informacoes de contato
@app.route('/save_contact_info', methods=['POST'])
def save_contact_info():
    """
    Recebe as informacoes de contato do cliente e as salva no arquivo .env.
    Retorna uma resposta JSON indicando sucesso ou falha.
    """
    data = request.get_json() # Obtem os dados JSON enviados na requisicao
    telefone = data.get('telefone')
    endereco = data.get('endereco')
    instagram = data.get('instagram')

    if not all([telefone, endereco, instagram]):
        # AQUI: Modificação da string para remover caracteres acentuados
        return jsonify({"success": False, "message": "Todos os campos de contato sao obrigatorios."}), 400

    try:
        # Usa set_key para atualizar ou adicionar as variáveis no arquivo .env
        set_key(DOTENV_PATH, 'APP_TELEFONE', telefone)
        set_key(DOTENV_PATH, 'APP_ENDERECO', endereco)
        set_key(DOTENV_PATH, 'APP_INSTAGRAM', instagram)

        # Recarrega as variáveis de ambiente após a modificação do .env
        # para que o servidor Flask (se estiver em debug ou reiniciado) as utilize
        load_dotenv(override=True) # override=True garante que os novos valores substituam os antigos

        return jsonify({"success": True, "message": "Informacoes de contato salvas com sucesso."})
    except Exception as e:
        print(f"Erro ao salvar informacoes no .env: {e}")
        return jsonify({"success": False, "message": f"Erro interno ao salvar informacoes: {str(e)}"}), 500

# Esta rota nao sera mais usada para "gerar placa" como em um exemplo simples,
# pois toda a logica de geracao e exportacao esta no JavaScript do index.html.
# No entanto, se houver necessidade de processamento no servidor no futuro,
# esta rota pode ser adaptada.
@app.route('/generate_plate', methods=['POST'])
def generate_plate():
    # Esta funcao pode ser adaptada para, por exemplo, salvar dados de placas no servidor,
    # ou gerar PDFs/imagens no backend se o html2canvas nao for suficiente em alguns casos.
    # Por enquanto, redireciona para a pagina principal.
    return redirect(url_for('index'))

# Garante que o servidor Flask so seja executado quando o script for executado diretamente
if __name__ == '__main__':
    # Ativa o modo de depuracao para facilitar o desenvolvimento (recarrega o servidor
    # automaticamente ao detectar mudancas no codigo e mostra erros detalhados).
    # Defina debug=False em ambiente de producao.
    app.run(debug=True)