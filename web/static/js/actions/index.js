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
export const REMOVE_LIST = "REMOVE_LIST";

export const CREATE_LIST_REQUEST = "CREATE_LIST_REQUEST";
export const CREATE_LIST_SUCCESS = "CREATE_LIST_SUCCESS";
export const CREATE_LIST_FAILURE = "CREATE_LIST_FAILURE";

export const ADD_TASK_REQUEST = "ADD_TASK_REQUEST";
export const ADD_TASK_SUCCESS = "ADD_TASK_SUCCESS";
export const ADD_TASK_FAILURE = "ADD_TASK_FAILURE";

export const SET_CHECKED_STATUS_REQUEST = "SET_CHECKED_STATUS_REQUEST";
export const SET_CHECKED_STATUS_SUCCESS = "SET_CHECKED_STATUS_SUCCESS";
export const SET_CHECKED_STATUS_FAILURE = "SET_CHECKED_STATUS_FAILURE";

export const UPDATE_NAME_REQUEST = "UPDATE_NAME_REQUEST";
export const UPDATE_NAME_SUCCESS = "UPDATE_NAME_SUCCESS";
export const UPDATE_NAME_FAILURE = "UPDATE_NAME_FAILURE";

export const DELETE_LIST_REQUEST = "DELETE_LIST_REQUEST";
export const DELETE_LIST_SUCCESS = "DELETE_LIST_SUCCESS";
export const DELETE_LIST_FAILURE = "DELETE_LIST_FAILURE";

export const MAKE_PRIVATE_REQUEST = "MAKE_PRIVATE_REQUEST";
export const MAKE_PRIVATE_SUCCESS = "MAKE_PRIVATE_SUCCESS";
export const MAKE_PRIVATE_FAILURE = "MAKE_PRIVATE_FAILURE";

export const DELETE_TODO_REQUEST = "DELETE_TODO_REQUEST";
export const DELETE_TODO_SUCCESS = "DELETE_TODO_SUCCESS";
export const DELETE_TODO_FAILURE = "DELETE_TODO_FAILURE";

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

export function removeList(list) {
  return { type: REMOVE_LIST, list };
}

export function connectSocket(jwt) {
  return (dispatch, getState) => {
    let socket = new Socket("/socket", {
      params: {
        guardian_token: jwt
      }
    });
    socket.connect();
    dispatch({ type: CONNECT_SOCKET, socket });
    dispatch(joinListsChannel("lists"));
  };
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
          dispatch(connectSocket(res.jwt));
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
          dispatch(connectSocket(res.jwt));
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
          dispatch(connectSocket(res.jwt));
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

export function setCheckedStatusRequest() {
  return { type: SET_CHECKED_STATUS_REQUEST };
}

export function setCheckedStatusSuccess() {
  return { type: SET_CHECKED_STATUS_SUCCESS };
}

export function setCheckedStatusFailure() {
  return { type: SET_CHECKED_STATUS_FAILURE };
}


export function setCheckedStatus(todo_id, status) {
  return (dispatch, getState) => {
    const { channel } = getState();
    dispatch(setCheckedStatusRequest());
    channel.push("set_checked_status", { todo_id, status })
      .receive("ok", (list) => {
        dispatch(setCheckedStatusSuccess());
      })
      .receive("error", () => dispatch(setCheckedStatusFailure()))
      .receive("timeout", () => dispatch(setCheckedStatusFailure()));
  }
}

export function createAddListListeners(channel) {
  return (dispatch, getState) => {
    channel.on("add_list", list => {
      dispatch(addList(list));
    });
    channel.on("update_list", list => {
      console.log("update_list", list)
      dispatch(updateList(list));
    })
    channel.on("remove_list", list => {
      dispatch(removeList(list));
    });
  };
}

export function updateNameRequest() {
  return { type: UPDATE_NAME_REQUEST };
}

export function updateNameSuccess() {
  return { type: UPDATE_NAME_SUCCESS };
}

export function updateNameFailure() {
  return { type: UPDATE_NAME_FAILURE };
}

export function updateName(list_id, name) {
  return (dispatch, getState) => {
    const { channel } = getState();
    dispatch(updateNameRequest());
    channel.push("update_name", { list_id, name })
      .receive("ok", (list) => {
        dispatch(updateNameSuccess());
      })
      .receive("error", () => dispatch(updateNameFailure()))
      .receive("timeout", () => dispatch(updateNameFailure()));
  }
}

export function deleteListRequest() {
  return { type: DELETE_LIST_REQUEST };
}

export function deleteListSuccess() {
  return { type: DELETE_LIST_SUCCESS };
}

export function deleteListFailure() {
  return { type: DELETE_LIST_FAILURE };
}

export function deleteList(list_id, name) {
  return (dispatch, getState) => {
    const { channel } = getState();
    dispatch(deleteListRequest());
    channel.push("delete_list", { list_id, name })
      .receive("ok", (list) => {
        dispatch(deleteListSuccess());
      })
      .receive("error", () => dispatch(deleteListFailure()))
      .receive("timeout", () => dispatch(deleteListFailure()));
  }
}

export function makePrivateRequest() {
  return { type: MAKE_PRIVATE_REQUEST };
}

export function makePrivateSuccess() {
  return { type: MAKE_PRIVATE_SUCCESS };
}

export function makePrivateFailure() {
  return { type: MAKE_PRIVATE_FAILURE };
}

export function makePrivate(list_id) {
  return (dispatch, getState) => {
    const { channel } = getState();
    dispatch(makePrivateRequest());
    channel.push("make_private", { list_id })
      .receive("ok", (list) => {
        dispatch(makePrivateSuccess());
      })
      .receive("error", () => dispatch(makePrivateFailure()))
      .receive("timeout", () => dispatch(makePrivateFailure()));
  }
}

export function deleteTodoRequest() {
  return { type: DELETE_TODO_REQUEST };
}

export function deleteTodoSuccess() {
  return { type: DELETE_TODO_SUCCESS };
}

export function deleteTodoFailure() {
  return { type: DELETE_TODO_FAILURE };
}

export function deleteTodo(todo_id, name) {
  return (dispatch, getState) => {
    const { channel } = getState();
    dispatch(deleteTodoRequest());
    channel.push("delete_todo", { todo_id, name })
      .receive("ok", (list) => {
        dispatch(deleteTodoSuccess());
      })
      .receive("error", () => dispatch(deleteTodoFailure()))
      .receive("timeout", () => dispatch(deleteTodoFailure()));
  }
}
