import { useStateValue } from "../StateProvider";
import React from "react";
import Homie from "./Home1";
import { Button } from "react-bootstrap";

import * as routes from "../constants/routes";
import { Link } from "react-router-dom";
// import { Link } from "react-router-dom";
// import * as routes from "../constants/routes";

/**
 * jab tak banda enroll na kare tak tak uski maar ka rakho
 * enroll par hi
 */

function Home() {
  const [{ features }] = useStateValue();

  return (
    <div>
      <Homie />
      <br />
      {features ? (
        <> <h2>Welcome to The FTIM!</h2></>
      ) : (
        <>
          <br />
          <div className="footer">
            <Link to={routes.ENROLL}>
              <Button
                variant="primary"
                style={{
                  color: "white",
                  width: "40%",
                  height: "200%",
                  position: "relative",
                  boxShadow: "inset 0 0.2 0.2 0.8 grey",
                }}
              >
                Train Yourself
              </Button>
            </Link>
          </div>
          <br />
        </>
      )}
    </div>
  );
}

export default Home;
