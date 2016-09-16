export const SIGN_UP_REQUEST = "SIGN_UP_REQUEST";
export const SIGN_UP_SUCCESS = "SIGN_UP_SUCCESS";
export const SIGN_UP_FAILURE = "SIGN_UP_FAILURE";

export const SIGN_OUT_REQUEST = "SIGN_OUT_REQUEST";
export const SIGN_OUT_SUCCESS = "SIGN_OUT_SUCCESS";
export const SIGN_OUT_FAILURE = "SIGN_OUT_FAILURE";

export function signUpRequest() {
  return { type: SIGN_UP_REQUEST };
}

export function signUpSuccess(user, jwt) {
  return { type: SIGN_UP_SUCCESS, user, jwt };
}

export function signUpFailure(errors) {
  return { type: SIGN_UP_FAILURE, errors };
}

export function signOutRequest() {
  return { type: SIGN_OUT_REQUEST };
}

export function signOutSuccess() {
  return { type: SIGN_OUT_SUCCESS };
}

export function signOutFailure(errors) {
  return { type: SIGN_OUT_FAILURE, errors };
}

export function signUp(email, password, password_confirm) {
  return (dispatch) => {
    dispatch(signUpRequest());

    let errors = [];
    if (!email) {
      errors.push({ email: "Email required" });
    }
    if (!password) {
      errors.push({ password: "Password required" });
    }
    if (password_confirm !== password) {
      errors.push({ password_confirm: "Please confirm your password" });
    }
    if (errors.length) {
      return Promise.resolve(dispatch(signUpFailure(errors)));
    }

    return fetch("/api/users", {
      method: "post",
      headers: {
        "Accept": "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        user: {
          email,
          password,
          password_confirm
        }
      })
    })
      .then((res) => res.json())
      .then((res) => {
        if (res.errors) {
          dispatch(signUpFailure(res.errors));
          return false;
        }
        else {
          dispatch(signUpSuccess(res.user, res.jwt));
          return true;
        }
      });
  }
}

export function signOut(jwt) {
  return (dispatch) => {
    dispatch(signOutRequest());
    return fetch("/api/sessions", {
      method: "delete",
      headers: {
        "Accept": "application/json",
        "Content-Type": "application/json",
        "Authorization": jwt
      }
    })
      .then((res) => res.json())
      .then((res) => {
        if (res.errors) {
          dispatch(signOutFailure(res.errors));
          return false;
        }
        else {
          dispatch(signOutSuccess());
          return true;
        }
      });
  }
}
