import "./Home.css";
import React, { useEffect, useState } from "react";

const API_endpoint = `https://api.openweathermap.org/data/2.5/weather?`;
const API_key =`d7be86b1b986532b8d11f98836befb51`;
function Home() {


  const [lat, setLat] = React.useState(null);
  const [lng, setLng] = React.useState(null);
  const [rest, setrest] = React.useState(null);

  window.navigator.geolocation.getCurrentPosition(
    position => {
      const location = {
        lat:position.coords.latitude,
        long:position.coords.longitude
      }
      showLocation(location); // <- Function that will use location data
    },
    (err)=>console.log(err),
  
  );
  
  function showLocation(location) {
      console.log(location);
      alert(location.long);
      setLat(location.long)

      let finalAPI= `${API_endpoint}lat=${location.lat}&lon=${location.long}&exclude=hourly,daily&appid=${API_key}`;

      Axios.get(finalAPI)
      .then((response) => {
        setrest(response.data)
      })
      // submit(name,uniQueEntry, time, location.long , location.lat);
      //other stuff    
  }
  return (
    <div className="Home">
      <>
        <title>Home Page</title>
        <link rel="preconnect" href="https://fonts.gstatic.com" />
        <link
          href="https://fonts.googleapis.com/css2?family=Ubuntu:wght@700&display=swap"
          rel="stylesheet"
        />
        <link
          rel="stylesheet"
          href="https://stackpath.bootstrapcdn.com/bootstrap/4.4.1/css/bootstrap.min.css"
          integrity="sha384-Vkoo8x4CGsO3+Hhxv8T/Q5PaXtkKtu6ug5TOeNV6gBiFeWPGFN9MuhOf23Q9Ifjh"
          crossOrigin="anonymous"
        />
        {/* navbar-dark style: font-size: 100px */}
        <div className="bg-img">
          <div className="bg-text">
            <h5>
              <b>
                {/* <span>To begin </span> */}
                {rest.name}
                a new day and end a day{" "}
                <span>well spent...</span>
              </b>
            </h5>
          </div>
        </div>
        <div className="row">
          <div className="col-sm-6" id="card1">
            <div className="card">
              <div className="card-body">
                <h5 className="card-title">How to Sign Up?</h5>
                <p className="card-text"></p>
                <ul>
                  <li>Click on the "Sign Up" link on the top right corner</li>
                  <li> Enter and submit your details</li>
                  <li>
                    Let your take snaps of your face in diffrent
                    orientations(keep your webcam on in chrome)
                  </li>
                  <li>Congrats, you are registered....</li>
                </ul>
                <p />
              </div>
            </div>
          </div>
          <div className="col-sm-6" id="card2">
            <div className="card">
              <div className="card-body">
                <h5 className="card-title">How to Log In?</h5>
                <p className="card-text"></p>
                <ul>
                  <li>Click on "Log In" at the top right corner</li>
                  <li>Enter your email and password</li>
                  <li>Allow the webcam to scan your face</li>
                  <li>
                    your morning/evening attendance is marked with timestamp
                  </li>
                  <li>Happy Working!!</li>
                </ul>
                <p />
              </div>
            </div>
          </div>
        </div>
      </>
    </div>
  );
}

export default Home;
