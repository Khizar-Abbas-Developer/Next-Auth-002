"use client"

import React from "react";

const Loader = () => {
  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100vh" }}>
      <span className="loading loading-spinner text-secondary w-20 bg-accent"></span>     
    </div>
  );
};

export default Loader;