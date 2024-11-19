import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const getTodosAsync = createAsyncThunk(
    "todos/getTodosAsync",
    async () => {
        const res = await axios(`${process.env.REACT_APP_API_BASE_ENDPOINT}/todos`);
        return res.data;
    }
);

export const addTodosAsync = createAsyncThunk(
    "todos/addTodosAsync",
    async (data) => {
        const res = await axios.post(`${process.env.REACT_APP_API_BASE_ENDPOINT}/todos`, data);
        return res.data;
    }
);

export const toggleTodoAsync = createAsyncThunk('todos/toggleTodoAsync', async ({ id, data }) => {
    const response = await fetch(`${process.env.REACT_APP_API_BASE_ENDPOINT}/todos/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
  
    if (!response.ok) {
      throw new Error('Failed to toggle todo');
    }
  
    const updatedTodo = await response.json();
    console.log('Updated todo:', updatedTodo); // API'den dönen yanıt
    return updatedTodo;
  });
export const removeTodoAsync = createAsyncThunk('todos/removeTodoAsync', async (id) => {
    const res = await axios.delete(`${process.env.REACT_APP_API_BASE_ENDPOINT}/todos/${id}`);
    return id; // Eğer backend sadece `id` döndürüyorsa, doğru.
});