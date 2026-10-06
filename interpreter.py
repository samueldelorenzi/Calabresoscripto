import sys
from lexer import lex
from parser_clb import Parser, Program, VarDecl, Assign, If, While, For, Print, FuncCall, BinOp, Number, Identifier, Return, FuncDef, Boolean

class BreakException(Exception): pass
class ContinueException(Exception): pass
class ReturnException(Exception):
    def __init__(self, value):
        self.value = value

class Environment:
    def __init__(self, parent=None):
        self.vars = {}
        self.funcs = {}
        self.parent = parent

    def declare(self, name, value):
        self.vars[name] = value

    def assign(self, name, value):
        if name in self.vars:
            self.vars[name] = value
            return
        if self.parent:
            self.parent.assign(name, value)
            return
        raise Exception(f"Erro de Execução: Variável '{name}' não foi declarada, Iveto!")

    def get(self, name):
        if name in self.vars:
            return self.vars[name]
        if self.parent:
            return self.parent.get(name)
        raise Exception(f"Erro de Execução: Variável '{name}' não foi declarada, Saboneto!")

    def declare_func(self, name, node):
        self.funcs[name] = node

    def get_func(self, name):
        if name in self.funcs:
            return self.funcs[name]
        if self.parent:
            return self.parent.get_func(name)
        raise Exception(f"Erro de Execução: A função '{name}' não existe, chamou o Bruno Marquezino atoa!")

class Interpreter:
    def __init__(self, ast):
        self.ast = ast
        self.global_env = Environment()

    def interpret(self):
        try:
            self.visit(self.ast, self.global_env)
        except Exception as e:
            print(f"\n[FALHA NO CALABRESOSCRIPTO] {e}")

    def visit(self, node, env):
        if isinstance(node, Program):
            for func in node.funcs:
                env.declare_func(func.name, func)
            self.visit_block(node.main, env)

        elif isinstance(node, VarDecl):
            val = self.visit(node.expr, env) if node.expr else 0
            env.declare(node.name, val)

        elif isinstance(node, Assign):
            val = self.visit(node.expr, env)
            env.assign(node.name, val)

        elif isinstance(node, If):
            cond = self.visit(node.condition, env)
            if cond:
                self.visit_block(node.true_block, Environment(env))
            elif node.else_block:
                self.visit_block(node.else_block, Environment(env))

        elif isinstance(node, While):
            while self.visit(node.condition, env):
                try:
                    self.visit_block(node.body, Environment(env))
                except BreakException:
                    break
                except ContinueException:
                    continue

        elif isinstance(node, For):
            loop_env = Environment(env)
            self.visit(node.init, loop_env)
            while self.visit(node.condition, loop_env):
                try:
                    self.visit_block(node.body, Environment(loop_env))
                except BreakException:
                    break
                except ContinueException:
                    pass
                self.visit(node.step, loop_env)

        elif isinstance(node, FuncCall):
            func_node = env.get_func(node.name)
            func_env = Environment(self.global_env)
            
            if len(node.args) != len(func_node.params):
                raise Exception(f"A função '{node.name}' esperava {len(func_node.params)} argumentos, mas recebeu {len(node.args)}")
            
            for param_decl, arg_expr in zip(func_node.params, node.args):
                param_name = param_decl[1]
                func_env.declare(param_name, self.visit(arg_expr, env))
                
            try:
                self.visit_block(func_node.body, func_env)
            except ReturnException as ret:
                return ret.value
            return 0

        elif isinstance(node, Return):
            val = self.visit(node.expr, env)
            raise ReturnException(val)

        elif isinstance(node, Print):
            string = node.string.strip('"')
            string = string.replace('\\n', '\n')
            args = [self.visit(arg, env) for arg in node.args]
            
            if args:
                try:
                    output = string % tuple(args)
                    print(output)
                except Exception:
                    print(string, *args)
            else:
                print(string)

        elif isinstance(node, BinOp):
            l = self.visit(node.left, env)
            r = self.visit(node.right, env)
            if node.op == '+': return l + r
            if node.op == '-': return l - r
            if node.op == '*': return l * r
            if node.op == '/': return l / r
            if node.op == '==': return l == r
            if node.op == '!=': return l != r
            if node.op == '>': return l > r
            if node.op == '<': return l < r
            if node.op == '>=': return l >= r
            if node.op == '<=': return l <= r

        elif isinstance(node, Boolean):
            return node.value

        elif isinstance(node, Number):
            return node.value

        elif isinstance(node, Identifier):
            return env.get(node.name)

    def visit_block(self, block, env):
        for stmt in block:
            self.visit(stmt, env)
