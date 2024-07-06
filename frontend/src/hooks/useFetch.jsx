import { useEffect } from 'react';

export default function useFetch(url, setTodos, setArchivedToDos, token, navigate) {
    useEffect(() => {
        if (!token) {
            navigate('/');
            return;
        }

        const requestOptions = {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
        };

        fetch(url, requestOptions)
            .then(res => res.json())
            .then(data => {
                if (data.ok) {

                    // Filter todos based on status
                    const todos = data.todos.filter(todo => {
                        return ['todo', 'in progress', 'done'].includes(todo.status);
                    });

                    const archivedTodos = data.todos.filter(todo => {
                        return todo.status === 'archived';
                    });

                    setTodos(todos);
                    setArchivedToDos(archivedTodos);
                } else {
                    navigate('/');
                }
            })
            .catch(error => {
                console.log(error);
                navigate('/');
            });
    }, [url, setTodos, setArchivedToDos, token, navigate]);
}
