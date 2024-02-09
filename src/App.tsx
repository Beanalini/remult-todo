import { FormEvent, useEffect, useState } from "react";
import { remult } from "remult";
import { Task } from "./shared/task";
import "./App.css";
import { TasksController } from "./shared/TasksController";

const taskRepo = remult.repo(Task);

function App() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTaskTitle, setNewTaskTitle] = useState("");

  useEffect(() => {
    return taskRepo
      .liveQuery({ where: { completed: undefined } })
      .subscribe((info) => setTasks(info.applyChanges));
  }, []);

  async function addTask(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    try {
      //const newTask = await taskRepo.insert({ title: newTaskTitle });
      //console.log(newTask);
      await taskRepo.insert({ title: newTaskTitle });
      // setTasks((tasks) => [...tasks, newTask]);
      setNewTaskTitle("");
    } catch (error) {
      alert((error as { message: string }).message);
    }
  }
  async function setAllCompleted(completed: boolean) {
    // for (const task of await taskRepo.find()) {
    //   console.log(task);
    //   await taskRepo.save({ ...task, completed });
    await TasksController.setAllCompleted(completed);
  }

  return (
    <div>
      <h1>Todos</h1>
      <main>
        {taskRepo.metadata.apiInsertAllowed() && (
          <form onSubmit={(e) => addTask(e)}>
            <input
              value={newTaskTitle}
              placeholder="Enter task"
              onChange={(e) => setNewTaskTitle(e.target.value)}
            ></input>
            <button>Add</button>
          </form>
        )}
        {tasks.map((task) => {
          function setTask(value: Task) {
            setTasks((tasks) => tasks.map((t) => (t === task ? value : t)));
          }
          async function setCompleted(completed: boolean) {
            //setTask(await taskRepo.save({ ...task, completed }));
            await taskRepo.save({ ...task, completed });
          }
          function setTitle(title: string) {
            setTask({ ...task, title });
          }
          async function doSaveTask() {
            try {
              //setTask(await taskRepo.save(task));
              await taskRepo.save(task);
            } catch (error) {
              alert((error as { message: string }).message);
            }
          }

          async function deleteTask() {
            try {
              await taskRepo.delete(task);
              //setTasks((tasks) => tasks.filter((t) => t !== task));
            } catch (error) {
              alert((error as { message: string }).message);
            }
          }

          return (
            <div key={task.id}>
              <input
                type="checkbox"
                checked={task.completed}
                onChange={(e) => setCompleted(e.target.checked)}
              />{" "}
              <input
                value={task.title}
                onChange={(e) => setTitle(e.target.value)}
              />
              <button onClick={() => doSaveTask()}>Save</button>
              {taskRepo.metadata.apiDeleteAllowed() && (
                <button onClick={() => deleteTask()}>Delete</button>
              )}
            </div>
          );
        })}

        <div>
          <button onClick={() => setAllCompleted(true)}>
            Set all completed
          </button>
          <button onClick={() => setAllCompleted(false)}>
            Set all uncompleted
          </button>
        </div>
      </main>
    </div>
  );
}

export default App;
