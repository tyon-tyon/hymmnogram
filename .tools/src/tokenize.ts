import kuromoji from 'kuromoji';

const builder = kuromoji.builder({
    dicPath: 'node_modules/kuromoji/dict'
});

export default (text: string) => {
    return new Promise((resolve, reject) => {
        builder.build((err, tokenizer) => {
            if (err) {
                reject(err);
                return;
            }
            try {
                var tokens = tokenizer.tokenize(text);
                resolve(tokens);
            } catch (err) {
                resolve([{ basic_form: text }]);
            }
        });
    });
};
