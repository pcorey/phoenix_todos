export const SIGN_UP_REQUEST = "SIGN_UP_REQUEST";
export const SIGN_UP_SUCCESS = "SIGN_UP_SUCCESS";
export const SIGN_UP_FAILURE = "SIGN_UP_FAILURE";

export function signUpRequest() {
  return { type: SIGN_UP_REQUEST };
}

export function signUpSuccess(user, jwt) {
  return { type: SIGN_UP_SUCCESS, user, jwt };
}

export function signUpFailure(errors) {
  return { type: SIGN_UP_FAILURE, errors };
}

export function signUp(email, password, password_confirm) {
  return (dispatch) => {
    dispatch(signUpRequest());
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
