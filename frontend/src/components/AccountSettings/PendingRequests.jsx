import React from 'react';
import { requests_URL } from '../../storage/storage';

export default function PendingRequests({ setPendingRequests, pendingRequests, setTriggerFetch }) {

  const token = localStorage.getItem("token")

  const handleRemoveRequest = (e, request) => {
    e.preventDefault()

    const requestOptions = {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
    }
    fetch(`${requests_URL}${request._id}`, requestOptions)
      .then(res => res.json())
      .then(data => {
        setPendingRequests(pendingRequests.filter((prevrequest) => prevrequest._id !== request._id))
      })
      .catch(error => {
        console.log(error);
      });
    // setTriggerFetch(prevState => !prevState)

  }


  return (
    <div>
      {pendingRequests.length < 1
        ? <p>No pending requests</p>
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
                {pendingRequests.map(request => (
                  <tr key={request.id}>
                    <td>
                      <p key={request.id}>{request.userData.username}</p>
                    </td>
                    <td>
                      <button onClick={(e) => handleRemoveRequest(e, request)}>Cancel request</button>
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

