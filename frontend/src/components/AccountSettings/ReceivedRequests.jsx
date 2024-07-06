import React from 'react';
import { FaCheck } from "react-icons/fa6";
import { RxCross2 } from "react-icons/rx";
import { requests_URL, users_URL } from '../../storage/storage';

export default function ReceivedRequests({ receivedRequests, setTriggerFetch, setTriggerFetchContacts }) {
    const user = JSON.parse(localStorage.getItem("user"));
    const token = localStorage.getItem("token");

    const handleRequestAnswer = (e, request) => {
        e.preventDefault();

        const answer = {
            status: e.target.value
        };

        const requestOptions = {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
            body: JSON.stringify(answer)
        };

        fetch(`${requests_URL}${request._id}`, requestOptions)
            .then(res => res.json())
            .then(data => {
                if (data.ok) {
                    if (e.target.value === "ACCEPTED") {
                        const newContact = {
                            contacts: { contactId: data.updatedContactRequest.recipient, timestamp: new Date() }
                        };

                        const requestOptions = {
                            method: 'PUT',
                            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                            body: JSON.stringify(newContact)
                        };

                        fetch(`${users_URL}${request.sender}`, requestOptions)
                            .then(res => res.json())
                            .then(data => {
                                if (data.ok) {
                                }
                            })
                            .catch(error => {
                                console.error(error);
                            });

                        const newContactDuplicate = {
                            contacts: { contactId: data.updatedContactRequest.sender, timestamp: new Date() }
                        };

                        const requestOptionsDuplicate = {
                            method: 'PUT',
                            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                            body: JSON.stringify(newContactDuplicate)
                        };

                        fetch(`${users_URL}${request.recipient}`, requestOptionsDuplicate)
                            .then(res => res.json())
                            .then(data => {
                                if (data.ok) {
                                }
                            })
                            .catch(error => {
                                console.error(error);
                            });
                    } else {
                        const requestOptionsDelete = {
                            method: 'DELETE',
                            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                        };
                        fetch(`${requests_URL}${request._id}`, requestOptionsDelete)
                            .then(res => res.json())
                            .then(data => {
                            })
                            .catch(error => {
                                console.error(error);
                            });
                    }
                    setTriggerFetch(prevState => !prevState);
                    setTriggerFetchContacts(prevState => !prevState);
                }
            })
            .catch(error => {
                console.error(error);
            });
    };

    return (
        <div>
            {receivedRequests.length < 1
                ? <p>No received requests</p>
                :
                <div className='contact-search-container'>
                    <div className='contact-search'>
                        <table className='todo-table'>
                            <thead>
                                <tr>
                                    <th>Name</th>
                                    <th>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {receivedRequests.map(request => (
                                    <tr key={request.id}>
                                        <td>
                                            <p>{request.userData.username}</p>
                                        </td>
                                        <td style={{ display: "flex", justifyContent: "center", gap: "16px" }}>
                                            <button value="ACCEPTED" onClick={(e) => handleRequestAnswer(e, request)}>
                                                <FaCheck style={{ pointerEvents: "none" }} />
                                            </button>
                                            <button value="DECLINED" onClick={(e) => handleRequestAnswer(e, request)}>
                                                <RxCross2 style={{ pointerEvents: "none" }} />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            }
        </div>
    );
}