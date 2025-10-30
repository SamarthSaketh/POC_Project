import React from "react";
import axios from "axios";
import "./ActionButtons.css";
const BASE_URL = "http://localhost:5000";
const ActionButtons = ({
  tableDepartments,
  checkedStates,
  selectedDept,
  selectedIncident,
  fetchTableData
}) => {
  const saveAll = async () => {
    try {
      // Send all checkbox states to backend
      await Promise.all(
        tableDepartments.map((dept, i) =>
          axios.post(`${BASE_URL}/api/selection`, {
            department: dept,
            approval: checkedStates[i]?.approval || false,
            informed: checkedStates[i]?.informed || false,
            selectedDept: selectedDept || "",
            incidentType: selectedIncident || ""
          })
        )
      );
      return true;
    } catch (err) {
      console.error("Error saving all selections:", err);
      alert("Error saving data. Check console.");
      return false;
    }
  };
  const hasAnyCheckboxSelected = () => {
    return checkedStates.some((state) => state.approval || state.informed);
  };
  const handleExit = () => {
    window.location.href = "http://localhost:3000";
  };
  const handleNext = async () => {
    if (!hasAnyCheckboxSelected()) {
      alert("Please select at least one checkbox before saving!");
      return;
    }
    const saved = await saveAll();
    if (saved) {
      alert("✅ Data saved! Loading new table.");
      fetchTableData(); // Refresh table
    }
  };
  const handleSaveAndExit = async () => {
    if (!selectedDept || !selectedIncident) {
      alert("Please select both Department and Incident Type before saving!");
      return;
    }
    if (!hasAnyCheckboxSelected()) {
      alert("Please select at least one checkbox before saving!");
      return;
    }
    const confirmed = window.confirm("Do you want to save all selections and exit?");
    if (!confirmed) return;
    alert("Saving data…");
    const saved = await saveAll();
    if (saved) {
      alert("✅ Data saved successfully! Going to Home Page.");
      handleExit();
    }
  };
  return (
    <div className="action-buttons-wrapper">
      <button className="action-button exit" onClick={handleExit}>Exit</button>
      <button className="action-button next" onClick={handleNext}>Next</button>
      <button className="action-button save-exit" onClick={handleSaveAndExit}>Save & Exit</button>
    </div>
  );
};
export default ActionButtons;
