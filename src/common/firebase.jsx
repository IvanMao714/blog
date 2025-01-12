import { initializeApp } from "firebase/app";
import { GoogleAuthProvider, getAuth, signInWithPopup } from 'firebase/auth'

const firebaseConfig = {
  apiKey: "AIzaSyCTRuGgvs_7agVjYZ9l6cMq3kOpUxZ9cH4",
  authDomain: "react-js-blog-website-yt.firebaseapp.com",
  projectId: "react-js-blog-website-yt",
  storageBucket: "react-js-blog-website-yt.appspot.com",
  messagingSenderId: "511273583112",
  appId: "1:511273583112:web:8f691fcae60cbc4aa807bd"
};

const app = initializeApp(firebaseConfig);

// google auth

const provider = new GoogleAuthProvider();

const auth = getAuth();

export const authWithGoogle = async () => {

    let user = null;

    await signInWithPopup(auth, provider)
    .then((result) => {
        user = result.user
    })
    .catch((err) => {
        console.log(err)
    })

    return user;
}