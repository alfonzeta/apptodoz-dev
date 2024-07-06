import React, { useEffect, useState } from 'react';
import { MdCancel, MdModeEditOutline } from 'react-icons/md';
import { IoTrashBin, IoPersonAdd } from 'react-icons/io5';
import { FaCheck } from 'react-icons/fa6';
import { BsFolder, BsFolderFill, BsThreeDots, BsTrash } from 'react-icons/bs';
import { RxCross2 } from 'react-icons/rx';
import ProfileImage from './ProfileImage';
import HandleDate from '../logic/HandleDate';
import { todos_URL } from '../storage/storage';
import './TodoCard.css';

export default function TodoCard({ todo, index, setActiveCard, handleRemove, contacts, showModal, setShowModal, setToDos, setShowAreas, handleArchive }) {
  const [showDots, setShowDots] = useState(false);
  const [changeTitle, setChangeTitle] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [collaborators, setCollaborators] = useState(todo.collaborator || []);
  const [addCollaborator, setAddCollaborator] = useState(false);

  const user = JSON.parse(localStorage.getItem('user'));
  const token = localStorage.getItem('token');

  // Update collaborators state when todo.collaborator changes
  useEffect(() => {
    setCollaborators(todo.collaborator || []);
  }, [todo.collaborator]);


  // Render the more settings modal
  const moreSettingsModal = () => (
    <>
      {showModal === index && (
        <div className="more-settings">
          <MdCancel
            style={{ cursor: 'pointer' }}
            size={"30px"}
            onClick={() => {
              setShowModal(false);
              setShowDots(false);
            }}
          />
          <div className="more-settings-title">
            <h3>{todo.title}</h3>
          </div>
          <MdModeEditOutline
            size={"20px"}
            style={{ cursor: 'pointer' }}
            onClick={() => setChangeTitle(!changeTitle)}
          />

          {changeTitle && (
            <form onSubmit={updateTitle}>
              <input
                onChange={(e) => setNewTitle(e.target.value)}
                type="text"
                placeholder={todo.title}
              />
              <FaCheck type="submit" onClick={updateTitle} />
              <RxCross2 onClick={() => setChangeTitle(!changeTitle)} />
            </form>
          )}
          <div className="collaborators-title">
            <h4>Collaborators</h4>
            <IoPersonAdd
              size={"20px"}
              style={{ cursor: 'pointer' }}
              onClick={() => setAddCollaborator(!addCollaborator)}
            />
          </div>
          {addCollaborator && (
            <div className="contact-dropdown">
              <MdCancel
                style={{ cursor: 'pointer' }}
                size={"30px"}
                onClick={() => setAddCollaborator(!addCollaborator)}
              />
              <ul>
                {contacts.map((contact) => {
                  if (
                    !collaborators.some(
                      (collaborator) =>
                        collaborator.userId === contact._id ||
                        collaborator._id === contact._id
                    )
                  ) {
                    return (
                      <li
                        key={contact._id}
                        onClick={(e) => handleAddCollaborator(e, contact)}
                      >
                        <div
                          style={{
                            display: 'flex',
                            gap: '10px',
                            height: '50px',
                            alignItems: 'center',
                          }}
                        >
                          <ProfileImage
                            name={contact.firstName}
                            lastName={contact.lastName}
                            todo={todo}
                          />
                          {contact.username}
                        </div>
                      </li>
                    );
                  }
                  return null;
                })}
              </ul>
            </div>
          )}
          {showCollaboratorsModal()}
          <button
            style={{ margin: '20px' }}
            className="remove-task"
            onClick={() => {
              setShowModal(false);
              handleRemove(todo._id, todo._id);
            }}
          >
            Remove Task
          </button>
        </div>
      )}
    </>
  );

  // Handle title update
  const updateTitle = (e) => {
    e.preventDefault();
    todo.title = newTitle;

    const requestOptions = {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({ title: newTitle }),
    };

    fetch(`${todos_URL}/updateTodo/${todo._id}`, requestOptions)
      .then((res) => res.json())
      .then((data) => console.log(data))
      .catch((error) => console.log(error));

    setChangeTitle(false);
  };

  // Handle adding collaborator
  const handleAddCollaborator = (e, contact) => {
    e.preventDefault();

    const newCollaborator = {
      userId: contact._id,
      firstName: contact.firstName,
      lastName: contact.lastName,
      username: contact.username,
      timestampCollaborator: new Date(),
    };

    const requestOptions = {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({ collaborator: newCollaborator }),
    };

    fetch(`${todos_URL}/updateTodo/${todo._id}`, requestOptions)
      .then((res) => res.json())
      .then((data) => {
        if (data.ok) {
          setToDos((prevToDos) =>
            prevToDos.map((t) =>
              t._id === todo._id
                ? { ...t, collaborator: [...t.collaborator, newCollaborator] }
                : t
            )
          );
        }
      })
      .catch((error) => console.log(error));

    setAddCollaborator(!addCollaborator);
  };

  // Handle removing collaborator
  const handleRemoveCollaborator = (e, contact) => {
    e.preventDefault();

    const removeCollaborator = {
      userId: contact.userId || contact._id,
    };

    const requestOptions = {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({ removeCollaborator: removeCollaborator }),
    };

    fetch(`${todos_URL}/updateTodo/${todo._id}`, requestOptions)
      .then((res) => res.json())
      .then((data) => {
        if (data.ok) {
          setToDos((prevToDos) =>
            prevToDos.map((t) =>
              t._id === todo._id
                ? {
                  ...t,
                  collaborator: t.collaborator.filter(
                    (collaborator) =>
                      collaborator.userId !== (contact.userId || contact._id)
                  ),
                }
                : t
            )
          );
        }
      })
      .catch((error) => console.log(error));
  };

  // Render the bottom section of each to-do card with default profile images
  const showBottomSection = () => (
    <div className="bottom-todo">
      <div className="profile-pictures">
        <ProfileImage
          name={todo.author.firstName}
          lastName={todo.author.lastName}
          todo={todo}
        />
        {collaborators &&
          collaborators.map((collaborator) => (
            <ProfileImage
              key={collaborator._id}
              name={collaborator.firstName}
              lastName={collaborator.lastName}
              todo={todo}
            />
          ))}
      </div>
      {showDots && user._id === todo.userId && (
        <>
          <BsThreeDots
            style={{ color: 'white', cursor: 'pointer' }}
            onClick={() => setShowModal(index)}
            size={"25px"}
          />
          {todo.status === "done" && <BsFolderFill onClick={() => handleArchive(todo)} color='white' size={"25px"} style={{ cursor: "pointer" }} />}
        </>
      )}


    </div>
  );

  // Render the collaborators modal when add collaborator icon is clicked
  const showCollaboratorsModal = () => (
    <div className="collaborators-table-container">
      <table className="collaborators-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Collaborator since</th>
            <th>Remove</th>
          </tr>
        </thead>
        <tbody>
          {collaborators &&
            collaborators.map((collaborator) => (
              <tr key={collaborator._id}>
                <td>
                  <div style={{ display: 'flex', gap: '10px' }}>
                    <ProfileImage
                      name={collaborator.firstName}
                      lastName={collaborator.lastName}
                      todo={todo}
                    />
                    {collaborator.username}
                  </div>
                </td>
                <td>{HandleDate(collaborator.timestampCollaborator || Date.now())}</td>
                <td>
                  <IoTrashBin
                    onClick={(e) => handleRemoveCollaborator(e, collaborator)}
                    size={"25px"}
                    style={{ cursor: 'pointer' }}
                  />
                </td>
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  );

  const handleDragStart = (e) => {
    setActiveCard(index);
    setShowAreas(true);
  };

  const handleDragEnd = () => {
    setActiveCard(null);
    setShowAreas(true);
  };


  return (
    <div
      draggable="true"
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onTouchMove={handleDragStart}
      className="todo-card"
    >
      <div
        onMouseEnter={() => setShowDots(true)}
        onMouseLeave={() => setShowDots(false)}
        className={user._id === todo.userId ? 'todo own-todo' : 'todo other-todo'}
      >
        <div className='todo-title-container'>
          <div className="todo-title">
            <p>{todo.title}</p>
          </div>

        </div>
        {showBottomSection()}
        {moreSettingsModal()}
      </div>
      {showModal === index && <div className="overlay"></div>}
    </div>
  );
}
