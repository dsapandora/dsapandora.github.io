import React from "react";
import { createRoot } from "react-dom/client";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Footer from "./components/Footer";
import "./App.css";

createRoot(document.getElementById("root")).render(
  <>
    <Navbar />
    <Home />
    <Footer />
  </>
);
