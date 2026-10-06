import re
import sys

TOKENS = [
    ('START',       r'Casos\s+Bahio'),
    ('END_BLOCK',   r'Sonho\s+de\s+Valso'),
    ('TYPE_CHAR',   r'Madono'),
    ('TYPE_BOOL',   r'Boleno'),
    ('TRUE',        r'Verdado'),
    ('FALSE',       r'Mentiro'),
    ('TYPE_SHORT',  r'Linguiço|Linguico'),
    ('TYPE_INT',    r'Calabreso'),
    ('TYPE_LONG',   r'Mussarelo'),
    ('TYPE_FLOAT',  r'Tubaíno|Tubaino'),
    ('TYPE_DOUBLE', r'Salsicho'),
    ('TYPE_UNSIGNED', r'Cebolo'),
    ('PRINT',       r'Impressoro'),
    ('INPUT',       r'Samsungo'),
    ('IF',          r'Iveto\s+Sangalo'),
    ('ELSE_IF',     r'Patrício\s+Poeto|Patricio\s+Poeto'),
    ('ELSE',        r'Mato\s+Atlântico|Mato\s+Atlantico'),
    ('WHILE',       r'Rito\s+Cadilaco'),
    ('FOR',         r'Cinderelo'),
    ('CONTINUE',    r'Tilápio|Tilapio'),
    ('BREAK',       r'Borboleto'),
    ('FUNC_DEF',    r'CNPJoto'),
    ('RETURN',      r'Dipirono'),
    ('FUNC_CALL',   r'Bruno\s+Marquezino'),
    
    ('COMMENT',     r'Fofoco.*'),
    ('NUMBER',      r'\d+(\.\d+)?'),
    ('STRING',      r'".*?"'),
    ('ID',          r'[a-zA-Z_][a-zA-Z0-9_]*'),
    
    ('INC',         r'\+\+'),
    ('DEC',         r'--'),
    ('EQ',          r'=='),
    ('NEQ',         r'!='),
    ('LE',          r'<='),
    ('GE',          r'>='),
    ('LT',          r'<'),
    ('GT',          r'>'),
    ('ASSIGN',      r'='),
    ('PLUS',        r'\+'),
    ('MINUS',       r'-'),
    ('MUL',         r'\*'),
    ('DIV',         r'/'),
    ('AMPERSAND',   r'&'),
    ('COMMA',       r','),
    ('LPAREN',      r'\('),
    ('RPAREN',      r'\)'),
    ('SEMICOLON',   r';'),
    ('SKIP',        r'[ \t\n\r]+'),
    ('MISMATCH',    r'.'),
]

def lex(code):
    tok_regex = '|'.join('(?P<%s>%s)' % pair for pair in TOKENS)
    regex = re.compile(tok_regex, re.IGNORECASE)
    
    line_num = 1
    line_start = 0
    tokens = []

    for mo in regex.finditer(code):
        kind = mo.lastgroup
        value = mo.group()
        column = mo.start() - line_start
        
        if kind == 'SKIP' or kind == 'COMMENT':
            if '\n' in value:
                line_num += value.count('\n')
                line_start = mo.end()
            continue
        elif kind == 'MISMATCH':
            raise RuntimeError(f'Erro Léxico: Caractere inesperado {value!r} na linha {line_num}, coluna {column}')
        
        tokens.append({'tipo': kind, 'valor': value, 'linha': line_num, 'coluna': column})
        
    return tokens

if __name__ == '__main__':
    if len(sys.argv) < 2:
        print("Uso: python lexer.py <arquivo.clb>")
        sys.exit(1)
        
    arquivo = sys.argv[1]
    with open(arquivo, 'r', encoding='utf-8') as f:
        codigo = f.read()
        
    try:
        lista_tokens = lex(codigo)
        print(f"[{arquivo}] Tokens gerados com sucesso:")
        for t in lista_tokens:
            print(t)
    except RuntimeError as e:
        print(e)
