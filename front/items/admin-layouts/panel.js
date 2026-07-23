onetype.AddonReady('admin.layouts', (layouts) =>
{
    layouts.Item({
        id: 'panel',
        isActive: false,
        zone: 'root',
        slot: 'right',
        render: '<e-orah-chat></e-orah-chat>'
    });
});
