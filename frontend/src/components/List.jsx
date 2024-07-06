import React, { useState } from 'react'
import "./List.css"
import DropArea from './DropArea'
import TodoCard from './TodoCard'


export default function List({ handleRemove, setActiveCard, status, title, onDrop, toDos, contacts, showContacts, setShowContacts, showModal, setShowModal, setToDos, showAreas, setShowAreas, handleArchive }) {



    return (

        <section className='list-section'>
            <div>
                <h3>{title}</h3>
            </div>

            <DropArea
                onDrop={() => onDrop(status, 0)}
                showAreas={showAreas}
                setShowAreas={setShowAreas}

            />
            {toDos && toDos.map((todo, index) => (
                todo.status === status && (
                    <div key={todo._id}>

                        <TodoCard
                            todo={todo}
                            index={index}
                            setActiveCard={setActiveCard}
                            handleRemove={handleRemove}
                            contacts={contacts}
                            showContacts={showContacts}
                            setShowContacts={setShowContacts}
                            showModal={showModal}
                            setShowModal={setShowModal}
                            setToDos={setToDos}
                            setShowAreas={setShowAreas}
                            handleArchive={handleArchive}

                        />

                        <DropArea
                            onDrop={() => onDrop(status, index + 1)}
                            showAreas={showAreas}
                            setShowAreas={setShowAreas}

                        />


                    </div>
                )

            ))}

        </section>

    )
}

