function renderDash(d){
  setTitle('Dashboard');var h='';
  if(!d.bot.connected){
    h+='<div class="card"><b>Last step: connect your bot</b><p class="sub">'+esc(d.bot.note)+'</p><button class="pri" data-act="connect">Connect bot</button></div>';
  }else{
    h+='<div class="card sub">🤖 @'+esc(d.bot.username)+' is connected'+(d.bot.pending?' · '+d.bot.pending+' updates waiting':'')
      +(d.bot.lastError?'<br>Telegram note: '+esc(d.bot.lastError)+' (harmless if the bot is replying normally)':'')+'</div>';
  }
  h+='<div class="grid">'+stat(d.users,'Users')+stat('+'+d.new24,'New (24h)')+stat(money(d.owed),'Owed to users')+stat(money(d.paid),'Paid out')
    +stat(d.pendingCount+' · '+money(d.pendingSum),'Pending payouts')+stat(d.activeTasks,'Active tasks')+stat(d.done24,'Tasks done (24h)')+stat(d.subsPending||0,'Proofs to review')+'</div>';
  h+='<h2>Needs payout</h2>';
  h+=d.pending.length?d.pending.map(wdCard).join(''):'<div class="card empty">Nothing pending</div>';
  if(d.pendingCount>5)h+='<p><a href="#" data-act="nav" data-v="wd">See all '+d.pendingCount+' pending</a></p>';
  h+='<h2>Recent admin activity</h2>';
  h+=d.logs.length?'<div class="card">'+d.logs.map(function(l){return '<div class="sub">'+fdt(l.at)+' · <b>'+esc(l.action)+'</b> '+esc(l.detail)+'</div>';}).join('')+'</div>':'<div class="card empty">No actions yet.</div>';
  h+='<p class="sub">Your data lives in your Supabase project (Table Editor). Please do not edit it by hand.</p>';
  show(h);
}
function renderWd(d){
  setTitle('Withdrawals');
  var tabs='<div class="tabs">';
  ['pending','paid','rejected','all'].forEach(function(s){tabs+='<button data-act="wdtab" data-s="'+s+'" class="'+(s===wdS?'on':'')+'">'+s.charAt(0).toUpperCase()+s.slice(1)+'</button>';});
  tabs+='</div>';
  show(tabs+(d.items.length?d.items.map(wdCard).join(''):'<div class="card empty">Nothing here.</div>')+pager(d.total,d.per));
}
function renderSubs(d){
  setTitle('Proofs');
  var tabs='<div class="tabs">';
  ['pending','approved','rejected','all'].forEach(function(s){tabs+='<button data-act="sbtab" data-s="'+s+'" class="'+(s===sbS?'on':'')+'">'+s.charAt(0).toUpperCase()+s.slice(1)+'</button>';});
  tabs+='</div>';
  show(tabs+(d.items.length?d.items.map(function(s){
    var u=API+'?img='+s.id+'&t='+encodeURIComponent(token);
    return '<div class="card"><div class="row"><div><b>#'+s.id+'</b> '+esc(s.title)+'</div><span class="pill '+(s.status==='approved'?'paid':s.status)+'">'+esc(s.status)+'</span></div>'
     +'<div class="sub">User '+esc(s.user_id)+(s.username?' (@'+esc(s.username)+')':'')+' · reward '+money(s.reward)+' · '+fdt(s.created)+'</div>'
     +'<p><a href="'+u+'" target="_blank" rel="noopener"><img src="'+u+'" loading="lazy" alt="proof" style="max-width:100%;max-height:260px;border-radius:8px"></a></p>'
     +(s.status==='pending'?'<div class="row"><button class="ok" data-act="sdecide" data-id="'+s.id+'" data-d="ok">Approve</button><button class="bad" data-act="sdecide" data-id="'+s.id+'" data-d="no" data-confirm="1">Reject</button></div>':'')+'</div>';
  }).join(''):'<div class="card empty">Nothing here.</div>')+pager(d.total,d.per));
}
function renderBc(){
  setTitle('Broadcast');
  show('<div class="card"><label>Message to send to all users</label><textarea id="bc_text" rows="6" maxlength="3500" style="width:100%;box-sizing:border-box;padding:10px;border-radius:10px;border:1px solid var(--bd);background:var(--bg);color:var(--tx);font:inherit"></textarea>'
   +'<p class="sub">Sent as plain text to everyone who has started the bot (banned users are skipped). A big list can take a few minutes, so keep this page open.</p>'
   +'<p><button class="pri" data-act="bcsend" data-confirm="1">Send to all users</button></p></div>');
}
function renderSet(d){
  setTitle('Settings');
  show('<div class="card"><label>Referral bonus (₹) paid to the inviter when a friend completes the first task</label><input id="s_ref" inputmode="decimal" value="'+esc(String(d.ref))+'">'
   +'<label>Minimum withdrawal (₹)</label><input id="s_min" inputmode="decimal" value="'+esc(String(d.minw))+'">'
   +'<p><button class="pri" data-act="saveset">Save settings</button></p><div class="sub">Changes apply within a few seconds.</div></div>');
    }
      
