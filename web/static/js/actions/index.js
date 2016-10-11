import { Socket } from "deps/phoenix/web/static/js/phoenix"

export const SIGN_UP_REQUEST = "SIGN_UP_REQUEST";
export const SIGN_UP_SUCCESS = "SIGN_UP_SUCCESS";
export const SIGN_UP_FAILURE = "SIGN_UP_FAILURE";

export const SIGN_OUT_REQUEST = "SIGN_OUT_REQUEST";
export const SIGN_OUT_SUCCESS = "SIGN_OUT_SUCCESS";
export const SIGN_OUT_FAILURE = "SIGN_OUT_FAILURE";

export const SIGN_IN_REQUEST = "SIGN_IN_REQUEST";
export const SIGN_IN_SUCCESS = "SIGN_IN_SUCCESS";
export const SIGN_IN_FAILURE = "SIGN_IN_FAILURE";

export const CONNECT_SOCKET = "CONNECT_SOCKET";

export const JOIN_LISTS_CHANNEL_REQUEST = "JOIN_LISTS_CHANNEL_REQUEST";
export const JOIN_LISTS_CHANNEL_SUCCESS = "JOIN_LISTS_CHANNEL_SUCCESS";
export const JOIN_LISTS_CHANNEL_FAILURE = "JOIN_LISTS_CHANNEL_FAILURE";

export const ADD_LIST = "ADD_LIST";
export const UPDATE_LIST = "UPDATE_LIST";

export const CREATE_LIST_REQUEST = "CREATE_LIST_REQUEST";
export const CREATE_LIST_SUCCESS = "CREATE_LIST_SUCCESS";
export const CREATE_LIST_FAILURE = "CREATE_LIST_FAILURE";

export const ADD_TASK_REQUEST = "ADD_TASK_REQUEST";
export const ADD_TASK_SUCCESS = "ADD_TASK_SUCCESS";
export const ADD_TASK_FAILURE = "ADD_TASK_FAILURE";

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

export function signInRequest() {
  return { type: SIGN_IN_REQUEST };
}

export function signInSuccess() {
  return { type: SIGN_IN_SUCCESS };
}

export function signInFailure(errors) {
  return { type: SIGN_IN_FAILURE, errors };
}

export function addList(list) {
  return { type: ADD_LIST, list };
}

export function updateList(list) {
  return { type: UPDATE_LIST, list };
}

export function connectSocket(jwt) {
  let socket = new Socket("/socket", {
    params: {
      token: jwt
    }
  });
  socket.connect();
  return { type: CONNECT_SOCKET, socket };
}

export function joinListsChannelRequest(channel) {
  return { type: JOIN_LISTS_CHANNEL_REQUEST, channel };
}

export function joinListsChannelSuccess(channel) {
  return { type: JOIN_LISTS_CHANNEL_SUCCESS, channel };
}

export function joinListsChannelFailure(channel, error) {
  return { type: JOIN_LISTS_CHANNEL_FAILURE, channel, error };
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
          localStorage.setItem("user", JSON.stringify(res.user));
          localStorage.setItem("jwt", res.jwt);
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
          localStorage.removeItem("user");
          localStorage.removeItem("jwt");
          dispatch(signOutSuccess());
          return true;
        }
      });
  }
}

export function signIn(email, password) {
  return (dispatch) => {
    dispatch(signInRequest());

    let errors = [];
    if (!email) {
      errors.push({ email: "Email required" });
    }
    if (!password) {
      errors.push({ password: "Password required" });
    }
    if (errors.length) {
      return Promise.resolve(dispatch(signInFailure(errors)));
    }

    return fetch("/api/sessions", {
      method: "post",
      headers: {
        "Accept": "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password })
    })
      .then((res) => res.json())
      .then((res) => {
        if (res.errors) {
          dispatch(signInFailure(res.errors));
          return false;
        }
        else {
          localStorage.setItem("user", JSON.stringify(res.user));
          localStorage.setItem("jwt", res.jwt);
          dispatch(signInSuccess(res.user, res.jwt));
          return true;
        }
      });
  }
}

export function joinListsChannel(channelName) {
  return (dispatch, getState) => {
    const { socket } = getState();

    dispatch(joinListsChannelRequest());

    let channel = socket.channel(channelName);
    channel
      .join()
      .receive("ok", (lists) => {
        lists.forEach((list) => {
          dispatch(addList(list));
        });
        dispatch(joinListsChannelSuccess(channel));
        dispatch(createAddListListeners(channel));
      })
      .receive("error", (error) => {
        dispatch(joinListsChannelFailure(channel, error));
      });
  }
}

export function createListRequest() {
  return { type: CREATE_LIST_REQUEST };
}

export function createListSuccess() {
  return { type: CREATE_LIST_SUCCESS };
}

export function createListFailure() {
  return { type: CREATE_LIST_FAILURE };
}

export function createList(router) {
  return (dispatch, getState) => {
    const { channel } = getState();
    dispatch(createListRequest());
    channel.push("create_list")
      .receive("ok", (list) => {
        dispatch(createListSuccess());
        router.push(`/lists/${ list.id }`);
      })
      .receive("error", () => dispatch(createListFailure()))
      .receive("timeout", () => dispatch(createListFailure()));
  }
}

export function addTaskRequest() {
  return { type: ADD_TASK_REQUEST };
}

export function addTaskSuccess() {
  return { type: ADD_TASK_SUCCESS };
}

export function addTaskFailure() {
  return { type: ADD_TASK_FAILURE };
}

export function addTask(list_id, text) {
  return (dispatch, getState) => {
    const { channel } = getState();
    dispatch(addTaskRequest());
    channel.push("add_task", { list_id, text })
      .receive("ok", (list) => {
        dispatch(addTaskSuccess());
      })
      .receive("error", () => dispatch(addTaskFailure()))
      .receive("timeout", () => dispatch(addTaskFailure()));
  }
}

export function createAddListListeners(channel) {
  return (dispatch, getState) => {
    channel.on("add_list", list => {
      dispatch(addList(list));
    });
    channel.on("update_list", list => {
      dispatch(updateList(list));
    })
  };
}
