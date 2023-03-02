const sendBtn = document.querySelector('.send-btn');
const geoBtn = document.querySelector('.geo-btn');
const messageField = document.querySelector('.message-field');
const input = document.querySelector('.input');

input.addEventListener('keypress', event => {
  if (event.key == 'Enter') {
    event.preventDefault();
    sendBtn.click();
  }
});

sendBtn.addEventListener('click', () => {
  const message = input.value;

  websocket = new WebSocket('wss://echo-ws-service.herokuapp.com');

  websocket.onopen = function() {
    console.log('connected');
    websocket.send(message);
    writeMessage(message, 'user-message');

    websocket.onmessage = (evt) => writeMessage(evt.data, 'server-message');
  };

  websocket.onerror = () => writeMessage('error');

});

function writeMessage(message, author) {
  let answer = document.createElement('div');
  answer.classList.add('message');
  answer.classList.add(author);

  let pre = document.createElement('p');
  pre.innerHTML = message;

  let timeStr = document.createElement('p');
  messageTime = new Date;
  timeStr.innerHTML = messageTime.toLocaleTimeString()
  timeStr.classList.add('time');

  answer.appendChild(pre);
  answer.appendChild(timeStr);
  messageField.appendChild(answer);
}

function writeLink(link) {
  let answer = document.createElement('div');
  answer.classList.add('message');
  answer.classList.add('server-message');

  let mapLink = document.createElement('a');
  mapLink.textContent = 'Гео-локация';
  mapLink.href = link;
  mapLink.setAttribute('target', '_blank');

  answer.appendChild(mapLink);

  messageField.appendChild(answer)
}

const succes = position => {
  const latitude = position.coords.latitude;
  const longitude = position.coords.longitude;

  const mapLink = `https://www.openstreetmap.org/#map=18/${latitude}/${longitude}`;

  writeLink(mapLink);
};

const error = () => {
  console.log('Невозможно получить ваше местоположение');
};

geoBtn.addEventListener('click', () =>{
  const geoAnswer = ''

  if (!navigator.geolocation) {
    geoAnswer = 'Геолокация не поддерживается браузером';
  } else {
    navigator.geolocation.getCurrentPosition(succes, error);
  }
});
