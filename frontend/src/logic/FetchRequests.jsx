import React, { useEffect } from 'react'
import { requests_URL, users_URL } from '../storage/storage';

export default function FetchRequests(requestTypeURL, setRequests, whoReceives, triggerFetch) {

    const token = localStorage.getItem("token")
    const user = JSON.parse(localStorage.getItem("user"))

    return (
        useEffect(() => {
            const requestOptions = {
                method: 'GET',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
            };

            fetch(`${requests_URL}/${requestTypeURL}/${user._id}`, requestOptions)
                .then(res => res.json())
                .then(data => {
                    if (data.ok) {
                        const { receivedRequests } = data;
                        Promise.all(receivedRequests.map(request => {
                            return fetch(`${users_URL}/${request[whoReceives]}`, requestOptions)
                                .then(res => res.json())
                                .then(userData => {
                                    // Return the user data along with the request
                                    return { ...request, userData: userData.users[0] };
                                });
                        })).then(updatedRequests => {
                            // Update the state with the updated requests array
                            setRequests(updatedRequests);
                        });
                    }
                })
                .catch(error => {
                    console.log(error);
                });
        }, [triggerFetch])
    )
}




