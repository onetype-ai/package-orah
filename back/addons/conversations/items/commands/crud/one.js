import commands from '@onetype/framework/commands';
import orah from '#orah/addon.js';

commands.Item({
    id: 'orah:conversations:one',
    exposed: true,
    method: 'GET',
    endpoint: '/api/orah/conversations/:id',
    description: 'Reads one conversation with its full message history.',
    metadata: { addon: 'orah.conversations' },
    condition: function()
    {
        if(!this.http || !this.http.state.user)
        {
            return 'Sign in to use Orah.';
        }
    },
    in: {
        id: {
            type: 'string',
            required: true,
            description: 'Conversation id.'
        }
    },
    callback: async function(properties, resolve)
    {
        const item = await orah.conversations.Fn('get', properties.id);

        if(!item)
        {
            return resolve(null, null, 404);
        }

        if(item.Get('user_id') && String(item.Get('user_id')) !== String(this.http.state.user.id))
        {
            return resolve(null, 'This conversation belongs to another user.', 403);
        }

        const conversation = {
            id: item.Get('id'),
            title: item.Get('title'),
            messages: JSON.parse(item.Get('messages') || '[]'),
            updated_at: item.Get('updated_at'),
            created_at: item.Get('created_at')
        };

        orah.conversations.ItemRemove(item.Get('id'), false);

        resolve({ conversation });
    }
});
