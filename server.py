import sys
import io
import os
from http.server import BaseHTTPRequestHandler, HTTPServer
from lexer import lex
from parser_clb import Parser
from interpreter import Interpreter

BASE_DIR = os.path.dirname(os.path.abspath(__file__))

STATIC_ROUTES = {
    '/': 'web/index.html',
    '/favicon.ico': 'assets/favicon.ico',
}
STATIC_DIRS = ('web', 'assets')
MIME_TYPES = {
    '.html': 'text/html; charset=utf-8',
    '.css': 'text/css; charset=utf-8',
    '.js': 'application/javascript; charset=utf-8',
    '.jpeg': 'image/jpeg',
    '.jpg': 'image/jpeg',
    '.png': 'image/png',
    '.ico': 'image/x-icon',
}

def resolve_static(url_path):
    url_path = url_path.split('?', 1)[0]
    rel = STATIC_ROUTES.get(url_path, url_path.lstrip('/'))
    full = os.path.normpath(os.path.join(BASE_DIR, rel))
    allowed = any(full.startswith(os.path.join(BASE_DIR, d) + os.sep) for d in STATIC_DIRS)
    if allowed and os.path.isfile(full):
        return full
    return None

class RequestHandler(BaseHTTPRequestHandler):
    def log_message(self, format, *args):
        pass

    def do_GET(self):
        path = resolve_static(self.path)
        if path is None:
            self.send_error(404, 'File Not Found')
            return
        with open(path, 'rb') as f:
            data = f.read()
        ext = os.path.splitext(path)[1].lower()
        self.send_response(200)
        self.send_header('Content-type', MIME_TYPES.get(ext, 'application/octet-stream'))
        self.send_header('Content-Length', str(len(data)))
        self.end_headers()
        self.wfile.write(data)

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
