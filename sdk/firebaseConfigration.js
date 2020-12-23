import * as firebase from "firebase";

var firebaseConfigration = {
    apiKey: "AIzaSyCKBVD4Y0PJQNXoEm_8mQZgXLIYAZ8lWMo",
    authDomain: "almakan-2e492.firebaseapp.com",
    databaseURL: "https://almakan-2e492.firebaseio.com",
    projectId: "almakan-2e492",
    storageBucket: "almakan-2e492.appspot.com",
    messagingSenderId: "743065719366",
    appId: "1:743065719366:web:84d40615e9a62db741f047"
};

try {
    if (firebase.apps.length === 0)
        firebase.initializeApp(firebaseConfigration);
} catch (err) {
    console.log('firebase error:', err)
}

export default firebase
