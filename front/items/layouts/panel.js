onetype.AddonReady('ui.layouts', (layouts) =>
{
    layouts.Item({
        id: 'orah',
        isActive: false,
        zone: 'root',
        slot: 'right',
        render: `<e-orah-chat></e-orah-chat>`
    });
});
