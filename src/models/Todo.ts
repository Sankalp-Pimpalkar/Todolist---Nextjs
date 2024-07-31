import mongoose from "mongoose";

const addTodo = new mongoose.Schema({
    todo: String,
    completed: Boolean
}, { timestamps: true });

const Todo = mongoose.models.Todo || mongoose.model("Todo", addTodo);

export default Todo;