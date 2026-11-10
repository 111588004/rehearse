// 手機遙控：透過 Supabase Realtime 的 broadcast 頻道，在不同裝置之間同步頁數。
// 傳的永遠是「現在是第 N 頁」（絕對頁數），重複收到也不會多翻；以最後一次操作為準。
// 斷線時兩邊各自照常運作，重新連上後講者端會問觀眾畫面目前在第幾頁再對齊。
(function () {
  // 在 config.js 填自己的 Supabase 專案（Project URL 和 anon / publishable key）。沒填就不開手機遙控，同一台電腦的視窗照樣同步
  const C = (window.DECK_CONFIG && window.DECK_CONFIG.supabase) || {};
  if (!C.url || !C.key) return;
  const KEY = C.key;
  const URL_ = `${C.url.replace(/^http/, 'ws').replace(/\/$/, '')}/realtime/v1/websocket?apikey=${KEY}&vsn=1.0.0`;
  const RKEY = r => 'deck-room-' + r;  // 觀眾畫面和講者模式分開記，同一台電腦開兩個視窗才不會互相搶
  // 房間碼：去掉容易看錯的 0/O、1/I/L
  const ABC = '23456789ABCDEFGHJKMNPQRSTUVWXYZ';
  const newCode = () => Array.from(crypto.getRandomValues(new Uint8Array(6)), b => ABC[b % ABC.length]).join('');
  const clean = s => (s || '').toUpperCase().replace(/[^0-9A-Z]/g, '').slice(0, 6);
  const id = Math.random().toString(36).slice(2, 10);

  function Remote({ role, onMsg, onStatus, onPeers }) {
    let ws = null, room = null, ref = 0, joinRef = null, hb = null, retry = null, wait = 1000, joined = false, want = false;
    const status = s => onStatus && onStatus(s);
    const topic = () => `realtime:deck-${room}`;
    const push = (event, payload, t) => { if (ws && ws.readyState === 1) { ws.send(JSON.stringify({ topic: t || topic(), event, payload, ref: String(++ref), join_ref: t ? undefined : joinRef })); return true; } return false; };
    function open() {
      clearTimeout(retry); if (!want || !room) return;
      if (ws && ws.readyState <= 1) return;
      status('connecting');
      let s; try { s = ws = new WebSocket(URL_); } catch (e) { return later(); }
      s.onopen = () => {
        if (ws !== s) return;
        joinRef = String(++ref);
        s.send(JSON.stringify({ topic: topic(), event: 'phx_join', ref: joinRef, join_ref: joinRef,
          payload: { config: { broadcast: { self: false, ack: false }, presence: { key: id }, private: false }, access_token: KEY } }));
        clearInterval(hb); hb = setInterval(() => ping(8000), 15000);
      };
      s.onmessage = e => {
        if (ws !== s) return;
        let m; try { m = JSON.parse(e.data); } catch (_) { return; }
        if (m.topic === 'phoenix' && m.event === 'phx_reply') { clearTimeout(pong); return; }
        if (m.topic !== topic()) return;
        if (m.event === 'phx_reply' && m.ref === joinRef) {
          if (m.payload && m.payload.status === 'ok') {
            joined = true; wait = 1000; status('online');
            push('presence', { type: 'presence', event: 'track', payload: { role } });
            onMsg && onMsg({ joined: true });
          } else { status('error'); s.close(); }
        } else if (m.event === 'broadcast' && m.payload && m.payload.event === 'deck') {
          const p = m.payload.payload; if (p && p.from !== id) onMsg && onMsg(p);
        } else if (m.event === 'presence_state') { peers = {}; addPeers(m.payload); }
        else if (m.event === 'presence_diff') { addPeers(m.payload.joins); Object.keys(m.payload.leaves || {}).forEach(k => delete peers[k]); emitPeers(); }
        else if (m.event === 'phx_error' || m.event === 'phx_close') s.close();
      };
      s.onclose = () => { if (ws !== s) return; ws = null; joined = false; clearInterval(hb); clearTimeout(pong); peers = {}; emitPeers(); if (want) { status('offline'); later(); } };
      s.onerror = () => {};
    }
    // 心跳：送出後在時限內沒有回應，就當作斷線（切換網路時連線常常卡住而不是正常關閉）
    let pong = null;
    function ping(ms) { if (!ws || ws.readyState !== 1) return; clearTimeout(pong); const s = ws; push('heartbeat', {}, 'phoenix'); pong = setTimeout(() => { if (ws === s) { try { s.close(); } catch (e) {} s.onclose(); } }, ms); }
    let peers = {};
    function addPeers(obj) { Object.entries(obj || {}).forEach(([k, v]) => { if (k !== id) peers[k] = (v.metas && v.metas[0] && v.metas[0].role) || '?'; }); emitPeers(); }
    function emitPeers() { onPeers && onPeers(Object.values(peers)); }
    function later() { clearTimeout(retry); retry = setTimeout(open, wait); wait = Math.min(wait * 2, 8000); }
    function stop() { want = false; joined = false; clearTimeout(retry); clearInterval(hb); const s = ws; ws = null; if (s) try { s.close(); } catch (e) {} peers = {}; emitPeers(); status('off'); }
    // 手機鎖螢幕、切到背景回來時，連線多半已經斷了：立刻重連，不等退避時間
    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState !== 'visible' || !want) return;
      wait = 1000; if (joined) { ping(3000); onMsg && onMsg({ joined: true }); } else { if (ws) { try { ws.close(); } catch (e) {} ws = null; } open(); }
    });
    addEventListener('online', () => { if (!want) return; wait = 1000; if (joined) ping(3000); else open(); });
    addEventListener('offline', () => { if (ws) ping(1); });
    return {
      get room() { return room; }, get online() { return joined; },
      start(code) { code = clean(code); if (code.length !== 6) return false; if (code !== room) { stop(); room = code; } want = true; try { localStorage.setItem(RKEY(role), room); } catch (e) {} open(); return true; },
      stop() { stop(); room = null; try { localStorage.removeItem(RKEY(role)); } catch (e) {} },
      send(p) { return joined && push('broadcast', { type: 'broadcast', event: 'deck', payload: { ...p, from: id } }); },
    };
  }
  Remote.saved = role => { try { return clean(localStorage.getItem(RKEY(role))); } catch (e) { return ''; } };
  Remote.newCode = newCode; Remote.clean = clean;
  window.DeckRemote = Remote;
})();
