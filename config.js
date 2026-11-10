// 手機遙控（選用）：填自己的 Supabase 專案就會出現「手機遙控」按鈕。
// Supabase 後台 → Project Settings → API：Project URL 和 anon（publishable）key。
// anon key 本來就是給瀏覽器用的公開金鑰，可以放這裡；service_role key 絕對不要放。
// 不填也能用：同一台電腦上的觀眾畫面和講者模式會自動同步。
window.DECK_CONFIG = {
  supabase: { url: '', key: '' },
};
