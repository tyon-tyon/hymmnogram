import type { TWord } from "~/types";


export default function () {
  const { getWords } = useDictionary();
  const { getDialectTextClass } = useStyles();
  const editorWords = useState<TWord[][]>('editorWords', () => []);
  const cursorLineIndex = useState<number>('cursorLineIndex', () => 0);
  const cursorPosition = useState<number>('cursorPosition', () => 0);
  const cursorLine = useState<string>('cursorLine', () => "");
  const textareaText = useState<string>('textareaText', () => "");
  const lineHtmls = useState<string[]>('lineHtmls', () => ["\n"]);

  let timer: NodeJS.Timeout;
  const changeTextarea = (text: string) => {
    clearTimeout(timer);
    textareaText.value = text;
    const lines = text.split("\n");
    // 編集中の行は即時更新
    lineHtmls.value = lines.map((line, index) => {
      if (index === cursorLineIndex.value)
        return getLineHtml(getWords(line, true)[0] ?? []);
      return lineHtmls.value[index];
    });

    // 行数が変わった場合は全行を更新
    timer = setTimeout(() => {
      // テキストを分割
      editorWords.value = getWords(text, true);
      // htmlを生成
      lineHtmls.value = editorWords.value.map((words) => {
        return getLineHtml(words);
      });
    }, 200);
  };

  const getLineHtml = (words: TWord[]) => {
    return words
      .map((word) => {
        // 日本語の場合は何もしない
        if (
          word.hymmnos.match(
            /[\u3040-\u30ff\u3400-\u4dbf\u4e00-\u9fff\uf900-\ufaff]/
          )
        ) {
          return `<span class="text-black dark:text-white">` + word.hymmnos + `</span>`;
        }
        const dialectClass = getDialectTextClass(word?.dialect ?? null);

        // 単語が存在する場合はその言語で表示
        if (word.dialect)
          return `<span class="${dialectClass}">` + word.hymmnos + `</span>`;

        // 英字が含まれている場合は誤字として表示
        if (word.hymmnos.match(/^[A-Za-z\=\-\>]+$/))
          return (
            `<span class="text-black dark:text-white bg-cool-300 dark:bg-cool-700">` + word.hymmnos + `</span>`
          );

        // それ以外は黒文字で表示
        return `<span class="text-black dark:text-white">` + word.hymmnos + `</span>`;
      })
      .join("");
  };

  const changeCursorPosition = (_cursorPosition: number) => {
    cursorPosition.value = _cursorPosition;
    // カーソル位置から行番号を取得
    cursorLineIndex.value =
      textareaText.value.slice(0, _cursorPosition).split("\n").length - 1;
    // カーソル位置の行のテキストを取得
    cursorLine.value = textareaText.value.split("\n")[cursorLineIndex.value];
  };

  const addText = (text: string) => {
    // テキストエリアを取得
    const textarea = document.querySelector("textarea");
    if (!textarea) return;
    // フォーカスする
    textarea.focus();
    // カーソル位置に挿入
    document.execCommand("insertText", false, text);
    // フォーカスを解除
    textarea.blur();
  };

  const addWord = (word: TWord) => {
    addText(
      (
        cursorPosition.value < 1 || textareaText.value.slice(0, cursorPosition.value + 1).match(/^[\s\n]$/)
          ? "" : " "
      )// 空白の場合はスペースを追加
      + word.hymmnos
    );
  };

  const deleteText = () => {
    // テキストエリアを取得
    const textarea = document.querySelector("textarea");
    if (!textarea) return;
    // フォーカスする
    textarea.focus();
    // カーソル位置から1文字削除
    document.execCommand("delete", false);
    // カーソル位置を更新
    changeCursorPosition(cursorPosition.value - 1);
    // フォーカスを解除
    textarea.blur();
  };

  const replaceText = (start: number, end: number, text: string) => {
    const before = textareaText.value.slice(0, start);
    const after = textareaText.value.slice(end);
    changeTextarea(before + text + after);
    setTimeout(() => {
      // フォーカスする
      const textarea = document.querySelector("textarea");
      if (!textarea) return;
      textarea.focus();
      // カーソル位置を設定
      textarea.setSelectionRange(start + text.length, start + text.length);
    }, 1);
  };


  return { changeTextarea, changeCursorPosition, editorWords, cursorPosition, cursorLineIndex, cursorLine, textareaText, lineHtmls, addWord, addText, deleteText, replaceText };
}