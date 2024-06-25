import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// axios.defaults.baseURL = "http://localhost:7002";


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

export const todosSlice = createSlice({
    name: 'todos',
    initialState: {
        items: [],
        activeFilter: localStorage.getItem("activeFilter") || "all",
        isLoading: false,
        error: null,
        addNewTodo: {
          isLoading: false,
          error: null
        }
      },
    reducers: {
        toggle: (state, action) => {
            const { id } = action.payload;
            const item = state.items.find(item => item.id === id);
            item.completed = !item.completed;
        },
        destroy: (state, action) => {
            const id = action.payload;
            const filtered = state.items.filter((item) => item.id !== id);
            state.items = filtered;
        },
        changeActiveFilter: (state, action) => {
            state.activeFilter = action.payload;
        },
        clearCompleted: (state) => {
            const filtered = state.items.filter(item => item.completed === false);
            state.items = filtered;
        },
    },
    extraReducers: (builder) => {
        // get todos
        builder.addCase(getTodosAsync.pending, (state) => {
            state.isLoading = true;
        });
        builder.addCase(getTodosAsync.fulfilled, (state, action) => {
            state.items = action.payload;
            state.isLoading = false;
        });
        builder.addCase(getTodosAsync.rejected, (state, action) => {
            state.error = action.error.message;
            state.isLoading = false;
        });
        // add todo
        builder.addCase(addTodosAsync.pending, (state) => {
            state.addNewTodo.isLoading = true;
        });
        builder.addCase(addTodosAsync.fulfilled, (state, action) => {
            state.items.push(action.payload);
            state.addNewTodo.isLoading = false;
        });
        builder.addCase(addTodosAsync.rejected, (state, action) => {
            state.addNewTodo.error = action.error.message;
            state.addNewTodo.isLoading = action.error.message;
        });
    }
});

export const selectTodos = (state) => state.todos.items;
export const selectFilteredTodos = (state) => {
    if (state.todos.activeFilter === 'all') {
        return state.todos.items;
    }
    return state.todos.items.filter((todo) =>
        state.todos.activeFilter === 'active' ? todo.completed === false : todo.completed === true
    )
};
export const selectActiveFilter = (state) => state.todos.activeFilter;
export const { toggle, destroy, changeActiveFilter, clearCompleted } = todosSlice.actions;
export default todosSlice.reducer;