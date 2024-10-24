const textBox = document.querySelector('#tweet');
const container = document.querySelector('.container');
const submit = document.querySelector('.button');
const newMessageId = `new-message`;
const savedMessageId = `saved-message`;

container.appendChild(createMessageContainer(newMessageId, 'new-message-container'));
container.appendChild(createMessageContainer(savedMessageId, 'saved-message-container'));
const newMessageContainer = document.querySelector('#new-message');
const savedMessageContainer = document.querySelector('#saved-message');
let message = "";

const localStrg = {
    get messageObj() {
        try {
            return JSON.parse(localStorage.getItem('messageObj')) || {};
        } catch (e) {
            console.error('Failed to parse messageArray from localStorage:', e);
            return {}; // Default to an empty array if there's a parsing error
        }
    },
    set messageObj(messageArray) {
        localStorage.setItem('messageObj', JSON.stringify(messageArray));
    }
};

// Event Listeners -----------------------------------------------------------------------------------------------------

document.addEventListener('DOMContentLoaded', () => {
    loadEventListeners();
    loadSavedMessages();
});

function loadEventListeners() {
    textBox.addEventListener('input', (e) => {
        handleTextBoxInput(e);
    });
    submit.addEventListener('click', (e) => {
        e.preventDefault();
        handleSubmit(validateMsg(message));
    });
}

// Manipulate HTML Elements ------------------------------------------------------------------------------------------------

function createMessageContainer(id, className) {
    const messageContainer = document.createElement('div');
    messageContainer.classList.add(className);
    messageContainer.id = id;
    return messageContainer;
}

function createMessage(id, text) {
    const message = document.createElement('article');
    message.classList.add('message');
    message.textContent = text;
    message.setAttribute('data-id', id);

    const deleteBtn = document.createElement('button');
    deleteBtn.textContent = 'Delete';
    deleteBtn.classList.add('delete-btn');
    deleteBtn.addEventListener('click', () => {
        removeMessage(id);
        message.remove();
    });

    message.appendChild(deleteBtn);
    return message;
}

function clearNewMessage() {
    newMessageContainer.textContent = '';
}

function clearTextBox() {
    textBox.value = '';
}

function loadSavedMessages() {
    console.log('loadSavedMessages 1', localStrg.messageObj);

    for (const [id, text] of Object.entries(localStrg.messageObj)) {
        const savedMessage = createMessage(id, text);
        savedMessageContainer.appendChild(savedMessage);
        console.log('loadSavedMessages 2', id, text, localStrg.messageObj);
    }
}

// Event Handlers ------------------------------------------------------------------------------------------------------

function handleTextBoxInput(e) {
    message = e.target.value;
    clearNewMessage();
    const newMessage = createMessage(Date.now(), message); // Use Date.now() for a quick unique ID
    newMessageContainer.appendChild(newMessage);
}

function handleSubmit(text) {
    if (text) {
        const messages = localStrg.messageObj;
        const newMessageObj = { id: Date.now(), text };
        messages[newMessageObj["id"]] = text;
        localStrg.messageObj = messages;
        console.log('handleSubmit saved messgaes', localStrg.messageObj)// Create a new object with a unique ID

        clearNewMessage();
        clearTextBox();
        message = '';

        const newMessage = createMessage(newMessageObj.id, newMessageObj.text);
        newMessage.classList.add('message-slide-down');

        savedMessageContainer.prepend(newMessage);
    } else {
        alert(`I'm sorry, the message you entered was empty`);
    }
}

// Utility Functions ---------------------------------------------------------------------------------------------------

function validateMsg(message) {
    return message.length > 0 ? message : null;
}

function removeMessage(id) {
    const message = localStrg.messageObj[id];
    if (message) {
        delete localStrg.messageObj[id]
    } else {
        localStrg.messageObj = localStrg.messageObj;
    }
}

