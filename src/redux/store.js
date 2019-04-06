import { createStore } from 'redux';
import userReducer from './reducers/user_reducer';

export default createStore(userReducer);