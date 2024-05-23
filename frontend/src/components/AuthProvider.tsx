import {
  createContext,
  useContext,
  useEffect,
  useReducer,
  Dispatch,
  useMemo,
  useLayoutEffect,
} from "react";
import AuthError from "./AuthError";

export enum AuthActionKind {
  Login = "LOGIN",
  Logout = "LOGOUT",
}

export interface AuthAction {
  type: AuthActionKind;
  token: string | null;
}

export interface AuthState {
  token: string | null;
  loading: boolean;
}

const initialState = { token: null, loading: true };

const AuthContext = createContext<AuthState>(initialState);
export const AuthDispatchContext = createContext<Dispatch<AuthAction>>(
  () => null
);

function authReducer(state: AuthState, action: AuthAction): AuthState {
  // FIXME: Invoked 4 times in (home)
  switch (action.type) {
    case AuthActionKind.Login: {
      return { token: action.token, loading: false };
    }
    case AuthActionKind.Logout: {
      return { token: null, loading: false };
    }
    default: {
      return state;
    }
  }
}

export const AuthProvider = ({ children }: any) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    if (storedToken) {
      dispatch({ type: AuthActionKind.Login, token: storedToken });
    } else {
      dispatch({ type: AuthActionKind.Logout, token: null });
    }
  }, []);

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
