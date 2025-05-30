"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const kuromoji_1 = __importDefault(require("kuromoji"));
const builder = kuromoji_1.default.builder({
    dicPath: 'node_modules/kuromoji/dict'
});
exports.default = (text) => {
    return new Promise((resolve, reject) => {
        builder.build((err, tokenizer) => {
            if (err) {
                reject(err);
                return;
            }
            try {
                var tokens = tokenizer.tokenize(text);
                resolve(tokens);
            }
            catch (err) {
                resolve([{ basic_form: text }]);
            }
        });
    });
};
//# sourceMappingURL=tokenize.js.map