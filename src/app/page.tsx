/* eslint-disable react-hooks/rules-of-hooks */
"use client";
import { Check, FilePenLine, LoaderCircle, Trash2, X } from "lucide-react";
import React, { FormEvent, useEffect, useState } from "react";

type TodolistItem = {
  _id: string;
  todo: string;
  completed: boolean;
  createdAt: Date;
  updatedAt: Date;
  __v: number;
};

function Home() {
  const [todos, setTodos] = useState<TodolistItem[]>([]);
  const [isloadingTodos, setIsloadingTodos] = useState(true);
  const [isAdding, setIsAdding] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [newTodo, setNewTodo] = useState("");
  const [editTodoIndex, setEditTodoIndex] = useState<string | null>(null);
  const [updatedTask, setUpdatedTask] = useState("");

  async function AddTodo(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (newTodo.trim()) {
      setIsAdding(true);
      try {
        const newtodo = await fetch(`/api/add-todo`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ todo: newTodo.trim() }),
        });
        const newTodoData = await newtodo.json();

        setNewTodo("");
        setTodos([...todos, newTodoData.data])
      } catch (error) {
        console.error("Error adding todo:", error);
      } finally {
        setIsAdding(false);
      }
    }
  }


  async function DeleteTodo(todo_id: string) {
    if (todo_id) {
      setIsDeleting(true);
      try {
        await fetch(`/api/remove-todo`, {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ todo_id })
        });

        setTodos(todos.filter((todo) => todo._id !== todo_id))
      } catch (error) {
        console.error("Error deleting todo:", error);
      } finally {
        setIsDeleting(false);
      }
    }
  }

  async function CompletedTodo(todo_id: string) {
    if (todo_id) {
      setIsUpdating(true);
      try {
        await fetch(`/api/update-todo`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ todo_id, updatedTodo: { completed: true } }),
        });

        setTodos(todos.map((todo) => todo._id === todo_id ? { ...todo, completed: true } : todo))
      } catch (error) {
        console.error("Error updating todo:", error);
      } finally {
        setIsUpdating(false);
      }
    }
  }

  async function UpdateTask(todo_id: string, task: string) {
    if (task.trim()) {
      setIsUpdating(true);
      try {
        await fetch(`/api/update-todo`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ todo_id, updatedTodo: { todo: task.trim() } }),
        });

        setTodos(todos.map((todo) => todo._id === todo_id ? { ...todo, todo: task.trim() } : todo))
      } catch (error) {
        console.error("Error updating todo:", error);
      } finally {
        setIsUpdating(false);
      }
    }
  }

  async function FetchTodos() {
    setIsloadingTodos(true);
    try {
      const response = await fetch("/api/get-todos", {
        method: "GET",
        cache: "no-cache",
      });

      if (!response.ok) {
        throw new Error(`Error fetching todos: ${response.statusText}`);
      }

      const todosData = await response.json();
      if (todosData.data) {
        setTodos(todosData.data);
      } else {
        console.warn("No todos data found");
      }
    } catch (error) {
      console.error("Error fetching todos:", error);
    } finally {
      setIsloadingTodos(false);
    }
  }


  useEffect(() => {
    FetchTodos();
  }, []);

  return (
    <div className="w-full h-screen flex items-center justify-center bg-gray-100 sm:bg-gray-200">
      <div className="w-full max-w-2xl h-[40rem] p-5 border border-gray-200 bg-gray-100 rounded-md">
        <form onSubmit={AddTodo}>
          <h1 className="h1 text-gray-600 mb-5">Your Todolist</h1>
          <div className="flex relative">
            <input
              type="text"
              className="outline-none px-5 py-3 text-lg w-full rounded-md text-gray-700"
              placeholder="Add task"
              value={newTodo}
              onChange={(e) => setNewTodo(e.target.value)}
              disabled={isAdding}
              autoFocus
            />
            <button
              type="submit"
              className="absolute right-5 text-green-400 text-lg font-semibold inset-y-0"
              disabled={isAdding}
            >
              {isAdding ? "Adding..." : "Add"}
            </button>
          </div>
        </form>

        <h3 className="p-3 font-medium text-gray-600">Your todos</h3>

        {isloadingTodos ? (
          <h1 className="px-3 py-1 text-gray-700 flex gap-2">
            <LoaderCircle className="animate-spin" />
            Loading todos...
          </h1>
        ) : (
          <ul className="flex flex-col gap-1 h-[26rem] overflow-y-auto">
            {todos.map((todo) => (
              <li key={todo._id} className="list flex items-center justify-between">
                <div className="flex items-center gap-4">
                  {!todo.completed ? (
                    <X
                      size={23}
                      className="text-red-500 cursor-pointer"
                      onClick={() => CompletedTodo(todo._id)}
                    />
                  ) : (
                    <Check size={23} className="text-green-500 cursor-pointer" />
                  )}
                  {editTodoIndex === todo._id ? (
                    <input
                      type="text"
                      className="outline-none w-full rounded-md text-gray-700"
                      autoFocus
                      placeholder="Edit task"
                      onChange={(e) => setUpdatedTask(e.target.value)}
                    />
                  ) : (
                    <span className={`${todo.completed && "line-through"}`}>
                      {todo.todo}
                    </span>
                  )}
                </div>
                <span className="flex items-center gap-3">
                  {editTodoIndex === todo._id && (
                    <div
                      className="bg-green-400 rounded-full cursor-pointer"
                      onClick={() => {
                        UpdateTask(todo._id, updatedTask);
                        setEditTodoIndex(null);
                      }}
                    >
                      <Check className="p-1 text-gray-600" />
                    </div>
                  )}
                  <FilePenLine
                    size={23}
                    className="text-gray-500 cursor-pointer"
                    onClick={() => setEditTodoIndex(todo._id)}
                  />
                  <Trash2
                    size={23}
                    className="text-red-500 cursor-pointer"
                    onClick={() => DeleteTodo(todo._id)}
                  />
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

export default Home;
