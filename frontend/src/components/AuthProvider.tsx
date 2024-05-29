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
  roles: string | null;
}

export interface AuthState {
  token: string | null;
  loading: boolean;
  roles: string | null;
}

const initialState = { token: null, loading: true, roles: null };

const AuthContext = createContext<AuthState>(initialState);
export const AuthDispatchContext = createContext<Dispatch<AuthAction>>(
  () => null
);

function authReducer(state: AuthState, action: AuthAction): AuthState {
  // FIXME: Invoked 4 times in (home)
  switch (action.type) {
    case AuthActionKind.Login: {
      return { token: action.token, loading: false, roles: action.roles };
    }
    case AuthActionKind.Logout: {
      return { token: null, loading: false, roles: action.roles };
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
    const storedRoles = localStorage.getItem("roles");
    if (storedToken) {
      dispatch({
        type: AuthActionKind.Login,
        token: storedToken,
        roles: storedRoles,
      });
    } else {
      dispatch({ type: AuthActionKind.Logout, token: null, roles: null });
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
