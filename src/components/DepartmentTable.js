import React, { useEffect } from "react";
import axios from "axios";
import "./DepartmentTable.css";
const DepartmentTable = ({
  tableDepartments,
  checkedStates,
  setCheckedStates,
  selectedDept,
  selectedIncident,
}) => {
  // -------- Fetch existing data from backend --------
  useEffect(() => {
    const fetchStates = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/selection");
        const backendData = res.data;
        const updatedStates = tableDepartments.map((dept) => {
          // Match by department + selectedDept + incidentType
          const found = backendData.find(
            (d) =>
              d.department === dept &&
              d.selectedDept === (selectedDept || "") &&
              d.incidentType === (selectedIncident || "")
          );
          return found
            ? { approval: found.approval, informed: found.informed }
            : { approval: false, informed: false };
        });
        setCheckedStates(updatedStates);
      } catch (err) {
        console.error("Error fetching backend data:", err);
      }
    };
    if (tableDepartments.length > 0) fetchStates();
  }, [tableDepartments, selectedDept, selectedIncident]);
  // -------- Handle Checkbox Click --------
  const handleCheckboxChange = async (index, type) => {
    const current = checkedStates[index] || { approval: false, informed: false };
    // Toggle the clicked checkbox and reset the other
    const newState =
      type === "approval"
        ? { approval: !current.approval, informed: false }
        : { approval: false, informed: !current.informed };
    // Update local state immediately
    const updatedStates = [...checkedStates];
    updatedStates[index] = newState;
    setCheckedStates(updatedStates);
    // Send updated values to backend
    const department = tableDepartments[index];
    try {
      await axios.post("http://localhost:5000/api/selection", {
        department,
        approval: newState.approval,
        informed: newState.informed,
        selectedDept: selectedDept || "",
        incidentType: selectedIncident || "",
      });
      console.log(`✅ Saved ${department}: approval=${newState.approval}, informed=${newState.informed}`);
    } catch (err) {
      console.error("Error saving state:", err);
    }
  };
  return (
    <div className="table-wrapper">
      <div className="table-scroll">
        <table className="dept-table">
          <thead>
            <tr>
              <th>Department</th>
              <th>Request Approval</th>
              <th>Just Keep Informed</th>
            </tr>
          </thead>
          <tbody>
            {tableDepartments.map((dept, index) => (
              <tr key={index}>
                <td>{dept}</td>
                <td>
                  <input
                    type="checkbox"
                    checked={checkedStates[index]?.approval || false}
                    onChange={() => handleCheckboxChange(index, "approval")}
                  />
                </td>
                <td>
                  <input
                    type="checkbox"
                    checked={checkedStates[index]?.informed || false}
                    onChange={() => handleCheckboxChange(index, "informed")}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
export default DepartmentTable;


