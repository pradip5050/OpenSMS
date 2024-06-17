import { User } from "@/lib/login/login";
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
  token?: string;
  exp?: number;
  user?: User;
}

export interface AuthState {
  token?: string;
  exp?: number;
  loading: boolean;
  user?: User;
}

const initialState = { loading: true };

const AuthContext = createContext<AuthState>(initialState);
export const AuthDispatchContext = createContext<Dispatch<AuthAction>>(
  () => null
);

function authReducer(state: AuthState, action: AuthAction): AuthState {
  // FIXME: Invoked 2x2 times in (home)
  switch (action.type) {
    case AuthActionKind.Login: {
      return {
        token: action.token,
        exp: action.exp,
        loading: false,
        user: action.user,
      };
    }
    case AuthActionKind.Logout: {
      return { loading: true };
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
    const storedExp = localStorage.getItem("exp");
    const storedUser: User = JSON.parse(localStorage.getItem("user")!);
    const isExpired = new Date(Number(storedExp ?? "0") * 1000) < new Date();
    // TODO: Implement refresh if user is active

    if (storedToken && storedExp && storedToken && !isExpired) {
      dispatch({
        type: AuthActionKind.Login,
        exp: Number(storedExp),
        token: storedToken,
        user: storedUser,
      });
    } else {
      dispatch({ type: AuthActionKind.Logout });
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
