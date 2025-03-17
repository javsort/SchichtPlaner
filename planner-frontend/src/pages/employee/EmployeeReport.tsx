import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { getEmployeeReportCSV, getEmployeeReportExcel } from "../../Services/api.ts";
import "./EmployeeReport.css";

const EmployeeReport: React.FC = () => {
  const { t } = useTranslation();
  const [notification, setNotification] = useState<string | null>(null);

  const handleGenerateCSV = async () => {
    try {
      const csvReport = await getEmployeeReportCSV();
      const blob = new Blob([csvReport], { type: "text/csv" });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "employee_report.csv";
      a.click();
      window.URL.revokeObjectURL(url);
      setNotification(t("csvReportGenerated") || "CSV report generated and downloaded");
    } catch (error) {
      setNotification(t("errorGeneratingCSV") || "Error generating CSV report");
    }
  };

  const handleGenerateExcel = async () => {
    try {
      const excelReport = await getEmployeeReportExcel();
      const blob = new Blob([excelReport], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "employee_report.xlsx";
      a.click();
      window.URL.revokeObjectURL(url);
      setNotification(t("excelReportGenerated") || "Excel report generated and downloaded");
    } catch (error) {
      setNotification(t("errorGeneratingExcel") || "Error generating Excel report");
    }
  };

  return (
    <div className="employee-report-container container mt-4">
      <h2>{t("employeeReport") || "Employee Report"}</h2>
      {notification && (
        <div className={`notification-toast ${notification.includes("Error") ? "error" : "success"}`}>
          {notification}
        </div>
      )}
      <div className="report-buttons">
        <button onClick={handleGenerateCSV} className="btn btn-primary">
          {t("generateCSVReport") || "Generate CSV Report"}
        </button>
        <button onClick={handleGenerateExcel} className="btn btn-secondary">
          {t("generateExcelReport") || "Generate Excel Report"}
        </button>
      </div>
    </div>
  );
};

export default EmployeeReport;
