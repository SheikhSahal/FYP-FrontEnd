import React from 'react'
import {Link} from 'react-router-dom';
import './styler.css';
import { Button } from '@material-ui/core';
import * as routes from "../constants/routes";
function Footbtn() {
  return (<>
    <div className="footer">
        <Link to ={routes.SIGNUP}><Button variant ="primary" style={{background:'white',color:'white',width:'40%',height:'200%',position:'relative',boxShadow: 'inset 0 0.2 0.2 0.8 grey'}}>Register Yourself 
        </Button></Link>
    </div>
  </>);
}
export default Footbtn;