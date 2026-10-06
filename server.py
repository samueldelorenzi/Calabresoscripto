import sys
import io
import os
from http.server import BaseHTTPRequestHandler, HTTPServer
from lexer import lex
from parser_clb import Parser
from interpreter import Interpreter

HTML_PAGE = """
<!DOCTYPE html>
<html lang="pt-br">
<head>
    <meta charset="UTF-8">
    <title>CalabresoScripto</title>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Bangers&family=Comic+Neue:ital,wght@0,300;0,400;0,700;1,300;1,400;1,700&display=swap" rel="stylesheet">
    <style>
        * { box-sizing: border-box; }
        
        body { 
            background-color: #0000FF; 
            color: #FFFFFF;
            font-family: 'Comic Neue', "Comic Sans MS", "Chalkboard SE", sans-serif;
            margin: 0;
            padding: 2rem;
            height: 100vh;
            display: flex;
            flex-direction: column;
            overflow: hidden;
        }

        h1 {
            font-family: 'Bangers', cursive;
            text-align: center;
            font-size: 5rem;
            color: #FFFF00; 
            text-shadow: 5px 5px 0 #FF00FF, -2px -2px 0 #00FF00;
            margin: 0 0 2rem 0;
            letter-spacing: 4px;
        }

        .workspace {
            display: flex;
            flex: 1;
            gap: 1.5rem;
            min-height: 0; 
        }

        .panel {
            display: flex;
            flex-direction: column;
        }
        
        .sidebar {
            flex: 0.8;
            max-width: 350px;
        }
        
        .editor-panel {
            flex: 2;
        }

        .output-panel {
            flex: 1.5;
        }

        .panel-label {
            font-family: 'Bangers', cursive;
            font-size: 1.8rem;
            margin-bottom: 0.5rem;
            color: #00FF00;
            text-transform: lowercase;
            letter-spacing: 2px;
        }

        textarea, .output, .dict-content {
            flex: 1;
            border: 8px ridge #CCCCCC; 
            border-radius: 0; 
            padding: 1rem;
            outline: none;
        }

        textarea {
            background-color: #FFFFFF;
            color: #000000;
            font-family: "Courier New", monospace;
            font-size: 1.25rem;
            resize: none;
        }

        .output {
            background-color: #000000; 
            color: #00FF00;
            border-color: #FF00FF;
            font-family: "Courier New", monospace;
            font-size: 1.25rem;
            overflow-y: auto;
            white-space: pre-wrap;
        }
        
        .dict-content {
            background-color: #FF00FF;
            color: #FFFF00;
            border-color: #00FFFF;
            font-size: 1.1rem;
            overflow-y: auto;
            line-height: 1.4;
        }

        .dict-content b {
            color: #FFFFFF;
            display: block;
            margin-top: 10px;
            font-size: 1.2rem;
            text-decoration: underline;
        }

        .dict-content span {
            color: #00FFFF;
        }

        .controls {
            width: 150px;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
        }

        button {
            background: none;
            border: none;
            padding: 0;
            cursor: pointer;
            transition: transform 0.2s cubic-bezier(0.175, 0.885, 0.32, 1.275);
            outline: none;
        }

        button:hover {
            transform: scale(1.15) rotate(8deg);
        }
        
        button:active {
            transform: scale(0.85) rotate(-15deg);
        }

        img.meme-btn {
            width: 100%;
            border-radius: 50%;
            border: 8px dotted #FFFF00; 
            box-shadow: 0 0 20px #FF00FF, 0 0 30px #00FFFF;
            animation: pulse 2s infinite alternate;
        }

        @keyframes pulse {
            0% { filter: hue-rotate(0deg); }
            100% { filter: hue-rotate(90deg) contrast(150%); }
        }

        .help-text {
            font-family: 'Bangers', cursive;
            text-align: center;
            margin-top: 1rem;
            font-size: 1.5rem;
            color: #FFFF00;
            text-transform: uppercase;
            animation: blink 1s step-end infinite;
            letter-spacing: 1px;
        }

        @keyframes blink { 50% { opacity: 0; } }

        /* Estilização Insana das Barras de Rolagem */
        ::-webkit-scrollbar {
            width: 24px;
            height: 24px;
        }
        ::-webkit-scrollbar-track {
            background: #FF00FF;
            border: 6px ridge #00FFFF;
        }
        ::-webkit-scrollbar-thumb {
            background: #FFFF00;
            border: 5px outset #FFFF00;
        }
        ::-webkit-scrollbar-thumb:hover {
            background: #00FF00;
            border: 5px outset #00FF00;
        }
        ::-webkit-scrollbar-corner {
            background: #0000FF;
        }
    </style>
</head>
<body>
    <h1>CalabresoScripto</h1>
    
    <div class="workspace">
        <div class="panel sidebar">
            <div class="panel-label">dicionário</div>
            <div class="dict-content">
                <b>Estrutura</b>
                Casos Bahio <span>(Início)</span><br>
                Sonho de Valso <span>(Fim/Fecha bloco)</span>
                
                <b>Tipos</b>
                Boleno <span>(bool)</span><br>
                Calabreso <span>(int)</span><br>
                Tubaíno <span>(float)</span><br>
                Madono <span>(char)</span><br>
                Mussarelo <span>(long)</span><br>
                Linguiço <span>(short)</span><br>
                Salsicho <span>(double)</span><br>
                Cebolo <span>(unsigned)</span>
                
                <b>Valores</b>
                Verdado <span>(true)</span><br>
                Mentiro <span>(false)</span>
                
                <b>Comentários</b>
                Fofoco <span>(Ignorado pelo máquino)</span>
                
                <b>I/O</b>
                Impressoro <span>(Print)</span><br>
                Samsungo <span>(Scan/Input)</span>
                
                <b>Condicionais</b>
                Iveto Sangalo <span>(if)</span><br>
                Mato Atlântico <span>(else)</span><br>
                Patrício Poeto <span>(else if)</span>
                
                <b>Loops</b>
                Rito Cadilaco <span>(while)</span><br>
                Cinderelo <span>(for)</span><br>
                Borboleto <span>(break)</span><br>
                Tilápio <span>(continue)</span>
                
                <b>Funções</b>
                CNPJoto <span>(Criar função)</span><br>
                Bruno Marquezino <span>(Chamar)</span><br>
                Dipirono <span>(return)</span>
            </div>
        </div>

        <div class="panel editor-panel">
            <div class="panel-label">código fonto</div>
            <textarea id="code" spellcheck="false">
Fofoco Esse é um comentário e será ignorado pelo máquino

CNPJoto (Calabreso SOMAR(Calabreso NumA, Calabreso NumB))
    Dipirono NumA + NumB;
Sonho de Valso

Casos Bahio
    Boleno Teste = Verdado;
    
    Iveto Sangalo (Teste == Verdado)
        Calabreso SomaAB = Bruno Marquezino SOMAR(10, 5);
        Impressoro("O RESULTADO EH %d, MEU DELICIO!", SomaAB);
    Mato Atlantico
        Impressoro("Deu ruim!");
    Sonho de Valso
Sonho de Valso
</textarea>
        </div>
        
        <div class="controls">
            <button onclick="runCode()">
                <img src="/assets/toninho-tornado.jpeg" alt="Toninho Tornado" class="meme-btn">
            </button>
            <div class="help-text">Clica pro compilaço</div>
        </div>
        
        <div class="panel output-panel">
            <div class="panel-label">saído padrão</div>
            <div id="output" class="output">Aguardando o programo, meu calabreso...</div>
        </div>
    </div>

    <script>
        async function runCode() {
            const outDiv = document.getElementById('output');
            outDiv.innerText = "Trabalhando na firmo...";
            
            try {
                const response = await fetch('/run', {
                    method: 'POST',
                    body: document.getElementById('code').value
                });
                const text = await response.text();
                outDiv.innerText = text || "O compilaço deu bom! Mas cade o Impressoro, meu mortadelo?";
            } catch(e) {
                outDiv.innerText = "Caiu a conexo! Reinicia o servidoro, meu emocionado!";
            }
        }
    </script>
</body>
</html>
"""

class RequestHandler(BaseHTTPRequestHandler):
    def log_message(self, format, *args):
        pass

    def do_GET(self):
        if self.path == '/':
            self.send_response(200)
            self.send_header('Content-type', 'text/html; charset=utf-8')
            self.end_headers()
            self.wfile.write(HTML_PAGE.encode('utf-8'))
        elif self.path == '/assets/toninho-tornado.jpeg':
            if os.path.exists('assets/toninho-tornado.jpeg'):
                with open('assets/toninho-tornado.jpeg', 'rb') as f:
                    self.send_response(200)
                    self.send_header('Content-type', 'image/jpeg')
                    self.end_headers()
                    self.wfile.write(f.read())
            else:
                self.send_error(404, 'File Not Found')
        else:
            self.send_error(404, 'File Not Found')

    def do_POST(self):
        if self.path == '/run':
            content_length = int(self.headers['Content-Length'])
            code = self.rfile.read(content_length).decode('utf-8')
            
            old_stdout = sys.stdout
            sys.stdout = my_stdout = io.StringIO()
            
            try:
                tokens = lex(code)
                parser = Parser(tokens)
                ast = parser.parse_program()
                interpreter = Interpreter(ast)
                interpreter.interpret()
            except Exception as e:
                print(f"DEU RUIM NO SINTAXO:\n{e}")
                
            sys.stdout = old_stdout
            output = my_stdout.getvalue()
            
            self.send_response(200)
            self.send_header('Content-type', 'text/plain; charset=utf-8')
            self.end_headers()
            self.wfile.write(output.encode('utf-8'))

def run(server_class=HTTPServer, handler_class=RequestHandler, port=8000):
    server_address = ('', port)
    httpd = server_class(server_address, handler_class)
    print("="*40)
    print(" Servidor iniciado com sucesso! ")
    print(f"Acesse: http://localhost:{port}")
    print("="*40)
    try:
        httpd.serve_forever()
    except KeyboardInterrupt:
        pass

if __name__ == '__main__':
    run()
