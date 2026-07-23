onetype.AddonReady('admin.navbar', (navbar) =>
{
    navbar.Item({
        id: 'toggle',
        order: 5,
        position: 'right',
        icon: 'psychology',
        tooltip: 'Orah',
        onClick: () =>
        {
            commands.Fn('run', 'admin:layouts:toggle', { id: 'panel' });
        }
    });
});
