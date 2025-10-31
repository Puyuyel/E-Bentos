import React from 'react';
import {
    DocumentReportIcon,
    OfficeBuildingIcon,
    TicketIcon,
    ShoppingCartIcon,
    CalendarIcon,
    UsersIcon,
    ChartBarIcon,
    LogoutIcon
} from './icons';
import { useNavigate } from 'react-router-dom'
import '../styles/Sidebar.css';

interface NavItemProps {
    icon: React.ReactNode;
    label: string;
    active?: boolean;
    route?: string;
    onClick?: () => void;
}

type NavEntry = {
    icon: React.ReactNode;
    label: string;
    route: string;
}

const NavItem: React.FC<NavItemProps> = ({ icon, label, active = false, onClick }) => {
    return (
        <a
            onClick={onClick}
            className={`nav-item ${active ? 'nav-item-active' : ''}`}
            style={{ cursor: 'pointer' }}
        >
            {icon}
            <span className="nav-label">{label}</span>
        </a>
    );
};

interface SidebarProps {
    currentPath?: string;
}

const Sidebar: React.FC<SidebarProps> = ({ currentPath = '' }) => {
    const navigate = useNavigate();

    const handleNavigate = (route?: string) => {
        if (route) navigate(`/admin/${route}`);
    };
    const manageItems: NavEntry[] = [
        { icon: <DocumentReportIcon />, label: 'Productoras', route: 'gestionar-productora' },
        { icon: <OfficeBuildingIcon />, label: 'Gestores de locales', route: 'gestionar-gestor-local' },
        { icon: <TicketIcon />, label: 'Taquilleros', route: 'gestionar-taquillero' },
        { icon: <ShoppingCartIcon />, label: 'Puntos de venta', route: 'gestionar-punto-venta' },
    ];

    const reportItems: NavEntry[] = [
        { icon: <CalendarIcon />, label: 'Eventos', route: 'reporte-evento' },
        { icon: <OfficeBuildingIcon />, label: 'Locales', route: 'reporte-local' },
        { icon: <UsersIcon />, label: 'Clientes', route: 'reporte-cliente' },
        { icon: <DocumentReportIcon />, label: 'Productoras', route: 'reporte-productora' },
        { icon: <ChartBarIcon />, label: 'Organizadores', route: 'reporte-organizador' },
        { icon: <TicketIcon />, label: 'Taquilleros', route: 'reporte-taquillero' },
    ];

    return (
        <aside className="sidebar">
            <div className="logo-container">
                <img src="../../public/images/ebentos-logo-morado.png" alt="e-Bentos Logo" className="logo" />
                <span className="logo-text">e-Bentos</span>
            </div>

            <nav className="sidebar-nav">
                <div>
                    <h3 className="nav-section-title">Gestionar</h3>
                    <div className="nav-group">
                        {manageItems.map((item, index) => (
                            <NavItem
                                key={index}
                                icon={item.icon}
                                label={item.label}
                                active={currentPath === item.route}
                                onClick={() => handleNavigate(item.route)}
                            />
                        ))}
                    </div>
                </div>
                <div>
                    <h3 className="nav-section-title">Reportes</h3>
                    <div className="nav-group">
                        {reportItems.map((item, index) => (
                            <NavItem
                                key={index}
                                icon={item.icon}
                                label={item.label}
                                active={currentPath === item.route}
                                onClick={() => handleNavigate(item.route)}
                            />
                        ))}
                    </div>
                </div>
            </nav>

            <div className="logout-container">
                <NavItem icon={<LogoutIcon />} label="Cerrar sesión" onClick={() => navigate('/login')} />
            </div>
        </aside>
    );
};

export default Sidebar;
