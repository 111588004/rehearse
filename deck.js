// 這份是範例簡報。格式說明見 AGENTS.md，換成你自己的內容就好。
window.DECK = {
  title: 'Rehearse 範例',

  // 所有 html 頁共用的樣式。每一頁都是 1920×1080 的 .slide
  css: `
    .slide { padding: 120px 160px; font: 48px/1.5 -apple-system, BlinkMacSystemFont, "Segoe UI", "PingFang TC", "Noto Sans TC", sans-serif; color: #18181b; background: #fff; }
    .slide h1 { font-size: 120px; line-height: 1.1; margin: 0 0 40px; letter-spacing: -.02em; }
    .slide h2 { font-size: 80px; line-height: 1.2; margin: 0 0 56px; letter-spacing: -.01em; }
    .slide p, .slide li { color: #52525b; }
    .slide ul { margin: 0; padding-left: 1.2em; } .slide li { margin: 0 0 24px; }
    .slide .eyebrow { font-size: 32px; color: #a1a1aa; text-transform: uppercase; letter-spacing: .12em; margin: 0 0 24px; }
    .slide .accent { color: #2563eb; }
    .slide.center { display: flex; flex-direction: column; justify-content: center; }
    .slide.dark { background: #18181b; color: #fafafa; } .slide.dark p { color: #a1a1aa; }
    .slide code { font: 40px ui-monospace, "SF Mono", Menlo, monospace; background: #f4f4f5; padding: 4px 12px; border-radius: 8px; }
  `,

  slides: [
    {
      title: '封面',
      html: `<div class="slide center">
        <p class="eyebrow">Open source</p>
        <h1>Rehearse 排練</h1>
        <p>讓 AI 寫投影片，你專心排練</p>
      </div>`,
      notes: '大家好，今天介紹 **Rehearse 排練**。\n它是一個不用安裝的網頁簡報工具。',
    },
    {
      title: '三個功能',
      html: `<div class="slide">
        <h2>三個功能</h2>
        <ul>
          <li><b>講者模式</b>：講稿、計時、每頁秒數</li>
          <li><b>直接改講稿</b>：邊練邊改，再下載回來</li>
          <li><b>手機遙控</b>：掃 QR code 就能翻頁</li>
        </ul>
      </div>`,
      notes: '- 按 **P** 開講者模式\n- 講稿可以直接編輯\n- 手機遙控要先在 config.js 設定 Supabase',
    },
    {
      title: '交給 agent',
      html: `<div class="slide center dark">
        <p class="eyebrow">How it works</p>
        <h2>告訴 agent：<span class="accent">「照 AGENTS.md 幫我做一份簡報」</span></h2>
        <p>它只需要改 <code>deck.js</code></p>
      </div>`,
      notes: '這是重點：簡報內容和講稿都在 deck.js。\nagent 讀 AGENTS.md 就知道怎麼寫。',
    },
    {
      title: '謝謝',
      html: `<div class="slide center"><h1>謝謝</h1><p>← → 換頁 · F 全螢幕 · P 講者模式</p></div>`,
      notes: '',
    },
  ],
};
