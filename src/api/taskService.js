import api from "./axiosConfig";

// POST /tasks/crear/{columnId}
export const createTask = async (columnId, dto) => {
  const response = await api.post(`/tasks/crear/${columnId}`, dto);
  return response.data;
  // dto: { title, description?, assignedUserId? }
};

// GET /tasks/columna/{columnId}
export const getTasksByColumn = async (columnId) => {
  const response = await api.get(`/tasks/columna/${columnId}`);
  return response.data;
};

// PUT /tasks/editar
export const updateTask = async (dto) => {
  const response = await api.put("/tasks/editar", dto);
  return response.data;
  // dto: { id, title, description?, assignedUserId? }
};

// DELETE /tasks/eliminar
export const deleteTask = async (id) => {
  await api.delete("/tasks/eliminar", { data: { id } });
};

// PUT /tasks/actualizar-posicion
export const updateTaskPosition = async (id, columnId, position) => {
  await api.put("/tasks/actualizar-posicion", { id, columnId, position });
};