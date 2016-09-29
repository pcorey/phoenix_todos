import {
  SIGN_UP_REQUEST,
  SIGN_UP_SUCCESS,
  SIGN_UP_FAILURE,
  SIGN_OUT_REQUEST,
  SIGN_OUT_SUCCESS,
  SIGN_OUT_FAILURE,
  SIGN_IN_REQUEST,
  SIGN_IN_SUCCESS,
  SIGN_IN_FAILURE,
  CONNECT_SOCKET,
  ADD_LIST,
} from "../actions";

const user = localStorage.getItem("user");
const jwt = localStorage.getItem("jwt");

const initialState = {
  socket: undefined,
  user: user ? JSON.parse(user) : user,
  jwt,
  loading: false,
  connected: true,
  menuOpen: false,
  lists: [],
  errors: []
};

export default (state = initialState, action) => {
  switch (action.type) {
  case SIGN_IN_REQUEST:
  case SIGN_UP_REQUEST:
    return state;
  case SIGN_IN_SUCCESS:
  case SIGN_UP_SUCCESS:
    return Object.assign({}, state, {
      user: action.user,
      jwt: action.jwt
    });
  case SIGN_IN_FAILURE:
  case SIGN_UP_FAILURE:
    return Object.assign({}, state, {
      errors: action.errors
    });

  case SIGN_OUT_REQUEST:
    return state;
  case SIGN_OUT_SUCCESS:
    return Object.assign({}, state, {
      user: undefined,
      jwt: undefined
    });
  case SIGN_OUT_FAILURE:
    return Object.assign({}, state, {
      errors: action.errors
    });
  case ADD_LIST:
    return Object.assign({}, state, {
      lists: [...state.lists, action.list]
    });
  case CONNECT_SOCKET:
    return Object.assign({}, state, { socket: action.socket });
  default:
    return state;
  }
}
