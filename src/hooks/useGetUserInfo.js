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
        return { name, profilePhoto, userID, isAuth };
    } catch (err) {
        // If parsing fails, return safe defaults and log the error for debugging
        // Keep logs minimal to avoid exposing sensitive data
        // eslint-disable-next-line no-console
        console.warn('useGetUserInfo: failed to read user info from localStorage', err);
        return { name: 'Guest', profilePhoto: null, userID: null, isAuth: false };
    }
};
