import React, { useState } from "react";
import { auth } from "../firebase";
import { Form, Button } from "react-bootstrap";
import { useStateValue } from "../StateProvider";
import Axios from 'axios';

function Signin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [apDate, setDate] = useState("");
  const [Remarks, setRemarks] = useState("");
  const [{ uid, features, name }, dispatch] = useStateValue();
  
  

  const submit = (a,b,c) => {
    Axios.post('https://tame-teal-firefly-wig.cyclic.app/leave',{
      User : a,
      apDate : b,
      Remarks : c
    }).then(function(result) {
      alert('Successfully applied');
    })
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(name,apDate, Remarks);
   submit(name,apDate, Remarks);
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
            Apply for the Leave
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
              <Form.Label>Date</Form.Label>
              <Form.Control
                type="date"
                placeholder="Enter Date"
                value={apDate}
                onChange={(e) => setDate(e.target.value)}
                width = "100%"
              />
            </Form.Group>

            <Form.Group>
              <Form.Label>Remarks</Form.Label>
              <Form.Control
                type="text"
                placeholder="Remarks"
                value={Remarks}
                onChange={(e) => setRemarks(e.target.value)}
              />
            </Form.Group>
            <Button
              type="submit"
              style={{ width: "45%", background: "#ff3300" }}
            >
              Submit
            </Button>
          </Form>
        </div>
      </div>
    </div>
  );
}

export default Signin;

