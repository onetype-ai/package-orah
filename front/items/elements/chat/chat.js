elements.ItemAdd({
	id: 'orah-chat',
	icon: 'psychology',
	name: 'Orah Chat',
	description: 'Talk to Orah. It answers directly, and when the goal needs the instance it orchestrates the agents — you watch every call as it happens.',
	category: 'Orah',
	metadata: { addon: 'orah' },
	config: {
		background: {
			type: 'number',
			value: 1,
			description: 'Background depth of the panel from 1 to 3. Inner surfaces sit one step above it.'
		}
	},
	render: function()
	{
		this.typed = '';
		this.busy = false;
		this.width = $ot.modules.settings.get('ui.orah.width', 380);

		/* Visual demo data — the real feed replaces this once the orchestrator lands. */
		this.messages = [
			{ id: 1, role: 'user', content: 'Koliko projekata trenutno imamo i posalji rezime na Slack?' },
			{ id: 2, role: 'steps', steps: [
				{ mode: 'research', agent: 'project', label: 'How many projects exist, by status?', state: 'done', activity: [] },
				{ mode: 'task', agent: 'slack', label: 'Send the summary to #general', state: 'active', activity: [
					{ label: 'slack:channels — list channels', state: 'done' },
					{ label: 'slack:members — who is in #general', state: 'done' },
					{ label: 'slack:send — posting the summary', state: 'active' }
				] },
				{ mode: 'note', agent: null, label: 'The team tracks projects weekly', state: 'done', activity: [] }
			] },
			{ id: 3, role: 'assistant', content: 'Imate 14 projekata — 9 aktivnih, 3 pauzirana i 2 završena ove nedelje. Šaljem rezime na #general.' },
			{ id: 4, role: 'stats', stats: [
				{ value: '14', label: 'Projects' },
				{ value: '9', label: 'Active' },
				{ value: '2', label: 'Done this week' }
			] },
			{ id: 5, role: 'items', title: 'Latest projects', items: [
				{ icon: 'rocket_launch', label: 'Mondobook Travel', hint: 'Updated 2 hours ago', badge: 'Active', color: 'green' },
				{ icon: 'storefront', label: 'Bakery Site', hint: 'Updated yesterday', badge: 'Paused', color: 'orange' },
				{ icon: 'fitness_center', label: 'Gym Landing', hint: 'Updated 3 days ago', badge: 'Done', color: 'blue' }
			] },
			{ id: 6, role: 'colors', title: 'Brand palette', colors: [
				{ value: '#a78bfa', label: 'Brand' },
				{ value: '#22c55e', label: 'Green' },
				{ value: '#f97316', label: 'Orange' },
				{ value: '#3b82f6', label: 'Blue' },
				{ value: '#0f172a', label: 'Ink' }
			] }
		];

		const glance = () =>
		{
			requestAnimationFrame(() =>
			{
				const list = this.Element && this.Element.querySelector('.messages');

				list && (list.scrollTop = list.scrollHeight);
			});
		};

		this.input = ({ value }) =>
		{
			this.typed = value;
		};

		this.send = () =>
		{
			const prompt = this.typed.trim();

			if(!prompt || this.busy)
			{
				return;
			}

			this.messages.push({ id: this.messages.length + 1, role: 'user', content: prompt });
			this.typed = '';
			this.Update();
			glance();
		};

		this.key = ({ event }) =>
		{
			if(event.key === 'Enter' && !event.shiftKey)
			{
				event.preventDefault();
				this.send();
			}
		};

		this.icon = (step) =>
		{
			if(step.state === 'active')
			{
				return 'progress_activity';
			}

			if(step.state === 'failed')
			{
				return 'cancel';
			}

			return step.mode === 'research' ? 'search' : (step.mode === 'note' ? 'bookmark' : 'bolt');
		};

		this.resize = {
			edge: ['left'],
			min: 320,
			max: 640,
			onResize: (event) => $ot.modules.settings.set('ui.orah.width', event.width)
		};

		this.close = () =>
		{
			$ot.ui.layouts.close('orah');
		};

		return `
			<div :class="'box bg-' + background" :style="'width: ' + width + 'px'" :ot-resize="resize">
				<div class="head">
					<div class="tile"><i>psychology</i></div>
					<div class="titles">
						<span class="title">Orah</span>
						<span class="status"><em></em>Ready</span>
					</div>
					<button class="action" ot-tooltip="New conversation"><i>edit_square</i></button>
					<button class="action" ot-tooltip="History"><i>history</i></button>
					<button class="action" ot-click="close"><i>right_panel_close</i></button>
				</div>
				<div class="messages">
					<div ot-if="!messages.length" class="empty">
						<div class="mark"><i>psychology</i></div>
						<span class="lead">Ask anything.</span>
						<span class="hint">Orah answers directly, or orchestrates the agents when the goal needs the instance.</span>
					</div>
					<div ot-for="message in messages" :ot-key="message.id" :class="'entry ' + message.role">
						<div ot-if="message.role === 'user'" class="message user">{{ message.content }}</div>
						<div ot-if="message.role === 'assistant'" class="message assistant">{{ message.content }}</div>
						<div ot-if="message.role === 'error'" class="message error">{{ message.content }}</div>
						<div ot-if="message.role === 'steps'" class="steps">
							<div ot-for="step in message.steps" :ot-key="step.label" :class="'step ' + step.state">
								<div class="main">
									<i class="what">{{ icon(step) }}</i>
									<span class="text">
										<span class="target">{{ step.agent ? step.agent : 'memory' }}<em>{{ step.mode }}</em></span>
										<span class="label">{{ step.label }}</span>
									</span>
									<i ot-if="step.state === 'done'" class="mark">check</i>
								</div>
								<div ot-if="step.activity && step.activity.length" class="activity">
									<div ot-for="entry in step.activity.slice(-3)" :ot-key="entry.label" :class="'run ' + entry.state">
										<em></em>
										<span>{{ entry.label }}</span>
									</div>
								</div>
							</div>
						</div>
						<div ot-if="message.role === 'stats'" class="stats">
							<div ot-for="stat in message.stats" :ot-key="stat.label" class="stat">
								<span class="value">{{ stat.value }}</span>
								<span class="label">{{ stat.label }}</span>
							</div>
						</div>
						<div ot-if="message.role === 'items'" class="card">
							<div ot-if="message.title" class="name">{{ message.title }}</div>
							<div ot-for="entry in message.items" :ot-key="entry.label" class="row">
								<div class="tile"><i>{{ entry.icon }}</i></div>
								<span class="text">
									<span class="label">{{ entry.label }}</span>
									<span class="hint">{{ entry.hint }}</span>
								</span>
								<span ot-if="entry.badge" :class="'badge ' + (entry.color || '')">{{ entry.badge }}</span>
							</div>
						</div>
						<div ot-if="message.role === 'colors'" class="card">
							<div ot-if="message.title" class="name">{{ message.title }}</div>
							<div class="swatches">
								<div ot-for="color in message.colors" :ot-key="color.label" class="swatch" :ot-tooltip="color.label">
									<em :style="'background: ' + color.value"></em>
									<span>{{ color.value }}</span>
								</div>
							</div>
						</div>
					</div>
					<div ot-if="busy" class="message assistant thinking"><span></span><span></span><span></span></div>
				</div>
				<div class="composer">
					<div class="field">
						<textarea :value="typed" rows="1" spellcheck="false" placeholder="Ask Orah..." ot-input="input" ot-keydown="key"></textarea>
						<button class="send" ot-click="send"><i>arrow_upward</i></button>
					</div>
				</div>
			</div>
		`;
	}
});
