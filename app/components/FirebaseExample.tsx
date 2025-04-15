"use client";

import { useState, useEffect } from 'react';
import { 
  db, 
  collection, 
  addDoc, 
  getDocs,
  doc,
  updateDoc,
  deleteDoc
} from '../../lib/firebase';
import { DocumentData } from 'firebase/firestore';

interface Todo {
  id: string;
  title: string;
  completed: boolean;
}

export default function FirebaseExample() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [newTodo, setNewTodo] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Charger les todos depuis Firestore
  useEffect(() => {
    const fetchTodos = async () => {
      try {
        setLoading(true);
        const todosCollection = collection(db, 'todos');
        const todoSnapshot = await getDocs(todosCollection);
        const todoList = todoSnapshot.docs.map((doc: DocumentData) => ({
          id: doc.id,
          ...doc.data()
        })) as Todo[];
        
        setTodos(todoList);
        setError(null);
      } catch (err) {
        console.error("Erreur lors du chargement des todos:", err);
        setError("Impossible de charger les données");
      } finally {
        setLoading(false);
      }
    };

    fetchTodos();
  }, []);

  // Ajouter un nouveau todo
  const addTodo = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newTodo.trim()) return;
    
    try {
      const todosCollection = collection(db, 'todos');
      const docRef = await addDoc(todosCollection, {
        title: newTodo,
        completed: false
      });
      
      // Ajouter le nouveau todo à l'état local
      setTodos([...todos, {
        id: docRef.id,
        title: newTodo,
        completed: false
      }]);
      
      setNewTodo('');
    } catch (err) {
      console.error("Erreur lors de l'ajout d'un todo:", err);
      setError("Impossible d'ajouter le todo");
    }
  };

  // Supprimer un todo
  const deleteTodo = async (id: string) => {
    try {
      const todoDoc = doc(db, 'todos', id);
      await deleteDoc(todoDoc);
      
      // Mettre à jour l'état local
      setTodos(todos.filter(todo => todo.id !== id));
    } catch (err) {
      console.error("Erreur lors de la suppression d'un todo:", err);
      setError("Impossible de supprimer le todo");
    }
  };

  // Marquer un todo comme complété ou non
  const toggleTodo = async (id: string) => {
    try {
      const todoToToggle = todos.find(todo => todo.id === id);
      if (!todoToToggle) return;
      
      const todoDoc = doc(db, 'todos', id);
      await updateDoc(todoDoc, {
        completed: !todoToToggle.completed
      });
      
      // Mettre à jour l'état local
      setTodos(todos.map(todo => 
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      ));
    } catch (err) {
      console.error("Erreur lors de la mise à jour d'un todo:", err);
      setError("Impossible de mettre à jour le todo");
    }
  };

  return (
    <div className="max-w-lg mx-auto my-8 p-6 bg-white rounded-lg shadow-md">
      <h1 className="text-2xl font-bold mb-4">Liste de Tâches (Firebase)</h1>
      
      {error && <div className="bg-red-100 text-red-700 p-3 rounded mb-4">{error}</div>}
      
      <form onSubmit={addTodo} className="mb-6">
        <div className="flex">
          <input
            type="text"
            value={newTodo}
            onChange={(e) => setNewTodo(e.target.value)}
            placeholder="Ajouter une nouvelle tâche"
            className="flex-1 p-2 border border-gray-300 rounded-l"
          />
          <button 
            type="submit" 
            className="bg-blue-500 text-white p-2 rounded-r hover:bg-blue-600"
          >
            Ajouter
          </button>
        </div>
      </form>
      
      {loading ? (
        <p className="text-center">Chargement...</p>
      ) : (
        <ul className="space-y-2">
          {todos.length === 0 ? (
            <p className="text-gray-500 text-center">Aucune tâche pour le moment</p>
          ) : (
            todos.map(todo => (
              <li key={todo.id} className="flex items-center justify-between bg-gray-50 p-3 rounded">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    checked={todo.completed}
                    onChange={() => toggleTodo(todo.id)}
                    className="mr-2"
                  />
                  <span className={todo.completed ? "line-through text-gray-500" : ""}>
                    {todo.title}
                  </span>
                </div>
                <button
                  onClick={() => deleteTodo(todo.id)}
                  className="text-red-500 hover:text-red-700"
                >
                  Supprimer
                </button>
              </li>
            ))
          )}
        </ul>
      )}
    </div>
  );
} 