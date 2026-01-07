import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import {
  ID_SISTEMA,
  URL_HOST,
  URL_WS_SUPYCAP_CENTRAL,
} from "../../utils/constantes";
import * as etiquetas from "../../utils/login/etiquetas";

const initialStateLoginUser = {
  isLoadingLoginUserReducer: false,
  currentUser: null,
  errorLogin: null,
  aspirante: null,
};

export const login = createAsyncThunk(
  "loginUserReducer/login",
  async (dataLogin, thunkAPI) => {
    try {
      const response = await axios.post(
        `${URL_HOST}${URL_WS_SUPYCAP_CENTRAL}loginUser`,
        dataLogin,
        { headers: { "Content-Type": "application/json" } }
      );

      if (response.data.code != 200) {
        switch (response.data.code) {
          case 201:
            throw etiquetas.mensaje_codigo_201;
          case 202:
            throw etiquetas.mensaje_codigo_202;
          case 203:
            throw etiquetas.mensaje_codigo_203;
          case 204:
            throw etiquetas.mensaje_codigo_204;
          case 205:
            throw response.data.message ?? etiquetas.mensaje_codigo_205;
          case 207:
            throw etiquetas.mensaje_codigo_207;
          case 500:
            throw etiquetas.mensaje_codigo_500;
          default:
            throw etiquetas.mensaje_codigo_500;
        }
      }

      return response.data;
    } catch (error) {
      console.error(error);
      return thunkAPI.rejectWithValue(
        error.message != undefined ? error.message : error
      );
    }
  }
);

export const refreshToken = createAsyncThunk(
  "loginUserReducer/refreshToken",
  async (arg, thunkAPI) => {
    let state = thunkAPI.getState();
    const dataRefresh = {
      tknR: state.loginUser.currentUser.tknR,
    };
    try {
      const response = await axios.post(
        `${URL_HOST}${URL_WS_SUPYCAP_CENTRAL}refreshToken`,
        dataRefresh,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      if (response.data.code != 200) {
        return thunkAPI.rejectWithValue(response.data.message);
      }
      return response;
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  }
);

export const logout = createAsyncThunk(
  "loginUserReducer/logout",
  async (arg, thunkAPI) => {
    let state = thunkAPI.getState();
    const dataLogout = {
      usuario: state.loginUser.currentUser.username,
      idSistema: ID_SISTEMA,
    };
    try {
      const response = await axios.post(
        `${URL_HOST}${URL_WS_SUPYCAP_CENTRAL}cierraSesion`,
        dataLogout,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + state.loginUser.currentUser.tknA,
          },
        }
      );
      return response;
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  }
);

export const forceLogout = createAsyncThunk(
  "loginUserReducer/forceLogout",
  async (data, thunkAPI) => {
    try {
      const response = await axios.post(
        `${URL_HOST}${URL_WS_SUPYCAP_CENTRAL}cierraSesionForc`,
        data,
        { headers: { "Content-Type": "application/json" } }
      );
      return response;
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  }
);

export const loginUserReducer = createSlice({
  name: "loginUserReducer",
  initialState: initialStateLoginUser,
  reducers: {
    clearUser: (state) => {
      state.currentUser = null;
      state.errorLogin = null;
      state.aspirante = null;
    },
    clearErrorMessage: (state) => {
      state.errorLogin = null;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(login.pending, (state) => {
      state.isLoadingLoginUserReducer = true;
    });
    builder.addCase(login.fulfilled, (state, action) => {
      state.isLoadingLoginUserReducer = false;
      state.currentUser = action.payload.datosUsuario;
      state.errorLogin = null;
      state.aspirante = action.payload.aspirante;
    });
    builder.addCase(login.rejected, (state, action) => {
      state.isLoadingLoginUserReducer = false;
      state.currentUser = null;
      state.errorLogin = action.payload;
      state.aspirante = null;
    });
    builder.addCase(refreshToken.pending, (state) => {
      state.isLoadingLoginUserReducer = true;
    });
    builder.addCase(refreshToken.fulfilled, (state, action) => {
      state.isLoadingLoginUserReducer = false;
      state.currentUser.tknA = action.payload.data.data;
      state.errorLogin = null;
    });
    builder.addCase(refreshToken.rejected, (state, action) => {
      state.isLoadingLoginUserReducer = false;
    });
    builder.addCase(logout.pending, (state) => {
      state.isLoadingLoginUserReducer = true;
    });
    builder.addCase(logout.fulfilled, (state, action) => {
      state.isLoadingLoginUserReducer = false;
    });
    builder.addCase(logout.rejected, (state, action) => {
      state.isLoadingLoginUserReducer = false;
    });
    builder.addCase(forceLogout.pending, (state) => {
      state.isLoadingLoginUserReducer = true;
    });
    builder.addCase(forceLogout.fulfilled, (state, action) => {
      state.isLoadingLoginUserReducer = false;
      state.errorLogin = null;
    });
    builder.addCase(forceLogout.rejected, (state, action) => {
      state.isLoadingLoginUserReducer = false;
      state.errorLogin = null;
    });
  },
});

export const { clearUser, clearErrorMessage } = loginUserReducer.actions;
export default loginUserReducer.reducer;
