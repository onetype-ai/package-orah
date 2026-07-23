onetype.schemas.ItemAdd({
    id: 'orah.note',
    config: {
        id: {
            type: 'string',
            description: 'Note id.'
        },
        content: {
            type: 'string',
            description: 'The learned fact.'
        },
        agent: {
            type: 'string',
            description: 'Agent the note belongs to, null for the orchestrator.'
        },
        created_at: {
            type: 'string',
            description: 'Timestamp of when the note was learned.'
        }
    }
});
