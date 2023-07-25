import React, { useState } from "react";
import axios from "axios";
import "./UserForm.css";

const UserForm = ({ dataJson }) => {
  const [username, setUsername] = useState("");
  const [status, setStatus] = useState("");
  const [showModal, setShowModal] = useState(false);

  const handleGoToPortfolio = () => {
    if (username) {
      const portfolioLink = `http://localhost:3000/${username}`;
      window.open(portfolioLink, "_blank"); // Open the link in a new tab
    }
  };

  const handleCheckUser = async () => {
    try {
      const response = await axios.get("http://127.0.0.1:5000/getuser", {
        params: {
          username: username,
        },
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.status === 200) {
        setStatus("userFound");
      } else {
        handleCreateOrUpdateUser(); // If user not found, proceed to create/update user
      }
    } catch (error) {
      if (error.response && error.response.status === 404) {
        setStatus("userNotFound");
        handleCreateOrUpdateUser(); // If user not found, proceed to create/update user
      } else {
        console.error("Error:", error);
        setStatus("error");
      }
    }
  };

  const handleCreateOrUpdateUser = async () => {
    try {
      const response = await axios.post(
        "http://127.0.0.1:5000/createorupdateuser",
        {
          username: username,
          data: dataJson,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status === 201 || response.status === 200) {
        setStatus("success");
        setShowModal(true); // Show the success modal
      }
    } catch (error) {
      console.error("Error:", error);
      setStatus("error");
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    handleCheckUser();
  };

  const handleCopyToClipboard = () => {
    const copyText = `http://localhost:3000/${username}`;
    const textarea = document.createElement("textarea");
    textarea.value = copyText;
    document.body.appendChild(textarea);
    textarea.select();
    document.execCommand("copy");
    document.body.removeChild(textarea);

    // You can also display a notification or alert to indicate that the URL has been copied
    alert("URL copied to clipboard!");
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}>
      <div className="user-form" style={{ margin: "10px" }}>
        {status === "userFound" && (
          <p className="error-message">
            Duplicate username. Please try another username.
          </p>
        )}
        {status === "success" && (
          <div className="success-message">
            <p>User data uploaded successfully!</p>
            <p>
              Your portfolio is published on{" "}
              <a
                href={`http://localhost:3000/${username}`}
                target="_blank"
                rel="noopener noreferrer">
                http://localhost:3000/{username}
              </a>
            </p>
            <div className="buttons">
              <button className="copy-button" onClick={handleCopyToClipboard}>
                Copy URL
              </button>
              <button className="go-to-button" onClick={handleGoToPortfolio}>
                Go to Portfolio
              </button>
            </div>
          </div>
        )}
        {status === "error" && (
          <p className="error-message">
            Error occurred while processing the request
          </p>
        )}

        {(status === "error" || status === "userFound" || status === "") && (
          <form className="form" onSubmit={handleSubmit}>
            <label htmlFor="username">Username:</label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            <button type="submit" className="submit-button">
              Submit
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default UserForm;
