/**
 * ABSTRACT SYNTAX TREE----------------------------------------------
 */

/**
 * Types
 */
export type TyNum = { tag: 'num' }
export type TyCharseq = { tag: 'charseq' }
export type TyBool = { tag: 'bool' }
export type TyImg = { tag: 'img' }
export type TyDir = { tag: 'dir' }
export type TyMat = { tag: 'mat' }

export type Typ = TyNum | TyCharseq | TyBool | TyImg | TyDir | TyMat

/**
 * Expressions
 */
export type Num = { tag: 'num', value: number } // Num
export type Charseq = { tag: 'string', value: string } // String
export type Bool = { tag: 'bool', value: Boolean } // Boolean
export type If = { tag: 'if', e1: Exp; e2: Exp; e3: Exp } //If
export type Var = { tag: 'var', value: string } //Variable
export type Img = { tag: 'image', loc: string } //Image
export type Dir = { tag: 'dir', loc: string } // Directory
export type Mat = { tag: 'mat', value: number[][] | number }; // Matrix
export type Lam = { tag: 'lam'; param: string; typ: Typ; body: Exp } // Lambda
export type App = { tag: 'app'; head: Exp; args: Exp[] } //Application


export const evar = (value: string): Var => ({ tag: 'var', value })
export const num = (value: number): Num => ({ tag: 'num', value })
export const bool = (value: boolean): Bool => ({ tag: 'bool', value })
export const ife = (e1: Exp, e2: Exp, e3: Exp): If => ({ tag: 'if', e1, e2, e3, })
export const charseq = (str: Charseq) => ({ tag: 'charseq', str })
export const img = (loc: String) => ({ tag: 'img', loc })
export const dir = (loc: String) => ({ tag: 'dir', loc })
export const mat = (m: Mat) => ({ tag: 'mat', m })
export const lam = (param: string, typ: Typ, body: Exp): Lam => ({ tag: 'lam', param, typ, body, })
export const app = (head: Exp, args: Exp[]): App => ({ tag: 'app', head, args })

export type Exp = Var | Num | Bool | Charseq | If | Dir | Img | Mat | Lam | App

/**
 * Values
 */

export type Value = Num | Charseq | Bool | Img | Dir | Mat

/**
 * Statements
 */

export type Stmt = SDefine | SAssign | SPrint
export type SDefine = { tag: 'define'; id: string; exp: Exp }
export type SAssign = { tag: 'assign'; loc: Exp; exp: Exp }
export type SPrint = { tag: 'print'; exp: Exp }

export const sdefine = (id: string, exp: Exp): SDefine => ({ tag: 'define', id, exp, })
export const sassign = (loc: Exp, exp: Exp): SAssign => ({ tag: 'assign', loc, exp, })
export const sprint = (exp: Exp): SPrint => ({ tag: 'print', exp })

/**
 * Program
 */
export type Prog = Stmt[]