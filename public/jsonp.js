const proxy = 'http://127.0.0.1:2333/jsonp';
const userApi = 'https://api.bilibili.com/x/web-interface/card?mid=';
const listenlist = [];

document.addEventListener('DOMContentLoaded', () => {
  const search = document.getElementById('search');
  const button = document.getElementById('search-button');
  const table = document.getElementsByTagName('table')[0];

  search.onkeyup = (e) => {
    if (!e) e = window.event;
    if (e.keyCode === 13) {
      checkInput(search);
    }
  };
  button.onclick = () => {
    checkInput(search);
  };
  table.style.visibility = 'hidden';

  // var pokemon = ['nes-bulbasaur', 'nes-charmander', 'nes-squirtle'];
  // for (clas of pokemon) {
  //   let [w, h] = [Math.random() * window.innerWidth, Math.random() * window.innerHeight]
  //   let i = document.createElement('i');
  //   i.className = clas;
  //   Object.assign(i.style, {
  //     position: 'absolute',
  //     left: w + 'px',
  //     top: h + 'px',
  //   });
  //   document.body.appendChild(i);
  // }
});

function checkInput(search) {
  const uid = +search.value;
  if (uid > 0) {
    addListen(uid);
  } else {
    error('请输入纯数字(=・ω・=)');
  }
}

function error(msg) {
  const { search } = this;
  search.value = '';
  search.className += 'error ';
  search.setAttribute('placeholder', msg);
  setTimeout(() => {
    search.setAttribute('placeholder', '');
  }, 2500);
}

function jsonpReq(url, callback) {
  const script = document.createElement('script');
  script.src = `${proxy}?callback=${callback}&url=${encodeURIComponent(url)}`;
  document.body.appendChild(script);
  script.onload = () => {
    document.body.removeChild(script);
  };
}

function addListen(uid) {
  if (listenlist.includes(uid)) {
    // jsonpReq(userApi + uid, 'updateFans');
    error('已存在(=・ω・=)');
    return;
  }
  jsonpReq(userApi + uid, 'initFans');
  listenlist.push(uid);
}

function initFans(res) {
  const {
    name: upName, mid: uid, fans, face,
  } = res;
  if (!uid) {
    error('查询出错(°∀°)ﾉ');
    return;
  }
  console.log('init', upName);

  const list = document.getElementById('list');
  const upInfo = document.createElement('tr');
  upInfo.id = `up-${uid}`;
  upInfo.classList.add('animated', 'fadeIn');

  const upname = document.createElement('td');
  const upnamea = document.createElement('a');
  Object.assign(upnamea, {
    innerText: upName,
    href: `https://space.bilibili.com/${uid}`,
    target: '_blank',
  });
  upname.appendChild(upnamea);

  const upfans = document.createElement('td');
  const upfanss = document.createElement('div');
  upfanss.id = `od-${uid}`;
  // upfanss.innerText = fans;
  od = new Odometer({
    el: upfanss,
    value: fans,
    format: '(,dddd).dd',
    theme: 'default',
  });
  upfans.appendChild(upfanss);
  //   const avatar = document.createElement('img');
  //   avatar.src = face;
  //   upname.appendChild(avatar);

  upInfo.appendChild(upname);
  upInfo.appendChild(upfans);
  list.appendChild(upInfo);

  list.parentNode.style.visibility = 'visible';

  setInterval(
    () => {
      jsonpReq(userApi + uid, 'updateFans');
    },
    fans > 5e5 ? 4e3 : 1e4,
  );
}

function updateFans(res) {
  const { name: upName, mid: uid, fans } = res;
  const upFans = document.getElementById(`od-${uid}`);
  upFans.innerText = fans;
  console.log('update', upName);
}
