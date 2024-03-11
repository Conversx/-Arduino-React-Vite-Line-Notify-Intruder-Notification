import React, { useState } from 'react';
import axios from 'axios';

const About = () => {
  const [ledStatus, setLedStatus] = useState(0);

  const switchClicked = (pramValue) => {
    let _payload = '';
    if (pramValue === 0) {
      _payload = 'CLOSE';
      // setLedStatus(1);
    } else {
      _payload = 'OPEN';
      // setLedStatus(0);
    }
    publishToNetpie(_payload);
  };

  const publishToNetpie = (payload) => {
    let target = "topic=lab_ict_kps%2Fcommand";
    let apiurl = "http://api.netpie.io/v2/device/message" + "?" + target;
    let headers = {
      "Content-Type": "text/plain",
      "Authorization": "Device c1b40ba4-ffcd-4c20-aea0-56bb155144f8:KNj5zck4h8WASo8xaJuF56mrgqmDXWMf"
    };
    let data = payload;

    axios.put(apiurl, data, { headers })
      .then(response => {
        console.log(response.data);
      })
      .catch(error => {
        console.log(error);
      });
  };

  return (
    <div className='flex justify-center items-center grid'>
      <button className='btn btn-primary hover:btn-secondary my-8' onClick={() => switchClicked(1)}>
        Open
      </button>
      <button className='btn btn-primary hover:btn-secondary' onClick={() => switchClicked(0)}>
        Close
      </button>
    </div>
  );
};

export default About;
