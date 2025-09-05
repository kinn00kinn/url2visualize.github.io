# CPR Result Visualizer

心肺蘇生（CPR）のトレーニング結果を視覚化して共有するためのウェブアプリケーションです。URL に含まれるデータから、レーダーチャートを含む詳細な評価結果レポートを生成します。

## 主な機能

- **動的な結果生成**: URL のクエリパラメータから CPR 評価データを読み取り、結果ページを動的に生成します。
- **多様な入力方法**: QR コードのスキャン、または URL を直接入力して結果を表示できます。
- **レーダーチャート表示**: `Chart.js`を利用し、圧迫、リリース、位置、速さ、中断の 5 項目をレーダーチャートで視覚化します。
- **詳細データ表示**: 圧迫の深さ(cm)、速さ(BPM)、中断回数などの具体的な測定値を表示します。
- **画像としてエクスポート**: 表示された結果レポートを PNG 画像としてダウンロードできます。
- **レスポンシブデザイン**: PC、スマートフォン、タブレットなど、様々なデバイスの画面サイズに合わせてレイアウトが最適化されます。
- **堅牢な UI**: ページ間の遷移やボタンの動作を、確実性の高い堅牢な方法で実装しています。

## URL の構造

結果ページの URL は、以下のクエリパラメータで構成されます。

- `totalScore`: 総合スコア（点数）
- `rc_comp`: 【レーダーチャート用】圧迫のスコア (0-100)
- `rc_release`: 【レーダーチャート用】リリースのスコア (0-100)
- `rc_pos`: 【レーダーチャート用】位置のスコア (0-100)
- `rc_speed`: 【レーダーチャート用】速さのスコア (0-100)
- `rc_int`: 【レーダーチャート用】中断のスコア (0-100)
- `depth`: （詳細データ用）圧迫の深さ (cm)
- `bpm`: （詳細データ用）圧迫の速さ (BPM)
- `releasePct`: （詳細データ用）リリースのパーセンテージ (%)
- `positionPct`: （詳細データ用）圧迫位置のパーセンテージ (%)
- `interruptionCount`: （詳細データ用）中断回数

### サンプル URL

```
http://localhost:8000/result.html?totalScore=88&rc_comp=90&rc_release=100&rc_pos=100&rc_speed=95&rc_int=80&depth=5.5&bpm=110&releasePct=100&positionPct=100&interruptionCount=1
```

### サンプル URL(web)

```
https://kinn00kinn.github.io/url2visualize.github.io//result.html?totalScore=88&rc_comp=90&rc_release=10&rc_pos=50&rc_speed=95&rc_int=80&depth=5.5&bpm=110&releasePct=100&positionPct=100&interruptionCount=1
```

## ローカルでの実行方法

1. このプロジェクトのディレクトリに移動します。
2. ターミナルで以下のコマンドを実行し、ローカルサーバーを起動します。(Python 3 が必要です)
   ```shell
   python -m http.server
   ```
3. ウェブブラウザで `http://localhost:8000` にアクセスします。
