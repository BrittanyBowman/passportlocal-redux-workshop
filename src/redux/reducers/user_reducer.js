//Redux State
const initialState = {
    user: {}
};

//Action Types
const LOGIN = 'LOGIN';

//Action Creators || Dispatchers
export function login(userCredentials){
    const action =  {
        type: LOGIN,
        payload: userCredentials
    }
    return action;
}

//Reducer
export default function userReducer(state = initialState, action){
    switch(action.type){
        case LOGIN:
            return Object.assign({}, state, {user: action.payload})
        default:
            return state;
    }
}