import api from "./axiosConfig";

// POST /boards/crear
export const createBoard = async (dto) => {
  const response = await api.post("/boards/crear", dto);
  return response.data;
  // dto: { name, description? }
};

// GET /boards/ver
export const getBoards = async () => {
  const response = await api.get("/boards/ver");
  return response.data;
  // retorna lista de boards del usuario autenticado
};

// PUT /boards/editar
export const updateBoard = async (dto) => {
  await api.put("/boards/editar", dto);
  // dto: { id, name, description? }
};

// DELETE /boards?id={id}
export const deleteBoard = async (id) => {
  await api.delete("/boards", { params: { id } });
};