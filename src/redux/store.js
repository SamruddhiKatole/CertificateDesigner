import { createStore } from 'redux';
import certificateReducer from './reducers';

const store = createStore(certificateReducer);

export default store;
