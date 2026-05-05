import {Route, Routes } from "react-router-dom"
import DashboardPage from "./pages/DashboardPage"

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<h1>Home</h1>} />
      <Route path="/Dashboard" element={<DashboardPage />} />
    </Routes>
  )
}