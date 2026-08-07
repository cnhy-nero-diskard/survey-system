import React, { useState, useEffect } from 'react';
import {
  Drawer,
  Box,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Button,
  TextField,
  Typography,
  Divider,
  Collapse,
  IconButton,
  Tooltip,
  Avatar,
  Chip,
} from '@mui/material';
import styled, { keyframes } from 'styled-components';
import { Link, useLocation } from 'react-router-dom';
import {
  Dashboard as DashboardIcon,
  LocationCity as MunicipalityIcon,
  Map as BarangayIcon,
  BeachAccessOutlined as AttIcon,
  Business as EstablishmentIcon,
  Timeline as GraphIcon,
  ExitToApp as LogoutIcon,
  InsightsRounded as InsightsIcon,
  PollRounded as SurveyIcon,
  ApiRounded as AiToolsIcon,
  ComputerOutlined as CompIcon,
  VerifiedUserOutlined as UserIcon,
  QrCode2Outlined as SurveyTouchpointsIcon,
  Storage as DBIcon,
  MenuOpen as MenuOpenIcon,
  Menu as MenuIcon,
  ExpandLess,
  ExpandMore,
  Analytics as AnalyticsIcon,
  Settings as SettingsIcon,
  TrendingUp as TrendingUpIcon,
  SupervisorAccount as AdminIcon,
} from '@mui/icons-material';

import '@fontsource/poppins/300.css'; // Light
import '@fontsource/poppins/400.css'; // Regular
import '@fontsource/poppins/500.css'; // Medium
import '@fontsource/poppins/700.css'; // Bold

// Animations
const slideIn = keyframes`
  from {
    opacity: 0;
    transform: translateX(-10px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
`;

// Styled Components
const SidebarDrawer = styled(Drawer).withConfig({
  shouldForwardProp: (prop) => !['drawerWidth', 'collapsed'].includes(prop),
})`
  width: ${({ drawerWidth, collapsed }) => (collapsed ? '80px' : `${drawerWidth}px`)};
  flex-shrink: 0;
  transition: width 0.3s cubic-bezier(0.4, 0, 0.2, 1);

  & .MuiDrawer-paper {
    width: ${({ drawerWidth, collapsed }) => (collapsed ? '80px' : `${drawerWidth}px`)};
    box-sizing: border-box;
    background: linear-gradient(145deg, #ffffff 0%, #f8fafc 50%, #e2e8f0 100%);
    border-right: 1px solid #e2e8f0;
    font-family: 'Poppins', sans-serif;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    overflow: hidden;
  }
`;

const SidebarHeader = styled(Box).withConfig({
  shouldForwardProp: (prop) => !['collapsed'].includes(prop),
})`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: ${({ collapsed }) => (collapsed ? '12px 8px 16px 8px' : '24px 16px')};
  background: #4f46e5;
  color: white;
  font-family: 'Poppins', sans-serif;
  position: relative;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  min-height: ${({ collapsed }) => (collapsed ? '80px' : 'auto')};
`;

const UserProfile = styled(Box).withConfig({
  shouldForwardProp: (prop) => !['collapsed'].includes(prop),
})`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: ${({ collapsed }) => (collapsed ? '8px' : '16px')};
  margin: 16px;
  background: rgba(79, 70, 229, 0.08);
  border-radius: 16px;
  border: 1px solid rgba(79, 70, 229, 0.15);
  transition: background 0.2s ease;
  animation: ${slideIn} 0.4s ease-out;

  &:hover {
    background: rgba(79, 70, 229, 0.12);
  }
`;

const SearchField = styled(TextField)`
  margin: 16px;
  background-color: #f8fafc;
  border-radius: 12px;
  width: calc(100% - 32px);
  transition: all 0.3s ease;

  & .MuiOutlinedInput-root {
    border-radius: 12px;
    transition: all 0.3s ease;

    &:hover {
      background-color: white;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
    }

    &.Mui-focused {
      background-color: white;
      box-shadow: 0 4px 16px rgba(102, 126, 234, 0.15);
    }
  }

  & .MuiInputBase-input {
    font-family: 'Poppins', sans-serif;
    font-weight: 400;
  }
`;

const MenuSection = styled(Box)`
  margin: 8px 0;
`;

const SectionTitle = styled(Typography)`
  font-family: 'Poppins', sans-serif;
  font-weight: 600;
  font-size: 12px;
  color: #64748b;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  padding: 8px 24px;
  margin-bottom: 4px;
`;

const StyledListItem = styled(ListItem).withConfig({
  // `collapsed` is styling-only; ListItem would otherwise spread it onto the
  // <li>, which React rejects as an unknown attribute.
  shouldForwardProp: (prop) => prop !== 'collapsed',
})`
  margin: ${({ collapsed }) => (collapsed ? '6px 0' : '2px 8px')};
  border-radius: 12px;
  border-left: 3px solid transparent;
  transition:
    background-color 0.2s ease,
    border-color 0.2s ease;

  &.active {
    background: rgba(79, 70, 229, 0.08);
    color: #4f46e5;
    font-weight: 600;
    border-left-color: ${({ collapsed }) => (collapsed ? 'transparent' : '#4f46e5')};

    & .MuiListItemIcon-root {
      color: #4f46e5;
    }
  }

  &:hover {
    background: rgba(79, 70, 229, 0.05);

    & .MuiListItemIcon-root {
      color: #4f46e5;
    }
  }

  &:focus-visible {
    outline: 2px solid #4f46e5;
    outline-offset: 2px;
  }
`;

const CollapseFooterButton = styled(Button)`
  border-radius: 12px;
  font-family: 'Poppins', sans-serif;
  font-weight: 600;
  text-transform: none;
  color: #64748b;
  justify-content: flex-start;
  padding-left: 24px;
  transition:
    background-color 0.2s ease,
    color 0.2s ease;

  &:hover {
    background: rgba(79, 70, 229, 0.08);
    color: #4f46e5;
  }

  &:focus-visible {
    outline: 2px solid rgba(79, 70, 229, 0.25);
    outline-offset: 2px;
  }
`;

const LogoutButton = styled(Button)`
  margin: 16px;
  border-radius: 12px;
  background: #ef4444;
  color: white;
  font-family: 'Poppins', sans-serif;
  font-weight: 600;
  padding: 12px 24px;
  transition: background-color 0.2s ease;

  &:hover {
    background: #dc2626;
  }
`;

const CustomTypography = styled(Typography)`
  font-family: 'Poppins', sans-serif;
`;

const menuSections = [
  {
    title: 'Overview',
    items: [
      { text: 'Dashboard', icon: <DashboardIcon />, to: 'dashboard', description: 'Main overview' },
    ],
  },
  {
    title: 'Data Analytics',
    items: [
      {
        text: 'Municipality Data',
        icon: <MunicipalityIcon />,
        to: 'overallmun',
        description: 'Municipal analytics',
      },
      {
        text: 'Per Area Data',
        icon: <BarangayIcon />,
        to: 'barangaydashboard',
        description: 'Area-specific insights',
      },
      {
        text: 'Per Attraction Data',
        icon: <AttIcon />,
        to: 'attractiondashboard',
        description: 'Tourism attractions',
      },
      {
        text: 'Per Establishment Data',
        icon: <EstablishmentIcon />,
        to: 'establishmentdashboard',
        description: 'Business establishments',
      },
    ],
  },
  {
    title: 'Survey Management',
    items: [
      {
        text: 'Survey Metrics',
        icon: <SurveyIcon />,
        to: 'surveymetrics',
        description: 'Performance metrics',
      },
      {
        text: 'Survey Statistics',
        icon: <GraphIcon />,
        to: 'stally',
        description: 'Statistical analysis',
      },
      {
        text: 'Survey Touchpoints',
        icon: <SurveyTouchpointsIcon />,
        to: 'surveytouchpoints',
        description: 'Interaction points',
      },
    ],
  },
  {
    title: 'AI & Analytics',
    items: [
      {
        text: 'AI Tools',
        icon: <AiToolsIcon />,
        to: 'aitoolsdashboard',
        description: 'ML & AI features',
      },
    ],
  },
  {
    title: 'System Management',
    items: [
      // { text: "Users Dashboard", icon: <UserIcon />, to: "usersdashboard", description: "User management" },
      { text: 'Data Manager', icon: <DBIcon />, to: 'datamanager', description: 'Data operations' },
      {
        text: 'System Performance',
        icon: <CompIcon />,
        to: 'systemperf',
        description: 'System monitoring',
      },
      {
        text: 'Log Stream',
        icon: <SurveyTouchpointsIcon />,
        to: 'logstream',
        description: 'System logs',
      },
    ],
  },
];

const Sidebar = ({ drawerWidth, onToggle, collapsed: propCollapsed }) => {
  const location = useLocation();
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  // Initialize collapsed state from localStorage or prop
  const [collapsed, setCollapsed] = useState(() => {
    const saved = localStorage.getItem('sidebar-collapsed');
    return saved !== null ? JSON.parse(saved) : propCollapsed || false;
  });

  const [expandedSections, setExpandedSections] = useState(() => {
    // Default every section open, keyed off menuSections itself. The old
    // literal listed "Administration", which is not a real section title, so
    // "System Management" fell through as undefined and its three items
    // (Data Manager, System Performance, Log Stream) were collapsed on load.
    const defaults = Object.fromEntries(menuSections.map((s) => [s.title, true]));
    const saved = localStorage.getItem('sidebar-expanded-sections');
    if (!saved) return defaults;
    try {
      return { ...defaults, ...JSON.parse(saved) };
    } catch {
      return defaults;
    }
  });

  function getBasename(pathname) {
    const parts = pathname.split('/').filter(Boolean);
    return parts.length > 0 ? parts[parts.length - 1] : '/';
  }

  // Sync prop changes with local state
  useEffect(() => {
    if (propCollapsed !== undefined && propCollapsed !== collapsed) {
      setCollapsed(propCollapsed);
    }
  }, [propCollapsed, collapsed]);

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleSearchKeyDown = (event) => {
    if (event.key === 'Escape') {
      setSearchTerm('');
      event.target.blur();
    }
  };

  const handleToggleCollapse = () => {
    const newCollapsed = !collapsed;
    setCollapsed(newCollapsed);
    localStorage.setItem('sidebar-collapsed', JSON.stringify(newCollapsed));
    if (onToggle) {
      onToggle(newCollapsed);
    }
  };

  const handleSectionToggle = (sectionTitle) => {
    setExpandedSections((prev) => {
      const newState = {
        ...prev,
        [sectionTitle]: !prev[sectionTitle],
      };
      localStorage.setItem('sidebar-expanded-sections', JSON.stringify(newState));
      return newState;
    });
  };

  // Filter items based on search
  const filteredSections = React.useMemo(() => {
    try {
      if (!searchTerm.trim()) {
        return menuSections;
      }

      return menuSections
        .map((section) => ({
          ...section,
          items: section.items.filter(
            (item) =>
              item.text.toLowerCase().includes(searchTerm.toLowerCase().trim()) ||
              item.description.toLowerCase().includes(searchTerm.toLowerCase().trim())
          ),
        }))
        .filter((section) => section.items.length > 0);
    } catch (error) {
      console.error('Error filtering sidebar sections:', error);
      return menuSections;
    }
  }, [searchTerm]);

  const isActiveRoute = (route) => {
    return getBasename(location.pathname) === route;
  };

  const handleLogout = async () => {
    if (isLoggingOut) return; // Prevent double-clicks

    setIsLoggingOut(true);
    try {
      console.log('Logging out...');
      const response = await fetch(`${process.env.REACT_APP_API_HOST}/api/auth/logout`, {
        method: 'GET',
        credentials: 'include',
        headers: {
          'Content-type': 'application/json',
        },
      });
      console.log(response.status);
      if (response.status === 200) {
        // Clear localStorage on logout
        localStorage.removeItem('sidebar-collapsed');
        localStorage.removeItem('sidebar-expanded-sections');
        window.location.href = '/login';
      } else {
        throw new Error(`Logout failed with status: ${response.status}`);
      }
    } catch (error) {
      console.error('Logout failed:', error);
      // Still redirect on error to be safe
      window.location.href = '/login';
    } finally {
      setIsLoggingOut(false);
    }
  };

  return (
    <SidebarDrawer variant="permanent" drawerWidth={drawerWidth} collapsed={collapsed}>
      {/* No AppBar exists in this layout, so the Toolbar spacer that used to sit
          here just pushed the sidebar 64px below the page content. */}
      <SidebarHeader collapsed={collapsed}>
        {collapsed ? (
          <Tooltip title="Panglao Tourism Office" placement="right">
            <Avatar sx={{ bgcolor: 'rgba(255,255,255,0.2)', width: 36, height: 36 }}>
              <AdminIcon sx={{ fontSize: 20 }} />
            </Avatar>
          </Tooltip>
        ) : (
          <>
            <CustomTypography
              variant="h6"
              align="center"
              fontWeight="bold"
              sx={{ fontSize: '14px', mb: 1 }}
            >
              MULTILINGUAL SURVEY SYSTEM
            </CustomTypography>
            <CustomTypography
              variant="subtitle2"
              align="center"
              sx={{ fontSize: '12px', opacity: 0.9 }}
            >
              PANGLAO TOURISM OFFICE
            </CustomTypography>
          </>
        )}
      </SidebarHeader>

      {!collapsed && (
        <UserProfile collapsed={collapsed}>
          <Avatar sx={{ bgcolor: '#4f46e5', width: 36, height: 36 }}>
            <AdminIcon />
          </Avatar>
          <Box sx={{ flex: 1 }}>
            <Typography variant="subtitle2" sx={{ fontWeight: 600, color: '#334155' }}>
              Admin User
            </Typography>
            <Chip
              label="Online"
              size="small"
              sx={{
                bgcolor: '#10b981',
                color: 'white',
                fontSize: '10px',
                height: '18px',
              }}
            />
          </Box>
        </UserProfile>
      )}

      {!collapsed && (
        <>
          <SearchField
            placeholder="Search navigation..."
            fullWidth
            variant="outlined"
            value={searchTerm}
            onChange={handleSearchChange}
            onKeyDown={handleSearchKeyDown}
            size="small"
            InputProps={{
              'aria-label': 'Search navigation items',
            }}
          />
          <Divider sx={{ mx: 2, my: 1 }} />
        </>
      )}

      <Box sx={{ overflow: 'auto', flex: 1 }}>
        {filteredSections.map((section, sectionIndex) => (
          <MenuSection key={section.title}>
            {collapsed && sectionIndex > 0 && <Divider sx={{ mx: 2, my: 1 }} />}
            {!collapsed && (
              <Box sx={{ display: 'flex', alignItems: 'center', px: 2, py: 1 }}>
                <SectionTitle variant="overline" sx={{ flex: 1 }}>
                  {section.title}
                </SectionTitle>
                <IconButton
                  size="small"
                  onClick={() => handleSectionToggle(section.title)}
                  sx={{
                    opacity: 0.9,
                    width: 36,
                    height: 36,
                    ml: 1,
                    borderRadius: 1,
                    '&:hover': { bgcolor: 'rgba(99,102,241,0.06)' },
                    '&:focus-visible': {
                      outline: '2px solid rgba(99,102,241,0.18)',
                      outlineOffset: 2,
                    },
                  }}
                  aria-expanded={!!expandedSections[section.title]}
                  aria-controls={`section-${sectionIndex}`}
                >
                  {expandedSections[section.title] ? <ExpandLess /> : <ExpandMore />}
                </IconButton>
              </Box>
            )}

            {/* An active search must reveal its matches even inside a section
                the user had collapsed, otherwise search appears to return
                nothing. */}
            <Collapse
              in={collapsed || !!searchTerm.trim() || expandedSections[section.title]}
              timeout={300}
            >
              <List dense>
                {section.items.map((item, index) => (
                  <Tooltip
                    key={`${sectionIndex}-${index}`}
                    title={collapsed ? `${item.text} - ${item.description}` : ''}
                    placement="right"
                    arrow
                    disableHoverListener={!collapsed}
                  >
                    <Box>
                      <StyledListItem
                        component={Link}
                        to={item.to}
                        collapsed={collapsed}
                        className={isActiveRoute(item.to) ? 'active' : ''}
                        sx={{
                          minHeight: 48,
                          justifyContent: collapsed ? 'center' : 'flex-start',
                          px: collapsed ? 0 : 3,
                        }}
                      >
                        <ListItemIcon
                          sx={{
                            minWidth: collapsed ? 'auto' : 40,
                            justifyContent: 'center',
                            color: isActiveRoute(item.to) ? '#4f46e5' : '#64748b',
                            transition: 'color 0.3s ease',
                          }}
                        >
                          {item.icon}
                        </ListItemIcon>

                        {!collapsed && (
                          <ListItemText
                            primary={item.text}
                            secondary={item.description}
                            primaryTypographyProps={{
                              fontFamily: 'Poppins, sans-serif',
                              fontWeight: isActiveRoute(item.to) ? 600 : 400,
                              fontSize: '14px',
                            }}
                            secondaryTypographyProps={{
                              fontFamily: 'Poppins, sans-serif',
                              fontSize: '11px',
                              color: '#94a3b8',
                            }}
                          />
                        )}
                      </StyledListItem>
                    </Box>
                  </Tooltip>
                ))}
              </List>
            </Collapse>
          </MenuSection>
        ))}
      </Box>

      <Box sx={{ mt: 'auto' }}>
        <Divider sx={{ mx: 2, my: 1 }} />
        {collapsed ? (
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              width: '100%',
              py: 1,
              gap: 1,
            }}
          >
            <Tooltip title="Log Out" placement="right">
              <IconButton
                onClick={handleLogout}
                disabled={isLoggingOut}
                sx={{
                  color: '#ef4444',
                  '&:hover': { bgcolor: 'rgba(239, 68, 68, 0.1)' },
                  '&:disabled': { color: '#94a3b8' },
                }}
                aria-label="Log out"
              >
                <LogoutIcon />
              </IconButton>
            </Tooltip>
            <Tooltip title="Expand sidebar" placement="right">
              <IconButton
                onClick={handleToggleCollapse}
                sx={{
                  color: '#64748b',
                  '&:hover': { bgcolor: 'rgba(79, 70, 229, 0.1)', color: '#4f46e5' },
                }}
                aria-label="Expand sidebar"
              >
                <MenuIcon />
              </IconButton>
            </Tooltip>
          </Box>
        ) : (
          <Box sx={{ px: 2, pt: 1, pb: 2, display: 'flex', flexDirection: 'column', gap: 1 }}>
            <LogoutButton
              fullWidth
              variant="contained"
              startIcon={<LogoutIcon />}
              onClick={handleLogout}
              disabled={isLoggingOut}
              sx={{ margin: 0 }}
            >
              {isLoggingOut ? 'Logging Out...' : 'Log Out'}
            </LogoutButton>
            <CollapseFooterButton
              fullWidth
              variant="text"
              startIcon={<MenuOpenIcon />}
              onClick={handleToggleCollapse}
            >
              Collapse
            </CollapseFooterButton>
          </Box>
        )}
      </Box>
    </SidebarDrawer>
  );
};

export default Sidebar;
