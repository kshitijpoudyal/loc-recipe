import {doc, getDoc} from "firebase/firestore";
import {db} from "@/app/lib/firebase";

export const fetchSpecificDocument = async (collectionName: string, documentId: string) => {
    try {
        // Create a reference to the specific document
        const docRef = doc(db, collectionName, documentId);

        // Fetch the document
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            return docSnap.data(); // Returns the document data
        } else {
            console.log('No such document!');
            return null;
        }
    } catch (error) {
        console.error('Error fetching document:', error);
    }
};