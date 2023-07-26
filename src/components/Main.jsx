import React, { useEffect, useState, lazy, Suspense } from "react";
import Header from "./header/Header";
import LeftPanel from "./left-panel/LeftPanel";
import RightPanel from "./right-panel/RightPanel";
import AllSections from "./all-sections/AllSections";
import Footer from "./footer/Footer";
import { Routes, Route } from "react-router-dom";
import "./Main.css";

const LazyPortfolioBuilder = lazy(() =>
  import("./portfolio-builder/PortfolioBuilderWrapper")
);

export default function Main() {
  const [width, setWidth] = useState(window.innerWidth);

  const [username, setUsername] = useState("");
  const [appData, setAppData] = useState({});

  useEffect(() => {
    setUsername(extractUsernameFromURL()); // Extract the username from the URL
  }, []);

  const extractUsernameFromURL = () => {
    const pathname = window.location.pathname;
    const username = pathname.slice(1); // Remove the leading slash
    return username;
  };

  // API GET call to fetch user data based on the extracted username
  useEffect(() => {
    if (username) {
      // Make the API GET call using the username
      // You can use Axios or fetch to make the API call
      // Replace 'YOUR_API_URL' with the actual API URL
      fetch(`http://127.0.0.1:5000/getuser?username=${username}`)
        .then((response) => response.json())
        .then((data) => {
          // Handle the fetched data as needed
          const { headerData, footerData, socialMediaLinks, emails, userData, image1, image2 } =
            data.data;
          setAppData({ ...data.data });
          // Update appData with the extracted fields
        })
        .catch((error) => {
          console.error("Error fetching user data:", error);
        });
    }
  }, [username]);

  useEffect(() => {
    const handleResize = () => setWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className="main">
      {username && (
        <Header
          {...appData.headerData}
          socialMediaLinks={appData.socialMediaLinks}
        />
      )}
      {username && width > 500 && (
        <>
          <LeftPanel {...appData.socialMediaLinks}></LeftPanel>
          <RightPanel emails={appData.emails}></RightPanel>
        </>
      )}

      <div className="wrapper">
        <Routes>
          {/* <Route path="/" element={<AllSections {...userData} />} /> */}
          <Route
            path="/"
            element={
              <Suspense fallback={<h1>Loading...</h1>}>
                <LazyPortfolioBuilder />
              </Suspense>
            }
          />
          <Route
            path="/:username"
            element={
              <AllSections 
                {...appData.userData} 
                image1={appData.image1 ?? "./assets/static_display_pic1.png"} 
                image2={appData.image2 ?? "./assets/static_display_pic2.jpg"}
              />
            }          />
          <Route
            path="*"
            element={
              <div className="wrong-url">
                <h1>404 not found</h1>
              </div>
            }
          />
        </Routes>
      </div>
      {username && width <= 500 && <LeftPanel {...appData.socialMediaLinks} />}
      {username && <Footer {...appData.footerData} />}
    </div>
  );
}
