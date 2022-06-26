import { useState, useEffect } from "react";
import axios from "axios";
function List({ todos }) {
  const [tasks, setTasks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    axios("https://kc-yilmaz.jotform.dev/intern-api/getTasks")
      .then((res) => {
        setTasks(res.data.content);
      })
      .catch((e) => console.log("List satır12" + e))
      .finally(() => setIsLoading(false));
  }, [todos]);

  return (
    <div>
      {isLoading && <div>Loding...</div>}
      {tasks.map((task) => (
        <div key={task.id}>{task.title}</div>
      ))}
    </div>
  );
}

export default List;
