import React, { useState, useEffect } from 'react';
import './Dashboard.css';

function Dashboard() {
  const [log, setLog] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);

  const fetchLogData = async () => {
    try {
      const response = await fetch('http://localhost:3001/log');
      const data = await response.json();
      setLog(data.reverse()); // Reverse the data array before setting it in the state
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };
  

  useEffect(() => {
    fetchLogData();
    const intervalId = setInterval(fetchLogData, 5000);

    return () => clearInterval(intervalId);
  }, []);

  const itemsPerPage = 11;

  const totalPages = Math.ceil(log.length / itemsPerPage);

  const handlePreviousPage = () => {
    setCurrentPage((prevPage) => Math.max(prevPage - 1, 1));
  };

  const handleNextPage = () => {
    setCurrentPage((prevPage) => Math.min(prevPage + 1, totalPages));
  };

  return (
    <div className="dashboard-container">
      <div className="overflow-x-auto">
        <table className="data-table">
          {/* head */}
          <thead>
            <tr>
              <th></th>
              <th>NOTIFICATION</th>
              <th>TIME</th>
              <th>DATE</th>
            </tr>
          </thead>
          {/* body */}
          <tbody>
            {log.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage).map((entry, index) => (
              <React.Fragment key={index}>
                <tr>
                  <th>{index + 1}</th>
                  <td>{entry.MoveDetect}</td>
                  <td>{entry.timestamp}</td>
                  <td>{entry.date}</td>
                </tr>
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>
      <div className='pagination-container'>
      <div className="join grid grid-cols-2">
        <button className="join-item btn btn-outline" onClick={handlePreviousPage} disabled={currentPage === 1}>
          Previous page
        </button>
        <button className="join-item btn btn-outline" onClick={handleNextPage} disabled={currentPage === totalPages}>
          Next
        </button>
      </div>
      </div>
    </div>
    
  );
}

export default Dashboard;
