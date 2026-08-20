import { deleteDoc, doc } from "firebase/firestore";
import { db } from "../config/firebase-config";

export const useDeleteTransaction = () => {
  const deleteTransaction = async (transactionId) => {
    if (!transactionId) {
      throw new Error("Transaction ID is required.");
    }

    const transactionRef = doc(db, "transactions", transactionId);
    await deleteDoc(transactionRef);
  };

  return { deleteTransaction };
};
