import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  currentUser: null,
  loading: false,
  error: false,
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    signInStart: (state) => {
      state.loading = true;
    },
    signInSuccess: (state, action) => {
      state.currentUser = action.payload;
      state.loading = false;
      state.error = false;
    },
    signInFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    updateUserStart: (state)=>{
      state.loading = true
    },
    UpdateUserSucess: (state, action)=>{
      state.currentUser = action.payload;
      state.loading = false;
      state.error = false
    },
    UpdateUserFailure: (state)=>{
      state.currentUser = null;
      state.loading = false;
      state.error = action.payload;
    },
    UserSignOut: (state)=>{
      state.currentUser = null,
      state.loading = false,
      state.error = false
    }
  },
});

export const { signInStart, signInSuccess, signInFailure, updateUserStart, UpdateUserSucess, UpdateUserFailure, UserSignOut} = userSlice.actions;

export default userSlice.reducer;