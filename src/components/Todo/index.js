import { useState, useEffect } from "react";

import style from "./style.module.css";
import List from "./List";
import Form from "./Form";

function Todo() {
  const [todos, setTodos] = useState([]);

  useEffect(() => {}, [todos]);

  return (
    <div className={style.app}>
      <Form addTodo={setTodos} todos={todos} />
      <List changeTodo={setTodos} todos={todos} />
    </div>
  );
}

export default Todo;
