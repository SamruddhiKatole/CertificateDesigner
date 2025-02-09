export const addLayer = (layer) => ({
  type: 'ADD_LAYER',
  payload: layer,
});
// src/redux/actions.js
export const SET_CERTIFICATE = 'SET_CERTIFICATE';

export const setCertificate = (certificate) => ({
  type: SET_CERTIFICATE,
  payload: certificate,
});
