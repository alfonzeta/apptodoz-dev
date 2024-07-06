import { useEffect, useState, useRef } from 'react';
import List from '../components/List'
import NewToDo from '../components/NewToDo'
import { FaSort } from "react-icons/fa";
import { useNavigate } from 'react-router-dom';
import { todos_URL } from "../storage/storage"
import useFetch from '../hooks/useFetch'
import Header from '../components/Header';
import ProfileImage from '../components/ProfileImage';
import FetchContacts from '../logic/FetchContacts';
import TimeLeftUntilDeadLine from '../logic/TimeLeftUntilDeadLine';
import HandleDate from '../logic/HandleDate';
import Footer from "../components/Footer";
import './TodoList.css'

function TodoList() {

  const navigate = useNavigate();

  const [activeCard, setActiveCard] = useState(null)
  const [sortedTodos, setSortedTodos] = useState(null)
  const [toDos, setToDos] = useState([])
  const [archivedToDos, setArchivedToDos] = useState([])
  const [sortOrder, setSortOrder] = useState('asc');
  const [showNewTaskForm, setShowNewTaskForm] = useState(false)
  const [showContacts, setShowContacts] = useState(false)
  const [showModal, setShowModal] = useState(false)
  const [showAreas, setShowAreas] = useState(true)
  const [contacts, setContacts] = useState([])
  const [showNotArchived, setShowNotArchived] = useState(true)
  const [showArchived, setShowArchived] = useState(false)

  const token = localStorage.getItem('token');

  const listContainerRef = useRef(null);

  useFetch(todos_URL, setToDos, setArchivedToDos, token, navigate)
  FetchContacts(setContacts)

  // Prevent scroll when modal is opened
  useEffect(() => {
    if (showModal !== false) {
      document.body.classList.add('no-scroll');
    } else {
      document.body.classList.remove('no-scroll');
    }

    return () => {
      document.body.classList.remove('no-scroll');
    };
  }, [showModal]);

  // Client and server update when a todo card is dropped in a valid drop area
  const onDrop = (status, position) => {

    // Update client side
    if (activeCard == null || activeCard === undefined) return;
    const todoToMove = toDos[activeCard];
    const updatedTodos = toDos.filter((todo, index) => index !== activeCard)
    updatedTodos.splice(position, 0, {
      ...todoToMove,
      status: status
    })

    setToDos(updatedTodos)
    setSortedTodos(null)

    // Update server side
    const todoToMoveID = todoToMove._id
    const requestOptions = {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
      body: JSON.stringify({ status: status })
    }
    fetch(`${todos_URL}/updateTodo/${todoToMoveID}`, requestOptions)
      .then(res => res.json())
      .then(data => console.log(data))
      .catch(error => {
        console.log(error);
      });

  }


  const handleArchive = (todoToArchive) => {


    todoToArchive.status = "archived"

    // Update client side
    const updatedArchivedTodos = [...archivedToDos, todoToArchive]
    const updatedTodos = toDos.filter((todo) => todo._id !== todoToArchive._id)


    setToDos(updatedTodos)
    setArchivedToDos(updatedArchivedTodos)


    // Update server side
    const requestOptions = {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
      body: JSON.stringify({ status: "archived" })
    }
    fetch(`${todos_URL}/updateTodo/${todoToArchive._id}`, requestOptions)
      .then(res => res.json())
      .then(data => console.log(data))
      .catch(error => {
        console.log(error);
      });


  }


  // Remove each todo card and if server response is ok, update todo array state. 
  const handleRemove = (id) => {
    const requestOptions = {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
    }

    fetch(`${todos_URL}${id}`, requestOptions)
      .then(res => res.json())
      .then(data => {
        setToDos(toDos.filter((todo) => todo._id !== id))
      })
      .catch(error => {
        console.log(error);
      });


  }

  // Handle the color of each todo depending on status
  const handleStatusColor = (status) => {
    if (status === "todo") {
      return "todo-status"
    } if (status === "in progress") {
      return "in-progress-status"
    } else {
      return "done-status"
    }

  }

  const handleSortByUsername = () => {
    const sortedTodos = [...toDos].sort((a, b) => {
      if (sortOrder === 'asc') {
        return a.author.username.localeCompare(b.author.username);
      } else {
        return b.author.username.localeCompare(a.author.username);
      }
    });
    setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    setSortedTodos(sortedTodos)
  };

  const handleSortByTitle = () => {
    const sortedTodos = [...toDos].sort((a, b) => {
      if (sortOrder === 'asc') {
        return a.title.localeCompare(b.title);
      } else {
        return b.title.localeCompare(a.title);
      }
    });
    setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    setSortedTodos(sortedTodos)
  };

  const handleSortByStatus = () => {
    const sortedTodos = [...toDos].sort((a, b) => {
      if (sortOrder === 'asc') {
        return a.status.localeCompare(b.status);
      } else {
        return b.status.localeCompare(a.status);
      }
    });
    setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    setSortedTodos(sortedTodos)
  };

  const handleSortByDeadline = () => {
    const sortedTodos = [...toDos].sort((a, b) => {
      if (sortOrder === 'asc') {
        return a.deadline.localeCompare(b.deadline);
      } else {
        return b.deadline.localeCompare(a.deadline);
      }
    });
    setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    setSortedTodos(sortedTodos)
  };

  const handleSortByTimestamp = () => {
    const sortedTodos = [...toDos].sort((a, b) => {
      if (sortOrder === 'asc') {
        return a.timestamp.localeCompare(b.timestamp);
      } else {
        return b.timestamp.localeCompare(a.timestamp);
      }
    });
    setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    setSortedTodos(sortedTodos)
  };

  const handleDeadlineClass = (deadline) => {
    // Convert the target date string to a Date object
    const target = new Date(deadline);

    // Get the current date and time
    const now = new Date();

    // Calculate the difference in milliseconds
    const difference = target - now;

    // Calculate time components
    const days = Math.floor(difference / (1000 * 60 * 60 * 24));

    if (days < 2) {
      return "urgent-deadline"
    }
  }

  const renderThreeLists = () => {
    return (
      <div className='list-block' ref={listContainerRef}>
        <List
          showAreas={showAreas}
          setShowAreas={setShowAreas}
          handleRemove={handleRemove}
          toDos={toDos}
          onDrop={onDrop}
          setToDos={setToDos}
          activeCard={activeCard}
          setActiveCard={setActiveCard}
          status={"todo"}
          title={"To-do"}
          contacts={contacts}
          showContacts={showContacts}
          setShowContacts={setShowContacts}
          showModal={showModal}
          setShowModal={setShowModal}
          handleArchive={handleArchive}
        />
        <List
          showAreas={showAreas}
          setShowAreas={setShowAreas}
          handleRemove={handleRemove}
          toDos={toDos}
          onDrop={onDrop}
          setToDos={setToDos}
          activeCard={activeCard}
          setActiveCard={setActiveCard}
          status={"in progress"}
          title={"In progress"}
          contacts={contacts}
          showContacts={showContacts}
          setShowContacts={setShowContacts}
          showModal={showModal}
          setShowModal={setShowModal}
          handleArchive={handleArchive}
        />
        <List
          showAreas={showAreas}
          setShowAreas={setShowAreas}
          handleRemove={handleRemove}
          toDos={toDos}
          onDrop={onDrop}
          setToDos={setToDos}
          activeCard={activeCard}
          setActiveCard={setActiveCard}
          status={"done"}
          title={"Done"}
          contacts={contacts}
          showContacts={showContacts}
          setShowContacts={setShowContacts}
          showModal={showModal}
          setShowModal={setShowModal}
          handleArchive={handleArchive}
        />
      </div>

    )
  }
  // Handle sorted todos after sorting button is being clicked
  const handleSortTodos = (todos) => {
    return (
      todos.map((todo => (
        <tr key={todo._id}>
          <td>{todo.title}</td>
          <td><p className={handleStatusColor(todo.status)}>{todo.status}</p></td>
          <td>
            <div className='table-creator'>
              <ProfileImage todo={todo} name={todo.author.firstName} lastName={todo.author.lastName}></ProfileImage>
              {todo.author.username}
            </div>
          </td>
          <td>{HandleDate(todo.timestamp)}</td>
          <td className={handleDeadlineClass(todo.deadline)}>{HandleDate(todo.deadline)}</td>
          <td className={handleDeadlineClass(todo.deadline)} >{TimeLeftUntilDeadLine(todo.deadline)}</td>
        </tr>
      )))
    )
  }

  const notArchivedTodos = () => {
    return (
      <div style={{ cursor: "default" }} className='todo-table-container'>
        <table className='todo-table'>
          <thead>
            <tr>
              <th>Title <FaSort onClick={handleSortByTitle} style={{ cursor: "pointer" }} /></th>
              <th>Status <FaSort onClick={handleSortByStatus} style={{ cursor: "pointer" }} /></th>
              <th>Creator <FaSort onClick={handleSortByUsername} style={{ cursor: "pointer" }} /></th>
              <th>Created <FaSort onClick={handleSortByTimestamp} style={{ cursor: "pointer" }} /></th>
              <th>Deadline <FaSort onClick={handleSortByDeadline} style={{ cursor: "pointer" }} /></th>
              <th>Time left</th>
            </tr>
          </thead>
          <tbody>
            {sortedTodos
              ? handleSortTodos(sortedTodos)
              : handleSortTodos(toDos)
            }
          </tbody>
        </table>
      </div>

    )
  }

  const archivedTodos = () => {
    return (
      <div style={{ cursor: "default" }} className='todo-table-container'>
        <table className='todo-table'>
          <thead>
            <tr>
              <th>Title</th>
              <th>Status</th>
              <th>Creator</th>
              <th>Created</th>
              <th>Deadline</th>
            </tr>
          </thead>
          <tbody>
            {archivedToDos.map((todo => (
              <tr key={todo._id}>
                <td>{todo.title}</td>
                <td><p className={handleStatusColor(todo.status)}>{todo.status}</p></td>
                <td>
                  <div className='table-creator'>
                    <ProfileImage todo={todo} name={todo.author.firstName} lastName={todo.author.lastName}></ProfileImage>
                    {todo.author.username}
                  </div>
                </td>
                <td>{HandleDate(todo.timestamp)}</td>
                <td className={handleDeadlineClass(todo.deadline)}>{HandleDate(todo.deadline)}</td>
              </tr>
            )))}
          </tbody>
        </table>
      </div>
    )
  }
  useEffect(() => {
    if (activeCard) {
      const handleAutoScroll = (e) => {
        const container = listContainerRef.current;
        if (!container) return;

        const { clientX } = e;
        const { left, right } = container.getBoundingClientRect();
        const scrollSpeed = 10; // Adjust scroll speed as needed

        if (clientX < left + 50) {
          container.scrollLeft -= scrollSpeed;
        } else if (clientX > right - 50) {
          container.scrollLeft += scrollSpeed;
        }
      };

      document.addEventListener('dragover', handleAutoScroll);

      return () => {
        document.removeEventListener('dragover', handleAutoScroll);
      };
    }
  }, [activeCard]);

  return (
    <>
      <Header />
      <div className='lists-container' >
        <h1 style={{ margin: "40px" }}>Todo List</h1>
        {showNewTaskForm
          ? <button className='task-button' onClick={() => setShowNewTaskForm(false)} >Hide Form</button>
          : <button className='task-button' onClick={() => setShowNewTaskForm(true)} >Add Task</button>
        }
        {showNewTaskForm &&
          <NewToDo setSortedTodos={setSortedTodos} toDos={toDos} setToDos={setToDos} />
        }

        {renderThreeLists()}


        <div className='table-buttons'>
          <button className={showNotArchived ? "active-button" : undefined} onClick={() => { setShowNotArchived(true); setShowArchived(false) }} >Active Todos</button>
          <button className={showArchived ? "active-button" : undefined} onClick={() => { setShowArchived(true); setShowNotArchived(false) }} >Archived Todos</button>
        </div>
        {showNotArchived ?
          notArchivedTodos()
          : archivedTodos()
        }
      </div>
      <Footer />
    </>
  )
}

export default TodoList
