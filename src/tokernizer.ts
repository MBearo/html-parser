interface Token {
    type: string;
    value: string;
}
export default class Tokenizer {
    idx: number;
    char: string;
    string: string;
    tokens: Token[];
    tokenValue: string;
    tokenType: string;
    constructor(string: string) {
        this.idx = 0;
        this.char = ''
        this.tokens = [];
        this.string = string;
        this.tokenValue = ''
        this.tokenType = ''
    }
    next() {
        this.idx++;
        this.char = this.string[this.idx];
    }
    emit() {
        this.tokens.push({
            type: this.tokenType,
            value: this.tokenValue
        })
        this.tokenValue = ''
        this.tokenType = ''
    }
    tokenize() {
        while (this.idx < this.string.length) {
            this.char = this.string[this.idx];
            if (this.char === '<') {
                // TODO 文档上没写要emit
                if (this.tokenType) {
                    this.emit()
                }
                this.tagOpenState()
            } else {
                this.tokenType = 'literal'
                this.tokenValue += this.char
                this.next()
            }
        }
    }
    tagOpenState() {
        this.next()
        if (this.char === '/') {
            this.endTagOpenState()
        } else if (this.char === '!') {
            this.markupDeclarationOpenState()
        } else if (isASSIC(this.char)) {
            this.tokenType = 'openTag'
            this.tokenValue += this.char
            this.tagNameState()
        }
    }
    endTagOpenState() {
        this.next()
        if (this.char === '>') {
            this.next()
        } else {
            this.tokenValue += this.char
            this.tokenType = 'endTag'
            this.tagNameState()
        }
    }
    tagNameState() {
        this.next()
        if (isWhiteSpace(this.char)) {
            this.beforeAttributeNameState()
        } else if (this.char === '>') {
            this.emit()
            this.next()
        } else if (this.char === '/') {
            this.selfClosingStartTagState()
        } else if (isASSIC(this.char)) {
            this.tokenValue += this.char
            this.tagNameState()
        }
    }
    beforeAttributeNameState() {
        this.next()
        if (isWhiteSpace(this.char)) {
            this.beforeAttributeNameState()
        } else if (this.char === '/') {
            this.selfClosingStartTagState()
            // this.afterAttributeNameState()
        } else if (this.char === '>') {
            this.emit()
            this.next()
        } else {
            this.emit()
            this.tokenValue += this.char
            this.attributeNameState()
        }
    }
    selfClosingStartTagState() {
        this.next()
        if (this.char === '>') {
            this.emit()
            this.tokenType = 'selfClosingTag'
            this.emit()
            this.next()
        }
    }
    afterAttributeNameState() {
        this.next()
        if (isWhiteSpace(this.char)) {
            this.afterAttributeNameState()
        } else if (this.char === '/') {
            this.selfClosingStartTagState()
        } else if (this.char === '=') {
            this.beforeAttributeValueState()
        } else if (this.char === '>') {
            this.emit()
            this.next()
        } else {
            this.tokenValue += this.char
            this.attributeNameState()
        }
    }
    attributeNameState() {
        this.next()
        if (isWhiteSpace(this.char) || this.char === '/' || this.char === '>') {
            this.afterAttributeNameState()
        } else if (this.char === '=') {
            this.emit()
            this.beforeAttributeValueState()
        } else if (isASSIC(this.char)) {
            this.tokenType = 'attributeName'
            this.tokenValue += this.char
            this.attributeNameState()
        } else {
            this.tokenType = 'attributeName'
            this.tokenValue += this.char
            this.attributeNameState()
        }
    }
    beforeAttributeValueState() {
        this.next()
        if (isWhiteSpace(this.char)) {
            this.beforeAttributeValueState()
        } else if (this.char === '"') {
            this.attributeValueDoubleQuotedState()
        } else if (this.char === "'") {
            this.attributeValueSingleQuotedState()
        }
    }
    attributeValueDoubleQuotedState() {
        this.next()
        if (this.char === '"') {
            this.afterAttributeValueQuotedState()
        } else {
            this.tokenType = 'attributeValue'
            this.tokenValue += this.char
            this.attributeValueDoubleQuotedState()
        }
    }
    attributeValueSingleQuotedState() {

    }
    afterAttributeValueQuotedState() {
        this.next()
        if (isWhiteSpace(this.char)) {
            this.beforeAttributeNameState()
        } else if (this.char === '/') {
            this.selfClosingStartTagState()
        } else if (this.char === '>') {
            this.emit()
            this.next()
        }
    }
    markupDeclarationOpenState() {
        this.next()
        if (this.char === '-') {
            this.commentStartState()
        }
    }
    // TODO 注释中如果有连等的dash，会出错，比如 <!--- xxx -->
    commentStartState() {
        this.next()
        if (this.char === '-') {
            this.commentStartDashState()
        } else {
            this.commentState()
        }
    }
    commentStartDashState() {
        this.next()
        if (this.char === '-') {
            this.commentEndState()
        } else if (this.char === '>') {
            this.next()
        } else {
            this.tokenValue += this.char
            this.commentState()
        }
    }
    commentState() {
        this.next()
        if (this.char === '-') {
            this.commentEndDashState()
        } else {
            this.tokenType = 'comment'
            this.tokenValue += this.char
            this.commentState()
        }
    }
    commentEndDashState() {
        this.next()
        if (this.char === '-') {
            this.commentEndState()
        } else if (this.char === '>') {
            this.emit()
            this.next()
        } else {
            this.tokenValue += '-'
            this.commentState()
        }
    }
    commentEndState() {
        this.next()
        if (this.char === '>') {
            this.emit()
            this.next()
        } else if (this.char === '-') {
            this.tokenValue += '-'
            this.commentEndState()
        } else {
            this.tokenValue += '--'
            this.commentState()
        }
    }
}
function isWhiteSpace(char: string) {
    return char === ' ' || char === '\t' || char === '\n'
}
function isASSIC(char: string) {
    return char.charCodeAt(0) < 128
}