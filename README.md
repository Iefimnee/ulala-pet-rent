# ULALA - ペット可賃貸情報サイト

京都のペットと暮らせる賃貸物件を専門に扱う情報サイト「ULALA（うらら）」のリポジトリです。

## プロジェクト概要

ULALAは、京都でペットと暮らせる賃貸物件を専門に扱う情報サイトです。詳細なペット入居条件や周辺ペット施設情報を提供し、ペットオーナーの住まい探しをサポートします。

## サイト構造

```
/
├── index.html                # トップページ
├── assets/                   # 静的リソース
│   ├── css/                  # スタイルシート
│   ├── js/                   # JavaScriptファイル
│   └── images/               # 画像リソース
├── pages/                    # 各ページ
│   ├── search.html           # 物件検索ページ
│   ├── about.html            # ULALAについて
│   ├── contact.html          # お問い合わせ
│   ├── property/             # 物件詳細ページ
│   └── notes/                # うららかノート（ブログ）
└── netlify.toml              # Netlify設定ファイル
```

## デプロイ方法

### Netlifyへのデプロイ

1. GitHubリポジトリをNetlifyアカウントに接続します
2. 以下の設定でデプロイを構成します：
   - ビルドコマンド: なし（静的HTMLサイト）
   - 公開ディレクトリ: `/`
   - 環境変数: 必要なし

### Netlify設定

`netlify.toml`ファイルには以下の設定が含まれています：

- クリーンURL（.html拡張子の非表示）
- カスタムリダイレクト
- セキュリティヘッダー

## ローカル開発

1. リポジトリをクローン：
```
git clone https://github.com/yourusername/ulala-pet-rent.git
```

2. 任意のWebサーバーで実行（例：VSCodeのLive Server拡張機能など）

## 更新履歴

- 2025/04/23: 初期バージョン公開

## 連絡先

- Email: ulalaanimal@gmail.com
- Website: https://ulala.jp