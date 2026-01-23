const Sidebar = ({ activePage, onNavigate }) => {
  const userRole = localStorage.getItem("role");

  const menuItems = [
    { id: "dashboard", label: "Dashboard", icon: "📊" },
    { id: "obiekty", label: "Obiekty", icon: "🏢", roleRequired: "owner" },
    { id: "rent_assignment", label: "Umowy najmu", icon: "📝" },
    { id: "full_rent", label: "Czynsz", icon: "💰" },
    { id: "settings", label: "Ustawienia", icon: "⚙️" },
  ];

  const userName =
    `${localStorage.getItem("first_name") || ""} ${localStorage.getItem("last_name") || ""}`.trim();

  const visibleMenuItems = menuItems.filter((item) => {
    if (item.roleRequired) {
      return userRole === item.roleRequired;
    }
    return true;
  });

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <h2 className="sidebar-title">Twoje Mieszkanie</h2>
        {userName && (
          <p
            className="sidebar-subtitle"
            style={{
              fontSize: "0.85rem",
              color: "var(--text-muted)",
              marginTop: "0.5rem",
            }}
          >
            Witaj, {userName}
          </p>
        )}
      </div>

      <nav className="sidebar-nav">
        {visibleMenuItems.map((item) => (
          <button
            key={item.id}
            className={`nav-item ${activePage === item.id ? "active" : ""}`}
            onClick={() => onNavigate(item.id)}
          >
            <span className="nav-icon">{item.icon}</span>
            <span className="nav-label">{item.label}</span>
          </button>
        ))}
      </nav>

      <div className="sidebar-footer">
        <button
          className="nav-item logout"
          onClick={() => onNavigate("logout")}
        >
          <span className="nav-icon">🚪</span>
          <span className="nav-label">Wyloguj</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
