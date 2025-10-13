declare module 'sastrawijs' {
  export class Tokenizer {
    constructor(customWords?: string[]);
    tokenize(text: string): string[];
  }

  export class Stemmer {
    constructor(customWords?: string[]);
    stem(text: string): string;
  }
}
