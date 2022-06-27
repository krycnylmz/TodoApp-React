import { useState, useEffect } from "react";
import axios from "axios";
import style from "./style.module.css";
function List({ todos, changeTodo }) {
  const [tasks, setTasks] = useState([]);

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    axios("https://kc-yilmaz.jotform.dev/intern-api/getTasks")
      .then((res) => {
        setTasks(res.data.content);
      })
      .catch((e) => console.log(e))
      .finally(() => setIsLoading(false));
  }, [todos]);

  const [detail, setDetail] = useState(false);

  const ShowDetail = (e) => {
    setDetail(false);

    const span = e.target.querySelector("form");
    const isShow = span.getAttribute("isshow");
    if (isShow === "false") {
      span.setAttribute("isshow", "true");
      span.className = style.show;
    } else {
      span.setAttribute("isshow", "false");
      span.className = style.hidden;
    }
  };

  const SaveChanges = (e) => {
    // if (form.title === "") {
    //   return false;
    // }
  };

  const removeObj = (arr, value) => {
    return arr.filter(function () {
      if (value > -1) {
        arr.splice(value, 1);
      }
    });
  };

  //Delete item from the list and db
  const DeleteTodo = (id) => {
    axios
      .post("https://kc-yilmaz.jotform.dev/intern-api/deleteTask", {
        id: id,
      })
      .then(function (res) {
        if (res.data.responseCode === 200) {
          const deletedItemId = JSON.parse(res.config.data).id;
          const deletedObj = tasks.find((elem) => elem.id === deletedItemId);
          var newTasks = tasks.filter((x) => {
            return x !== deletedObj;
          });
          //update state
          setTasks(newTasks);
          changeTodo();
        }
      })
      .catch(function (error) {
        console.log(error);
      });
  };
  return (
    <ul>
      {isLoading && <div>Loding...</div>}
      {tasks.map((task) => (
        <li key={task.id} onClick={(e) => ShowDetail(e)}>
          {task.title}
          <div className={style.lastUpdate}>Last update: {task.updated_at}</div>
          <form
            onSubmit={(e) => e.preventDefault()}
            isshow={detail.toString()}
            className={detail ? style.show : style.hidden}
          >
            <input name="title" placeholder={task.title} />
            {task.body ? (
              <p>{task.body}</p>
            ) : (
              <textarea name="body" placeholder="Add more information!" />
            )}

            <div className={style.options}>
              <select name="stat">
                <option value="To-Do">To-Do</option>
                <option value="Doing">Doing</option>
                <option value="Completed">Completed</option>
                <option value="Cancelled">Cancelled</option>
              </select>
              {task.due_to ? task.due_to : "not setted"}
              <button
                className={style.delete}
                onClick={() => DeleteTodo(task.id)}
              >
                Delete
              </button>
              <button
                className={style.save}
                onClick={() => SaveChanges(task.id)}
              >
                Save
              </button>
            </div>
          </form>
        </li>
      ))}
    </ul>
  );
}

export default List;
