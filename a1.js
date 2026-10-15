var $=function(i){return document.getElementById(i)};
var token='';try{token=sessionStorage.getItem('eb_t')||''}catch(x){}
var view='dash',wdS='pending',sbS='pending',pg=1,qv='';

function esc(s){s=(s==null?'':String(s));return s.split('&').join('&amp;').split('<').join('&lt;').split('>').join('&gt;').split('"').join('&quot;').split("'").join('&#39;');}
function money(p){return '₹'+(p/100).toLocaleString('en-IN',{minimumFractionDigits:2,maximumFractionDigits:2});}
function fdt(ts){return ts?new Date(ts*1000).toLocaleString('en-IN',{day:'2-digit',month:'short',year:'numeric',hour:'2-digit',minute:'2-digit'}):'-';}
var API='';try{API=localStorage.getItem('eb_api')||'';}catch(x){}
if(API){$('apiRow').hidden=true;}
function call(action,args){
  if(!API){var i=$('apiUrl');API=(i&&i.value||'').trim();}
  if(!/^https:\/\//.test(API)){API='';return Promise.reject(new Error('Type the function URL in the first box (it starts with https://).'));}
  return fetch(API,{method:'POST',headers:{'Content-Type':'text/plain'},body:JSON.stringify({token:token,action:action,args:args||{}})})
    .then(function(r){return r.text().then(function(t){
      var j;try{j=JSON.parse(t);}catch(x){API='';throw new Error('Server replied '+r.status+': '+t.slice(0,150));}
      if(action==='login'&&j&&j.ok){try{localStorage.setItem('eb_api',API);}catch(x){}}
      return j;});},
      function(){API='';throw new Error('Could not reach the server. Check the function URL in the first box.');});
}
function data(r){
  if(r&&r.err==='auth'){logout('Session expired. Please sign in again.');throw new Error('auth');}
  if(r&&r.err)throw new Error(r.err);
  return r;
}
function flash(msg,ok){var f=$('flash');f.className='flash '+(ok?'ok':'err');f.textContent=msg;f.hidden=false;window.scrollTo(0,0);}
function clearFlash(){$('flash').hidden=true;}
function setTitle(t){$('title').textContent=t;}
function show(h){$('main').innerHTML=h;}
function busy(on){$('main').style.opacity=on?'.5':'1';}
function fail(e){busy(false);var m=String(e&&e.message?e.message:e);if(m!=='auth')flash(m,false);}

function nav(){
  var items=[['dash','Dashboard'],['wd','Withdrawals'],['tasks','Tasks'],['users','Users'],['subs','Proofs'],['bc','Broadcast'],['set','Settings']],h='';
  items.forEach(function(i){h+='<button data-act="nav" data-v="'+i[0]+'" class="'+((view===i[0]||(view==='user'&&i[0]==='users'))?'on':'')+'">'+i[1]+'</button>';});
  $('nav').innerHTML=h;
}
function pager(total,per){
  var pages=Math.max(1,Math.ceil(total/per));
  if(pages<2)return '';
  return '<div class="row"><button data-act="page" data-d="-1" '+(pg<=1?'disabled':'')+'>Prev</button><span class="sub">Page '+pg+' of '+pages+'</span><button data-act="page" data-d="1" '+(pg>=pages?'disabled':'')+'>Next</button></div>';
}

function wdCard(w){
  var name=w.username?'@'+w.username:'no username';
  var h='<div class="card"><div class="row"><div><b>#'+w.id+'</b> <span class="pill '+esc(w.status)+'">'+esc(w.status)+'</span></div><b>'+money(w.amount)+'</b></div>'
   +'<div class="sub"><a href="#" data-act="user" data-id="'+esc(w.user_id)+'">'+esc(name)+' · '+esc(w.user_id)+'</a> · requested '+fdt(w.created)+'</div>'
   +'<div class="row" style="margin-top:8px"><code>'+esc(w.upi)+'</code><button data-act="copy" data-v="'+esc(w.upi)+'">Copy</button></div>';
  if(w.dup)h+='<div class="sub warn">⚠ This UPI ID was also used by '+w.dup+' other account(s)</div>';
  if(w.status==='pending'){
    var link='upi://pay?pa='+encodeURIComponent(w.upi)+'&pn='+encodeURIComponent(w.username||'Payee')+'&am='+(w.amount/100).toFixed(2)+'&cu=INR&tn='+encodeURIComponent('Payout #'+w.id);
    h+='<div class="row" style="margin-top:10px"><a class="btn pri" href="'+esc(link)+'" target="_top">Pay in UPI app</a>'
     +'<button class="ok" data-act="decide" data-id="'+w.id+'" data-d="paid" data-confirm="1">Mark paid</button>'
     +'<button class="bad" data-act="decide" data-id="'+w.id+'" data-d="reject" data-confirm="1">Reject</button></div>';
  }else h+='<div class="sub">Decided '+fdt(w.decided)+'</div>';
  return h+'</div>';
}
function stat(v,l){return '<div class="card stat"><b>'+v+'</b><span>'+l+'</span></div>';}

function load(){
  busy(true);nav();var p;
  if(view==='dash')p=call('dashboard').then(function(r){renderDash(data(r));});
  else if(view==='wd')p=call('withdrawals',{status:wdS,page:pg}).then(function(r){renderWd(data(r));});
  else if(view==='tasks')p=call('tasks').then(function(r){renderTasks(data(r));});
  else if(view==='users')p=call('users',{q:qv,page:pg}).then(function(r){renderUsers(data(r));});
  else if(view==='subs')p=call('subs',{status:sbS,page:pg}).then(function(r){renderSubs(data(r));});
  else if(view==='bc'){renderBc();p=Promise.resolve();}
  else if(view==='set')p=call('getSettings').then(function(r){renderSet(data(r));});
  else p=call('user',{id:qv}).then(function(r){renderUser(data(r));});
  p.then(function(){busy(false);}).catch(fail);
}
function go(v,keep){view=v;if(!keep){pg=1;}load();}
  
