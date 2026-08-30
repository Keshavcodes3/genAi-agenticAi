import { Provider } from "react-redux";
import { authStore } from "../Redux/store.js";
import { useAuth } from "../Hooks/useAuth.jsx";

const AuthInitializer = ({ children }) => {
    useAuth({ autoFetchMe: true });

    return <>{children}</>;
};

const AuthProvider = ({ children }) => {
    return (
        <Provider store={authStore}>
            <AuthInitializer>
                {children}
            </AuthInitializer>
        </Provider>
    );
};

export default AuthProvider;