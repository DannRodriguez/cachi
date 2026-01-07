import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import apiClient from "../../utils/apiClient";
import { ID_SISTEMA, ID_MENU_REPORTES } from "../../utils/constantes";

//Constants
const initialStateMenu = {
  rolUsuario: null,
  estados: null,
  estado: null,
  procesos: null,
  proceso: null,
  distritos: null,
  distrito: null,
  opcionesMenu: null,
  moduloSeleccionado: {
    idMenu: 0,
    idSubMenu: 0,
    idModulo: 0,
  },
  idParticipacion: null,
  status: null,
  error: null,
};

export const obtenerNivelUsr = createAsyncThunk(
  "menuReducer/obtenerNivelUsr",
  async (rolUsuario, thunkAPI) => {
    let l = rolUsuario.split(".").length;
    let nivel = rolUsuario.split(".")[l != null ? l - 1 : 2].split("_");
    return nivel[0].toUpperCase();
  }
);

export const obtenerEstados = createAsyncThunk(
  "menuReducer/obtenerEstados",
  async (param, thunkAPI) => {
    try {
      const response = await apiClient.post("obtieneEstadosMultiProceso", {
        idSistema: ID_SISTEMA,
        rol: param.rolUsuario,
      });

      if (response.data && response.data.code === 200 && response.data.data) {
        return response.data.data;
      }
    } catch (error) {
      console.error("ERROR -obtenerEstados: ", error);
      return thunkAPI.rejectWithValue(
        error.message != undefined ? error.message : error
      );
    }
  }
);

export const obtenerProcesos = createAsyncThunk(
  "menuReducer/obtenerProcesos",
  async (param, thunkAPI) => {
    try {
      const response = await apiClient.post(
        "obtieneProcesosDetalleMultiProceso",
        {
          idSistema: ID_SISTEMA,
          idEstado: param.idEstado,
          ambitoUsuario: param.ambitoUsuario,
          idDistrito: param.idDistrito,
        }
      );

      if (response.data && response.data.code === 200 && response.data.data) {
        return response.data.data;
      }
    } catch (error) {
      console.error("ERROR -obtenerProcesos: ", error);
      return thunkAPI.rejectWithValue(
        error.message != undefined ? error.message : error
      );
    }
  }
);

export const obtenerDistritos = createAsyncThunk(
  "menuReducer/obtenerDistritos",
  async (param, thunkAPI) => {
    try {
      const response = await apiClient.post("obtieneDistritos", param.request);

      if (response.data && response.data.code === 200 && response.data.data) {
        return response.data.data;
      }
    } catch (error) {
      console.error("ERROR -obtenerDistritos: ", error);
      return thunkAPI.rejectWithValue(
        error.message != undefined ? error.message : error
      );
    }
  }
);

export const obtieneParticipacion = createAsyncThunk(
  "menuReducer/obtieneParticipacion",
  async (param, thunkAPI) => {
    try {
      const response = await apiClient.post(
        "obtieneParticipacion",
        param.request
      );

      if (response.data && response.data.code === 200 && response.data.data) {
        return response.data.data;
      }
    } catch (error) {
      console.error("ERROR -obtieneParticipacion: ", error);
      return thunkAPI.rejectWithValue(
        error.message != undefined ? error.message : error
      );
    }
  }
);

export const obtieneMenuLateral = createAsyncThunk(
  "menuReducer/obtieneMenuLateral",
  async (param, thunkAPI) => {
    try {
      const response = await apiClient.post(
        "obtieneMenuLateral",
        param.request
      );

      if (response.data && response.data.code === 200 && response.data.data) {
        const menusCompletos = response.data.data;

        const menus = menusCompletos
          .map((menu) => {
            const subMenus = menu.subMenus
              .map((submenu) => {
                const modulos = submenu.modulos.reduce(
                  (accumulator, modulo) => {
                    accumulator[modulo.idModulo] = modulo;
                    return accumulator;
                  },
                  {}
                );

                return {
                  ...submenu,
                  modulos,
                };
              })
              .reduce((accumulator, submenu) => {
                accumulator[submenu.idSubMenu] = submenu;
                return accumulator;
              }, {});

            return {
              ...menu,
              subMenus,
            };
          })
          .reduce((accumulator, menu) => {
            accumulator[menu.idMenu] = menu;
            return accumulator;
          }, {});
        return menus;
      }
    } catch (error) {
      console.error("ERROR -obtieneMenuLateral: ", error);
      return thunkAPI.rejectWithValue(
        error.message != undefined ? error.message : error
      );
    }

    return [];
  }
);

export const obtieneMenuReportes = createAsyncThunk(
  "menuReducer/obtieneMenuReportes",
  async (param, thunkAPI) => {
    try {
      const response = await apiClient.post(
        "obtieneMenuLateral",
        param.request
      );

      if (response.data && response.data.code === 200 && response.data.data) {
        const menusCompletos = response.data.data;

        const menuReportes = [];

        menusCompletos.forEach((menu) => {
          if (menu.idMenu === ID_MENU_REPORTES) {
            menuReportes.push(menu);
          }
        });

        const menus = menuReportes
          .map((menu) => {
            const subMenus = menu.subMenus
              .map((submenu) => {
                const modulos = submenu.modulos.reduce(
                  (accumulator, modulo) => {
                    accumulator[modulo.idModulo] = modulo;
                    return accumulator;
                  },
                  {}
                );

                return {
                  ...submenu,
                  modulos,
                };
              })
              .reduce((accumulator, submenu) => {
                accumulator[submenu.idSubMenu] = submenu;
                return accumulator;
              }, {});

            return {
              ...menu,
              subMenus,
            };
          })
          .reduce((accumulator, menu) => {
            accumulator[menu.idMenu] = menu;
            return accumulator;
          }, {});
        return menus;
      }
    } catch (error) {
      console.error("ERROR -obtieneMenuReportes: ", error);
      return thunkAPI.rejectWithValue(
        error.message != undefined ? error.message : error
      );
    }

    return [];
  }
);

export const obtieneMenuAcciones = createAsyncThunk(
  "menuReducer/obtieneMenuAcciones",
  async (param, thunkAPI) => {
    try {
      const response = await apiClient.post(
        "obtieneMenuAcciones",
        param.request
      );
      if (response.data && response.data.code === 200 && response.data.data) {
        return response.data.data;
      }
    } catch (error) {
      console.error("ERROR -obtieneMenuAcciones: ", error);
      return thunkAPI.rejectWithValue(
        error.message != undefined ? error.message : error
      );
    }
  }
);

//Reducer toolkit
export const menuReducer = createSlice({
  name: "menuReducer",
  initialState: initialStateMenu,
  reducers: {
    asignarEstado: (state, action) => {
      state.estado = action.payload;
    },

    asignarProceso: (state, action) => {
      state.proceso = action.payload;
      if (action.payload === null) {
        state.distritos = null;
        state.distrito = null;
      }
    },

    asignarDistrito: (state, action) => {
      state.distrito = action.payload;
      if (action.payload === null) {
        state.opcionesMenu = null;
        state.moduloSeleccionado = null;
      }
    },

    asignarModulo: (state, action) => {
      state.moduloSeleccionado = action.payload;
    },
  },

  extraReducers: (builder) => {
    builder
      .addCase(obtenerNivelUsr.pending, (state) => {
        state.rolUsuario = null;
        state.status = "loading";
        state.error = null;
      })
      .addCase(obtenerNivelUsr.fulfilled, (state, action) => {
        state.rolUsuario = action.payload;
        state.status = "succeeded";
        state.error = null;
      })
      .addCase(obtenerNivelUsr.rejected, (state, action) => {
        state.rolUsuario = null;
        state.status = "failed";
        state.error = action.error.message;
      })

      .addCase(obtenerEstados.pending, (state) => {
        state.estados = null;
        state.estado = null;
        state.procesos = null;
        state.proceso = null;
        if (state.rolUsuario === "OC" || state.rolUsuario === "JL") {
          state.distritos = null;
          state.distrito = null;
          state.opcionesMenu = null;
        }
        state.status = "loading";
        state.error = null;
      })
      .addCase(obtenerEstados.fulfilled, (state, action) => {
        state.estados = action.payload;
        state.estado = null;
        state.procesos = null;
        state.proceso = null;
        if (state.rolUsuario === "OC" || state.rolUsuario === "JL") {
          state.distritos = null;
          state.distrito = null;
          state.opcionesMenu = null;
        }
        state.status = "succeeded";
        state.error = null;
      })
      .addCase(obtenerEstados.rejected, (state, action) => {
        state.estados = null;
        state.estado = null;
        state.procesos = null;
        state.proceso = null;
        if (state.rolUsuario === "OC" || state.rolUsuario === "JL") {
          state.distritos = null;
          state.distrito = null;
          state.opcionesMenu = null;
        }
        state.status = "failed";
        state.error = action.error.message;
      })

      .addCase(obtenerProcesos.pending, (state) => {
        state.procesos = null;
        state.proceso = null;
        if (state.rolUsuario === "OC") {
          state.distritos = null;
          state.distrito = null;
          state.opcionesMenu = null;
        }
        state.status = "loading";
        state.error = null;
      })
      .addCase(obtenerProcesos.fulfilled, (state, action) => {
        state.procesos = action.payload;
        state.proceso = null;
        if (state.rolUsuario === "OC") {
          state.distritos = null;
          state.distrito = null;
          state.opcionesMenu = null;
        }
        state.status = "succeeded";
        state.error = null;
      })
      .addCase(obtenerProcesos.rejected, (state, action) => {
        state.procesos = null;
        state.proceso = null;
        if (state.rolUsuario === "OC") {
          state.distritos = null;
          state.distrito = null;
          state.opcionesMenu = null;
        }
        state.status = "failed";
        state.error = action.error.message;
      })

      .addCase(obtenerDistritos.pending, (state) => {
        state.distritos = null;
        state.status = "loading";
        state.error = null;
      })
      .addCase(obtenerDistritos.fulfilled, (state, action) => {
        state.distritos = action.payload;
        state.status = "succeeded";
        state.error = null;
      })
      .addCase(obtenerDistritos.rejected, (state, action) => {
        state.distritos = null;
        state.status = "failed";
        state.error = action.error.message;
      })

      .addCase(obtieneMenuLateral.pending, (state) => {
        state.opcionesMenu = null;
        if (state.rolUsuario === "OC" || state.rolUsuario === "JL")
          state.moduloSeleccionado = {
            idMenu: 0,
            idSubMenu: 0,
            idModulo: 0,
          };
        state.menuAcciones = null;
        state.status = "loading";
        state.error = null;
      })
      .addCase(obtieneMenuLateral.fulfilled, (state, action) => {
        state.opcionesMenu = action.payload;
        if (state.rolUsuario === "OC" || state.rolUsuario === "JL")
          state.moduloSeleccionado = {
            idMenu: 0,
            idSubMenu: 0,
            idModulo: 0,
          };
        state.menuAcciones = null;
        state.status = "succeeded";
        state.error = null;
      })
      .addCase(obtieneMenuLateral.rejected, (state, action) => {
        state.opcionesMenu = null;
        if (state.rolUsuario === "OC" || state.rolUsuario === "JL")
          state.moduloSeleccionado = {
            idMenu: 0,
            idSubMenu: 0,
            idModulo: 0,
          };
        state.menuAcciones = null;
        state.status = "failed";
        state.error = action.error.message;
      })

      .addCase(obtieneMenuReportes.pending, (state) => {
        state.opcionesMenu = null;
        if (state.rolUsuario === "OC" || state.rolUsuario === "JL")
          state.moduloSeleccionado = {
            idMenu: 0,
            idSubMenu: 0,
            idModulo: 0,
          };
        state.menuAcciones = null;
        state.status = "loading";
        state.error = null;
      })
      .addCase(obtieneMenuReportes.fulfilled, (state, action) => {
        state.opcionesMenu = action.payload;
        if (state.rolUsuario === "OC" || state.rolUsuario === "JL")
          state.moduloSeleccionado = {
            idMenu: 0,
            idSubMenu: 0,
            idModulo: 0,
          };
        state.menuAcciones = null;
        state.status = "succeeded";
        state.error = null;
      })
      .addCase(obtieneMenuReportes.rejected, (state, action) => {
        state.opcionesMenu = null;
        if (state.rolUsuario === "OC" || state.rolUsuario === "JL")
          state.moduloSeleccionado = {
            idMenu: 0,
            idSubMenu: 0,
            idModulo: 0,
          };
        state.menuAcciones = null;
        state.status = "failed";
        state.error = action.error.message;
      })

      .addCase(obtieneParticipacion.pending, (state) => {
        state.idParticipacion = null;
        state.etapaCapacitacion = null;
        state.status = "loading";
        state.error = null;
      })
      .addCase(obtieneParticipacion.fulfilled, (state, action) => {
        state.idParticipacion = action.payload.idParticipacion;
        state.etapaCapacitacion = action.payload.etapaCapacitacion;
        state.status = "succeeded";
        state.error = null;
      })
      .addCase(obtieneParticipacion.rejected, (state, action) => {
        state.idParticipacion = null;
        state.etapaCapacitacion = null;
        state.status = "failed";
        state.error = action.error.message;
      })
      .addCase(obtieneMenuAcciones.pending, (state) => {
        state.menuAcciones = null;
        state.status = "loading";
        state.error = null;
      })
      .addCase(obtieneMenuAcciones.fulfilled, (state, action) => {
        state.menuAcciones = action.payload;
        state.status = "succeeded";
        state.error = null;
      })
      .addCase(obtieneMenuAcciones.rejected, (state, action) => {
        state.menuAcciones = null;
        state.status = "failed";
        state.error = action.payload;
      });
  },
});

export const { asignarEstado, asignarProceso, asignarDistrito, asignarModulo } =
  menuReducer.actions;
export default menuReducer.reducer;
