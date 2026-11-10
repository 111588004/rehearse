# Rehearse 排練

讓 AI 寫投影片，你專心排練。一個資料夾就是一份簡報：內容和講稿都寫在 `deck.js`，交給你的 agent（Claude Code、Codex、Cursor……）來做。

純靜態網頁，不用安裝、沒有 build，丟到任何靜態主機就能用。

## 功能

- **觀眾畫面**：方向鍵、空白鍵或點擊換頁，`F` 全螢幕
- **講者模式**（`P`）：目前頁面、講稿、總計時、本頁計時、各頁秒數統計
- **直接改講稿**：邊練邊改，存在這台電腦，按「下載」匯出成 Markdown
- **手機遙控**（選用）：手機掃 QR code 翻頁，不用連同一個 Wi-Fi
- **影片頁**：開簡報時整支預載，會場斷網也能播；講者模式可以控制播放
- 手機和平板版的講者模式，支援明暗模式

## 開始

```bash
git clone https://github.com/111588004/rehearse my-talk
```

```bash
cd my-talk && python3 -m http.server
```

打開 http://localhost:8000 。接著跟你的 agent 說：

> 照 AGENTS.md 的格式，幫我把這份大綱做成簡報：……

格式說明在 [AGENTS.md](AGENTS.md)，人看也看得懂。

## 部署

整個資料夾就是網站，Vercel、Netlify、GitHub Pages、Cloudflare Pages 都可以直接部署。

注意：**部署後 `deck.js` 是公開的，講稿也一樣。** 不想公開講稿，就只在本機跑。

## 手機遙控

同一台電腦開「觀眾畫面」和「講者模式」兩個視窗，不用設定就會自動同步。

想用手機翻頁，需要一個免費的 [Supabase](https://supabase.com) 專案當中繼（只用到 Realtime broadcast，不建資料表）：

1. 建立 Supabase 專案
2. 到 Project Settings → API，複製 Project URL 和 anon（publishable）key
3. 填進 `config.js`

```js
window.DECK_CONFIG = {
  supabase: { url: 'https://xxxx.supabase.co', key: 'eyJ...' },
};
```

觀眾畫面右上角就會出現「手機遙控」。anon key 本來就是給瀏覽器用的公開金鑰；**不要放 service_role key**。

## 快捷鍵

| 按鍵 | 動作 |
|---|---|
| → ↓ 空白 Enter PageDown | 下一頁 |
| ← ↑ Backspace PageUp | 上一頁 |
| Home / End | 第一頁／最後一頁 |
| F | 全螢幕 |
| P | 講者模式 |
| K / M | 影片播放暫停／靜音 |

## 檔案

| 檔案 | 用途 |
|---|---|
| `deck.js` | 簡報內容和講稿，**你只需要改這個** |
| `assets/` | 圖片、影片 |
| `config.js` | 手機遙控設定（選用） |
| `index.html` | 觀眾畫面 |
| `presenter.html` | 講者模式 |
| `remote.js` | 手機遙控連線 |
| `qrcode.js` | [qrcode-generator](https://github.com/kazuhikoarase/qrcode-generator)（MIT） |

## 授權

MIT
