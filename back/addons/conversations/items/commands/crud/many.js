import commands from '@onetype/framework/commands';
import orah from '#orah/addon.js';

commands.Item({
    id: 'orah:conversations:many',
    exposed: true,
    method: 'GET',
    endpoint: '/api/orah/conversations',
    description: 'Lists the conversations of the signed in user, newest first.',
    metadata: { addon: 'orah.conversations' },
    condition: function()
    {
        if(!this.http || !this.http.state.user)
        {
            return 'Sign in to use Orah.';
        }
    },
    out: {
        conversations: {
            type: 'array',
            each: {
                type: 'object',
                config: 'orah.conversation'
            },
            description: 'The conversations, newest first.'
        }
    },
    callback: async function(properties, resolve)
    {
        const conversations = await orah.conversations.Fn('list', this.http.state.user.id);

        resolve({ conversations });
    }
});
