import Tokenizer from "./tokernizer";

export default class Parser extends Tokenizer{

    constructor(string: string) {
        super(string)
    }
    parse() {
        this.tokenize()
        console.log(this.tokens)
    }
}