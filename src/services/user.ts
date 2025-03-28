import { collection, addDoc, getDocs, updateDoc, doc, query, orderBy, deleteDoc } from "firebase/firestore";
import { UserData } from "../types/user";
import { db } from "@/config/firebase";

// export const addUser = async (userData: UserData) => {
//     try {
//         const docRef = await addDoc(collection(db, "users"), userData);
//         return docRef.id;
//     } catch (error) {
//         console.error("Error adding user: ", error);
//         throw error;
//     }
// };

export const addUser = async (userData: UserData) => {
    try {
        if (!db) {
            throw new Error('Firebase is not initialized');
        }
        const docRef = await addDoc(collection(db, "users"), userData);
        return docRef.id;
    } catch (error) {
        console.error("Error adding user: ", error);
        throw error;
    }
};

export const updateUser = async (userId: string, userData: Partial<UserData>) => {
    try {
        const userRef = doc(db, "users", userId);
        await updateDoc(userRef, userData);
    } catch (error) {
        console.error("Error updating user: ", error);
        throw error;
    }
};

export const getUsers = async () => {
    try {
        const q = query(
            collection(db, "users"),
            orderBy("lastName"),
            orderBy("firstName")
        );
        const querySnapshot = await getDocs(q);
        return querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));
    } catch (error) {
        console.error("Error getting users: ", error);
        throw error;
    }
};

export const deleteUser = async (userId: string) => {
    try {
        if (!db) {
            throw new Error('Firebase is not initialized');
        }
        const userRef = doc(db, "users", userId);
        await deleteDoc(userRef);
        return true;
    } catch (error) {
        console.error("Error deleting user: ", error);
        throw error;
    }
};