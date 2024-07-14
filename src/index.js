//index.js or as App.js  same same
import React from "react";
import { createRoot } from "react-dom/client";
import {
  createBrowserRouter,
  RouterProvider,
  Outlet,
} from "react-router-dom";
import Home from "./pages/Home";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Navbar from "./components/Navbar";
import Resume from "./pages/Resume";
import Footer from "./components/Footer";
import "./App.css"

const AppLayout = () =>{
    return(
        <>
        <Navbar />
        <Outlet />
        <Footer />
        </>
    )
}

const router = createBrowserRouter([
    {
        element: <AppLayout />,
        children: [
            {
                path: "/",
                element: <Home/>,
              },
              {
                path: "resume",
                element: <Resume />,
              },
              {
                path: "contact",
                element: <Contact />,
              },
              {
                path: "about",
                element: <About />,
              },
             
        ],
    },
  
]);

createRoot(document.getElementById("root")).render(
  <RouterProvider router={router} />
);