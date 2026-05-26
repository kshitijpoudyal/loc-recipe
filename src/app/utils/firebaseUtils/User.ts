import {auth, db} from "@/app/config/firebase";
import {signInWithEmailAndPassword, createUserWithEmailAndPassword, signInWithPopup, signInWithRedirect, GoogleAuthProvider, updateProfile, User, UserCredential, getRedirectResult, sendPasswordResetEmail} from 'firebase/auth';
import {doc, setDoc, getDoc} from 'firebase/firestore';

export const saveUserProfile = async (uid: string, displayName: string, email: string) => {
    await setDoc(doc(db, 'users', uid), { displayName, email }, { merge: true });
};

export const getUserDisplayName = async (uid: string): Promise<string | null> => {
    const snap = await getDoc(doc(db, 'users', uid));
    return snap.exists() ? (snap.data().displayName ?? null) : null;
};

export const handleGoogleRedirectResult = async (): Promise<UserCredential | null> => {
    const result = await getRedirectResult(auth);
    if (result) {
        const { uid, displayName, email } = result.user;
        await saveUserProfile(uid, displayName ?? '', email ?? '');
    }
    return result;
};

export const signInWithGoogle = async (): Promise<UserCredential | null> => {
    const provider = new GoogleAuthProvider();
    const isMobile = typeof window !== 'undefined' && /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
    if (isMobile) {
        await signInWithRedirect(auth, provider);
        return null;
    }
    try {
        const credential = await signInWithPopup(auth, provider);
        const { uid, displayName, email } = credential.user;
        await saveUserProfile(uid, displayName ?? '', email ?? '');
        return credential;
    } catch (err: unknown) {
        const code = (err as { code?: string }).code;
        // Fall back to redirect if popup was blocked
        if (code === 'auth/popup-blocked' || code === 'auth/popup-closed-by-user') {
            await signInWithRedirect(auth, provider);
            return null;
        }
        throw err;
    }
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

export const sendPasswordReset = async (email: string) => {
    await sendPasswordResetEmail(auth, email);
};