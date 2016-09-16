import {
  SIGN_UP_REQUEST,
  SIGN_UP_SUCCESS,
  SIGN_UP_FAILURE,
} from "../actions";

const initialState = {
  user: undefined,
  jwt: undefined,
  loading: false,
  connected: true,
  menuOpen: false,
  lists: [],
  errors: []
};

export default (state = initialState, action) => {
  switch (action.type) {
  case SIGN_UP_REQUEST:
    return state;
  case SIGN_UP_SUCCESS:
    return Object.assign({}, state, {
      user: action.user,
      jwt: action.jwt
    });
  case SIGN_UP_FAILURE:
    return Object.assign({}, state, {
      errors: action.errors
    });
  default:
    return state;
  }
}