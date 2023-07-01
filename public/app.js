const firebaseConfig = {
    apiKey: "AIzaSyAbOf7F_YvfIBemh77A_KHhqBJV7e9gfmk",
    authDomain: "xedoc.firebaseapp.com",
    projectId: "xedoc",
    storageBucket: "xedoc.appspot.com",
    messagingSenderId: "616525520389",
    appId: "1:616525520389:web:595c833563ca34e0f4066c"
}

const logged_in_div  = document.getElementById("logged_in")
const login_btn      = document.getElementById("login")
const logged_out_div = document.getElementById("logged_out")
const logout_btn     = document.getElementById("logout")
let send_notes_timeout
let notes_ref

firebase.initializeApp(firebaseConfig)
const auth = firebase.auth()
const provider = new firebase.auth.GoogleAuthProvider()

const db = firebase.firestore()

function get_notes() {
    notes_ref = db.collection("notes").doc(auth.currentUser.uid).get().then(doc => {
        if (!doc.data()) return
        localStorage.setItem("txt", doc.data().text)
        console.log("recieved:", doc.data().text)
        restore_txt()
    }).then(() => {
        send_notes()
    })
}

function send_notes() {
    textarea = document.querySelector("#txt")
	db.collection("notes")
        .doc(auth.currentUser.uid)
        .set({text: textarea.value})
    console.log("sent:", textarea.value)
    send_notes_timeout = setTimeout(send_notes, 5 * 1000)
}

document.onload = () => {
    if (auth.currentUser) { get_notes() }
    else {
        logged_in_div.style.display = "none"
        logged_out_div.style.display = "block"
    }
}

login_btn.onclick = () => {
    auth.signInWithPopup(provider)
}

auth.onAuthStateChanged(user => {
    if (user) {
        logged_in_div.style.display = "contents"
        logged_out_div.style.display = "none"
        get_notes()
    } else {
        clearTimeout(send_notes_timeout)
        logged_in_div.style.display = "none"
        logged_out_div.style.display = "block"
    }
})

logout_btn.onclick = () => {
    auth.signOut()
}