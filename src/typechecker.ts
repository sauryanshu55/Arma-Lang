import * as L from './lang';

export function typecheck(e: L.Exp): L.Typ {
  switch (e.tag) {
    case 'num':
      return L.tynat;
    case 'plus':
      const t1 = typecheck(e.e1);
      const t2 = typecheck(e.e2);
      if (t1 === L.tynat && t2 === L.tynat) {
        return L.tynat;
      } else {
        throw new Error(`Invalid addition types`);
      }
    case 'bool':
      return L.tybool;
    case 'and':
      const t3 = typecheck(e.e1);
      const t4 = typecheck(e.e2);
      if ((t3 === L.tybool && t4 === L.tybool) || (t3 === L.tynat && t4 === L.tynat)) {
        return L.tybool;
      } else {
        throw new Error(`Invalid and types`);
      }
    case 'or':
      const t5 = typecheck(e.e1);
      const t6 = typecheck(e.e2);
      if ((t5 === L.tybool && t6 === L.tybool) || (t5 === L.tynat && t6 === L.tynat)) {
        return L.tybool;
      } else {
        throw new Error(`Invalid or types`);
      }
    case 'not':
      const t7 = typecheck(e.exp);
      if (t7 === L.tybool) {
        return L.tybool;
      } else {
        throw new Error(`Invalid not type`);
      }
    case 'if':
      const t8 = typecheck(e.e1);
      const t9 = typecheck(e.e2);
      const t10 = typecheck(e.e3);
      if (t8 === L.tybool && t9 === t10) {
        return t9;
      } else {
        throw new Error(`Invalid if types`);
      }
    case 'eq':
      const t11 = typecheck(e.e1);
      const t12 = typecheck(e.e2);
      if ((t11 === L.tybool && t12 === L.tybool) || t11 === L.tynat && t12 === L.tynat) {
        return L.tybool;
      } else {
        throw new Error(`Invalid and types`);
      }
    case 'directory':
      throw new Error('Unimplemented!')
    case 'matrix':
      throw new Error('Unimplemented!')
    case 'image':
      throw new Error('Unimplemented!')
  }
}

