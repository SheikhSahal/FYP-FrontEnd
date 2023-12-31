import React, { useEffect } from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
} from "react-router-dom";
import { auth, db } from "./firebase";
import { useStateValue } from "./StateProvider";
import * as routes from "./constants/routes";
import Home from "./screens/Home";
import Welcome from "./screens/Welcome";
import Enroll from "./screens/Enroll";
import Detect from "./screens/Detect";
import Signin from "./screens/Signin";
import Signup from "./screens/Signup";
import Leave from "./screens/Leaves";
import About from "./screens/About";
import FooterPage from "./components/Footer";
import Head from "./components/Header";
import "./App.css";

function App() {
  const [{ uid, features }, dispatch] = useStateValue();

  useEffect(() => {
    async function startupFunc() {
      try {
        auth.onAuthStateChanged(async (authUser) => {
          if (authUser) {
            // user is logged in
            const uid = authUser?.uid;

            if (uid) {
              dispatch({
                type: "SET_UID",
                uid: uid,
              });

              try {
                var data = await db.collection("users").doc(uid).get();

                if (data.exists) {
                  data = data.data();

                  dispatch({
                    type: "SET_USER",
                    name: data.name,
                    collegeId: data.collegeId,
                    finishedSetup: data.finishedSetup,
                  });
                }

                data = await db.collection("features").doc(uid).get();

                if (data.exists) {
                  data = data.data();

                  dispatch({
                    type: "SET_FEATURES",
                    features: data?.features,
                  });
                }
              } catch (e) {
                console.log(e);
              }
            }
          } else {
            // user is logged out
            dispatch({
              type: "SET_UID",
              uid: null,
            });
          }
        });
      } catch (e) {
        console.log(e);
      }
    }

    startupFunc();
    return () => {};
  }, [dispatch]);

  return (
    <div className="classypeople">
      <Router>
        <Head />

        <Switch>
          <Route exact path={routes.ABOUT}>
            <About />
          </Route>

          {uid ? (
            <>
              {features && (
                <div>
                <Route exact path={routes.DETECT}>
                  <Detect />
                  
                </Route>
                <Route exact path={routes.LEAVE}>
                  <Leave />
                  
                </Route>
                </div>
              )}

              {!features && (
                <Route exact path={routes.ENROLL}>
                  <Enroll />
                </Route>
              )}

              <Route exact path={routes.HOME}>
                <Home />
              </Route>

              <Redirect to={routes.HOME}>
                <Home />
              </Redirect>
            </>
          ) : (
            <>
              <Route path={routes.SIGNIN}>
                <Signin />
              </Route>

              <Route path={routes.SIGNUP}>
                <Signup />
              </Route>

              <Route exact path={routes.WELCOME}>
                <Welcome />
              </Route>

              <Redirect to={routes.WELCOME}>
                <Welcome />
              </Redirect>
            </>
          )}
        </Switch>

        {/* <FooterPage /> */}
      </Router>
    </div>
  );
}

export default App;
