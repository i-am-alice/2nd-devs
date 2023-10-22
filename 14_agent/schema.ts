export const multiplySchema = {
    "name": "multiply",
    "description": "Multiply two numbers",
    "parameters": {
        "type": "object",
        "properties": {
            "first": {
                "type": "number",
                "description": "First value to multiply"
            },
            "second": {
                "type": "number",
                "description": "Second value to multiply"
            }
        },
        "required": [
            "first", "second"
        ]
    }
};
export const addSchema = {
    "name": "add",
    "description": "Add two numbers",
    "parameters": {
        "type": "object",
        "properties": {
            "first": {
                "type": "number",
                "description": "First value to add"
            },
            "second": {
                "type": "number",
                "description": "Second value to add"
            }
        },
        "required": [
            "first", "second"
        ]
    }
};
export const subtractSchema = {
    "name": "subtract",
    "description": "Subtract two numbers",
    "parameters": {
        "type": "object",
        "properties": {
            "first": {
                "type": "number",
                "description": "First value to subtract"
            },
            "second": {
                "type": "number",
                "description": "Second value to subtract"
            }
        },
        "required": [
            "first", "second"
        ]
    }
};