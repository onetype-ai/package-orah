import commands from '@onetype/framework/commands';
import orah from '#orah/addon.js';

commands.Item({
    id: 'orah:notes:many',
    exposed: true,
    method: 'GET',
    endpoint: '/api/orah/notes',
    description: 'Lists everything Orah has learned.',
    metadata: { addon: 'orah.notes' },
    condition: function()
    {
        if(!this.http || !this.http.state.user)
        {
            return 'Sign in to use Orah.';
        }
    },
    out: {
        notes: {
            type: 'array',
            each: {
                type: 'object',
                config: 'orah.note'
            },
            description: 'The saved notes, oldest first.'
        }
    },
    callback: async function(properties, resolve)
    {
        const notes = await orah.notes.Fn('list');

        resolve({ notes });
    }
});
