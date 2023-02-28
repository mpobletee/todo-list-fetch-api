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
} from "semantic-ui-react";

function App() {
  const [todos, SetTodos] = useState("");
  const [userName, setUserName] = useState("");
  const [users, SetUsers] = useState([]);

  // const option = users.map((user, index) => <li key={index}>{user}</li>);

  const url = "https://assets.breatheco.de/apis/fake/todos/user";

  useEffect(() => {
    fetch(url)
      .then((response) => {
        return response.json();
      })
      .then((myJson) => {
        // console.log(myJson)
        SetUsers(myJson);
      });
  }, []);

  useEffect(() => {
    fetch(url, {
      method: "POST",
      body: JSON.stringify(todos),
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => {
        return response.json();
      })
      .then((myJson) => {
        // console.log(myJson)
        SetUsers(myJson);
      });
  }, []);

  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState("");
  // const [hovered, setHovered] = useState("");

  const handleSubmit = (event) => {
    event.preventDefault();
    if (newTask) {
      setTasks([...tasks, newTask]);
      setNewTask("");
    }
  };

  const handleKeyPress = (event) => {
    if (event.key === "Enter") {
      handleSubmit(event);
    }
  };

  const handleDelete = (index) => {
    setTasks(tasks.filter((task, i) => i !== index));
  };

  return (
    <>
      <Header as="h2" icon textAlign="center">
        <Icon name="clipboard check" circular />
        <Header.Content> To-do List </Header.Content>
      </Header>
      <Grid centered>
        <Segment.Group>
          <Dropdown
            iconposition="left"
            placeholder="Ver usuarios"
            selection
            // options={option}
            options={users.map((user, index) => (
              <div className="text-center" key={index}>
                {user}
              </div>
            ))}
          ></Dropdown>
          <Segment>
            <Input
              icon="users"
              iconPosition="left"
              placeholder="Ingrese nombre de usuario..."
            />
            <Button>Crear usuario</Button>
            <Button>Eliminar usuario</Button>
          </Segment>
          <Segment.Group>
            <Segment color="teal">
              <Input
                icon="add circle"
                iconPosition="left"
                placeholder="Ingrese tarea..."
                onSubmit={handleSubmit}
                value={newTask}
                onChange={(e) => setNewTask(e.target.value)}
                onKeyDown={handleKeyPress}
              />
              <Button onClick={handleSubmit}>
                Crear tarea
              </Button>
            </Segment>

            <Segment >
              {tasks.length > 0 ? (
                <ul>
                  {tasks.map((task, index) => (
                    <div key={index}>{task}</div>
                  ))}
                </ul>
              ) : (
                <p>No tasks, add a task</p>
              )}
            </Segment>
          </Segment.Group>
        </Segment.Group>
      </Grid>
    </>
  );
}

export default App;
