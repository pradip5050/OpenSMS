import {
  createContext,
  useContext,
  useEffect,
  useReducer,
  Dispatch,
} from "react";

export enum AuthActionKind {
  Login = "LOGIN",
  Logout = "LOGOUT",
}

export interface AuthAction {
  type: AuthActionKind;
  token: string | null;
}

interface AuthState {
  token: string | null;
}

const AuthContext = createContext<AuthState>({ token: null });
export const AuthDispatchContext = createContext<Dispatch<AuthAction>>(
  () => null
);

function authReducer(state: AuthState, action: AuthAction): AuthState {
  console.log(action.type, action.token);
  switch (action.type) {
    case AuthActionKind.Login: {
      return { token: action.token };
    }
    case AuthActionKind.Logout: {
      return { token: null };
    }
    default: {
      return state;
    }
  }
}

export const AuthProvider = ({ children }: any) => {
  const [state, dispatch] = useReducer(authReducer, { token: null });

  // useEffect(() => {
  //   const storedToken = localStorage.getItem("token");
  //   if (storedToken) {
  //     dispatch({ type: AuthActionKind.login, token: storedToken });
  //   }
  // }, []);

  // const login = (newToken: string) => {
  //   localStorage.setItem("token", newToken);
  //   dispatch({ type: AuthActionKind.login, token: newToken });
  // };

  // const logout = () => {
  //   localStorage.removeItem("token");
  //   dispatch({ type: AuthActionKind.logout, token: null });
  // };

  return (
    <AuthContext.Provider value={state}>
      <AuthDispatchContext.Provider value={dispatch}>
        {children}
      </AuthDispatchContext.Provider>
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
export const useAuthDispatch = () => useContext(AuthDispatchContext);
