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
  user?: User;
}

export interface AuthState {
  token?: string;
  loading: boolean;
  user?: User;
}

const initialState = { loading: true };

const AuthContext = createContext<AuthState>(initialState);
export const AuthDispatchContext = createContext<Dispatch<AuthAction>>(
  () => null
);

function authReducer(state: AuthState, action: AuthAction): AuthState {
  // FIXME: Invoked 4 times in (home)
  switch (action.type) {
    case AuthActionKind.Login: {
      return { token: action.token, loading: false, user: action.user };
    }
    case AuthActionKind.Logout: {
      return { loading: false };
    }
    default: {
      return state;
    }
  }
}

// TODO: Add auth role state
export const AuthProvider = ({ children }: any) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    const storedUser: User = JSON.parse(localStorage.getItem("user")!);
    if (storedToken) {
      dispatch({
        type: AuthActionKind.Login,
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
