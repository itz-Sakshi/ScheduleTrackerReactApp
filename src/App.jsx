import { useState, useEffect } from "react";
import Navbar from "./components/navbar";
import { FaEdit } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import { v4 as uuidv4 } from "uuid";
import { startOfDay, isBefore, parseISO, isSameDay } from "date-fns";
import ConfirmModal from "./components/confirm"


function App() {
  const [todo, setTodo] = useState("");
  const [todos, setTodos] = useState([]);
  const [date, setDate] = useState("");
  const [deadline, setDeadline] = useState("");
  const [sort, setSort] = useState("");
  const [filteredTodos, setFilteredTodos] = useState([]);
  const [showEditConfirm, setShowEditConfirm] = useState(false);
  const [showDelConfirm, setShowDelConfirm] = useState(false);
  const [selectedTodoId, setSelectedTodoId] = useState(null);

  const [showFinished, setshowFinished] = useState(true);
  console.log(todos);

  useEffect(() => {
    let todoString = localStorage.getItem("todos");
    if (todoString) {
      let Todos = JSON.parse(localStorage.getItem("todos"));
      setTodos(Todos);
      setFilteredTodos(Todos);
    }
  }, []);

  useEffect(() => {
    updateFilteredTodos(sort);
  }, [sort, todos]);

  // Saving to localStorage
  const saveToLS = (newTodos) => {
    localStorage.setItem("todos", JSON.stringify(newTodos));
  };

  const toggleFinished = () => {
    setshowFinished(!showFinished);
  };

  const updateFilteredTodos = (sortOption) => {
    const today = startOfDay(new Date());
    let filtered;
    const aWeekFromNow = new Date(today);
    const aMonthFromNow = new Date(today);

    switch (sortOption) {
      case "today":
        filtered = todos.filter((todo) => {
          let deadline = parseISO(todo.deadline);
          console.log("today: "+today,"deadline: "+ deadline);
          return isSameDay(deadline,today);
        });
        break;

      case "week":
        aWeekFromNow.setDate(today.getDate() + 7);
        console.log(today, aWeekFromNow);
        filtered = todos.filter((todo) => {
          let deadline = parseISO(todo.deadline);
          return deadline >= today && deadline <= aWeekFromNow;
        });
        break;

      case "month":
        aMonthFromNow.setMonth(today.getMonth() + 1);
        console.log(today, aMonthFromNow);
        filtered = todos.filter((todo) => {
          let deadline = (parseISO(todo.deadline));
          return deadline >= today && deadline <= aMonthFromNow;
        });
        break;

      case "missed":
        filtered = todos.filter((todo)=>{
          return  !isFutureOrToday(todo.deadline);
        })
        break;

      default:
        filtered = todos;
        break;
    }

    setFilteredTodos(filtered);
  };

  const HandleChangeSort = (e) => {
    const sortOption = e.target.value;
    setSort(sortOption);
    updateFilteredTodos(sortOption);
  };

  const handleAdd = () => {
    if ( !isFutureOrToday(date) ||  !isFutureOrToday(deadline) || (date > deadline)) {
      alert("Please add valid dates and deadlines.");
      return;
    }
    const newTodos = [
      ...todos,
      { id: uuidv4(), todo, date, deadline, isCompleted: false },
    ];
    setTodos(newTodos);
    setTodo("");
    setDate("");
    setDeadline("");
    saveToLS(newTodos);
    updateFilteredTodos(sort);
  };

  const handleEdit = (id) => {
    setSelectedTodoId(id);
    setShowEditConfirm(true);
  };

  const handleConfirmEdit = () => {
    let id = selectedTodoId;
    let t = todos.filter((item) => item.id === id);
    setTodo(t[0].todo);
    setDate(t[0].date);
    setDeadline(t[0].deadline);
    let newTodos = todos.filter((item) => {
      return item.id !== id;
    });
    setTodos(newTodos);
    saveToLS(newTodos);
    updateFilteredTodos(sort);
    setShowEditConfirm(false);
  }; 

  const handleDelete = (id) => {
    setSelectedTodoId(id);
    setShowDelConfirm(true);
  };

  const handleConfirmDelete = () => {
    let id = selectedTodoId;
    let newTodos = todos.filter((item) => {
      return item.id !== id;
    });
    setTodos(newTodos);
    saveToLS(newTodos);
    updateFilteredTodos(sort);
    setShowDelConfirm(false);
  };

  const handleTodoChange = (e) => {
    setTodo(e.target.value);
  };

  const handleDateChange = (e) => {
    setDate(e.target.value);
  };

  const handleDeadlineChange = (e) => {
    setDeadline(e.target.value);
  };

  const handleCheckbox = (e) => {
    let id = e.target.name;
    let index = todos.findIndex((item) => {
      return item.id === id;
    });
    let newTodos = [...todos];
    newTodos[index].isCompleted = !newTodos[index].isCompleted;
    setTodos(newTodos);
    saveToLS(newTodos);
  };

  // Function to check if a date is today or in the future
  const isFutureOrToday = (dateStr) => {
    const userDate = parseISO(dateStr);
    const today = startOfDay(new Date()); // Get the start of today in UTC
    return !isBefore(userDate, today);
  };

  const handleCancelEdit = () => {
    setShowEditConfirm(false);
  };

  const handleCancelDelete = () => {
    setShowDelConfirm(false);
  };

  return (
    <>
      <Navbar />
      <div className=" mx-4 md:container md:mx-auto my-4 p-5 bg-slate-400 min-h-[88vh] md:w-1/2 overflow-auto">
        <h1 className="font-bold text-xl text-center">
          ScheduleTracker - Keep Track, Stay on Track.
        </h1>
        <div className="addTodo flex flex-col gap-2 my-5">
          <h2 className="text-lg font-bold">Add a Todo</h2>
          <input
            onChange={handleTodoChange}
            value={todo}
            className="w-full px-3 py-1 rounded-md"
            type="text"
            placeholder="Enter Task"
          />
          <div className="dateDeadline flex gap-4 justify-between">
            <input
              type="text"
              value={date}
              onFocus={(e) => (e.target.type = "date")}
              onBlur={(e) => (e.target.type = date ? "date" : "text")}
              onChange={handleDateChange}
              placeholder="Select Date"
              className=" w-[47%] px-3 py-1 rounded-md"
            />
            <input
              type="text"
              value={deadline}
              onFocus={(e) => (e.target.type = "date")}
              onBlur={(e) => (e.target.type = deadline ? "date" : "text")}
              onChange={handleDeadlineChange}
              placeholder="Select Deadline"
              className=" w-[47%] px-3 py-1 rounded-md"
            />
          </div>
          <button
            onClick={handleAdd}
            disabled={todo.length <= 3 || date === "" || deadline === ""}
            className="bg-slate-600 px-2 text-sm py-1 font-bold rounded-md disabled:bg-slate-300"
          >
            Save
          </button>
        </div>
        <div className="sort flex justify-between">
          <div>
            <input
              type="checkbox"
              onChange={toggleFinished}
              checked={showFinished}
            />{" "}
            Show Finished
          </div>
          <select
            value={sort}
            onChange={HandleChangeSort}
            className="border rounded"
          >
            <option value="">Sort by...</option>
            <option value="today">Due today</option>
            <option value="week">Due within a week</option>
            <option value="month">Due within a month</option>
            <option value="missed">Missed Deadline</option>
          </select>
        </div>

        <h2 className="text-xl font-bold my-4">Your Todos</h2>
        <div className="todos">
          <div className="todos-container h-[30vh] overflow-y-auto">
          {filteredTodos.length === 0 && (
            <div className="m-5 text-lg"> No Todos to display</div>
          )}
          {filteredTodos.map(
            (item) =>
              (showFinished || !item.isCompleted) && (
                <div key={item.id} className="todo flex justify-between mx-3">
                  <div className="flex gap-4">
                    <input
                      name={item.id}
                      onChange={handleCheckbox}
                      type="checkbox"
                      checked={item.isCompleted}
                    />
                    <div
                      className={
                        item.isCompleted
                          ? "line-through w-full"
                          : "w-full overflow-auto"
                      }
                    >
                      <p className="break-words whitespace-normal">
                        {item.todo}
                      </p>
                      <p className="text-sm text-gray-700">Date: {item.date}</p>
                      <p className="text-sm text-gray-700">
                        Deadline: {item.deadline}
                      </p>
                    </div>
                  </div>
                  <div className="buttons flex mt-2">
                    <button
                      onClick={() => {
                        handleEdit(item.id);
                      }}
                      className="bg-slate-600 px-2 text-[40px] py-1 font-bold rounded-md mx-1 w-12 flex justify-center items-center hover:text-3xl"
                    >
                      <FaEdit />
                    </button>
                    <button
                      onClick={() => {
                        handleDelete(item.id);
                      }}
                      className="bg-slate-600 px-2 text-[40px] py-1 font-bold rounded-md mx-1 w-12 flex justify-center items-center hover:text-3xl"
                    >
                      <MdDelete/>
                    </button>
                  </div>
                </div>
              )
          )}
        </div>
      </div></div>
      {showEditConfirm && (
          <ConfirmModal
            message="Are you sure you want to edit this Todo?"
            onConfirm={handleConfirmEdit}
            onCancel={handleCancelEdit}
          />
        )}
      {showDelConfirm && (
          <ConfirmModal
            message="Are you sure you want to delete this Todo?"
            onConfirm={handleConfirmDelete}
            onCancel={handleCancelDelete}
          />
        )}

    </>
  );
}

export default App;
