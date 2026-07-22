onetype.AddonReady('ui.navbar', (navbar) =>
{
    navbar.Item({
        id: 'orah',
        order: 5,
        position: 'right',
        icon: 'psychology',
        tooltip: 'Orah',
        onClick: () =>
        {
            $ot.ui.layouts.toggle('orah');
        }
    });
});
