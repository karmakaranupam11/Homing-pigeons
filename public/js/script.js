const socket = io();

const sendMessageButton = document.getElementById('sendButton');
const message = document.getElementById('messageTextArea');
const messagesContainer = document.getElementById('messagesContainer');
const form = document.getElementById('messagesForm');
const chatSidebar = document.getElementById('chatSidebar');


const obj = Qs.parse(location.search, { ignoreQueryPrefix: true })// here in location.search we get the query 


socket.emit('join', obj, (error) => {
   console.log(error);
})

socket.on('IncomingPosition', (location) => { //printing the position on the console
   console.log(location);
   const msg = document.createElement("div");
   msg.className = "incoming";
   msg.innerHTML = `<h4 class="user">${location.username}   ${moment(location.time).format('h:mm a')}</h4>
        <p class="messagetext"> <a id="locationLink" class="locationLink" href="${location.location}">shared <i id="sharedLocationIcon" class="fas fa-map-marker-alt"></i>ocation click here to view</a></p>`;
   messagesContainer.appendChild(msg);
   scrollToBottom();
})
socket.on('OutgoingPosition', (location) => { //printing the position on the console
   console.log(location);
   const msg = document.createElement("div");
   msg.className = "outgoing";
   msg.innerHTML = `<h4 class="user">${location.username}   ${moment(location.time).format('h:mm a')}</h4>
        <p class="messagetext"> <a id="locationLink" class="locationLink" href="${location.location}">shared <i id="sharedLocationIcon" class="fas fa-map-marker-alt"></i>ocation click here to view</a></p>`;
   messagesContainer.appendChild(msg);
   scrollToBottom();
})
socket.on('Incoming', (message) => {
   console.log(message.text);
   const msg = document.createElement("p");
   msg.className = "incoming";
   msg.innerHTML = `<h4 class="user">${message.username}    ${moment(message.time).format('h:mm a')}</h4>
        <p class="messagetext">${message.text}</p>`;
   messagesContainer.appendChild(msg);
   scrollToBottom();
})
socket.on('joiningMessage', (message) => {
   console.log(message.text);
   const msg = document.createElement("p");
   msg.innerHTML = `<div class="message">
                           <span class="time">
                                 ${moment(message.time).format('h:mm a')}
                           </span>
                           <div class="msgElement">
                                 ${message.text} 
                           </div>
                     </div>`;
   messagesContainer.appendChild(msg);
   scrollToBottom();
})
socket.on('disconnectionMessage', (message) => {
   console.log(message.text);
   const msg = document.createElement("p");
   msg.innerHTML = `<div class="message">
                           <span class="time">
                                 ${moment(message.time).format('h:mm a')}
                           </span>
                           <div class="msgElement">
                                 ${message.text} 
                           </div>
                     </div>`;
   messagesContainer.appendChild(msg);
   scrollToBottom();
})
socket.on('Outgoing', (message) => {
   console.log(message.text);
   const msg = document.createElement("div");
   msg.className = "outgoing";
   msg.innerHTML = `<h4 class="user">${message.username}   ${moment(message.time).format('h:mm a')}</h4>
        <p class="messagetext">${message.text}</p>`;

   messagesContainer.appendChild(msg);
   scrollToBottom();
})

socket.on('roomData', (obj) => {
   chatSidebar.innerHTML = ``;
   const userListContainer = document.createElement("div");
   userListContainer.innerHTML = `<p class="roomname"><i class="fas fa-users"></i> ${obj.room}</p>`;
   obj.users.forEach((user) => {
      const userListItem = document.createElement("div");
      userListItem.innerHTML = `<p class="userListItem"><i class="fas fa-user-circle"></i><span class="userOnlineStatus"></span>${user.username}</p>`;
      userListContainer.appendChild(userListItem);
   })
   chatSidebar.appendChild(userListContainer);
})

sendMessageButton.addEventListener('click', (e) => {
   e.preventDefault();

   if (message.value) {
      sendMessageButton.setAttribute('disabled', 'disabled');
      socket.emit('messageon', message.value, (msg) => {
         sendMessageButton.removeAttribute('disabled');
         if (msg) {
            console.log(msg);
         }
         else {
            console.log("the message was delivered");
         }
      }); // emit the message to other connections
      message.value = '';
   }
})

const sendLocationButton = document.getElementById('sendLocationButton');

sendLocationButton.addEventListener('click', (e) => {
   e.preventDefault();
   if (!navigator.geolocation) { // if the browser doesnot supports the geolocation 
      console.log('your browser is not supported by browser ');
      return;
   }

   navigator.geolocation.getCurrentPosition((position) => {
      //  console.log(position);
      sendLocationButton.setAttribute('disabled', 'disabled');
      socket.emit('sendLocation', {
         latitude: position.coords.latitude,
         longitude: position.coords.longitude
      }, () => {
         sendLocationButton.removeAttribute('disabled');
         console.log('location shared successfully');
      })
   })

})

function scrollToBottom() {
   messagesContainer.scrollTop = messagesContainer.scrollHeight;
}











// socket.on('countUpdated',(count)=>{
//     console.log('The count has been updated '+ count);
// })

// const button = document.getElementById('button');

// button.addEventListener('click',()=>{
//    socket.emit('increment')
// })