// src/routes/AppRoutes.jsx
import { Routes, Route } from "react-router-dom";
import AdminLayout from "../layouts/AdminLayout";
import ProtectedRoute from "./ProtectedRoute";

import Login from "../pages/Login";
import Dashboard from "../pages/Dashboard";
import Table from "../pages/Table";
import Page from "../components/Page";


export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route
        path="/"
        element={
          // <ProtectedRoute>
            <AdminLayout />
          // </ProtectedRoute>
        }
      >
        <Route index  element={<Page title="Dashboard" page="Dashboard"><Dashboard /></Page>}/>
        <Route path="tables" element={<Page title="Tables" page="Tables"><Table /></Page>} />
      </Route>
    </Routes>
  );
}
