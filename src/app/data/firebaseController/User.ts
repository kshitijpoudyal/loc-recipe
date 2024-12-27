import {auth} from "@/app/data/firebaseController/firebase";
import { signInWithEmailAndPassword } from 'firebase/auth';

export const authenticateUser = async (email:string, password: string) => {
    await signInWithEmailAndPassword(auth, email, password);
}

// export const handleLogout = async () => {
//     await auth().signOut();
//     // Redirect to login page or home
// };