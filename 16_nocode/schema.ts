export const managerSchema = {
    "name": "task_manager",
    "description": "This function connects to the Todoist in order to get/add/update tasks. Extract their `content` from the conversation.",
    "parameters": {
        "type": "object",
        "properties": {
            "update": {
                "type": "array",
                "description": "List of the tasks that needs to be updated/finished/completed",
                "items": {
                    "type": "object",
                    "properties": {
                        "content": {
                            "type": "string",
                            "description": "Task description including date and time"
                        },
                        "update_desc": {
                            "type": "string",
                            "description": "Full-sentence that describes what exactly has to be done with this task including datetime"
                        },
                        "action": {
                            "type": "string",
                            "description": "Action to perform on the task",
                            "enum": ["update", "complete"]
                        },
                        "due": {
                            "type": "string",
                            "description": "Due datetime for this task mentioned by the user, formatted as 'MM/DD/YYYY HH:mm'. By default set to the current day and time"
                        }
                    },
                    "required": ["content", "due"]
                }
            },
            "add": {
                "type": "array",
                "description": "List of tasks that needs to be added to the Todoist",
                "items": {
                    "type": "object",
                    "properties": {
                        "content": {
                            "type": "string",
                            "description": "Format: task description"
                        },
                        "due": {
                            "type": "string",
                            "description": "Due datetime for this task mentioned by the user, formatted as 'MM/DD/YYYY HH:mm'. By default set to the current day and time"
                        }
                    },
                    "required": ["content", "due"]
                }
            },
            "get": {
                "type": "boolean",
                "description": "set to true if user wants to get tasks list"
            },
            "from": {
                "type": "string",
                "description": "The earliest date mentioned, formatted as 'MM/DD/YYYY 00:00'"
            },
            "to": {
                "type": "string",
                "description": "The latest date mentioned, formatted as 'MM/DD/YYYY 23:59'"
            }
        },
        "required": ["get", "update", "add"]
    }
};