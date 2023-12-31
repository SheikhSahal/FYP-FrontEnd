import React, { useEffect, useState } from "react";
import * as faceapi from "face-api.js";
import { db } from "../firebase";
import { useStateValue } from "../StateProvider";
import firebase from "firebase";
import { useHistory } from "react-router-dom";
import * as routes from "../constants/routes";
import "./ED.css";
import LinearProgress from "@material-ui/core/LinearProgress";
import Axios from 'axios';
// import MuiAlert from "@material-ui/lab/Alert";
// import Snackbar from "@material-ui/core/Snackbar";

/**
 * use useState to store 5 frames detected from camera, after that
 * fed into function to detect the faces, if atleast 3/5 passed,
 * marked the attendance if server timestamp:
 *  morning: 9-10
 *  evening: 4-5
 *
 * first fetch the features dataset from the firestore if not present
 * in the datalayer, then apply the above function
 */
// function Alert(props) {
//   return <MuiAlert elevation={6} variant="filled" {...props} />;
// }

// const API_endpoint = `https://api.openweathermap.org/data/3.0/onecall?`;

// const API_endpoint = `https://api.openweathermap.org/data/2.5/weather?`;
// const API_key =`d7be86b1b986532b8d11f98836befb51`;

function Detect() {
  const [{ uid, features, name }, dispatch] = useStateValue();
  const history = useHistory();

  const [dbtime , setdbtime] = useState();
  const [dbdate , setdbdate] = useState();
  const [lat, setLat] = useState(null);
  const [lng, setLng] = useState(null);
  const [status, setStatus] = useState(null);
  const [rest , setrest] = useState();
  const [capturedFrame, setCapturedFrame] = useState(null);
  


  // const [openSnackBar, setOpenSnackBar] = useState(false);

  useEffect(() => {
    // database queries
    // async function checkFeatures() {
    //   if (features === null) {
    //     try {
    //       var data = await db.collection("features").doc(uid).get();
    //       if (data.exists) {
    //         data = data.data();

    //         dispatch({
    //           type: "SET_FEATURES",
    //           features: data.features,
    //         });
    //       }
    //     } catch (e) {
    //       console.log(e);
    //     }
    //   }
    // }
    // checkFeatures();
    var video = document.querySelector("#video");

    const startVideo = () => {
      var constraints = {
        audio: false,
        video: true,
      };

      if (navigator.mediaDevices.getUserMedia) {
        navigator.mediaDevices
          .getUserMedia(constraints)
          .then((stream) => {
            video.srcObject = stream;
            video.onloadedmetadata = (e) => video.play();
          })
          .catch(function (err) {
            console.log(err.name + ": " + err.message);
          });
      }
    };

    Promise.all([
      faceapi.nets.faceLandmark68Net.loadFromUri("./models"),
      faceapi.nets.faceRecognitionNet.loadFromUri("./models"),
      faceapi.nets.ssdMobilenetv1.loadFromUri("/models"),
    ])
      .then(startVideo)
      .catch((err) => console.log(err));

    return () => {};
  }, [dispatch, features, uid]);

  useEffect(() => {
    var video = document.querySelector("#video");
    var interval;

    function stopStream() {
      if (video.srcObject) {
        const stream = video.srcObject;
        const tracks = stream.getTracks();

        tracks.forEach(function (track) {
          track.stop();
        });

        video.srcObject = null;
      } else {
        console.log("Video doesn't have any src");
      }
    }

    const onVideoStarted = async () => {
      console.log("Playing");

      const parsedUserFeatures = JSON.parse(features);

      const labeledFaceDescriptors = await faceapi.LabeledFaceDescriptors.fromJSON(
        parsedUserFeatures
      );

      const faceMatcher = new faceapi.FaceMatcher(labeledFaceDescriptors, 0.6);

      const displaySize = {
        width: video.videoWidth,
        height: video.videoHeight,
      };

      const recogRes = [];

      async function recogniseFace() {
        const detections = await faceapi
          .detectAllFaces(video)
          .withFaceLandmarks()
          .withFaceDescriptors();

        const resizedDetections = faceapi.resizeResults(
          detections,
          displaySize
        );

        const results = resizedDetections.map((d) =>
          faceMatcher.findBestMatch(d.descriptor)
        );

        // const canvas = canvasRef.current;
        // canvas.getContext("2d").drawImage(video, 0, 0, video.videoWidth, video.videoHeight);
        // const frameDataURL = canvas.toDataURL("image/png");
        // setCapturedFrame(frameDataURL);

        results.forEach((result, i) => {
          if (result.label === name) recogRes.push(true);
          else recogRes.push(false);
        });
      }

      interval = setInterval(async () => {
        if (recogRes.length === 5) {
          stopStream();
          let cnt = 0;

          recogRes.forEach((res) => {
            if (res) cnt++;
          });

          if (cnt >= recogRes.length / 2 + 1) {
            console.log("Result passed");

            const saveAttendance = async () => {
              const firebaseDate = await firebase.firestore.Timestamp.now(
                new Date()
              ).toDate();

            

             const currmont = firebaseDate.getMonth() + 1;

              const uniQueEntry =
              firebaseDate.getFullYear().toString() +
                "-" +
                currmont.toString() +
                "-" +
                firebaseDate.getDate().toString();

              // check if the user is doing 1st entry at 9-12
              const currentDate = firebaseDate.getHours();

              const time =
                firebaseDate.getHours().toString() +
                ":" +
                firebaseDate.getMinutes().toString() +
                ":" +
                firebaseDate.getSeconds().toString();

                console.log(uniQueEntry , time);

                const submit = (a,b,c,d,e) => {
                  Axios.post('https://tame-teal-firefly-wig.cyclic.app/api',{
                    User : a,
                    IO_Date : b,
                    IO_time : c,
                    long : d,
                    lati : e
                  })
                };

  
    // if (navigator.geolocation) {
    //   navigator.geolocation.watchPosition(function(position) {
    //     console.log("Latitude is :", position.coords.latitude);
    //     console.log("Longitude is :", position.coords.longitude);
    //     submit(name,uniQueEntry, time, position.coords.longitude , position.coords.latitude);
    //   });
    // }

  //   function getLocation(callback) {
  //     if (navigator.geolocation) {
  //         var lat_lng = navigator.geolocation.getCurrentPosition(function(position){
  //         console.log(position);
  //           var user_position = {};
  //           user_position.lat = position.coords.latitude; 
  //           user_position.lng = position.coords.longitude; 
  //           callback(user_position);
  //         })
  //     }
  // }

  // getLocation(function(lat_lng){
  //   submit(name,uniQueEntry, time, lat_lng.lng , lat_lng.lat);
  //   console.log(lat_lng);
  // });

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
      // alert(location.long);

      // let finalAPI= `${API_endpoint}lat=${location.lat}&lon=${location.long}&exclude=hourly,daily&appid=${API_key}`;

      // Axios.get(finalAPI)
      // .then((response) => {
      //   console.log(response.data)
      // })

      submit(name,uniQueEntry, time, location.long , location.lat);
      //other stuff    
  }
             
                //submit(name,uniQueEntry, time);

              // check if the user is doing 1st entry at 9-12
              if (currentDate >= 9 && currentDate <= 12) {
                //  first time fucking...
                const data = await db
                  .collection("users")
                  .doc(uid)
                  .collection("attendance")
                  .doc(uniQueEntry)
                  .get();
                 

                if (!data?.exists) {
                  await db
                    .collection("users")
                    .doc(uid)
                    .collection("attendance")
                    .doc(uniQueEntry)
                    .set({
                      morning: time,
                    })
                    .then(() => {
                      console.log("Morning timestamp saved successfully!!");
                      setdbtime(uniQueEntry);
                      setdbdate(time);
                    })
                    .catch((err) => console.log(err));
                }
              }

              // check if the user is doing 1st entry at 2-5 ie 14-17
              if (currentDate >= 14 && currentDate <= 17) {
                // second time...
                const data = await db
                  .collection("users")
                  .doc(uid)
                  .collection("attendance")
                  .doc(uniQueEntry)
                  .get();

                if (!data?.exists) {
                  await db
                    .collection("users")
                    .doc(uid)
                    .collection("attendance")
                    .doc(uniQueEntry)
                    .set({
                      evening: time,
                    })
                    .then(() => {
                      console.log("Evening timestamp saved successfully!!");
                      console.log(features, name, history, uid);
                      setdbtime(uniQueEntry);
                      setdbdate(time);
                    })
                    .catch((err) => console.log(err));
                } else if (data?.exists && data.data().evening === null) {
                  await db
                    .collection("users")
                    .doc(uid)
                    .collection("attendance")
                    .doc(uniQueEntry)
                    .update({
                      evening: time,
                    })
                    .then(() => {
                      console.log("Evening timestamp saved successfully!!");
                      console.log(features, name, history, uid);
                      setdbtime(uniQueEntry);
                      setdbdate(time);
                    })
                    .catch((err) => console.log(err));
                }
              }
            };

            try {
              saveAttendance();
              // setOpenSnackBar(true);
            } catch (err) {
              console.log(err);
            }
          }
          history.push(routes.HOME);
        }
        if (recogRes.length > 5) {
          stopStream();
          clearInterval(interval);
        }

        console.log(recogRes.length);
        recogniseFace();
      }, 100);
    };

    if (features !== null) {
      video.addEventListener("playing", onVideoStarted);
    }

    return () => {
      video.removeEventListener("playing", onVideoStarted);
      clearInterval(interval);
      stopStream();
    };
  }, [features, name, history, uid]);

  return (
    <div className="vid">
      <LinearProgress />

      <div className="detect_vid">
        <video autoPlay={true} muted={true} id="video" />
        {/* <canvas ref={canvasRef} style={{ display: "none" }} /> */}
      </div>

      {/* <Snackbar
        open={openSnackBar}
        autoHideDuration={6000}
        onClose={() => setOpenSnackBar(false)}
      >
        <Alert onClose={() => setOpenSnackBar(false)} severity="success">
          Attendance marked <em>Successfully!!</em>
        </Alert>
      </Snackbar> */}
    </div>
  );
}

export default Detect;
