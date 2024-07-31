"use client"
import { Check, FilePenLine, LoaderCircle, Trash2, X } from 'lucide-react'
import React, { FormEvent, useEffect, useState } from 'react'

type TodolistItem = {
  _id: string;
  todo: string;
  completed: boolean;
  createdAt: Date;
  updatedAt: Date;
  __v: number;
}

function Home() {

  const [todos, setTodos] = useState<TodolistItem[]>([])
  const [isloadingTodos, setIsloadingTodos] = useState(true)
  const [newTodo, setNewTodo] = useState('')
  const [editTodoIndex, setEditTodoIndex] = useState<string | null>(null)
  const [updatedTask, setUpdatedTask] = useState('')

  async function addTodo(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (newTodo.trim()) {
      await fetch(`/api/add-todo`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ todo: newTodo.trim() })
      })

      setNewTodo('');
      fetchTodos()
    };
  }

  async function fetchTodos() {
    const response = await fetch('/api/get-todos', { cache: 'no-cache' })
    const data = await response.json()
    console.log(data)
    setTodos(data.data)
  }

  async function deleteTodo(todo_id: string) {
    if (todo_id) {
      await fetch(`/api/remove-todo`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ todo_id })
      })

      fetchTodos()
    }
  }

  async function completedTodo(todo_id: string) {
    if (todo_id) {
      await fetch(`/api/update-todo`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ todo_id, updatedTodo: { completed: true } })
      })

      fetchTodos()
    }
  }

  async function updateTask(todo_id: string, task: string) {
    if (task.trim()) {
      await fetch(`/api/update-todo`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ todo_id, updatedTodo: { todo: task.trim() } })
      })

      fetchTodos()
    }
  }

  useEffect(() => {
    fetchTodos()
    setIsloadingTodos(false)
  }, [])

  return (
    <div className='w-full h-screen flex items-center justify-center bg-gray-100 sm:bg-gray-200'>
      <div className='w-full max-w-2xl h-[40rem] p-5 border border-gray-200 bg-gray-100 rounded-md'>
        <form onSubmit={addTodo}>
          <h1 className='h1 text-gray-600 mb-5'>
            Your Todolist
          </h1>

          <div className='flex relative'>
            <input
              type="text"
              className='outline-none px-5 py-3 text-lg w-full rounded-md text-gray-700'
              placeholder='Add task'
              value={newTodo}
              onChange={(e) => setNewTodo(e.target.value)}
            />
            <button type='submit' className='absolute right-5 text-green-400 text-lg font-semibold inset-y-0'>
              Add
            </button>
          </div>
        </form>

        <h3 className='p-3 font-medium text-gray-600'>
          Your todos
        </h3>

        {
          isloadingTodos ?
            (
              <h1 className='px-3 py-1 text-gray-700 flex gap-2'>
                <LoaderCircle className='animate-spin ' />
                Loading todos...
              </h1>
            )
            :
            (
              <ul className='flex flex-col gap-1 h-[26rem] overflow-y-auto'>
                {
                  todos.map(todo => (
                    <li key={todo._id} className='list flex items-center justify-between'>
                      <div className='flex items-center gap-4'>
                        {
                          !todo.completed ?
                            <X size={23} className='text-red-500 cursor-pointer' onClick={() => completedTodo(todo._id)} />
                            :
                            <Check size={23} className='text-green-500 cursor-pointer' />
                        }
                        {
                          editTodoIndex === todo._id ?
                            (
                              <input
                                type="text"
                                className='outline-none w-full rounded-md text-gray-700'
                                autoFocus
                                placeholder='Edit task'
                                onChange={(e) => setUpdatedTask(e.target.value)}
                              />
                            ) :
                            (
                              <span className={`${todo.completed && 'line-through'}`}>
                                {todo.todo}
                              </span>

                            )
                        }
                      </div>

                      <span className='flex items-center gap-3'>
                        {
                          editTodoIndex === todo._id && (
                            <div className='bg-green-400 rounded-full cursor-pointer' onClick={() => {
                              updateTask(todo._id, updatedTask)
                              setEditTodoIndex(null)
                            }}>
                              <Check className='p-1 text-gray-600' />
                            </div>
                          )
                        }

                        <FilePenLine size={23} className='text-gray-500 cursor-pointer' onClick={() => setEditTodoIndex(todo._id)} />

                        <Trash2 size={23} className='text-red-500 cursor-pointer' onClick={() => deleteTodo(todo._id)} />
                      </span>
                    </li>
                  ))
                }
              </ul>
            )
        }

      </div>
    </div>
  )
}

export default Home