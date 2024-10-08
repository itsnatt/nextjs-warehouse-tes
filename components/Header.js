// components/Header.js
import React from 'react';
import { Menubar } from 'primereact/menubar';

const Header = () => {
    const items = [
        {
            label: 'Vendor',
            icon: 'pi pi-fw pi-users',
            command: () => window.location.href = '/vendor'
        },
        {
            label: 'raw_materials',
            icon: 'pi pi-fw pi-bell',
            command: () => window.location.href = '/raw_materials'
        },
        {
            label: 'Cutting',
            icon: 'pi pi-fw pi-cog',
            command: () => window.location.href = '/wh_cutting'
        },
        {
            label: 'raw_material_dash',
            icon: 'pi pi-fw pi-chart-bar',
            command: () => window.location.href = '/raw_material_dash'
        }
    ];

    return (
        <div className="header">
            <Menubar model={items} />
        </div>
    );
};

export default Header;