import React from "react";

export default function Header() {
  const resetData = () => {
    localStorage.clear();
    window.location.reload();
  };

  return (
    <header className="fixed-header">
      <nav className="navbar navbar-expand-lg navbar-light bg-light">
        <div className="container-fluid">
          <span className="navbar-brand">General Data List</span>
          <button className="btn btn-primary" onClick={() => resetData()}>
            Reset
          </button>
        </div>
      </nav>
    </header>
  );
}
