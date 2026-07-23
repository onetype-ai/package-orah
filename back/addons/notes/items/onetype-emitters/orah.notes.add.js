onetype.emitters.ItemAdd({
    id: 'orah.notes.add',
    description: 'Fires after Orah saves something it learned.',
    metadata: { addon: 'orah.notes' },
    config: {
        content: {
            type: 'string',
            description: 'The saved note.'
        },
        agent: {
            type: 'string',
            description: 'Agent the note belongs to, null for the orchestrator.'
        }
    }
});
