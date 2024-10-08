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
            label: 'Admin',
            icon: 'pi pi-fw pi-cog',
            command: () => window.location.href = '/admin'
        },
        {
            label: 'Dashboard',
            icon: 'pi pi-fw pi-chart-bar',
            command: () => window.location.href = '/dashboard'
        }
    ];

    return (
        <div className="header">
            <Menubar model={items} />
        </div>
    );
};

export default Header;