import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import apiClient from "../../utils/apiClient";

const initialStateSelectFolioNombre = {
  isLoadingSelectFolioNombre: false,
  sustituidoSeleccionado: null,
  mensajeError: null,
};

export const selecciona = createAsyncThunk(
  "selectFolioNombreReducer/selecciona",
  async (arg, thunkAPI) => {
    try {
      const response = await apiClient.post("obtenerInfoSustituido", arg);
      return response.data.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  }
);

export const selectFolioNombreReducer = createSlice({
  name: "selectFolioNombreReducer",
  initialState: initialStateSelectFolioNombre,
  reducers: {
    clearUser: (state) => {
      state.sustituidoSeleccionado = null;
    },
    clearErrorMessage: (state) => {
      state.mensajeError = null;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(selecciona.pending, (state) => {
      state.sustituidoSeleccionado = null;
      state.isLoadingSelectFolioNombre = true;
    });
    builder.addCase(selecciona.fulfilled, (state, action) => {
      state.isLoadingSelectFolioNombre = false;
      state.sustituidoSeleccionado = action.payload;
    });
    builder.addCase(selecciona.rejected, (state, action) => {
      state.sustituidoSeleccionado = null;
      state.isLoadingSelectFolioNombre = false;
    });
  },
});

export const { clearUser, clearErrorMessage } =
  selectFolioNombreReducer.actions;
export default selectFolioNombreReducer.reducer;
