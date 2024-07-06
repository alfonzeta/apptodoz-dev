import { useState } from 'react'
import "./NewToDo.css"
import { todos_URL } from '../storage/storage'


export default function NewToDo({ toDos, setToDos, setSortedTodos }) {

    const [NewToDoTitle, setNewToDoTitle] = useState("")
    const [deadlineDay, setDeadlineDay] = useState(null)
    const [deadlineDate, setDeadlineDate] = useState(null)
    const [showDeadline, setShowDeadline] = useState(false)
    const [showDaysDeadline, setShowDaysDeadline] = useState(false)
    const [showExactDeadline, setShowExactDeadline] = useState(false)
    const [status, setStatus] = useState("todo")
    const storedId = localStorage.getItem('storedId');
    const user = JSON.parse(localStorage.getItem("user"))

    const handleSubmit = (e) => {
        e.preventDefault()

        const newToDo = {
            userId: storedId,
            title: NewToDoTitle,
            status: status,
            author: {
                userId: user._id,
                username: user.username,
                firstName: user.firstName,
                lastName: user.lastName
            },
        }

        if (deadlineDate) {
            // Create a new Date object from the deadlineDate input value
            let selectedDate = new Date(deadlineDate);

            // Ensure selectedDate is in UTC format
            const utcDeadline = selectedDate.toISOString();
            newToDo.deadline = utcDeadline;
        }


        if (deadlineDay) {
            let currentDate = new Date();
            currentDate.setDate(currentDate.getDate() + Number(deadlineDay));
            newToDo.deadline = currentDate.toISOString();
        }

        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(newToDo)
        }

        fetch(todos_URL, requestOptions)
            .then(res => res.json())
            .then(data => {
                console.log(data);
                setToDos([data.savedTodo, ...toDos])
            })
            .catch(error => {
                console.log(error);
            });


        setToDos([newToDo, ...toDos])
        setSortedTodos(null)
        setNewToDoTitle("")
        setDeadlineDate(null)
        setDeadlineDay(null)

    }

    return (
        <div className='form-container'>


            <form className='new-task-form' action="" onSubmit={handleSubmit}>

                <input required onChange={(e) => setNewToDoTitle(e.target.value)} value={NewToDoTitle} id='title' maxLength={"30"} type="text" placeholder='Introduce new task' />
                <div className='change-status'>
                    <label htmlFor="status-select">Choose status</label>
                    <select onChange={(e) => setStatus(e.target.value)} name="status" id="status-select">
                        <option className='dropdown-option' value="todo">To do</option>
                        <option className='dropdown-option' value="in progress">In progress</option>
                        <option className='dropdown-option' value="done">Done</option>
                    </select>
                    {showDeadline
                        ? <button type='button' onClick={() => { setDeadlineDate(null), setDeadlineDay(null), setShowDeadline(!showDeadline) }}>Default deadline</button>
                        : <button type='button' onClick={() => setShowDeadline(!showDeadline)}>Custom deadline</button>
                    }
                </div>
                {showDeadline && showExactDeadline && <input onChange={(e) => setDeadlineDate(e.target.value)} type="datetime-local" name="deadlineDate" id="deadlineDate" />}
                {showDeadline && showDaysDeadline && <input onChange={(e) => setDeadlineDay(e.target.value)} min={1} type="number" name="" id="" placeholder='Introduce days from now' />}



                {showDeadline &&
                    <div className='deadline-buttons'>
                        <button className={showExactDeadline && "active-button"} type='button' onClick={() => { setShowDaysDeadline(false), setShowExactDeadline(true) }} >Add exact date time deadline</button>
                        <button className={showDaysDeadline && "active-button"} type='button' onClick={() => { setShowExactDeadline(false), setShowDaysDeadline(true) }}>Select days from now</button>
                    </div>}
                <input type="submit" value="Add Todo" />
            </form>




        </div>
    )
}
