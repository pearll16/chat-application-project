// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.14.0/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/9.14.0/firebase-auth.js";
import { getDatabase, ref, push, onChildAdded, remove } from "https://www.gstatic.com/firebasejs/9.14.0/firebase-database.js";

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyDPtXMPEGjbSaqXQVwEjPWxPZeW6Wnu-BA",
    authDomain: "chatapplication2-55c7b.firebaseapp.com",
    databaseURL: "https://chatapplication2-55c7b-default-rtdb.firebaseio.com",
    projectId: "chatapplication2-55c7b",
    storageBucket: "chatapplication2-55c7b.appspot.com",
    messagingSenderId: "649582271381",
    appId: "1:649582271381:web:7119a80cc27e012caeb49c",
    measurementId: "G-3XY6HGWCN9"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const database = getDatabase(app);

// Elements
const loginDiv = document.getElementById('auth-section');
const chatDiv = document.getElementById('chat-section');
const messagesDiv = document.getElementById('messages');
const messageInput = document.getElementById('message-input');
const sendButton = document.getElementById('send-btn');
const clearChatButton = document.getElementById('clear-chat-button');
const logoutButton = document.getElementById('logout-button');
const registerButton = document.getElementById('register-btn');
const loginButton = document.getElementById('login-btn');

// Authentication Logic
registerButton.addEventListener('click', () => {
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    createUserWithEmailAndPassword(auth, email, password)
        .then(userCredential => {
            alert('Sign Up Successful!');
        })
        .catch(error => {
            alert('Error: ' + error.message);
        });
});

loginButton.addEventListener('click', () => {
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    signInWithEmailAndPassword(auth, email, password)
        .then(userCredential => {
            loginDiv.style.display = 'none';
            chatDiv.style.display = 'block';
            loadMessages(); // Load messages after login
        })
        .catch(error => {
            alert('Login Error: ' + error.message);
        });
});

// Listen for auth state changes
onAuthStateChanged(auth, (user) => {
    if (user) {
        loginDiv.style.display = 'none';
        chatDiv.style.display = 'block';
        loadMessages(); // Load messages after login
    } else {
        loginDiv.style.display = 'block';
        chatDiv.style.display = 'none';
    }
});

// Sending Messages
sendButton.addEventListener('click', () => {
    const message = messageInput.value;
    if (message !== '') {
        const user = auth.currentUser.email; // Get the user's email
        const messagesRef = ref(database, 'messages');

        // Create a new message in the database
        push(messagesRef, {
            message: message,
            user: user,
            timestamp: Date.now()
        }).then(() => {
            messageInput.value = ''; // Clear the input field
        }).catch(error => {
            alert('Error sending message: ' + error.message);
        });
    } else {
        alert('Please enter a message to send.');
    }
});

// Load Messages from Firebase
function loadMessages() {
    const messagesRef = ref(database, 'messages');
    messagesDiv.innerHTML = ''; // Clear previous messages

    onChildAdded(messagesRef, (snapshot) => {
        const data = snapshot.val();
        displayMessage(data.message, data.user);
    });
}

// Display Message
function displayMessage(message, user) {
    const messageElement = document.createElement('div');
    messageElement.textContent = `${user}: ${message}`;
    
    // Apply the appropriate class based on the user
    if (user === auth.currentUser.email) {
        messageElement.classList.add('sent');
    } else {
        messageElement.classList.add('received');
    }
    
    messagesDiv.appendChild(messageElement);
    messagesDiv.scrollTop = messagesDiv.scrollHeight; // Scroll to the bottom
}


// Clear Chat Functionality
clearChatButton.addEventListener('click', () => {
    const messagesRef = ref(database, 'messages');
    remove(messagesRef).then(() => {
        messagesDiv.innerHTML = ''; // Clear messages
        alert('Chat cleared successfully.');
    }).catch(error => {
        alert('Error clearing chat: ' + error.message);
    });
});

// Logout Functionality
logoutButton.addEventListener('click', () => {
    signOut(auth).then(() => {
        loginDiv.style.display = 'block';
        chatDiv.style.display = 'none';
    });
});
