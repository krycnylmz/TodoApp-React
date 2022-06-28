import { useState, useEffect } from "react";
import axios from "axios";
import style from "./style.module.css";
import { useAutoAnimate } from "@formkit/auto-animate/react";
function List({ todos, changeTodo }) {
  const [autoAnimParent] = useAutoAnimate();
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

  // Toogle effect to see more detail about task
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

  //Update todos
  const OnChangeInput = (id, e) => {
    const newState = tasks.map((obj) => {
      // if id equalsid, update value by name of input
      if (obj.id === id) {
        return { ...obj, [e.target.name]: e.target.value };
      }
      // otherwise return object as is
      return obj;
    });

    setTasks(newState);
    console.log(tasks);
  };

  //Save changes on the db
  const SaveChanges = (task) => {
    console.log(task.id, task.title, task.body, task.stat, task.due_to);

    axios
      .put("https://kc-yilmaz.jotform.dev/intern-api/updateTask", {
        id: task.id,
        title: task.title,
        body: task.body,
        stat: task.stat,
        due_to: task.due_to,
      })
      .then(function (res) {
        // if (res.data.responseCode === 200) {
        //   const deletedItemId = JSON.parse(res.config.data).id;
        //   const deletedObj = tasks.find((elem) => elem.id === deletedItemId);
        //   var newTasks = tasks.filter((x) => {
        //     return x !== deletedObj;
        //   });
        //   //update state
        //   setTasks(newTasks);
        changeTodo();
        // }
        console.log(res);
      })
      .catch(function (error) {
        console.log(error);
      });
  };

  return (
    <ul ref={autoAnimParent}>
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
            <input
              name="title"
              placeholder={task.title}
              onChange={(e) => OnChangeInput(task.id, e)}
              value={task.title}
            />

            <textarea
              name="body"
              placeholder="Add more information!"
              value={task.body}
              onChange={(e) => OnChangeInput(task.id, e)}
            />

            <div className={style.options}>
              <select
                name="stat"
                onChange={(e) => OnChangeInput(task.id, e)}
                defaultValue={task.stat}
              >
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
              <button className={style.save} onClick={() => SaveChanges(task)}>
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
