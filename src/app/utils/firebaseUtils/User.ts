import {auth, db} from "@/app/config/firebase";
import {signInWithEmailAndPassword, createUserWithEmailAndPassword, signInWithPopup, GoogleAuthProvider, updateProfile, User, UserCredential} from 'firebase/auth';
import {doc, setDoc, getDoc} from 'firebase/firestore';

export const saveUserProfile = async (uid: string, displayName: string, email: string) => {
    await setDoc(doc(db, 'users', uid), { displayName, email }, { merge: true });
};

export const getUserDisplayName = async (uid: string): Promise<string | null> => {
    const snap = await getDoc(doc(db, 'users', uid));
    return snap.exists() ? (snap.data().displayName ?? null) : null;
};

export const signInWithGoogle = async (): Promise<UserCredential> => {
    const provider = new GoogleAuthProvider();
    const credential = await signInWithPopup(auth, provider);
    const { uid, displayName, email } = credential.user;
    await saveUserProfile(uid, displayName ?? '', email ?? '');
    return credential;
};

export const registerWithEmail = async (displayName: string, email: string, password: string) => {
    const credential = await createUserWithEmailAndPassword(auth, email, password);
    await updateProfile(credential.user, { displayName });
    await saveUserProfile(credential.user.uid, displayName, email);
    return credential;
};

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