import React, { useEffect, useState } from "react";
import axios from "axios";
import "./MyShifts.css";

const baseUrl = process.env.REACT_APP_API_BASE_URL || "";

interface Shift {
  id: number;
  title: string;
  start: string;
  end: string;
  status: "Assigned" | "Unfilled" | "Replacement Needed";
}

const MyShifts: React.FC = () => {
  const [shifts, setShifts] = useState<Shift[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchShifts();
  }, []);

  const fetchShifts = async () => {
    try {
      const response = await axios.get(`${baseUrl}/api/shifts/my-shifts`, {
        headers: { Authorization: localStorage.getItem("token") || "" },
      });
      setShifts(response.data);
    } catch (error) {
      console.error("Error fetching shifts:", error);
    } finally {
      setLoading(false);
    }
  };

  const reportAbsence = async (shiftId: number) => {
    if (!window.confirm("Are you sure you want to report absence for this shift?"))
      return;

    try {
      await axios.post(
        `${baseUrl}/api/shifts/report-absence`,
        { shiftId },
        { headers: { Authorization: localStorage.getItem("token") || "" } }
      );

      await axios.post(`${baseUrl}/api/notifications/send-email`, {
        subject: "Shift Absence Reported",
        message: `An employee has reported absence for shift ID: ${shiftId}. Please reassign.`,
      });

      alert("Absence reported. The shift supervisor has been notified.");
      fetchShifts();
    } catch (error) {
      console.error("Error reporting absence:", error);
    }
  };

  return (
    <div className="my-shifts-container">
      <h2>My Shifts</h2>
      {loading ? (
        <p>Loading shifts...</p>
      ) : shifts.length === 0 ? (
        <p>No assigned shifts.</p>
      ) : (
        <table className="shift-table">
          <thead>
            <tr>
              <th>Shift</th>
              <th>Start</th>
              <th>End</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {shifts.map((shift) => (
              <tr key={shift.id}>
                <td>{shift.title}</td>
                <td>{new Date(shift.start).toLocaleString()}</td>
                <td>{new Date(shift.end).toLocaleString()}</td>
                <td
                  className={
                    shift.status === "Replacement Needed" ? "warning" : ""
                  }
                >
                  {shift.status}
                </td>
                <td>
                  {shift.status === "Assigned" && (
                    <button
                      className="btn btn-danger btn-sm"
                      onClick={() => reportAbsence(shift.id)}
                    >
                      Report Absence
                    </button>
                  )}
                  {shift.status === "Replacement Needed" && (
                    <span className="alert-text">Needs Replacement</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default MyShifts;