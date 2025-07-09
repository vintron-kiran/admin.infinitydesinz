import React from "react";

export default function Footer(){
  return (
    <footer className="main-footer">
      <div className="footer-inner">
        <div className="pull-left">
          &copy; {new Date().getFullYear()} Infinity Designz. All rights
          reserved.
        </div>
        <div className="pull-right hidden-xs">Version 1.0.0</div>
      </div>
    </footer>
  );
}
