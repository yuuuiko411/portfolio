# FOSTER Works

FOSTERのサービスサイトです。Astroで静的HTMLを生成し、実績データはmicroCMSから取得します。microCMSが未設定の場合は `src/data/fallbackWorks.ts` のサンプルデータを利用します。

## ローカル起動

```bash
npm install
npm run dev
```

本番相当の確認は `npm run build` と `npm run preview` を使用します。

## microCMS設定

1. `.env.example` を `.env` へコピーします。
2. `MICROCMS_SERVICE_DOMAIN` と `MICROCMS_API_KEY` を設定します。
3. microCMSでリスト形式API `works` を作成します。

### works APIのフィールド

| フィールドID | 種類 | 必須 | 内容 |
|---|---|---:|---|
| `title` | テキスト | ✓ | 実績タイトル |
| `slug` | テキスト | ✓ | URL用の英数字 |
| `summary` | テキストエリア | ✓ | 一覧・詳細の概要 |
| `categories` | 複数選択 | ✓ | WEB、UIなど |
| `cover` | 画像 |  | サムネイル。未設定時はCSSビジュアルを表示 |
| `coverAlt` | テキスト | ✓ | 画像の代替テキスト |
| `role` | 複数選択 | ✓ | 担当領域 |
| `year` | テキスト | ✓ | 公開年 |
| `client` | テキスト |  | クライアント名 |
| `challenge` | テキストエリア | ✓ | 課題 |
| `approach` | テキストエリア | ✓ | アプローチ |
| `result` | テキストエリア | ✓ | 成果 |
| `technologies` | 複数選択 |  | 技術・ツール |
| `featured` | 真偽値 | ✓ | トップ掲載フラグ |
| `displayOrder` | 数値 | ✓ | 表示順 |
| `visual` | セレクト |  | `corporate` / `dashboard` / `brand` |
| `seoTitle` | テキスト |  | 詳細ページのSEOタイトル |
| `seoDescription` | テキストエリア |  | 詳細ページの説明 |

APIキーには `GET` のみ許可してください。

## GitHub Pages公開（後から実施）

`.github/workflows/deploy.yml` を同梱しています。GitHubへ接続後、次を設定します。

1. リポジトリの `Settings > Secrets and variables > Actions` に以下を登録
   - `MICROCMS_SERVICE_DOMAIN`
   - `MICROCMS_API_KEY`
2. `Settings > Pages > Source` で `GitHub Actions` を選択
3. `main` ブランチへpush

プロジェクトページとして `https://<user>.github.io/<repository>/` に公開する設定です。独自ドメインを利用する場合は `astro.config.mjs` とワークフローの `SITE_URL` / `BASE_PATH` を調整してください。

## microCMS更新時の自動公開

microCMSの `works > API設定 > Webhook` からGitHub Actionsを登録します。コンテンツの公開・更新をトリガーにワークフローを実行することで、Git操作なしでサイトを再生成できます。

## 主な構成

```text
src/
├─ components/   共通UIと実績カード
├─ data/         CMS未設定時のサンプル
├─ layouts/      共通HTMLレイアウト
├─ lib/          microCMS取得処理
├─ pages/        トップ・実績一覧・実績詳細
├─ styles/       サイト全体のCSS
└─ types/        実績データ型
```
