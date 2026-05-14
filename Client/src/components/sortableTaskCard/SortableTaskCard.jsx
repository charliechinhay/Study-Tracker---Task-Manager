import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import TaskCard from "../taskCard/TaskCard";

function SortableTaskCard({ task, onDelete, onToggle, onEdit }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: task._id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes}>
      <TaskCard
        task={task}
        onDelete={onDelete}
        onToggle={onToggle}
        onEdit={onEdit}
        dragHandleProps={listeners}
      />
    </div>
  );
}

export default SortableTaskCard;
