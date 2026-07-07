import api from "./axiosConfig";
 
// POST /registro
export const createUser = async (userData) => {
  const response = await api.post("/registro", userData);
  return response.data;  
};

// GET /usuario/{username}
export const getUserByUsername = async (username) => {
  const response = await api.get(`/usuario/${username}`);
  return response.data;
};
 
// PUT /modificar/{username}
export const updateUser = async (username, userData) => {
  const response = await api.put(`/modificar/${username}`, userData);
  return response.data;
};

// DELETE /eliminar/{username}
export const deleteUser = async (username) => {
  await api.delete(`/eliminar/${username}`);
  // 204 No Content: no retorna body
};
 