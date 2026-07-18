import commands from '@onetype/framework/commands';
import orah from '#orah/addon.js';

commands.Item({
	id: 'orah:agents:many',
	exposed: true,
	method: 'GET',
	endpoint: '/api/orah/agents',
	description: 'Lists every registered agent with its description and tools.',
	metadata: { addon: 'orah.agents' },
	condition: function()
	{
		if(!this.http || !this.http.state.user)
		{
			return 'Sign in to use Orah.';
		}
	},
	out: {
		agents: {
			type: 'array',
			each: {
				type: 'object',
				config: 'orah.agent'
			},
			description: 'The registered agents.'
		}
	},
	callback: function(properties, resolve)
	{
		const agents = Object.values(orah.agents.Items()).map((agent) => ({
			id: agent.Get('id'),
			name: agent.Get('name'),
			description: agent.Get('description'),
			instructions: agent.Get('instructions'),
			tools: agent.Get('tools') || []
		}));

		resolve({ agents });
	}
});
