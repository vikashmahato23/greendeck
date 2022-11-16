import React from "react";
import { useLocation } from "react-router-dom";

const Dashboard = () => {
  const { state } = useLocation();
  console.log(state);
  return (
    <div styl={{ width: "100%", display: "flex", flexWrap: "wrap" }}>
      <h3>TotoalColumn : {state.length}</h3>
      <table>
        <thead>
          <tr>
            {state.map((e, i) => {
              return <td key={i}>{i + 1}</td>;
            })}
          </tr>
        </thead>
        <tbody>
          <tr>
            {state.map((e, i) => {
              return <td key={i}>{e[0]}</td>;
            })}
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default Dashboard;
