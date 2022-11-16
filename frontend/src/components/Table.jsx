import React from "react";
import "./table.css";
const Table = ({ employdata, onClick }) => {
  console.log(onClick);

  return (
    <>
      <tr
        onClick={() => {
          var arr = [];

          for (var i = 0; i < employdata.spreadsheet?.length; i++) {
            arr.push({
              value: employdata.spreadsheet[i].id,
              label: employdata.spreadsheet[i].name,
              access_token: employdata.token,
            });
          }

          onClick(arr);
        }}
      >
        <td>
          <input value={employdata.name} />
        </td>
        <td>
          <input value={employdata.email} />
        </td>
      </tr>
    </>
  );
};

export default Table;
