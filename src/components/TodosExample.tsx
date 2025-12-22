import { useState, useEffect } from 'react'
import supabase from '@/lib/supabase'

interface Todo {
  id: string
  title: string
  completed: boolean
  created_at: string
}

function TodosPage() {
  const [todos, setTodos] = useState<Todo[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function getTodos() {
      try {
        setLoading(true)
        const { data: todos, error } = await supabase
          .from('todos')
          .select('*')
          .order('created_at', { ascending: false })

        if (error) {
          setError(error.message)
          return
        }

        if (todos && todos.length > 0) {
          setTodos(todos)
        }
      } catch (err) {
        setError('Erreur lors du chargement des todos')
        console.error('Error fetching todos:', err)
      } finally {
        setLoading(false)
      }
    }

    getTodos()
  }, [])

  if (loading) {
    return <div>Chargement des todos...</div>
  }

  if (error) {
    return <div>Erreur: {error}</div>
  }

  return (
    <div>
      <h1>Mes Todos</h1>
      {todos.length === 0 ? (
        <p>Aucun todo trouvé</p>
      ) : (
        <ul>
          {todos.map((todo) => (
            <li key={todo.id}>
              <span style={{ textDecoration: todo.completed ? 'line-through' : 'none' }}>
                {todo.title}
              </span>
              {todo.completed && <span> ✅</span>}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

export default TodosPage