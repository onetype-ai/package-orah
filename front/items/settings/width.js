onetype.AddonReady('modules.settings', (settings) =>
{
	settings.Item({
		id: 'ui.orah.width',
		label: 'Orah panel width',
		default: 380,
		metadata: { addon: 'orah' },
		description: 'Width in pixels of the Orah chat panel, resized by dragging its left edge.'
	});
});
