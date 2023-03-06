import React, { useEffect, useState } from "react";
import "semantic-ui-css/semantic.min.css";
import "./App.css";
import {
  Grid,
  Input,
  Button,
  Segment,
  Header,
  Icon,
  Dropdown,
  Modal,
  List,
} from "semantic-ui-react";

function App() {
  const [open1, setOpen1] = useState(false);
  const [open2, setOpen2] = useState(false);
  const [userName, setUserName] = useState("");
  const [users, SetUsers] = useState([]);
  const option = users.map((user, index) => (
    <div
      className="text-center"
      key={index}
      onClick={() => handleSelectUser(user)}
    >
      {user}
    </div>
  ));

  const handleSelectUser = (user) => {
    setUserName(user);
  };

  const url = "https://assets.breatheco.de/apis/fake/todos/user";

  useEffect(() => {
    fetch(url)
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        SetUsers(data);
      })
      .catch((err) => console.log("Solicitud fallida", err));
  }, []);

  useEffect(() => {
    fetch(`https://assets.breatheco.de/apis/fake/todos/user/${userName}`)
      .then((response) => response.json())
      .then((data) => setTasks(data))
      .catch((error) => console.error("Error:", error));
  }, [userName]);

  const fetchTasks = () => {
    fetch(`https://assets.breatheco.de/apis/fake/todos/user/${userName}`)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Error al obtener tareas");
        }
        return response.json();
      })
      .then((data) => {
        setTasks(data);
      })
      .catch((error) => console.error("Error:", error));
  };

  const handleCreateUser = () => {
    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username: userName, todos: [] }),
    };
    fetch(
      `https://assets.breatheco.de/apis/fake/todos/user/${userName}`,
      requestOptions
    )
      .then((response) => {
        if (!response.ok) {
          throw new Error("Error al crear usuario");
        }
        return response.json();
      })
      .then((data) => {
        SetUsers([...users, userName]);
        fetchTasks(userName);
      })
      .catch((error) => console.error("Error:", error));
  };

  const handleDeleteUser = () => {
    const requestOptions = {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
    };
    fetch(
      `https://assets.breatheco.de/apis/fake/todos/user/${userName}`,
      requestOptions
    )
      .then((response) => response.json())
      .then(
        (data) => console.log("User deleted:", data),
        setUserName(""),
        setTasks([]),
        SetUsers([...users, userName])
      )
      .catch((error) => console.error("Error:", error));
  };

  const [task, setTask] = useState("");
  const [tasks, setTasks] = useState([]);

  const handleCreateTask = (task) => {
    const newTask = { label: task, done: false };
    const newTasks = [...tasks, newTask];
    setTasks(newTasks);
    setTask("");
    fetch(`https://assets.breatheco.de/apis/fake/todos/user/${userName}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newTasks),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("Tarea Creada:", data);
        setTask("");
      })
      .catch((error) => console.error("Error:", error));
  };

  const handleDeleteTask = (taskIndex) => {
    const newTasks = tasks.filter((task, index) => index !== taskIndex);
    setTasks(newTasks);
    const requestOptions = {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newTasks),
    };
    fetch(
      `https://assets.breatheco.de/apis/fake/todos/user/${userName}`,
      requestOptions
    )
      .then((response) => response.json())
      .then((data) => console.log("Tarea Eliminada:", data))
      .catch((error) => console.error("Error:", error));
  };

  const userExists = users.includes(userName);

  const [selectedTask, setSelectedTask] = useState(null);
  const [editedTask, setEditedTask] = useState("");

  const handleEditTask = (task) => {
    setSelectedTask(task);
    setEditedTask(task.label);
  };

  const handleUpdateTask = () => {
    const requestOptions = {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(
        tasks.map((task) =>
          task.label === selectedTask.label
            ? { ...task, label: editedTask }
            : task
        )
      ),
    };
    fetch(
      `https://assets.breatheco.de/apis/fake/todos/user/${userName}`,
      requestOptions
    )
      .then((response) => response.json())
      .then((data) => {
        console.log("Tarea Actualizada:", data);
        setTasks(data);
        setSelectedTask(null);
        setEditedTask("");
        fetchTasks();
      })
      .catch((error) => console.error("Error:", error));
  };

  return (
    <>
      <Header as="h2" icon textAlign="center">
        <Icon name="clipboard check" circular />
        <Header.Content> To-do List </Header.Content>
      </Header>
      <Grid centered>
        <Segment.Group>
          <Header as="h5" color="green">
            Current User: <br />
            {userExists ? (
              userName
            ) : (
              <p style={{ color: "red" }}>Usuario no existe, debe crearlo</p>
            )}
          </Header>
          <Dropdown
            iconposition="left"
            placeholder="Ver usuarios"
            selection
            options={option}
          />
          <Segment>
            <Input
              icon="users"
              iconPosition="left"
              placeholder="Ingrese nombre de usuario..."
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
            />

            <Modal
              size="tiny"
              closeIcon
              open={open1}
              trigger={
                <Button onClick={handleCreateUser}>Crear usuario</Button>
              }
              onClose={() => setOpen1(false)}
              onOpen={() => setOpen1(true)}
            >
              <Header
                icon="add user"
                color="grey"
                content="  Usuario creado exitosamente "
              />
              {/* <Modal.Content>
                <p>Usuario creado exitosamente.</p>
              </Modal.Content> */}
              <Modal.Actions>
                <Button color="red" onClick={() => setOpen1(false)}>
                  <Icon name="remove" /> Cerrar
                </Button>
              </Modal.Actions>
            </Modal>
            {/* separacion de modal */}
            <Modal
              size="tiny"
              closeIcon
              open={open2}
              trigger={
                <Button onClick={handleDeleteUser}>Eliminar usuario</Button>
              }
              onClose={() => setOpen2(false)}
              onOpen={() => setOpen2(true)}
            >
              <Header
                icon="user delete"
                color="grey"
                content=" Usuario eliminado exitosamente "
              />
              {/* <Modal.Content>
                <p>Usuario eliminado exitosamente.</p>
              </Modal.Content> */}
              <Modal.Actions>
                <Button color="red" onClick={() => setOpen2(false)}>
                  <Icon name="remove" /> Cerrar
                </Button>
              </Modal.Actions>
            </Modal>
          </Segment>
          <Segment.Group>
            <Segment color="teal">
              <Input
                icon="add circle"
                iconPosition="left"
                placeholder="Ingrese tarea... (Enter)"
                value={task}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    handleCreateTask(e.target.value);
                    setTask(e.target.value);
                    e.target.value = "";
                  }
                }}
                onChange={(e) => setTask(e.target.value)}
              />
            </Segment>
            <Segment>
              {tasks.length > 0 ? (
                <>
                  {tasks.map((task, index) => (
                    <List>
                      <Segment color="teal" key={index}>
                        {selectedTask && selectedTask.label === task.label ? (
                          <>
                            <Input
                              value={editedTask}
                              onChange={(e) => setEditedTask(e.target.value)}
                            />
                            <div>
                              <Button.Group>
                                <Button
                                  circular
                                  color="blue"
                                  icon="save"
                                  onClick={handleUpdateTask}
                                />
                                <Button.Or />
                                <Button
                                  circular
                                  color="red"
                                  icon="cancel"
                                  onClick={() => setSelectedTask(null)}
                                />
                              </Button.Group>
                            </div>
                          </>
                        ) : (
                          <>
                            {task.label}
                            <hr />
                            <Button.Group>
                              <Button
                                size={"mini"}
                                circular
                                basic
                                icon="edit"
                                content="editar"
                                color="blue"
                                onClick={() => handleEditTask(task)}
                              />
                              <Button.Or />
                              <Button
                                size={"mini"}
                                circular
                                basic
                                icon="trash"
                                content="eliminar"
                                color="red"
                                onClick={() => handleDeleteTask(index)}
                              />
                            </Button.Group>
                          </>
                        )}
                      </Segment>
                    </List>
                  ))}
                </>
              ) : (
                <p>No existen tareas</p>
              )}
            </Segment>
          </Segment.Group>
        </Segment.Group>
      </Grid>
    </>
  );
}

export default App;
