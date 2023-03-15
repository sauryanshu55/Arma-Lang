/**
 * Expressions
 */

export type Num={tag:'num', value: number}
export type Charseq={tag:'string',value:string}
export type Bool={tag:'bool', value:Boolean}
export type If = { tag: 'if', e1: Exp; e2: Exp; e3: Exp }
export type Var = { tag: 'var', value: string }
export type Img={tag:'image', value:Ext}
export type Dir={tag:'dir', value:Ext}
export type Matrix = number[][] |number;

export const evar = (value: string): Var => ({ tag: 'var', value })
export const num = (value: number): Num => ({ tag: 'num', value })
export const bool = (value: boolean): Bool => ({ tag: 'bool', value })
export const ife = (e1: Exp, e2: Exp, e3: Exp): If => ({tag: 'if',e1,e2,e3,})
export const charseq=(str:Charseq)=>({tag:'charseq',str})
export const img=(img:Img)=>({tag:'img',img})
export const dir=(img:Img)=>({tag:'dir',img})
  
// Directory datatype and Image datatypes are Ext Types, External DataTypes
export type Ext=Dir|Img
export type Exp=Var|Num|Bool|Charseq|If |Ext
