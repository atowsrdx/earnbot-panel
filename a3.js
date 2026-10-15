function renderTasks(d){
  setTitle('Tasks');
  var h='<h2>Add channel task</h2><div class="card"><label>Channel (@username or -100… id)</label><input id="c_chat" placeholder="@mychannel">'
   +'<label>Reward (₹)</label><input id="c_rew" inputmode="decimal">'
   +'<label>Invite link (only for private channels)</label><input id="c_inv" placeholder="https://t.me/+…">'
   +'<p><button class="pri" data-act="addchan">Add channel task</button></p><div class="sub">The bot must already be an admin of the channel.</div></div>'
   +'<h2>Add link task</h2><div class="card"><label>Title</label><input id="l_title" maxlength="80" placeholder="Visit our partner">'
   +'<label>Link</label><input id="l_url" placeholder="https://…"><label>Reward (₹)</label><input id="l_rew" inputmode="decimal">'
   +'<p><button class="pri" data-act="addlink">Add link task</button></p></div>'
   +'<h2>Add proof task (screenshot)</h2><div class="card"><label>Title</label><input id="p_title" maxlength="80" placeholder="Review our app on Play Store">'
   +'<label>Instructions for the user</label><input id="p_info" maxlength="500" placeholder="Give 5 stars and send a screenshot of your review">'
   +'<label>Link (optional)</label><input id="p_url" placeholder="https://…"><label>Reward (₹)</label><input id="p_rew" inputmode="decimal">'
   +'<p><button class="pri" data-act="addproof">Add proof task</button></p><div class="sub">Users send a screenshot. You approve it in Proofs or in Telegram.</div></div><h2>All tasks</h2>';
  h+=d.items.length?d.items.map(function(t){
    return '<div class="card"><div class="row"><div><b>#'+t.id+'</b> '+esc(t.title)+'</div><span class="pill '+(t.active?'on':'')+'">'+(t.active?'on':'off')+'</span></div>'
     +'<div class="sub">'+esc(t.kind)+' · reward '+money(t.reward)+' · done '+t.done+' · spent '+money(t.done*t.reward)+'</div>'
     +'<div class="sub"><code>'+esc(t.url)+'</code></div>'
     +'<p style="margin:8px 0 0"><button data-act="toggle" data-id="'+t.id+'">'+(t.active?'Disable':'Enable')+'</button></p></div>';
  }).join(''):'<div class="card empty">No tasks yet.</div>';
  show(h);
}

function renderUsers(d){
  setTitle('Users');
  var h='<div class="card"><div class="row" style="flex-wrap:nowrap"><input id="q" value="'+esc(qv)+'" placeholder="Search id, @username or UPI"><button class="pri" data-act="search">Search</button></div></div>';
  h+=d.items.length?d.items.map(function(u){
    return '<div class="card" data-act="user" data-id="'+esc(u.id)+'" style="cursor:pointer"><div class="row"><div><b>'+esc(u.username?'@'+u.username:'(no username)')+'</b>'
     +(u.banned?' <span class="pill banned">banned</span>':'')+'<div class="sub">'+esc(u.id)+' · joined '+fdt(u.joined)+'</div></div>'
     +'<div style="text-align:right"><b>'+money(u.balance)+'</b><div class="sub">earned '+money(u.earned)+'</div></div></div></div>';
  }).join(''):'<div class="card empty">No users found.</div>';
  show(h+pager(d.total,d.per));
}
function renderUser(d){
  var u=d.user;setTitle('User '+u.id);
  var h='<div class="card"><div class="row"><b>'+esc(u.username?'@'+u.username:'(no username)')+'</b>'+(u.banned?'<span class="pill banned">banned</span>':'')+'</div>'
   +'<div class="sub">Telegram ID '+esc(u.id)+' · joined '+fdt(u.joined)+'</div>'
   +'<p>Balance <b>'+money(u.balance)+'</b> · earned '+money(u.earned)+'<br>UPI: <code>'+esc(u.upi||'not set')+'</code><br>Tasks done: '+u.done+' · Referrals: '+u.refs+' · Referred by: '+esc(u.referred_by||'-')+'</p>'
   +'<button class="'+(u.banned?'':'bad')+'" data-act="ban" data-id="'+esc(u.id)+'" data-b="'+(u.banned?'0':'1')+'" data-confirm="1">'+(u.banned?'Unban':'Ban user')+'</button></div>'
   +'<h2>Adjust balance</h2><div class="card"><label>Amount in ₹ (negative to deduct)</label><input id="a_amt" inputmode="decimal" placeholder="5 or -2.5">'
   +'<label>Reason (saved in the activity log)</label><input id="a_why" maxlength="100"><p><button class="pri" data-act="adjust" data-id="'+esc(u.id)+'" data-confirm="1">Apply</button></p></div>'
   +'<h2>Recent withdrawals</h2>'+(d.withdrawals.length?d.withdrawals.map(wdCard).join(''):'<div class="card empty">None yet.</div>');
  show(h);
}

function act(name,args,after){
  busy(true);
  call(name,args).then(function(r){r=data(r);busy(false);flash(r.msg||'Done',true);after&&after();}).catch(fail);
}
function copyText(t,b){
  var done=function(){b.textContent='Copied';};
  try{if(navigator.clipboard&&navigator.clipboard.writeText){navigator.clipboard.writeText(t).then(done,function(){fallback();});return;}}catch(x){}
  fallback();
  function fallback(){try{var ta=document.createElement('textarea');ta.value=t;document.body.appendChild(ta);ta.select();document.execCommand('copy');document.body.removeChild(ta);done();}catch(x){b.textContent=t;}}
                                                                                 }
                                                                                                                                        
