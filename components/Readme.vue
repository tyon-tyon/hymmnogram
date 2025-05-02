<template>
  <section class="mb-10">
    <AtomH2>
      ヒュムノグラム(v3.beta)へようこそ。
    </AtomH2>
    <AtomP>
      ヒュムノグラムは、アルトネリコ・サージュコンチェルトシリーズに登場する言語『ヒュムノス語』の非公式辞書サイトです。
      単語データは
      <AtomLink href="https://ux.getuploader.com/hymmnoster/" target="_blank" rel="noopener noreferrer">
        トリフィラ
      </AtomLink>
      を元に運営者が作成しています。
    </AtomP>
    <AtomH3>
      ダークモード非対応です。
    </AtomH3>
    <AtomH3>
      ダークモードだとかなり閲覧しづらいサイトとなっています。ブラウザのカラーモードをライトに変更してください。
    </AtomH3>
    <AtomH3>
      ヒュムノグラム(v3.beta)は現在開発中です
    </AtomH3>
    <AtomP>
      <!--リファラつけて遷移-->
      <AtomLink href="https://fau-varda.net/Hymmnogram" target="_blank" rel="noopener noreferrer">
        旧ヒュムノグラム
      </AtomLink>
      も引き続き利用可能です。バイナスフィア生成等、未実装の機能は旧サイトをご利用ください。
    </AtomP>
    <AtomH3>
      お問い合わせ
    </AtomH3>
    <AtomP>
      ご不明な点やお問い合わせがある場合は、
      <AtomLink href="https://marshmallow-qa.com/bfpkhciwx4ix2d3" target="_blank" rel="noopener noreferrer">
        マシュマロ(匿名メッセージフォーム)
      </AtomLink>
      からお気軽にご連絡ください。
    </AtomP>
  </section>

  <section class="mb-10">
    <AtomH2>
      更新履歴
    </AtomH2>
    <ul class="list-disc list-inside mb-4">
      <li v-for="release in releases" :key="release.id">
        {{ new Date(release.published_at).toLocaleDateString() }}
        <AtomLink :href="release.html_url" target="_blank" rel="noopener noreferrer">
          {{ release.name }}
        </AtomLink>
      </li>
    </ul>
  </section>

  <section class="mb-10">
    <AtomH2>
      ヒュムノス辞書
    </AtomH2>
    <AtomP>
      ヒュムノス語から日本語へ、または日本語からヒュムノス語への単語検索が可能です。ヒュムノサーバー未登録の単語は、流派を「ヒュムノサーバー未登録」と設定しています。
    </AtomP>
    <AtomH3>
      機能
    </AtomH3>
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
    <AtomH2>
      オリジナル単語登録
    </AtomH2>
    <AtomP>
      自作のヒュムノス語の単語を登録することができます。登録した単語は、ヒュムノス辞書で検索できるようになります。<br />
      登録は
      <AtomLink href="/original-words" class="text-blue-500"> こちら </AtomLink>
      から。
    </AtomP>
  </section>

  <section class="mb-10">
    <AtomH2>
      <nuxt-link to="/editor" class="cursor-pointer">
        ヒュムノスエディタ
      </nuxt-link>
    </AtomH2>
    <AtomP>
      ヒュムノス、律史前月読、アルシエラの記述を支援するテキストエディタです。
    </AtomP>
    <AtomH3>
      機能
    </AtomH3>
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
    <AtomH2>
      参考リンク
    </AtomH2>
    <ul class="list-disc list-inside mb-4">
      <li>
        <AtomLink href="https://github.com/tyon-tyon/hymmnogram" target="_blank" rel="noopener noreferrer">
          GitHub リポジトリ
        </AtomLink>
      </li>
      <li>
        <AtomLink href="http://game.salburg.com/hymmnoserver/index.php" target="_blank" rel="noopener noreferrer">
          ヒュムノサーバー
        </AtomLink>
      </li>
      <li>
        <AtomLink href="https://drive.google.com/file/d/1044oHiXZ9-4mrYWc-Cs4eVbnX2TEFW3g/view" target="_blank"
          rel="noopener noreferrer">
          紡ぐためのヒュムノス語
        </AtomLink>
      </li>
      <li>
        <AtomLink href="https://ux.getuploader.com/hymmnoster/" target="_blank" rel="noopener noreferrer">
          ヒュムノス関連アップローダ トリフィラ
        </AtomLink>
      </li>
      <li>
        <AtomLink href="https://ja.wikipedia.org/wiki/%E3%83%92%E3%83%A5%E3%83%A0%E3%83%8E%E3%82%B9%E8%AA%9E"
          target="_blank" rel="noopener noreferrer">
          ヒュムノス語 - Wikipedia
        </AtomLink>
      </li>
      <li>
        <AtomLink href="https://w.atwiki.jp/hymm01/" target="_blank" rel="noopener noreferrer">
          非公式ヒュムノス辞書
        </AtomLink>
      </li>
    </ul>
  </section>

</template>

<script setup>

// https://api.github.com/repos/tyon-tyon/hymmnogram/releasesから最新のリリースを取得
const latestRelease = await fetch('https://api.github.com/repos/tyon-tyon/hymmnogram/releases')
const latestReleaseData = await latestRelease.json()

//リリースのタイトルを取得
const releases = computed(() => {
  // 最新5件を取得
  return latestReleaseData.slice(0, 5)
})

</script>
