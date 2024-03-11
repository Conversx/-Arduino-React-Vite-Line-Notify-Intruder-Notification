// ไฟล์ app.js

import express from 'express';
import axios from 'axios';

const app = express();

app.use(express.json());

const fetchDataFromNetpie = async () => {
  const apiurl = 'https://api.netpie.io/v2/device/shadow/data';
  const headers = {
    'Content-Type': 'application/json',
    Authorization: 'Device c1b40ba4-ffcd-4c20-aea0-56bb155144f8:KNj5zck4h8WASo8xaJuF56mrgqmDXWMf',
  };

  try {
    const response = await axios.get(apiurl, { headers });
    const { data } = response.data;

    if (data.MoveDetect === 1) {
      console.log('Found Intruder!!');

      await axios.post('http://localhost:3001/log', {
        MoveDetect: 'Found Intruder!!',
        timestamp: data.timestamp,
        date: new Date().toLocaleDateString(),
      });
    } else if (data.MoveDetect === 0) {
      console.log('MoveDetect is 0. No log update or data.json write needed.');
    }
  } catch (error) {
    console.error(error);
  }
};

app.post('/log', async (req, res) => {
  const intrusionData = req.body;

  try {
    // เขียนข้อมูลการบุกรุกไปยัง data.json
    const jsonData = await readFileSync('./src/assets/data.json', 'utf8');
    const parsedData = JSON.parse(jsonData);
    parsedData.push(intrusionData);
    await writeFileSync('./data.json', JSON.stringify(parsedData, null, 2));

    res.json({ message: 'Data saved successfully!' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to save data' });
  }
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});

// เริ่มดึงข้อมูล
setInterval(fetchDataFromNetpie, 1000);
