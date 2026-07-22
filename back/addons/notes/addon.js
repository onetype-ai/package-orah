onetype.AddonReady('orah', (orah) =>
{
    orah.notes = onetype.Addon('orah.notes', (addon) =>
    {
        addon.Table('orah_notes');

        addon.Field('id', {
            type: 'string',
            description: 'Unique row id, a bigint the database returns as a string.'
        });

        addon.Field('content', {
            type: 'string',
            required: true,
            description: 'The learned fact, written to be useful in future conversations.'
        });

        addon.Field('agent', {
            type: 'string',
            description: 'Agent the note belongs to. Empty for the orchestrator itself.'
        });

        addon.Field('created_at', {
            type: 'string',
            description: 'Timestamp of when the note was learned.'
        });

        addon.Schema('id bigserial primary key');
        addon.Schema('content text not null');
        addon.Schema('agent varchar(255)');
        addon.Schema('created_at timestamptz not null default now()');

        addon.Expose({
            filter: ['id', 'agent', 'created_at'],
            sort: ['id', 'created_at'],
            select: ['id', 'content', 'agent', 'created_at']
        });
    });
});
