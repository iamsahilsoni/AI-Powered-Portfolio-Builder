import React, { useState } from "react";
import axios from "axios";

const UserForm = ({ dataJson }) => {
  const [username, setUsername] = useState("");
  const [status, setStatus] = useState("");
  const [showModal, setShowModal] = useState(false);

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
    <div>
      {status === "userFound" && (
        <p>Duplicate username. Please try another username.</p>
      )}
      {status === "success" && (
        <div>
          <p>User data uploaded successfully!</p>
          <p>Your portfolio is published on http://localhost:3000/{username}</p>
          <button onClick={handleCopyToClipboard}>Copy URL</button>
        </div>
      )}
      {status === "error" && <p>Error occurred while processing the request</p>}

      <form onSubmit={handleSubmit}>
        <label>
          Username:
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </label>
        <button type="submit">Submit</button>
      </form>
    </div>
  );
};

export default UserForm;
