// src/context/AuthProvider.jsx
import { useState, useEffect } from "react";
import { AuthContext } from "./AuthContext";

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [activeAccountId, setActiveAccountId] = useState(null);
    const [accounts, setAccounts] = useState({});

    // 🔹 Récupérer authData (sessionStorage > localStorage)
    const getStoredAuthData = () => {
        try {
            const session = sessionStorage.getItem("authData");
            const local = localStorage.getItem("authData");
            const authData = session || local;
            return authData
                ? JSON.parse(authData)
                : { accounts: {}, activeAccountId: null };
        } catch (error) {
            console.error("Erreur parsing authData:", error);
            return { accounts: {}, activeAccountId: null };
        }
    };

    // 🔹 Sauvegarder authData (dans sessionStorage ET localStorage)
    const setStoredAuthData = (data) => {
        sessionStorage.setItem("authData", JSON.stringify(data));
        localStorage.setItem("authData", JSON.stringify(data));
    };

    // 🔹 Initialisation au montage
    useEffect(() => {
        const authData = getStoredAuthData();
        setAccounts(authData.accounts || {});
        setActiveAccountId(authData.activeAccountId || null);

        if (authData.activeAccountId && authData.accounts[authData.activeAccountId]) {
            setUser(authData.accounts[authData.activeAccountId].user);
        }
        setLoading(false);
    }, []);

    // 🔹 Connexion
    const login = async (token, userData) => {
        const authData = getStoredAuthData();
        const newAccounts = {
            ...authData.accounts,
            [userData.id]: { token, user: userData },
        };
        const updatedAuthData = {
            accounts: newAccounts,
            activeAccountId: userData.id,
        };

        setStoredAuthData(updatedAuthData);
        setAccounts(newAccounts);
        setActiveAccountId(userData.id);
        setUser(userData);
    };

    // 🔹 Déconnexion
    const logout = async (userId = activeAccountId) => {
        const authData = getStoredAuthData();
        const newAccounts = { ...authData.accounts };
        delete newAccounts[userId];
        const newActiveId = userId === authData.activeAccountId ? Object.keys(newAccounts)[0] || null : authData.activeAccountId;
        const updatedAuthData = {
            accounts: newAccounts,
            activeAccountId: newActiveId,
        };

        setStoredAuthData(updatedAuthData);
        setAccounts(newAccounts);
        setActiveAccountId(newActiveId);
        setUser(newActiveId ? newAccounts[newActiveId].user : null);
    };

    // 🔹 Switch de compte
    const switchAccount = async (accountId) => {
        const authData = getStoredAuthData();
        if (!authData.accounts[accountId]) return false;

        const updatedAuthData = { ...authData, activeAccountId: accountId };

        setStoredAuthData(updatedAuthData);
        setActiveAccountId(accountId);
        setUser(authData.accounts[accountId].user);

        return true;
    };

    const value = {
        user,
        accounts,
        login,
        logout,
        switchAccount,
        activeAccountId,
        loading,
        isAuthenticated: !!user,
        getToken: () => accounts[activeAccountId]?.token || null,
    };

    return (
        <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
    );
};