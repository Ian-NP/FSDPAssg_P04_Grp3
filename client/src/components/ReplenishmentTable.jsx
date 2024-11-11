import React from 'react';
import styles from "../styles/ATMDashboard.module.css";

const ReplenishmentTable = ({ data = [] }) => {
  const dataArray = Array.isArray(data) ? data : Object.values(data);

  if (!Array.isArray(dataArray)) {
    console.error('Expected data to be an array but got:', typeof dataArray);
    return <div>Error: Invalid data format</div>;
  }

  return (
    <div>
      <h2>Replenishment Table</h2>
      <table>
        <thead>
          <tr>
            <th>ATM ID</th>
            <th>Location</th>
            <th>Location Type</th>
          </tr>
        </thead>
        <tbody>
          {dataArray.map((atm, index) => (
            <tr key={atm.atmId || index}>
              <td>{atm.atmId}</td>
              <td>{atm.address}</td>
              <td>{atm.location_type}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ReplenishmentTable;