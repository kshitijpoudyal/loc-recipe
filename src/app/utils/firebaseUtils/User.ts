import {auth} from "@/app/config/firebase";
import {signInWithEmailAndPassword, createUserWithEmailAndPassword, User} from 'firebase/auth';

export const registerUser = async (email: string, password: string) => {
    createUserWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            const user = userCredential.user;
            console.log(user);
        })
        .catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
            console.log(errorCode);
            console.log(errorMessage);
        });
}

export const authenticateUser = async (email: string, password: string) => {
    return signInWithEmailAndPassword(auth, email, password);
}

export function getSignedInUser(): User | null {
    return auth.currentUser;
}

export const logoutUser = async () => {
    await auth.signOut();
};