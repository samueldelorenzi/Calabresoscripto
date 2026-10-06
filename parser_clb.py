import sys
from lexer import lex

class ASTNode: pass

class Program(ASTNode):
    def __init__(self, funcs, main):
        self.funcs = funcs
        self.main = main

class FuncDef(ASTNode):
    def __init__(self, return_type, name, params, body):
        self.return_type = return_type
        self.name = name
        self.params = params
        self.body = body

class VarDecl(ASTNode):
    def __init__(self, var_type, name, expr):
        self.var_type = var_type
        self.name = name
        self.expr = expr

class Assign(ASTNode):
    def __init__(self, name, expr):
        self.name = name
        self.expr = expr

class If(ASTNode):
    def __init__(self, condition, true_block, else_block):
        self.condition = condition
        self.true_block = true_block
        self.else_block = else_block

class While(ASTNode):
    def __init__(self, condition, body):
        self.condition = condition
        self.body = body

class For(ASTNode):
    def __init__(self, init, condition, step, body):
        self.init = init
        self.condition = condition
        self.step = step
        self.body = body

class Print(ASTNode):
    def __init__(self, string, args):
        self.string = string
        self.args = args

class Return(ASTNode):
    def __init__(self, expr):
        self.expr = expr

class FuncCall(ASTNode):
    def __init__(self, name, args):
        self.name = name
        self.args = args

class BinOp(ASTNode):
    def __init__(self, left, op, right):
        self.left = left
        self.op = op
        self.right = right

class UnaryOp(ASTNode):
    def __init__(self, op, expr):
        self.op = op
        self.expr = expr

class Boolean(ASTNode):
    def __init__(self, value):
        self.value = value

class Number(ASTNode):
    def __init__(self, value):
        self.value = value

class Identifier(ASTNode):
    def __init__(self, name):
        self.name = name

class Parser:
    def __init__(self, tokens):
        self.tokens = tokens
        self.pos = 0

    def current(self):
        if self.pos < len(self.tokens):
            return self.tokens[self.pos]
        return None

    def match(self, token_type):
        tok = self.current()
        if tok and tok['tipo'] == token_type:
            self.pos += 1
            return tok
        tok_name = tok['tipo'] if tok else 'EOF'
        linha = tok['linha'] if tok else '?'
        raise SyntaxError(f"Erro Sintático [Linha {linha}]: Esperava '{token_type}', encontrou '{tok_name}'")

    def peek(self, token_type):
        tok = self.current()
        return tok and tok['tipo'] == token_type

    def parse_program(self):
        funcs = []
        main_block = []
        while self.current():
            if self.peek('FUNC_DEF'):
                funcs.append(self.parse_func_def())
            elif self.peek('START'):
                self.match('START')
                main_block = self.parse_block()
                break
            else:
                tok = self.current()
                raise SyntaxError(f"Erro Sintático [Linha {tok['linha']}]: Programa deve começar com CNPJoto ou Casos Bahio.")
        return Program(funcs, main_block)

    def parse_func_def(self):
        self.match('FUNC_DEF')
        self.match('LPAREN')
        ret_type = self.current()['valor']
        self.pos += 1
        name = self.match('ID')['valor']
        self.match('LPAREN')
        
        params = []
        if not self.peek('RPAREN'):
            ptype = self.current()['valor']
            self.pos += 1
            pname = self.match('ID')['valor']
            params.append((ptype, pname))
            while self.peek('COMMA'):
                self.match('COMMA')
                ptype = self.current()['valor']
                self.pos += 1
                pname = self.match('ID')['valor']
                params.append((ptype, pname))
        
        self.match('RPAREN')
        self.match('RPAREN')
        
        body = self.parse_block()
        return FuncDef(ret_type, name, params, body)

    def parse_block(self):
        statements = []
        while self.current() and not self.peek('END_BLOCK') and not self.peek('ELSE') and not self.peek('ELSE_IF'):
            statements.append(self.parse_statement())
        
        if self.peek('END_BLOCK'):
            self.match('END_BLOCK')
            
        return statements

    def parse_statement(self):
        tok = self.current()
        if tok['tipo'] in ['TYPE_INT', 'TYPE_FLOAT', 'TYPE_CHAR', 'TYPE_DOUBLE', 'TYPE_LONG', 'TYPE_SHORT', 'TYPE_UNSIGNED', 'TYPE_BOOL']:
            return self.parse_var_decl()
        elif tok['tipo'] == 'ID':
            return self.parse_assign_or_call()
        elif tok['tipo'] == 'IF':
            return self.parse_if()
        elif tok['tipo'] == 'WHILE':
            return self.parse_while()
        elif tok['tipo'] == 'FOR':
            return self.parse_for()
        elif tok['tipo'] == 'PRINT':
            return self.parse_print()
        elif tok['tipo'] == 'RETURN':
            return self.parse_return()
        elif tok['tipo'] == 'COMMENT':
            self.match('COMMENT')
            return self.parse_statement()
        else:
            raise SyntaxError(f"Comando inválido na linha {tok['linha']}: {tok['valor']}")

    def parse_var_decl(self):
        var_type = self.current()['valor']
        self.pos += 1
        name = self.match('ID')['valor']
        expr = None
        if self.peek('ASSIGN'):
            self.match('ASSIGN')
            expr = self.parse_expr()
        self.match('SEMICOLON')
        return VarDecl(var_type, name, expr)

    def parse_assign_or_call(self):
        name = self.match('ID')['valor']
        
        if self.peek('ASSIGN'):
            self.match('ASSIGN')
            expr = self.parse_expr()
            self.match('SEMICOLON')
            return Assign(name, expr)
        elif self.peek('INC'):
            self.match('INC')
            self.match('SEMICOLON')
            return Assign(name, BinOp(Identifier(name), '+', Number(1)))
        elif self.peek('DEC'):
            self.match('DEC')
            self.match('SEMICOLON')
            return Assign(name, BinOp(Identifier(name), '-', Number(1)))
        else:
            raise SyntaxError(f"Atribuição inválida para {name}")

    def parse_if(self):
        self.match('IF')
        self.match('LPAREN')
        cond = self.parse_expr()
        self.match('RPAREN')
        true_block = self.parse_block()
        else_block = None
        if self.peek('ELSE'):
            self.match('ELSE')
            else_block = self.parse_block()
        return If(cond, true_block, else_block)

    def parse_while(self):
        self.match('WHILE')
        self.match('LPAREN')
        cond = self.parse_expr()
        self.match('RPAREN')
        body = self.parse_block()
        return While(cond, body)

    def parse_for(self):
        self.match('FOR')
        self.match('LPAREN')
        
        init_id = self.match('ID')['valor']
        self.match('ASSIGN')
        init_expr = self.parse_expr()
        init = Assign(init_id, init_expr)
        self.match('SEMICOLON')
        
        cond = self.parse_expr()
        self.match('SEMICOLON')
        
        step_id = self.match('ID')['valor']
        if self.peek('INC'):
            self.match('INC')
            step = Assign(step_id, BinOp(Identifier(step_id), '+', Number(1)))
        elif self.peek('DEC'):
            self.match('DEC')
            step = Assign(step_id, BinOp(Identifier(step_id), '-', Number(1)))
        self.match('RPAREN')
        
        body = self.parse_block()
        return For(init, cond, step, body)

    def parse_print(self):
        self.match('PRINT')
        self.match('LPAREN')
        string = self.match('STRING')['valor']
        args = []
        while self.peek('COMMA'):
            self.match('COMMA')
            args.append(self.parse_expr())
        self.match('RPAREN')
        self.match('SEMICOLON')
        return Print(string, args)

    def parse_return(self):
        self.match('RETURN')
        expr = self.parse_expr()
        self.match('SEMICOLON')
        return Return(expr)

    def parse_expr(self):
        return self.parse_comparison()

    def parse_comparison(self):
        left = self.parse_term()
        while self.current() and self.current()['tipo'] in ['EQ', 'NEQ', 'LT', 'GT', 'LE', 'GE']:
            op = self.current()['valor']
            self.pos += 1
            right = self.parse_term()
            left = BinOp(left, op, right)
        return left

    def parse_term(self):
        left = self.parse_factor()
        while self.current() and self.current()['tipo'] in ['PLUS', 'MINUS']:
            op = self.current()['valor']
            self.pos += 1
            right = self.parse_factor()
            left = BinOp(left, op, right)
        return left

    def parse_factor(self):
        left = self.parse_primary()
        while self.current() and self.current()['tipo'] in ['MUL', 'DIV']:
            op = self.current()['valor']
            self.pos += 1
            right = self.parse_primary()
            left = BinOp(left, op, right)
        return left

    def parse_primary(self):
        tok = self.current()
        if tok['tipo'] == 'NUMBER':
            self.pos += 1
            return Number(float(tok['valor']) if '.' in str(tok['valor']) else int(tok['valor']))
        elif tok['tipo'] == 'TRUE':
            self.pos += 1
            return Boolean(True)
        elif tok['tipo'] == 'FALSE':
            self.pos += 1
            return Boolean(False)
        elif tok['tipo'] == 'ID':
            self.pos += 1
            return Identifier(tok['valor'])
        elif tok['tipo'] == 'LPAREN':
            self.match('LPAREN')
            expr = self.parse_expr()
            self.match('RPAREN')
            return expr
        elif tok['tipo'] == 'FUNC_CALL':
            self.match('FUNC_CALL')
            name = self.match('ID')['valor']
            self.match('LPAREN')
            args = []
            if not self.peek('RPAREN'):
                args.append(self.parse_expr())
                while self.peek('COMMA'):
                    self.match('COMMA')
                    args.append(self.parse_expr())
            self.match('RPAREN')
            return FuncCall(name, args)
        else:
            raise SyntaxError(f"Esperava expressão na linha {tok['linha']}, encontrou {tok['valor']}")
