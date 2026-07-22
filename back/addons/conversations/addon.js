onetype.AddonReady('orah', (orah) =>
{
    orah.conversations = onetype.Addon('orah.conversations', (addon) =>
    {
        addon.Table('orah_conversations');

        addon.Field('id', {
            type: 'string',
            description: 'Unique row id, a bigint the database returns as a string.'
        });

        addon.Field('title', {
            type: 'string',
            description: 'Title derived from the first message.'
        });

        addon.Field('messages', {
            type: 'string',
            value: '[]',
            description: 'Full message history as a JSON string, including tool calls and results.'
        });

        addon.Field('user_id', {
            type: 'string',
            description: 'Id of the user the conversation belongs to.'
        });

        addon.Field('updated_at', {
            type: 'string',
            description: 'Timestamp of the last message.'
        });

        addon.Field('created_at', {
            type: 'string',
            description: 'Timestamp of when the conversation started.'
        });

        addon.Schema('id bigserial primary key');
        addon.Schema('title varchar(255)');
        addon.Schema('messages text not null default \'[]\'');
        addon.Schema('user_id bigint');
        addon.Schema('updated_at timestamptz not null default now()');
        addon.Schema('created_at timestamptz not null default now()');

        addon.Expose({
            filter: ['id', 'user_id', 'created_at'],
            sort: ['id', 'updated_at', 'created_at'],
            select: ['id', 'title', 'user_id', 'updated_at', 'created_at']
        });
    });
});
