import {ITask, ITaskClose, ITaskModify} from "./todoist.dt";

const apiCall = async (endpoint = '/me', method = 'GET', body = {}) => {
    try {
        const response = await fetch(`https://api.todoist.com/rest/v2${endpoint}`, {
            method,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${process.env.TODOIST_API_KEY}`
            },
            body: method === 'POST' ? JSON.stringify(body) : undefined,
        });
        return response.status === 204 ? true : await response.json();

    } catch (err) {
        console.log(err);
    }

}

export const listUncompleted = async (): Promise<ITask[]> => {
    const uncompleted = await apiCall('/tasks', 'GET');
    return uncompleted.map((task: ITask) => {
        return {
            id: task.id,
            content: task.content,
            due: task.due ? task.due.string : undefined,
        }
    });
}

export const addTasks = async (tasks: ITaskModify[]): Promise<ITaskModify[]> => {
    const promises = tasks.map(task =>
        apiCall('/tasks', 'POST', {
            content: task.content,
            due_string: task.due_string
        })
    );

    const addedTasks = await Promise.all(promises);

    return addedTasks.map(addedTask => ({
        id: addedTask.id,
        content: addedTask.content,
        due_string: addedTask.due ? addedTask.due.string : null,
    }));
}

export const updateTasks = async (tasks: ITaskModify[]): Promise<ITaskModify[]> => {
    const promises = tasks.map((task) =>
        apiCall(`/tasks/${task.id}`, 'POST', {
            content: task.content,
            due_string: task.due_string,
            is_completed: task.is_completed
        })
    );

    const updatedTasks = await Promise.all(promises);

    return updatedTasks.map(updatedTask => ({
        id: updatedTask.id,
        content: updatedTask.content,
        due_string: updatedTask.due ? updatedTask.due.string : undefined,
    }));
}

export const closeTasks = async (tasks: ITaskClose[]): Promise<{[key: string]: 'completed'}[] | string> => {
    const promises = tasks.map((id) =>
        apiCall(`/tasks/${id}/close`, 'POST')
    );

    try {
        await Promise.all(promises);
        return tasks.map(closedTask => ({
            [closedTask.toString()]: 'completed',
        }));
    } catch (e) {
        return 'No tasks were closed (maybe they were already closed)';
    }
}
