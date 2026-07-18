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
		this.busy = false;
		this.width = $ot.modules.settings.get('ui.orah.width', 380);

		this.conversation = null;
		this.messages = [];

		const glance = () =>
		{
			requestAnimationFrame(() =>
			{
				const list = this.Element && this.Element.querySelector('.messages');

				list && (list.scrollTop = list.scrollHeight);
			});
		};

		const field = () => this.Element && this.Element.querySelector('textarea');

		this.send = async () =>
		{
			const prompt = field() ? field().value.trim() : '';

			if(!prompt || this.busy)
			{
				return;
			}

			this.messages.push({ id: this.messages.length + 1, role: 'user', content: prompt });
			field() && (field().value = '');
			this.busy = true;
			this.Update();
			glance();

			const { data, message, code } = await $ot.command('orah:chat', { conversation: this.conversation, message: prompt }, true);

			if(code === 200)
			{
				this.conversation = data.conversation;

				if(data.steps && data.steps.length)
				{
					this.messages.push({ id: this.messages.length + 1, role: 'steps', steps: data.steps.map((step) => ({
						mode: step.tool,
						agent: step.agent,
						label: Object.values(step.input || {}).map((value) => String(value)).join(' · ') || '—',
						state: 'done'
					})) });
				}

				this.messages.push({ id: this.messages.length + 1, role: 'assistant', content: data.message });
			}
			else
			{
				this.messages.push({ id: this.messages.length + 1, role: 'error', content: message });
			}

			this.busy = false;
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

		this.fresh = () =>
		{
			this.conversation = null;
			this.messages = [];
			this.Update();
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
					<button class="action" ot-tooltip="New conversation" ot-click="fresh"><i>edit_square</i></button>
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
						<textarea rows="1" spellcheck="false" placeholder="Ask Orah..." ot-keydown="key"></textarea>
						<button class="send" ot-click="send"><i>arrow_upward</i></button>
					</div>
				</div>
			</div>
		`;
	}
});
