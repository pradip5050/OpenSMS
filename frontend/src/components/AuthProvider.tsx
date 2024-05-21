import {
  createContext,
  useContext,
  useState,
  useEffect,
  useReducer,
  Dispatch,
} from "react";

enum AuthActionKind {
  login,
  logout,
}

interface AuthAction {
  type: AuthActionKind;
  payload: string | null;
}

interface AuthState {
  token: string | null;
}

const AuthContext = createContext<AuthState>({ token: null });
// TODO:
const AuthDispatchContext = createContext<Dispatch<AuthAction>>(null);

function authReducer(state: AuthState, action: AuthAction): AuthState {
  switch (action.type) {
    case AuthActionKind.login: {
      return { token: action.payload };
    }
    case AuthActionKind.logout: {
      return { token: null };
    }
  }
}

export const AuthProvider = ({ children }: any) => {
  const [state, dispatch] = useReducer(authReducer, { token: null });

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    if (storedToken) {
      dispatch({ type: AuthActionKind.login, payload: storedToken });
    }
  }, []);

  const login = (newToken: string) => {
    localStorage.setItem("token", newToken);
    dispatch({ type: AuthActionKind.login, payload: newToken });
  };

  const logout = () => {
    localStorage.removeItem("token");
    dispatch({ type: AuthActionKind.logout, payload: null });
  };

  return (
    <AuthContext.Provider value={state}>
      <AuthDispatchContext.Provider value={dispatch}>
        {children}
      </AuthDispatchContext.Provider>
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
