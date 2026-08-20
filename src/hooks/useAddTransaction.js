import {addDoc, collection, serverTimestamp} from "firebase/firestore";
import {db} from '../config/firebase-config';
import {useGetUserInfo} from './useGetUserInfo';


export const useAddTransaction = () => {
    const {userID} = useGetUserInfo();

    const transactionCollectionRef = collection(db, "transactions");
    
    const addTransaction = async (description, transactionAmount, transactionType) => {
        await addDoc(transactionCollectionRef, {
            userID,
            description,
            transactionAmount,
            transactionType,
            createdAt: serverTimestamp()
        
        });
    };
    return {addTransaction};
};