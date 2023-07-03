import React, { useState } from "react";
import { auth } from "../firebase";
import { Form, Button } from "react-bootstrap";

function Signin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (email && password) {
      await auth
        .signInWithEmailAndPassword(email, password)
        .then(async (authUser) => {
          if (authUser) {
            console.log("Login Successful!!");
          }
        })
        .catch((err) => console.log(err));
    }
  };

  return (
    <div className="poster-signin">
      <div className="container mt-12" style={{ width: "100%", padding: "10%" }}>
        <div className="form">
          <h6
            style={{
              color: "grey",
              textAlign: "center",
              textDecoration: "bold",
            }}
          >
            Welcome to The FTIM!
          </h6>
          {/* <h6
            style={{
              color: "#ff3300",
              textAlign: "center",
              textDecoration: "bold",
              width :"20px" 

            }}
          >
            To Login In Your Account, Fill the following details!
          </h6> */}
          <Form onSubmit={handleSubmit} className="form">
            <Form.Group>
              <Form.Label>Email address</Form.Label>
              <Form.Control
                type="email"
                placeholder="Enter email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                width = "100%"
              />
            </Form.Group>

            <Form.Group>
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </Form.Group>
            <Button
              type="submit"
              style={{ width: "45%", background: "#ff3300" }}
            >
              Login
            </Button>
          </Form>
        </div>
      </div>
    </div>
  );
}

export default Signin;
