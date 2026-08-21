import { useEffect, useState } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../config/firebase-config';

export const useGetUserInfo = () => {
  const [userInfo, setUserInfo] = useState(() => {
    try {
      const raw = localStorage.getItem("auth");
      if (!raw) return { name: 'Guest', profilePhoto: null, userID: null, isAuth: false };

      const parsed = JSON.parse(raw);
      if (!parsed || typeof parsed !== 'object') {
        return { name: 'Guest', profilePhoto: null, userID: null, isAuth: false };
      }

      const { name = 'Guest', profilePhoto = null, userID = null, isAuth = false } = parsed;
      const cleanProfilePhoto = profilePhoto && !profilePhoto.includes("unsplash.com") ? profilePhoto : null;

      return { name, profilePhoto: cleanProfilePhoto, userID, isAuth };
    } catch {
      return { name: 'Guest', profilePhoto: null, userID: null, isAuth: false };
    }
  });

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        const cleanPhoto = user.photoURL && !user.photoURL.includes("unsplash.com") ? user.photoURL : null;
        
        const updatedUser = {
          name: user.displayName || 'User',
          profilePhoto: cleanPhoto,
          userID: user.uid,
          isAuth: true,
        };

        setUserInfo(updatedUser);
        localStorage.setItem("auth", JSON.stringify(updatedUser));
      } else {
        const guestUser = { name: 'Guest', profilePhoto: null, userID: null, isAuth: false };
        setUserInfo(guestUser);
        localStorage.removeItem("auth");
      }
    });

    return () => unsubscribe();
  }, []);

  return userInfo;
};