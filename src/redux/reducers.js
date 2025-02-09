import { SET_CERTIFICATE } from './actions';

const initialState = {
  certificate: null,
};

export const certificateReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_CERTIFICATE:
      return { ...state, certificate: action.payload };
    default:
      return state;
  }
};






