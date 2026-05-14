import React from "react";
import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";

vi.mock("react-router-dom", () => ({
  useNavigate: () => vi.fn(),
}));

vi.mock("framer-motion", () => ({
  motion: {
    div: ({ children, className }) => <div className={className}>{children}</div>,
    button: ({ children, className, onClick, disabled, title }) => (
      <button className={className} onClick={onClick} disabled={disabled} title={title}>
        {children}
      </button>
    ),
  },
}));

import TaskCard from "../components/taskCard/TaskCard";

const baseTask = {
  _id: "task-1",
  title: "Study React",
  description: "Learn hooks",
  priority: "high",
  category: "programming",
  completed: false,
  dueDate: null,
  image: { url: null, publicId: null },
};

describe("TaskCard", () => {
  it("renders the task title", () => {
    render(
      <TaskCard task={baseTask} onDelete={vi.fn()} onToggle={vi.fn()} onEdit={vi.fn()} />,
    );
    expect(screen.getByText("Study React")).toBeInTheDocument();
  });

  it("renders the priority badge", () => {
    render(
      <TaskCard task={baseTask} onDelete={vi.fn()} onToggle={vi.fn()} onEdit={vi.fn()} />,
    );
    expect(screen.getByText("high")).toBeInTheDocument();
  });

  it("renders the task description", () => {
    render(
      <TaskCard task={baseTask} onDelete={vi.fn()} onToggle={vi.fn()} onEdit={vi.fn()} />,
    );
    expect(screen.getByText("Learn hooks")).toBeInTheDocument();
  });

  it("truncates descriptions longer than 60 characters", () => {
    const task = { ...baseTask, description: "A".repeat(80) };
    render(
      <TaskCard task={task} onDelete={vi.fn()} onToggle={vi.fn()} onEdit={vi.fn()} />,
    );
    expect(screen.getByText(`${"A".repeat(60)}...`)).toBeInTheDocument();
  });

  it("calls onDelete with the task id when delete button is clicked", () => {
    const onDelete = vi.fn();
    render(
      <TaskCard task={baseTask} onDelete={onDelete} onToggle={vi.fn()} onEdit={vi.fn()} />,
    );
    fireEvent.click(screen.getByTitle("Delete task"));
    expect(onDelete).toHaveBeenCalledWith("task-1");
  });

  it("calls onToggle with the task when complete button is clicked", () => {
    const onToggle = vi.fn();
    render(
      <TaskCard task={baseTask} onDelete={vi.fn()} onToggle={onToggle} onEdit={vi.fn()} />,
    );
    fireEvent.click(screen.getByTitle("Mark as done"));
    expect(onToggle).toHaveBeenCalledWith(baseTask);
  });

  it("calls onEdit with the task when edit button is clicked", () => {
    const onEdit = vi.fn();
    render(
      <TaskCard task={baseTask} onDelete={vi.fn()} onToggle={vi.fn()} onEdit={onEdit} />,
    );
    fireEvent.click(screen.getByTitle("Edit task"));
    expect(onEdit).toHaveBeenCalledWith(baseTask);
  });

  it("shows strikethrough style for completed tasks", () => {
    const task = { ...baseTask, completed: true };
    render(
      <TaskCard task={task} onDelete={vi.fn()} onToggle={vi.fn()} onEdit={vi.fn()} />,
    );
    expect(screen.getByText("Study React")).toHaveClass("text-decoration-line-through");
  });

  it("shows 'Mark as active' button for completed tasks", () => {
    const task = { ...baseTask, completed: true };
    render(
      <TaskCard task={task} onDelete={vi.fn()} onToggle={vi.fn()} onEdit={vi.fn()} />,
    );
    expect(screen.getByTitle("Mark as active")).toBeInTheDocument();
  });
});
