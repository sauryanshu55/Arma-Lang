/** A `Tok` is a semantically meaningful chunk of text. */
export type Tok = string

/** A `Lexer` statefully transforms an input string into a list of tokens. */
export class Lexer {
  private pos: number
  private readonly src: string

  /** Constructs a new `Lexer` from the given `src` string. */
  constructor (src: string) {
    this.pos = 0
    this.src = src
  }

  /** @returns true if the lexer has exhausted its input. */
  empty (): boolean {
    return this.pos >= this.src.length
  }

  /** @returns the next character of the input. */
  private peek (): string {
    if (this.empty()) {
      throw new Error('Lexer error: unexpected end of input while lexing.')
    } else {
      return this.src[this.pos]
    }
  }

  /** Advances the tokenizer forward one character. */
  private advance (): void { this.pos += 1 }

  /**
   * Retrieves the current character and advances the tokenizer forward one
   * character.
   */
  private chomp (): string {
    return this.src[this.pos++]
  }

  /** @return the next `Tok` from this lexer's source string. */
  private lex1 (): Tok {
    const leader = this.peek()
    if (leader === '(' || leader === ')') {
      const ret = this.chomp()
      this.whitespace()
      return ret
    } else {
      // N.B., identifiers are non-parentheses chunks of text
      let chk = this.chomp()
      while (!this.empty() && /\S/.test(this.peek()) && this.peek() !== '(' && this.peek() !== ')') {
        chk += this.chomp()
      }
      this.whitespace()
      return chk
    }
  }

  /**
   * Consumes leading whitespace in the input up until the next non-whitespace
   * character.
   */
  whitespace (): void {
    while (!this.empty() && /\s/.test(this.peek())) { this.advance() }
  }

  /** @returns a list of tokens lexed from this lexer's source string. */
  tokenize (): Tok[] {
    const ret: Tok[] = []
    this.whitespace()
    while (!this.empty()) {
      ret.push(this.lex1())
    }
    return ret
  }
}

/** *** S-expression Datatypes *************************************************/

/** An `Atom` is a non-delineating chunk of text. */
export interface Atom { tag: 'atom', value: string }
const atom = (value: string): Sexp => ({ tag: 'atom', value })

/** A `SList` is a list of s-expressions. */
export interface SList { tag: 'slist', exps: Sexp [] }
const slist = (exps: Sexp[]): Sexp => ({ tag: 'slist', exps })

/** An s-expression is either an `Atom` of a list of s-expressions, a `SList`. */
export type Sexp = Atom | SList

/** @returns a string representation of `Sexp` `e`. */
export function sexpToString (e: Sexp): string {
  if (e.tag === 'atom') {
    return e.value
  } else {
    return `(${e.exps.map(sexpToString).join(' ')})`
  }
}

/** *** S-expression Parsing ***************************************************/

/**
 * A `Parser` statefully transforms a list of tokens into a s-expression
 * or a collection of s-expressions.
 */
class Parser {
  private pos: number
  private readonly toks: Tok[]

  constructor (toks: Tok[]) {
    this.pos = 0
    this.toks = toks
  }

  /** @returns true if the parser has exhausted its input. */
  empty (): boolean {
    return this.pos >= this.toks.length
  }

  /** @returns the next token of the input. */
  peek (): Tok {
    if (this.empty()) {
      throw new Error('Parser error: unexpected end of input while parsing.')
    } else {
      return this.toks[this.pos]
    }
  }

  /** Advances the parser one token forward. */
  advance (): void { this.pos += 1 }

  /** Returns the current token and advances the parser forward. */
  chomp (): Tok {
    return this.toks[this.pos++]
  }

  /** @returns the next `Sexp` parsed from the input. */
  parse1 (): Sexp {
    const head = this.peek()
    if (head === '(') {
      // N.B., move past the '('
      this.advance()
      if (this.empty()) {
        throw new Error('Parser error: unexpected end of input while parsing.')
      }
      const ret: Sexp[] = []
      while (this.peek() !== ')') {
        ret.push(this.parse1())
      }
      // N.B., move past the ')'
      this.advance()
      return slist(ret)
    } else if (head === ')') {
      throw new Error('Parser error: unexpected close parentheses encountered.')
    } else {
      return atom(this.chomp())
    }
  }

  /** @return the collection of `Sexp`s parsed from the input. */
  parse (): Sexp[] {
    const ret: Sexp[] = []
    while (!this.empty()) {
      ret.push(this.parse1())
    }
    return ret
  }
}

/** @returns a single sexp */
export function parse1 (src: string): Sexp {
  const parser = new Parser(new Lexer(src).tokenize())
  const result = parser.parse1()
  if (parser.empty()) {
    return result
  } else {
    throw new Error(`Parse error: input not completely consumed: '${parser.peek()}'`)
  }
}

/** @returns a list of Sexps parsed from the input source string. */
export function parse (src: string): Sexp[] {
  const parser = new Parser(new Lexer(src).tokenize())
  const result = parser.parse()
  if (parser.empty()) {
    return result
  } else {
    throw new Error(`Parse error: input not completely consumed: '${parser.peek()}'`)
  }
}
