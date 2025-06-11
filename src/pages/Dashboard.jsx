import { DashboardSummary } from "../components/DashboardSummary";
import { Header } from "../components/Header";
import { Sidebar } from "../components/Sidebar";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

export const Dashboard = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("jwtToken");
    if (!token) {
      navigate("/login");
    }
  }, [navigate]);
  return (
    <>
      <Header />
      <Sidebar />
    </>
  );
};
