const generateMessage = (username,text) => {
    messageObj = {
        username : username,
        text: text,
        time: new Date().getTime()
    }
    return messageObj;
}
const generateLocation = (username,url) =>{
    return{
        username : username,
        location : url,
        time : new Date().getTime()
    }
}
module.exports = {
    generateMessage,
    generateLocation
} 