import commands from '@onetype/framework/commands';
import orah from '#orah/addon.js';

commands.Item({
	id: 'orah:tools:many',
	exposed: true,
	method: 'GET',
	endpoint: '/api/orah/tools',
	description: 'Lists every registered tool with its input fields.',
	metadata: { addon: 'orah.tools' },
	condition: function()
	{
		if(!this.http || !this.http.state.user)
		{
			return 'Sign in to use Orah.';
		}
	},
	out: {
		tools: {
			type: 'array',
			each: {
				type: 'object',
				config: 'orah.tool'
			},
			description: 'The registered tools.'
		}
	},
	callback: function(properties, resolve)
	{
		const tools = Object.values(orah.tools.Items()).map((tool) => ({
			id: tool.Get('id'),
			name: tool.Get('name'),
			description: tool.Get('description'),
			input: tool.Get('input') || {},
			command: tool.Get('command') || null
		}));

		resolve({ tools });
	}
});
