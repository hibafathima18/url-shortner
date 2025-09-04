import React from "react";
import { Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import ShortenerPage from "./pages/ShortenerPage";
import StatisticsPage from "./pages/StatisticsPage";
import RedirectHandler from "./components/RedirectHandler";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<ShortenerPage />} />
        <Route path="stats" element={<StatisticsPage />} />
      </Route>
      <Route path="/:shortCode" element={<RedirectHandler />} />
    </Routes>
  );
}

export default App;
