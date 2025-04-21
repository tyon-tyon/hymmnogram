<template>
  <section class="mb-10">
    <TypographyH2>
      ヒュムノグラム(v3.beta)へようこそ。
    </TypographyH2>
    <TypographyP>
      ヒュムノグラムは、アルトネリコ・サージュコンチェルトシリーズに登場する言語『ヒュムノス語』の非公式辞書サイトです。
      単語データは
      <TypographyLink href="https://ux.getuploader.com/hymmnoster/" target="_blank" rel="noopener noreferrer">
        トリフィラ
      </TypographyLink>
      を元に運営者が作成しています。
    </TypographyP>
    <TypographyH3>
      ヒュムノグラム(v3.beta)は現在開発中です
    </TypographyH3>
    <TypographyP>
      <!--リファラつけて遷移-->
      <TypographyLink href="https://fau-varda.net/Hymmnogram" target="_blank" rel="noopener noreferrer">
        旧ヒュムノグラム
      </TypographyLink>
      も引き続き利用可能です。バイナスフィア生成等、未実装の機能は旧サイトをご利用ください。
    </TypographyP>
    <TypographyH3>
      お問い合わせ
    </TypographyH3>
    <TypographyP>
      ご不明な点やお問い合わせがある場合は、
      <TypographyLink href="https://marshmallow-qa.com/bfpkhciwx4ix2d3" target="_blank" rel="noopener noreferrer">
        マシュマロ(匿名メッセージフォーム)
      </TypographyLink>
      からお気軽にご連絡ください。
    </TypographyP>
  </section>

  <section class="mb-10">
    <TypographyH2>
      更新履歴
    </TypographyH2>
    <ul class="list-disc list-inside mb-4">
      <li v-for="release in releases" :key="release.id">
        {{ new Date(release.published_at).toLocaleDateString() }}
        <TypographyLink :href="release.html_url" target="_blank" rel="noopener noreferrer">
          {{ release.name }}
        </TypographyLink>
      </li>
    </ul>
  </section>

  <section class="mb-10">
    <TypographyH2>
      ヒュムノス辞書
    </TypographyH2>
    <TypographyP>
      ヒュムノス語から日本語へ、または日本語からヒュムノス語への単語検索が可能です。ヒュムノサーバー未登録の単語は、流派を「ヒュムノサーバー未登録」と設定しています。
    </TypographyP>
    <TypographyH3>
      機能
    </TypographyH3>
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
    <TypographyH2>
      オリジナル単語登録
    </TypographyH2>
    <TypographyP>
      自作のヒュムノス語の単語を登録することができます。登録した単語は、ヒュムノス辞書で検索できるようになります。<br />
      登録は
      <TypographyLink href="/original-words" class="text-blue-500"> こちら </TypographyLink>
      から。
    </TypographyP>
  </section>

  <section class="mb-10">
    <TypographyH2>
      <nuxt-link to="/editor" class="cursor-pointer">
        ヒュムノスエディタ
      </nuxt-link>
    </TypographyH2>
    <TypographyP>
      ヒュムノス、律史前月読、アルシエラの記述を支援するテキストエディタです。
    </TypographyP>
    <TypographyH3>
      機能
    </TypographyH3>
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
    <TypographyH2>
      参考リンク
    </TypographyH2>
    <ul class="list-disc list-inside mb-4">
      <li>
        <TypographyLink href="https://github.com/tyon-tyon/hymmnogram" target="_blank" rel="noopener noreferrer">
          GitHub リポジトリ
        </TypographyLink>
      </li>
      <li>
        <TypographyLink href="http://game.salburg.com/hymmnoserver/index.php" target="_blank" rel="noopener noreferrer">
          ヒュムノサーバー
        </TypographyLink>
      </li>
      <li>
        <TypographyLink href="https://drive.google.com/file/d/1044oHiXZ9-4mrYWc-Cs4eVbnX2TEFW3g/view" target="_blank"
          rel="noopener noreferrer">
          紡ぐためのヒュムノス語
        </TypographyLink>
      </li>
      <li>
        <TypographyLink href="https://ux.getuploader.com/hymmnoster/" target="_blank" rel="noopener noreferrer">
          ヒュムノス関連アップローダ トリフィラ
        </TypographyLink>
      </li>
      <li>
        <TypographyLink href="https://ja.wikipedia.org/wiki/%E3%83%92%E3%83%A5%E3%83%A0%E3%83%8E%E3%82%B9%E8%AA%9E"
          target="_blank" rel="noopener noreferrer">
          ヒュムノス語 - Wikipedia
        </TypographyLink>
      </li>
      <li>
        <TypographyLink href="https://w.atwiki.jp/hymm01/" target="_blank" rel="noopener noreferrer">
          非公式ヒュムノス辞書
        </TypographyLink>
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
