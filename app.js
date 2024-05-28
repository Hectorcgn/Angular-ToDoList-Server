//imports
import "dotenv/config";
import express from "express";
import cors from "cors";
import multer from "multer";

//variabels
const port = process.env.PORT || 8080;
const app = express();
let todos = [];
let todosdone = [];

//middelware
app.use(cors());
app.use(express.json());

//multer
const upload = multer();

//get-route
app.get("/todos", (req, res) => {
  res.json(todos);
  console.log("todos im todos arrray", todos);
});

app.get("/todosdone", (req, res) => {
  res.json(todosdone);
  console.log("todos im todosdone arrray", todosdone);
});

//post-route
app.post("/addtodos", (req, res) => {
  const newTodo = {
    id: todos.length + 1, // Einfache Inkrement-ID
    ...req.body,
  };
  todos.push(newTodo);
  res
    .status(201)
    .json({ message: "Todo erfolgreich hinzugefügt", todo: newTodo });
});

//put-route
app.put("/todos/:id", (req, res) => {
  const id = req.params.id;
  const todoIndex = todos.findIndex((todo) => todo.id === id);
  const todoDoneIndex = todosdone.findIndex((todo) => todo.id === id);

  if (todoIndex !== -1) {
    const updatedTodo = { ...req.body, id: id };
    if (req.body.status === true) {
      const checkedTodo = todos.splice(todoIndex, 1)[0];
      checkedTodo.status = true;
      todosdone.push(checkedTodo);
    } else if (req.body.status === false) {
      res.status(400).json({ message: "Todo ist bereits im todos Array" });
    }
    res
      .status(200)
      .json({ message: "Todo erfolgreich geändert", todo: updatedTodo });
  } else if (todoDoneIndex !== -1) {
    const updatedTodo = { ...req.body, id: id };
    if (req.body.status === true) {
      res.status(400).json({ message: "Todo ist bereits im todosdone Array" });
    } else if (req.body.status === false) {
      const uncheckedTodo = todosdone.splice(todoDoneIndex, 1)[0];
      uncheckedTodo.status = false;
      todos.push(uncheckedTodo);
    }
    res
      .status(200)
      .json({ message: "Todo erfolgreich geändert", todo: updatedTodo });
  } else {
    res.status(404).json({ message: "Todo nicht gefunden" });
  }
});
app.put("/todos/:id/label", (req, res) => {
  const id = req.params.id;
  const updatedLabel = req.body.label; // New label from the request

  const todoIndex = todos.findIndex((todo) => todo.id === id);
  const todoDoneIndex = todosdone.findIndex((todo) => todo.id === id);

  if (todoIndex !== -1) {
    todos[todoIndex].label = updatedLabel;
    res
      .status(200)
      .json({ message: "Label successfully updated", todo: todos[todoIndex] });
  } else if (todoDoneIndex !== -1) {
    todosdone[todoDoneIndex].label = updatedLabel;
    res.status(200).json({
      message: "Label successfully updated",
      todo: todosdone[todoDoneIndex],
    });
  } else {
    res.status(404).json({ message: "Todo not found" });
  }
});

//delete-route
app.delete("/todos/:id", (req, res) => {
  const id = req.params.id;
  const todoIndex = todos.findIndex((todo) => todo.id === id);
  const todoDoneIndex = todosdone.findIndex((todo) => todo.id === id);

  if (todoIndex !== -1) {
    todos.splice(todoIndex, 1);
    res.status(200).json({ message: "Todo erfolgreich gelöscht" });
  } else if (todoDoneIndex !== -1) {
    todosdone.splice(todoDoneIndex, 1);
    res.status(200).json({ message: "Todo erfolgreich gelöscht" });
  } else {
    res.status(404).json({ message: "Todo nicht gefunden" });
  }
});

//server start
app.listen(port, () => {
  console.log("Listening on port " + port);
});
