const socket = io();

// ===== DOM REFERENCES =====
const sendMessageButton = document.getElementById('sendMessageButton');
const messageInput      = document.getElementById('textarea');
const messagesContainer = document.getElementById('message__area');
const usersjoinedList   = document.getElementById('users');
const memberCount       = document.getElementById('memberCount');
const headerRoomName    = document.getElementById('headerRoomName');
const headerUsername    = document.getElementById('headerUsername');
const userAvatarSm      = document.getElementById('userAvatarSm');
const headerOnlineCount = document.getElementById('headerOnlineCount');
const roomIdEl          = document.getElementById('roomid');
const copyRoomBtn       = document.getElementById('copyRoomBtn');
const toastEl           = document.getElementById('toast');
const toastMsg          = document.getElementById('toastMsg');

// ===== TOAST UTILITY =====
let toastTimer;
function showToast(msg, duration = 2500) {
  if (!toastEl) return;
  toastMsg.textContent = msg;
  toastEl.classList.add('visible');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toastEl.classList.remove('visible'), duration);
}

// ===== PARSE QUERY PARAMS =====
const obj = Qs.parse(location.search, { ignoreQueryPrefix: true });

// Redirect if no username/room
if (!obj.username || !obj.room) {
  window.location.href = '/';
}

// ===== COPY ROOM ID =====
if (copyRoomBtn) {
  copyRoomBtn.addEventListener('click', () => {
    const roomName = roomIdEl ? roomIdEl.textContent.trim() : obj.room;
    navigator.clipboard.writeText(roomName).then(() => {
      copyRoomBtn.classList.add('copied');
      copyRoomBtn.querySelector('.copy-icon').style.display = 'none';
      copyRoomBtn.querySelector('.check-icon').style.display = 'block';
      showToast('Room ID copied to clipboard!');
      setTimeout(() => {
        copyRoomBtn.classList.remove('copied');
        copyRoomBtn.querySelector('.copy-icon').style.display = 'block';
        copyRoomBtn.querySelector('.check-icon').style.display = 'none';
      }, 2000);
    }).catch(() => {
      showToast('Could not copy — please copy manually.');
    });
  });
}

// ===== JOIN ROOM =====
socket.emit('join', obj, (error) => {
  if (error) {
    alert(error);
    window.location.href = '/';
  }
});

// ===== HELPERS =====
function getInitials(name) {
  return name ? name.charAt(0).toUpperCase() : '?';
}

function scrollToBottom() {
  messagesContainer.scrollTop = messagesContainer.scrollHeight;
}

function formatTime(time) {
  return moment(time).format('h:mm A');
}

function removeIntro() {
  const intro = messagesContainer.querySelector('.message-area-intro');
  if (intro) intro.remove();
}

// ===== USER DETAILS =====
socket.on('userdetails', (userdata) => {
  if (headerUsername) headerUsername.textContent = userdata.user;
  if (userAvatarSm) userAvatarSm.textContent = getInitials(userdata.user);
});

// ===== ROOM DATA =====
socket.on('roomData', (data) => {
  // Update sidebar room name
  if (roomIdEl) roomIdEl.textContent = data.room;
  if (headerRoomName) headerRoomName.textContent = data.room;

  // Update online count
  const count = data.users.length;
  if (headerOnlineCount) headerOnlineCount.textContent = `${count} online`;
  if (memberCount) memberCount.textContent = count;

  // Rebuild members list
  if (usersjoinedList) {
    usersjoinedList.innerHTML = '';
    data.users.forEach((user) => {
      const li = document.createElement('li');
      li.className = 'userlistItem';
      li.innerHTML = `<div class="user-dot"></div>${user.username}`;
      usersjoinedList.appendChild(li);
    });
  }
});

// ===== SYSTEM MESSAGES (join/leave) =====
function createSystemMessage(text, time) {
  const wrapper = document.createElement('div');
  wrapper.className = 'system-message';
  wrapper.innerHTML = `
    <div class="system-message-inner">
      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/></svg>
      <span>${text}</span>
      <span class="system-time">${formatTime(time)}</span>
    </div>
  `;
  return wrapper;
}

socket.on('joiningMessage', (message) => {
  removeIntro();
  const el = createSystemMessage(message.text, message.time);
  messagesContainer.appendChild(el);
  scrollToBottom();
});

socket.on('disconnectionMessage', (message) => {
  removeIntro();
  const el = createSystemMessage(message.text, message.time);
  messagesContainer.appendChild(el);
  scrollToBottom();
});

// ===== BAD LANGUAGE ALERT =====
socket.on('badLanguageAlert', (message) => {
  const wrapper = document.createElement('div');
  wrapper.className = 'alert-message';
  wrapper.innerHTML = `
    <div class="alert-message-inner">
      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
      ${message.text}
    </div>
  `;
  messagesContainer.appendChild(wrapper);
  scrollToBottom();
});

// ===== SENT MESSAGE (Incoming = your own message) =====
socket.on('Incoming', (message) => {
  removeIntro();
  const wrapper = document.createElement('div');
  wrapper.className = 'incoming';
  wrapper.innerHTML = `
    <div class="bubble">
      <p class="bubble-text">${escapeHtml(message.text)}</p>
      <span class="bubble-time">${formatTime(message.time)}</span>
    </div>
  `;
  messagesContainer.appendChild(wrapper);
  scrollToBottom();
});

// ===== RECEIVED MESSAGE (Outgoing = other people's messages) =====
socket.on('Outgoing', (message) => {
  removeIntro();
  const wrapper = document.createElement('div');
  wrapper.className = 'outgoing';
  wrapper.innerHTML = `
    <div class="msg-meta">
      <div class="user-avatar-sm" style="width:22px;height:22px;font-size:10px;background:linear-gradient(135deg,#7c3aed,#4f46e5);border-radius:50%;display:inline-flex;align-items:center;justify-content:center;color:white;font-weight:700;">${getInitials(message.username)}</div>
      <span style="font-size:12px;font-weight:600;color:#a78bfa;">${escapeHtml(message.username)}</span>
    </div>
    <div class="bubble">
      <p class="bubble-text">${escapeHtml(message.text)}</p>
      <span class="bubble-time">${formatTime(message.time)}</span>
    </div>
  `;
  messagesContainer.appendChild(wrapper);
  scrollToBottom();
});

// ===== SENT LOCATION =====
socket.on('IncomingPosition', (location) => {
  removeIntro();
  const wrapper = document.createElement('div');
  wrapper.className = 'incoming';
  wrapper.innerHTML = `
    <div class="bubble">
      <a class="location-link" href="${location.location}" target="_blank" rel="noopener noreferrer">
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
        Shared a location — tap to view
      </a>
      <span class="bubble-time">${formatTime(location.time)}</span>
    </div>
  `;
  messagesContainer.appendChild(wrapper);
  scrollToBottom();
});

// ===== RECEIVED LOCATION =====
socket.on('OutgoingPosition', (location) => {
  removeIntro();
  const wrapper = document.createElement('div');
  wrapper.className = 'outgoing';
  wrapper.innerHTML = `
    <div class="msg-meta">
      <div class="user-avatar-sm" style="width:22px;height:22px;font-size:10px;background:linear-gradient(135deg,#7c3aed,#4f46e5);border-radius:50%;display:inline-flex;align-items:center;justify-content:center;color:white;font-weight:700;">${getInitials(location.username)}</div>
      <span style="font-size:12px;font-weight:600;color:#a78bfa;">${escapeHtml(location.username)}</span>
    </div>
    <div class="bubble">
      <a class="location-link" href="${location.location}" target="_blank" rel="noopener noreferrer">
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
        Shared a location — tap to view
      </a>
      <span class="bubble-time">${formatTime(location.time)}</span>
    </div>
  `;
  messagesContainer.appendChild(wrapper);
  scrollToBottom();
});

// ===== SEND MESSAGE =====
sendMessageButton.addEventListener('click', (e) => {
  e.preventDefault();
  const text = messageInput.value.trim();
  if (!text) return;

  sendMessageButton.disabled = true;
  socket.emit('messageon', text, (err) => {
    sendMessageButton.disabled = false;
    if (err) console.warn('Message error:', err);
  });
  messageInput.value = '';
  messageInput.focus();
});

// ===== SEND LOCATION =====
const sendLocationButton = document.getElementById('sendLocationButton');
sendLocationButton.addEventListener('click', (e) => {
  e.preventDefault();
  if (!navigator.geolocation) {
    alert('Geolocation is not supported by your browser.');
    return;
  }
  sendLocationButton.disabled = true;
  navigator.geolocation.getCurrentPosition(
    (position) => {
      socket.emit('sendLocation', {
        latitude: position.coords.latitude,
        longitude: position.coords.longitude
      }, () => {
        sendLocationButton.disabled = false;
      });
    },
    () => {
      sendLocationButton.disabled = false;
      alert('Unable to retrieve your location.');
    }
  );
});

// ===== XSS PREVENTION =====
function escapeHtml(str) {
  const div = document.createElement('div');
  div.appendChild(document.createTextNode(str));
  return div.innerHTML;
}