<template>
  <section class="mb-10">
    <h2 class="text-2xl font-bold mb-4 text-primary-600">
      ヒュムノグラム(v3.beta)へようこそ。
    </h2>
    <p class="mb-4">
      ヒュムノグラムは、アルトネリコ・サージュコンチェルトシリーズに登場する言語『ヒュムノス語』の非公式辞書サイトです。
      単語データは
      <nuxt-link
        href="https://ux.getuploader.com/hymmnoster/"
        target="_blank"
        rel="noopener noreferrer"
        class="text-blue-500"
      >
        トリフィラ
      </nuxt-link>
      を元にしています。
    </p>
    <h3 class="text-xl font-bold mb-4 text-primary-600">
      ヒュムノグラム(v3.beta)は現在開発中です
    </h3>
    <p class="mb-4">
      <!--リファラつけて遷移-->
      <a href="https://fau-varda.net/Hymmnogram" class="text-blue-500" >
        旧ヒュムノグラム
      </a>
      も引き続き利用可能です。バイナスフィア生成等、未実装の機能は旧サイトをご利用ください。
    </p>
    <h3 class="text-xl font-bold mb-4 text-primary-600">お問い合わせ</h3>
    <p>
      ご不明な点やお問い合わせがある場合は、
      <nuxt-link
        to="https://x.com/messages/compose?recipient_id=565191834"
        target="_blank"
        rel="noopener noreferrer"
        class="text-blue-500"
      >
        Twitter DM
      </nuxt-link>
      からお気軽にご連絡ください。
    </p>
  </section>

  <section class="mb-10">
    <h2 class="text-2xl font-bold mb-4 text-primary-600">ヒュムノス辞書</h2>
    <p class="mb-4">
      ヒュムノス語から日本語へ、または日本語からヒュムノス語への単語検索が可能です。ヒュムノサーバー未登録の単語は、流派を「ヒュムノサーバー未登録」と設定しています。
    </p>
    <h3 class="text-xl font-bold mb-2 text-primary-600">機能</h3>
    <ul class="list-disc list-inside mb-4">
      <li>
        <strong>単語検索</strong>:
        ヒュムノス語やその意味だけでなく、品詞や発音による検索が可能です。
      </li>
      <li>
        <strong>一括意味表示</strong>:
        入力されたヒュムノス文から、使用されている単語の意味を一括で表示します。
      </li>
      <li>
        <strong>用例検索</strong>:
        公式の用例を、ヒュムノス語と日本語の両方で検索できます。
      </li>
    </ul>
  </section>

  <section class="mb-10">
    <h2 class="text-2xl font-bold mb-4 text-primary-600">
      <nuxt-link to="/editor" class="cursor-pointer">
        ヒュムノスエディタ
      </nuxt-link>
    </h2>
    <p class="mb-4">
      ヒュムノス、律史前月読、アルシエラの記述を支援するテキストエディタです。
    </p>
    <h3 class="text-xl font-bold mb-2 text-primary-600">機能</h3>
    <ul class="list-disc list-inside mb-4">
      <li>
        <strong>誤字チェック</strong>:
        リアルタイムでテキストの誤字をチェックし、間違いがある場合はハイライト表示します。
      </li>
      <li>
        <strong>一括意味表示</strong>:
        カーソルがある行の文章の意味をリアルタイムで表示します。ヒュムノス語、律史前月読、アルシエラの
        3 つの言語に対応しています。
      </li>
      <li>
        <strong>入力支援</strong>:
        画面下部に「ヒュムノス辞書」「アルシエラキーボード」「律史前月読キーボード」を備えています。ヒュムノス語の単語をクリックすると、その単語を挿入できます。
      </li>
    </ul>
  </section>

  <section class="mb-10">
    <h2 class="text-2xl font-bold mb-4 text-primary-600">参考リンク</h2>
    <ul class="list-disc list-inside mb-4">
      <li>
        <nuxt-link
          to="https://github.com/tyon-tyon/hymmnogram"
          target="_blank"
          rel="noopener noreferrer"
          class="text-blue-500"
          >GitHub リポジトリ</nuxt-link
        >
      </li>
      <li>
        <nuxt-link
          to="http://game.salburg.com/hymmnoserver/index.php"
          target="_blank"
          rel="noopener noreferrer"
          class="text-blue-500"
          >ヒュムノサーバー</nuxt-link
        >
      </li>
      <li>
        <nuxt-link
          to="https://drive.google.com/file/d/1044oHiXZ9-4mrYWc-Cs4eVbnX2TEFW3g/view"
          target="_blank"
          rel="noopener noreferrer"
          class="text-blue-500"
          >紡ぐためのヒュムノス語</nuxt-link
        >
      </li>
      <li>
        <nuxt-link
          to="https://ux.getuploader.com/hymmnoster/"
          target="_blank"
          rel="noopener noreferrer"
          class="text-blue-500"
          >ヒュムノス関連アップローダ トリフィラ</nuxt-link
        >
      </li>
      <li>
        <nuxt-link
          to="https://ja.wikipedia.org/wiki/%E3%83%92%E3%83%A5%E3%83%A0%E3%83%8E%E3%82%B9%E8%AA%9E"
          target="_blank"
          rel="noopener noreferrer"
          class="text-blue-500"
          >ヒュムノス語 - Wikipedia</nuxt-link
        >
      </li>
      <li>
        <nuxt-link
          to="https://w.atwiki.jp/hymm01/"
          target="_blank"
          rel="noopener noreferrer"
          class="text-blue-500"
          >非公式ヒュムノス辞書</nuxt-link
        >
      </li>
    </ul>
  </section>
</template>

<script setup></script>
