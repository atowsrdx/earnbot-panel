function val(i){return ($(i)||{}).value||'';}

document.addEventListener('click',function(ev){
  var b=ev.target.closest('[data-act]');if(!b)return;
  var a=b.getAttribute('data-act');
  if(b.tagName==='A')ev.preventDefault();
  if(b.hasAttribute('data-confirm')&&b.getAttribute('data-armed')!=='1'){
    b.setAttribute('data-armed','1');b.setAttribute('data-label',b.textContent);b.textContent='Tap again to confirm';b.classList.add('armed');
    setTimeout(function(){if(b.getAttribute('data-armed')==='1'){b.setAttribute('data-armed','0');b.textContent=b.getAttribute('data-label');b.classList.remove('armed');}},4000);
    return;
  }
  clearFlash();
  var id=b.getAttribute('data-id');
  if(a==='nav'){qv='';go(b.getAttribute('data-v'));}
  else if(a==='logout')logout('');
  else if(a==='connect'){act('connect',{},function(){go('dash',true);});}
  else if(a==='decide')act('decide',{id:id,decision:b.getAttribute('data-d')},function(){load();});
  else if(a==='copy')copyText(b.getAttribute('data-v'),b);
  else if(a==='wdtab'){wdS=b.getAttribute('data-s');pg=1;load();}
  else if(a==='page'){pg+=Number(b.getAttribute('data-d'));load();}
  else if(a==='toggle')act('toggleTask',{id:id},load);
  else if(a==='addchan')act('addChannel',{chat:val('c_chat'),reward:val('c_rew'),invite:val('c_inv')},load);
  else if(a==='addlink')act('addLink',{title:val('l_title'),url:val('l_url'),reward:val('l_rew')},load);
  else if(a==='sbtab'){sbS=b.getAttribute('data-s');pg=1;load();}
  else if(a==='sdecide')act('decideSub',{id:id,decision:b.getAttribute('data-d')},load);
  else if(a==='addproof')act('addProof',{title:val('p_title'),url:val('p_url'),info:val('p_info'),reward:val('p_rew')},load);
  else if(a==='bcsend')act('broadcast',{text:val('bc_text')},function(){go('bc',true);});
  else if(a==='saveset')act('saveSettings',{ref:val('s_ref'),minw:val('s_min')},load);
  else if(a==='search'){qv=val('q');pg=1;load();}
  else if(a==='user'){qv=id;view='user';load();}
  else if(a==='ban')act('ban',{id:id,banned:b.getAttribute('data-b')==='1'},load);
  else if(a==='adjust')act('adjust',{id:id,amount:val('a_amt'),reason:val('a_why')},load);
});
document.addEventListener('keydown',function(ev){
  if(ev.key!=='Enter')return;
  if(ev.target.id==='pw')login();
  if(ev.target.id==='q'){qv=val('q');pg=1;load();}
});

function login(){
  var pw=$('pw').value;if(!pw)return;
  $('loginBtn').disabled=true;$('loginErr').hidden=true;
  call('login',{password:pw}).then(function(r){
    $('loginBtn').disabled=false;
    if(r.err){$('loginErr').textContent=r.err;$('loginErr').hidden=false;return;}
    token=r.token;try{sessionStorage.setItem('eb_t',token)}catch(x){}
    $('pw').value='';enter();
  }).catch(function(e){$('loginBtn').disabled=false;$('loginErr').textContent=String(e&&e.message?e.message:e);$('loginErr').hidden=false;});
}
function enter(){$('login').hidden=true;$('app').hidden=false;view='dash';load();}
function logout(msg){
  token='';try{sessionStorage.removeItem('eb_t')}catch(x){}
  $('app').hidden=true;$('login').hidden=false;
  if(msg){$('loginErr').textContent=msg;$('loginErr').hidden=false;}else $('loginErr').hidden=true;
}
$('loginBtn').addEventListener('click',login);
if(token)enter();else $('login').hidden=false;
  
