import React from "react";

export default function Header({ onToggleSidebar }: { onToggleSidebar: () => void }) {
  return (
    <>
      <header className="main-header-top hidden-print">
        <a href="index.php" className="logo">
          <img src="/assets/images/logo.svg" />
        </a>
        <nav className="navbar navbar-static-top">
          {/* Sidebar toggle button*/}
          <a href="#!" data-toggle="offcanvas" className="sidebar-toggle" onClick={onToggleSidebar}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width={24}
              height={24}
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
              className="feather feather-align-left"
            >
              <line x1={17} y1={10} x2={3} y2={10} />
              <line x1={21} y1={6} x2={3} y2={6} />
              <line x1={21} y1={14} x2={3} y2={14} />
              <line x1={17} y1={18} x2={3} y2={18} />
            </svg>
          </a>
          <ul className="top-nav lft-nav">
            <div className="search-bx mx-5 d-none d-md-block">
              <form>
                <div className="input-group">
                  <input
                    type="search"
                    className="form-control"
                    placeholder="Search"
                    aria-label="Search"
                    aria-describedby="button-addon3"
                  />
                  <div className="input-group-append">
                    <button className="btn" type="submit" id="button-addon3">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width={24}
                        height={24}
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth={2}
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="feather feather-search"
                      >
                        <circle cx={11} cy={11} r={8} />
                        <line x1={21} y1={21} x2="16.65" y2="16.65" />
                      </svg>
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </ul>
          {/* Navbar Right Menu*/}
          <div className="navbar-custom-menu f-right">
            <ul className="top-nav">
              {/*Notification Menu*/}
              <li className="dropdown notification-menu ">
                <a  className="btn-warning-light">
                  <i className="icon-size-fullscreen" />
                </a>
              </li>
              {/* chat dropdown */}
              <li className="pc-rheader-submenu ">
                <a
                  href="#"
                  className="waves-effect waves-light dropdown-toggle btn-info-light"
                  data-bs-toggle="dropdown"
                  title="Notifications"
                >
                  <i className="icon-bell" />
                </a>
              </li>
              {/* window screen */}
              <li className="pc-rheader-submenu ">
                <a
                  href="#"
                  data-toggle="control-sidebar"
                  title="Setting"
                  className="waves-effect full-screen waves-light btn-danger-light"
                >
                  <i className="icon-settings" />
                </a>
              </li>
              {/* User Menu*/}
              <li className="dropdown">
                <a
                  href="#!"
                  data-toggle="dropdown"
                  role="button"
                  aria-haspopup="true"
                  aria-expanded="false"
                  className="dropdown-toggle drop icon-circle drop-image"
                >
                  <span>
                    <img
                      className="img-circle "
                      src="/assets/images/avatar-1.png"
                      style={{ width: 40 }}
                      alt="User Image"
                    />
                  </span>
                </a>
                <ul className="dropdown-menu settings-menu">
                  <li>
                    <a href="#!">
                      <i className="icon-settings" /> Settings
                    </a>
                  </li>
                  <li>
                    <a href="#">
                      <i className="icon-user" /> Profile
                    </a>
                  </li>
                  <li>
                    <a href="#">
                      <i className="icon-envelope-open" /> My Messages
                    </a>
                  </li>
                  <li className="p-0">
                    <div className="dropdown-divider m-0" />
                  </li>
                  <li>
                    <a href="#">
                      <i className="icon-lock" /> Lock Screen
                    </a>
                  </li>
                  <li>
                    <a href="login1.php">
                      <i className="icon-logout" /> Logout
                    </a>
                  </li>
                </ul>
              </li>
            </ul>
          </div>
        </nav>
      </header>
    </>
  );
}