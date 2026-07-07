import { useState, useCallback } from "react";
import {
  getUserByUsername,
  updateUser,
  deleteUser,
} from "../api/userService";
 
export function useUsers() {
  // user: { username, email, ... } o null si no hay usuario cargado
  const [user, setUser] = useState(null);
  // loading: true mientras se hace la petición, false cuando termina
  const [loading, setLoading] = useState(false);
  // error: mensaje de error si algo falla, null si no hay error
  const [error, setError] = useState(null);
 
  // GET /usuario/{username}
  const fetchUser = useCallback(async (username) => {
    setLoading(true);
    setError(null);
    try {
      const data = await getUserByUsername(username);
      setUser(data);
      return data;
    } catch (err) {
      if (err.response?.status === 404) {
        setError("Usuario no encontrado.");
      } else {
        setError("Error al cargar el usuario.");
      }
      return null;
    } finally {
      setLoading(false);
    }
  }, []);
 
  // PUT /modificar/{username}
  const editUser = useCallback(async (username, updatedData) => {
    setLoading(true);
    setError(null);
    try {
      const data = await updateUser(username, updatedData);
      setUser(data);
      return { success: true, data };
    } catch (err) {
      if (err.response?.status === 409) {
        setError("El nombre de usuario o email ya está en uso.");
      } else {
        setError("Error al actualizar el usuario.");
      }
      return { success: false };
    } finally {
      setLoading(false);
    }
  }, []);
 
  // DELETE /eliminar/{username}
  const removeUser = useCallback(async (username) => {
    setLoading(true);
    setError(null);
    try {
      await deleteUser(username);
      setUser(null);
      return { success: true };
    } catch (err) {
      setError("Error al eliminar el usuario.");
      return { success: false };
    } finally {
      setLoading(false);
    }
  }, []);
 
  const clearError = () => setError(null);
 
  return {
    user,
    loading,
    error,
    fetchUser,
    editUser,
    removeUser,
    clearError,
  };
}