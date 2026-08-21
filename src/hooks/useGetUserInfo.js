export const useGetUserInfo = () => {
  try {
    const raw = localStorage.getItem("auth");
    if (!raw) {
      return { name: 'Guest', profilePhoto: null, userID: null, isAuth: false };
    }

    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed !== 'object') {
      return { name: 'Guest', profilePhoto: null, userID: null, isAuth: false };
    }

    const { name = 'Guest', profilePhoto = null, userID = null, isAuth = false } = parsed;

    // Remove unsplash fallback links so email users don't display a default photo
    const cleanProfilePhoto =
      profilePhoto && !profilePhoto.includes("unsplash.com")
        ? profilePhoto
        : null;

    return { name, profilePhoto: cleanProfilePhoto, userID, isAuth };
  } catch (err) {
    console.warn('useGetUserInfo: failed to read user info from localStorage', err);
    return { name: 'Guest', profilePhoto: null, userID: null, isAuth: false };
  }
};