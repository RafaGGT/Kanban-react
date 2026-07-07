import api from "./axiosConfig";

// GET /columns/board/{boardId}
export const getColumnsByBoard = async (boardId) => {
  const response = await api.get(`/columns/board/${boardId}`);
  // 204 = sin columnas, retorna array vacío
  if (response.status === 204) return [];
  return response.data;
};

// POST /columns/crear/{boardId}
export const createColumn = async (boardId, dto) => {
  const response = await api.post(`/columns/crear/${boardId}`, dto);
  return response.data;
};

// DELETE /columns/eliminar
export const deleteColumn = async (id) => {
  await api.delete("/columns/eliminar", { data: { id } });
};

// PUT /columns/actualizar-nombre
export const updateColumnName = async (id, name) => {
  await api.put("/columns/actualizar-nombre", { id, name });
};

// PUT /columns/actualizar-posicion
export const updateColumnPosition = async (id, position) => {
  await api.put("/columns/actualizar-posicion", { id, position });
};