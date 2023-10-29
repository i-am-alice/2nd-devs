export const intentSchema = {
    name: 'describe_intention',
    description: `Describe Adam's intention towards Alice, based on his latest message and details from summary of their conversation.`,
    parameters: {
        type: 'object',
        properties: {
            type: {
                type: 'string',
                description: `
                  Type has to be set to either:
                  'query' — when Alice has to speak, write sth, translate, correct, help, simply answer to Adam's question or access her long-term memory or notes. Should be picked by default and for common conversations and chit-chat.
                  'action' — when Adam asks Alice explicitly to perform an action that she needs to do herself related to Internet connection to the external apps, services, APIs, models (like Wolfram Alpha) finding sth on a website, calculating, giving environment related info (like weather or nearest locations) accessing and reading websites/urls contents, listing tasks, and events and memorizing something by Alice.
                  `,
            }
        },
        required: ['name'],
    },
}