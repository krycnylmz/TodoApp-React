import { useState } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";

function Form({ addTodo, todos }) {
  const initialForm = {
    title: "",
  };
  const [form, setForm] = useState(initialForm);

  const OnChangeInput = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const OnSubmit = (e) => {
    e.preventDefault();
    if (form.title === "") {
      return false;
    }

    const notify = (response) => {
      switch (response.responseCode) {
        case 404:
          toast.error(response.message, {
            position: toast.POSITION.BOTTOM_RIGHT,
          });
          break;

        default:
          toast.success(response.message, {
            position: toast.POSITION.BOTTOM_RIGHT,
          });
          break;
      }
    };

    //send todo to backend
    axios
      .post("https://kc-yilmaz.jotform.dev/intern-api/createTask", {
        title: form.title,
      })
      .then(function (res) {
        const response = JSON.parse(res.request.response);
        if (response.responseCode) {
          addTodo([...todos, form]);
        }
        notify(response);
      })
      .catch(function (error) {
        console.log(error);
      });

    //clear the input
    setForm(initialForm);
  };

  return (
    <>
      <form onSubmit={OnSubmit}>
        <input
          name="title"
          placeholder="What do you want to do?"
          onChange={OnChangeInput}
          value={form.title}
        />

        <button type="submit">Add</button>
      </form>
      <ToastContainer />
    </>
  );
}

export default Form;
