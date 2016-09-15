const initialState = {
    user: undefined,
    jwt: undefined,
    loading: false,
    connected: true,
    menuOpen: false,
    lists: []
};

export default (state = initialState, action) => {
    switch (action.type) {
        default:
            return state;
    }
}
