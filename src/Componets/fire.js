import firebase from 'firebase'
const firebaseConfig = {
    apiKey: "AIzaSyAabDaQmvXQlK8yhJmObrPgjGIUYSlM5ro",
    authDomain: "fir-react-song.firebaseapp.com",
    projectId: "fir-react-song",
    storageBucket: "fir-react-song.appspot.com",
    messagingSenderId: "187061988355",
    appId: "1:187061988355:web:b51ff992082e287749b236"
}
firebase.initializeApp(firebaseConfig);
var storage = firebase.storage();
export default storage;