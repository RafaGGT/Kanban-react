import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  DndContext,
  closestCorners,
  PointerSensor,
  useSensor,
  useSensors,
  useDroppable,
} from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
  useSortable,
  arrayMove,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import Navbar from "../componentes/Navbar";
import { getColumnsByBoard, createColumn, deleteColumn, updateColumnName } from "../api/columnService";
import { getTasksByColumn, createTask, deleteTask, updateTaskPosition } from "../api/taskService";
import "./BoardPage.css";

const ACCENTS = ["violet", "cyan", "pink", "lime"];
const accentFor = (index) => ACCENTS[index % ACCENTS.length];

// --- Componente de tarea arrastrable ---
function SortableTask({ task, columnId, onDelete }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: `task-${task.id}`,
    data: { type: "task", task, columnId },
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`kb-task ${isDragging ? "kb-task-dragging" : ""}`}
      {...attributes}
      {...listeners}
    >
      <div className="d-flex justify-content-between align-items-start">
        <span className="kb-task-title">{task.title}</span>
        <button
          className="kb-task-delete"
          onClick={(e) => { e.stopPropagation(); onDelete(columnId, task.id); }}
          onPointerDown={(e) => e.stopPropagation()}
          aria-label="Eliminar tarea"
        >
          ✕
        </button>
      </div>
      {task.description && <p className="kb-task-desc">{task.description}</p>}
    </div>
  );
}

// --- Componente de columna como zona droppable ---
// Clave del fix: antes la columna solo tenía un id de HTML plano
// (id={`column-${col.id}`}), que no significa nada para dnd-kit.
// dnd-kit solo detecta colisiones contra elementos registrados con
// useDraggable / useDroppable / useSortable. Si la columna no tenía
// tareas, no había NADA registrado ahí, así que nunca se podía soltar.
// useDroppable registra explícitamente el div de la columna como
// zona de drop válida, tenga o no tareas adentro.
function Column({ col, accent, isOver, setNodeRef, children }) {
  return (
    <div
      ref={setNodeRef}
      id={`column-${col.id}`}
      className={`kb-column accent-${accent} ${isOver ? "kb-column-over" : ""}`}
    >
      {children}
    </div>
  );
}

export default function BoardPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const username = localStorage.getItem("username");

  const [columns, setColumns] = useState([]);
  const [tasks, setTasks] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [newColumnName, setNewColumnName] = useState("");
  const [creatingColumn, setCreatingColumn] = useState(false);
  const [newTask, setNewTask] = useState({ columnId: null, title: "", description: "" });
  const [editingColumn, setEditingColumn] = useState(null);

  const totalTasks = Object.values(tasks).reduce((sum, list) => sum + (list?.length ?? 0), 0);

  // Sensor: requiere mover 5px antes de iniciar drag (evita que un clic se confunda con drag)
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } })
  );

  useEffect(() => {
    fetchBoard();
  }, [id]);

  const fetchBoard = async () => {
    setLoading(true);
    setError(null);
    try {
      const cols = await getColumnsByBoard(id);
      setColumns(cols);

      const taskMap = {};
      await Promise.all(
        cols.map(async (col) => {
          try {
            const t = await getTasksByColumn(col.id);
            taskMap[col.id] = Array.isArray(t) ? t : [];
          } catch {
            taskMap[col.id] = [];
          }
        })
      );
      setTasks(taskMap);
    } catch {
      setError("Error al cargar el tablero.");
    } finally {
      setLoading(false);
    }
  };

  // --- Columnas ---
  const handleCreateColumn = async (e) => {
    e.preventDefault();
    if (!newColumnName.trim()) return;
    setCreatingColumn(true);
    try {
      await createColumn(id, { name: newColumnName.trim() });
      setNewColumnName("");
      await fetchBoard();
    } catch {
      setError("Error al crear la columna.");
    } finally {
      setCreatingColumn(false);
    }
  };

  const handleDeleteColumn = async (columnId) => {
    if (!window.confirm("¿Eliminar esta columna y sus tareas?")) return;
    try {
      await deleteColumn(columnId);
      setColumns((prev) => prev.filter((c) => c.id !== columnId));
      setTasks((prev) => { const t = { ...prev }; delete t[columnId]; return t; });
    } catch {
      setError("Error al eliminar la columna.");
    }
  };

  const handleRenameColumn = async (columnId) => {
    if (!editingColumn?.name?.trim()) return;
    try {
      await updateColumnName(columnId, editingColumn.name.trim());
      setColumns((prev) => prev.map((c) => c.id === columnId ? { ...c, name: editingColumn.name } : c));
      setEditingColumn(null);
    } catch {
      setError("Error al renombrar la columna.");
    }
  };

  // --- Tareas ---
  const handleCreateTask = async (columnId) => {
    if (!newTask.title.trim()) return;
    try {
      const created = await createTask(columnId, {
        title: newTask.title.trim(),
        description: newTask.description.trim() || null,
      });
      setTasks((prev) => ({ ...prev, [columnId]: [...(prev[columnId] ?? []), created] }));
      setNewTask({ columnId: null, title: "", description: "" });
    } catch {
      setError("Error al crear la tarea.");
    }
  };

  const handleDeleteTask = async (columnId, taskId) => {
    try {
      await deleteTask(taskId);
      setTasks((prev) => ({ ...prev, [columnId]: prev[columnId].filter((t) => t.id !== taskId) }));
    } catch {
      setError("Error al eliminar la tarea.");
    }
  };

  // --- Drag & drop ---
  const findColumnByTaskId = (taskId) => {
    return columns.find((col) => (tasks[col.id] ?? []).some((t) => `task-${t.id}` === taskId));
  };

  const handleDragEnd = async (event) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const activeColumn = findColumnByTaskId(active.id);
    // over.id puede ser una tarea (task-X) o directamente una columna,
    // incluida una columna vacía, gracias a useDroppable en <Column />.
    const overColumn = findColumnByTaskId(over.id) ?? columns.find((c) => `column-${c.id}` === over.id);

    if (!activeColumn || !overColumn) return;

    const activeTaskId = Number(active.id.replace("task-", ""));

    if (activeColumn.id === overColumn.id) {
      // Reordenar dentro de la misma columna
      const colTasks = tasks[activeColumn.id];
      const oldIndex = colTasks.findIndex((t) => t.id === activeTaskId);
      const newIndex = colTasks.findIndex((t) => `task-${t.id}` === over.id);
      if (oldIndex === newIndex || newIndex === -1) return;

      const reordered = arrayMove(colTasks, oldIndex, newIndex);
      setTasks((prev) => ({ ...prev, [activeColumn.id]: reordered }));

      try {
        await updateTaskPosition(activeTaskId, activeColumn.id, newIndex + 1);
      } catch {
        setError("Error al mover la tarea.");
        fetchBoard(); // revertir con datos reales del servidor
      }
    } else {
      // Mover a otra columna (incluye el caso de columna destino vacía)
      const sourceTasks = tasks[activeColumn.id].filter((t) => t.id !== activeTaskId);
      const movedTask = tasks[activeColumn.id].find((t) => t.id === activeTaskId);
      const targetTasks = tasks[overColumn.id] ?? [];

      const overIndex = targetTasks.findIndex((t) => `task-${t.id}` === over.id);
      // Si over.id es la columna misma (drop sobre área vacía o espacio
      // libre de la columna) en vez de una tarea puntual, insertamos al final.
      const insertAt = overIndex === -1 ? targetTasks.length : overIndex;

      const newTargetTasks = [...targetTasks];
      newTargetTasks.splice(insertAt, 0, movedTask);

      setTasks((prev) => ({
        ...prev,
        [activeColumn.id]: sourceTasks,
        [overColumn.id]: newTargetTasks,
      }));

      try {
        await updateTaskPosition(activeTaskId, overColumn.id, insertAt + 1);
      } catch {
        setError("Error al mover la tarea.");
        fetchBoard();
      }
    }
  };

  return (
    <div className="app-shell">
      <Navbar username={username} />

      <div className="container-fluid py-4 px-4">
        <div className="d-flex align-items-center gap-3 mb-4 flex-wrap justify-content-center board-header">
          <button className="btn btn-sm btn-outline-secondary" onClick={() => navigate("/home")}>
            ← Volver
          </button>
          <div>
            <span className="eyebrow">Tablero</span>
            <h1 className="board-title">Organiza tu flujo de trabajo</h1>
            {!loading && (
              <div className="board-stats">
                <span className="board-stat"><span className="board-stat-value">{columns.length}</span> columna{columns.length !== 1 ? "s" : ""}</span>
                <span className="board-stat-sep">·</span>
                <span className="board-stat"><span className="board-stat-value">{totalTasks}</span> tarea{totalTasks !== 1 ? "s" : ""}</span>
              </div>
            )}
          </div>
        </div>

        {error && <div className="alert alert-danger">{error}</div>}
        {loading && <div className="text-center py-5 text-muted">Cargando tablero...</div>}

        {!loading && (
          <DndContext sensors={sensors} collisionDetection={closestCorners} onDragEnd={handleDragEnd}>
            <div className="kb-board-row">

              {columns.map((col, i) => (
                <ColumnContainer
                  key={col.id}
                  col={col}
                  accent={accentFor(i)}
                  tasksInColumn={tasks[col.id] ?? []}
                  editingColumn={editingColumn}
                  setEditingColumn={setEditingColumn}
                  handleRenameColumn={handleRenameColumn}
                  handleDeleteColumn={handleDeleteColumn}
                  handleDeleteTask={handleDeleteTask}
                  newTask={newTask}
                  setNewTask={setNewTask}
                  handleCreateTask={handleCreateTask}
                />
              ))}

              <div className="kb-column kb-column-new">
                <p className="kb-column-new-label">Nueva columna</p>
                <form onSubmit={handleCreateColumn}>
                  <input
                    className="form-control form-control-sm mb-2"
                    placeholder="Nombre de la columna"
                    value={newColumnName}
                    onChange={(e) => setNewColumnName(e.target.value)}
                  />
                  <button type="submit" className="btn btn-primary btn-sm w-100" disabled={creatingColumn}>
                    {creatingColumn ? "Creando..." : "+ Crear columna"}
                  </button>
                </form>
              </div>

            </div>
          </DndContext>
        )}
      </div>
    </div>
  );
}

// Componente intermedio: conecta useDroppable con el contenido visual
// de la columna (header editable, lista de tareas y form de nueva tarea).
function ColumnContainer({
  col,
  accent,
  tasksInColumn,
  editingColumn,
  setEditingColumn,
  handleRenameColumn,
  handleDeleteColumn,
  handleDeleteTask,
  newTask,
  setNewTask,
  handleCreateTask,
}) {
  const { setNodeRef, isOver } = useDroppable({
    id: `column-${col.id}`,
    data: { type: "column", columnId: col.id },
  });

  return (
    <Column col={col} accent={accent} isOver={isOver} setNodeRef={setNodeRef}>
      <div className="d-flex align-items-center justify-content-between mb-3">
        {editingColumn?.id === col.id ? (
          <input
            className="form-control form-control-sm"
            value={editingColumn.name}
            onChange={(e) => setEditingColumn({ ...editingColumn, name: e.target.value })}
            onBlur={() => handleRenameColumn(col.id)}
            onKeyDown={(e) => e.key === "Enter" && handleRenameColumn(col.id)}
            autoFocus
          />
        ) : (
          <span
            className="kb-column-title"
            onClick={() => setEditingColumn({ id: col.id, name: col.name })}
            title="Clic para renombrar"
          >
            {col.name}
            <span className="kb-column-count">{tasksInColumn.length}</span>
          </span>
        )}
        <button className="kb-task-delete ms-2" onClick={() => handleDeleteColumn(col.id)} aria-label="Eliminar columna">
          ✕
        </button>
      </div>

      <SortableContext
        items={tasksInColumn.map((t) => `task-${t.id}`)}
        strategy={verticalListSortingStrategy}
      >
        <div className="d-flex flex-column gap-2 mb-3 kb-column-body">
          {tasksInColumn.length === 0 && (
            <div className="kb-empty-placeholder">Crea o mueve una tarea aquí</div>
          )}
          {tasksInColumn.map((task) => (
            <SortableTask
              key={task.id}
              task={task}
              columnId={col.id}
              onDelete={handleDeleteTask}
            />
          ))}
        </div>
      </SortableContext>

      {newTask.columnId === col.id ? (
        <div>
          <input
            className="form-control form-control-sm mb-2"
            placeholder="Título de la tarea"
            value={newTask.title}
            onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
            autoFocus
          />
          <input
            className="form-control form-control-sm mb-2"
            placeholder="Descripción (opcional)"
            value={newTask.description}
            onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
          />
          <div className="d-flex gap-2">
            <button className="btn btn-primary btn-sm flex-grow-1" onClick={() => handleCreateTask(col.id)}>
              Agregar
            </button>
            <button className="btn btn-outline-secondary btn-sm" onClick={() => setNewTask({ columnId: null, title: "", description: "" })}>
              Cancelar
            </button>
          </div>
        </div>
      ) : (
        <button
          className="btn btn-outline-secondary btn-sm w-100"
          onClick={() => setNewTask({ columnId: col.id, title: "", description: "" })}
        >
          + Agregar tarea
        </button>
      )}
    </Column>
  );
}