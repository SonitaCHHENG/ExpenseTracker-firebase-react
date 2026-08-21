import { useEffect, useState } from "react";
import { query, collection, where, orderBy, onSnapshot } from "firebase/firestore";
import { db } from "../config/firebase-config";
import { useGetUserInfo } from "./useGetUserInfo";

export const useGetTransactions = () => {
  const [transactions, setTransactions] = useState([]);
  const [transactionTotals, setTransactionTotals] = useState({
    balance: 0.0,
    income: 0.0,
    expenses: 0.0,
  });

  const { userID, isAuth } = useGetUserInfo();
  const transactionCollectionRef = collection(db, "transactions");

  useEffect(() => {
    // SECURITY GUARD: Do NOT query Firestore if user is not authenticated or userID is missing
    if (!isAuth || !userID) {
      setTransactions([]);
      setTransactionTotals({ balance: 0.0, income: 0.0, expenses: 0.0 });
      return;
    }

    let unsubscribe;
    try {
      const queryTransactions = query(
        transactionCollectionRef,
        where("userID", "==", userID),
        orderBy("createdAt")
      );

      unsubscribe = onSnapshot(queryTransactions, (snapshot) => {
        let docs = [];
        let totalIncome = 0;
        let totalExpenses = 0;

        snapshot.forEach((doc) => {
          const data = doc.data();
          const id = doc.id;

          docs.push({ ...data, id });

          if (data.transactionType === "expense") {
            totalExpenses += Number(data.transactionAmount);
          } else {
            totalIncome += Number(data.transactionAmount);
          }
        });

        setTransactions(docs);
        setTransactionTotals({
          balance: totalIncome - totalExpenses,
          expenses: totalExpenses,
          income: totalIncome,
        });
      });
    } catch (error) {
      console.error("Error fetching transactions:", error);
    }

    return () => unsubscribe && unsubscribe();
  }, [userID, isAuth]);

  return { transactions, transactionTotals };
};