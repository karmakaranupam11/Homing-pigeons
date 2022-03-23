const users = [];

const addusr = (obj) => {
    const username = obj.username.trim().toLowerCase();
    const room  = obj.room .trim().toLowerCase();

    // validate if username and room  are there
    if (!username || !room ) {
        return {
            error: 'username and room  are required'
        }
    }

    // check for existing user
    const exitingUser = users.find((user) => {
        return user.room  === room  && user.username === username;
    })

    //validate username
    if (exitingUser) {
        return {
            error: ' username is in use '
        }
    }

    //store user
    const user = {
        id: obj.id,
        username: username,
        room : room 
    }
    users.push(user);
    return user
}

const removeusr = (id) => {
    const index = users.findIndex((user) => user.id === id)

    if (index !== -1) {
        return users.splice(index, 1)[0];
    }
}

const getusr = (id) => {
    return users.find((user) => user.id === id)
}

const getusrinroom  = (room ) => {
    return users.filter((user) => user.room  === room )
}

module.exports = {
    addusr,
    removeusr,
    getusr,
    getusrinroom 
}