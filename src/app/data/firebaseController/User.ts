import {auth} from "@/app/data/firebaseController/firebase";
import {signInWithEmailAndPassword, createUserWithEmailAndPassword} from 'firebase/auth';

export const registerUser = async (email: string, password: string) => {
    createUserWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            const user = userCredential.user;
        })
        .catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
            // ..
        });
}

export const authenticateUser = async (email: string, password: string) => {
    signInWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            // Signed in
            const user = userCredential.user;
            console.log("user", user);
        })
        .catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
        });
}


// export const handleLogout = async () => {
//     await auth().signOut();
//     // Redirect to login page or home
// };