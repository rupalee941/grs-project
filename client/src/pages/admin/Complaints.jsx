import { useEffect, useState } from "react";
import axios from "axios";
import AdminSidebar from "../../components/admin/AdminSidebar";
import AdminTopbar from "../../components/admin/AdminTopbar";
import DataTable from "../../components/admin/DataTable";
import "./CollegeManagement.css";

const complaintConfig = {
  all: {
    breadcrumb: "all complaints",
    title: "All Complaints",
    emptyMessage: "No complaints found",
  },
  pending: {
    breadcrumb: "pending complaints",
    title: "Pending Complaints",
    emptyMessage: "No pending complaints found",
  },
  "not-processed": {
    breadcrumb: "not processed complaints",
    title: "Not Processed Complaints",
    emptyMessage: "No unprocessed complaints found",
  },
  closed: {
    breadcrumb: "closed complaints",
    title: "Closed Complaints",
    emptyMessage: "No closed complaints found",
  },
};

const complaintColumns = [
  "S NO.",
  "USER NAME",
  "COMPLAINT TYPE",
  "STATUS",
  "DATE",
  "ACTIONS",
];

const Complaints = ({ type = "all" }) => {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(false);
  const config = complaintConfig[type] || complaintConfig.all;

  const fetchComplaints = async () => {
    setLoading(true);
    try {
      const params = {};
      if (type !== "all") {
        params.status = type;
      }
      const res = await axios.get("http://localhost:5000/api/complaints", { params });
      if (res.data.msg === "Data fetched") {
        setComplaints(res.data.complaints || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchComplaints();
  }, [type]);

  const handleStatusUpdate = async (id, currentStatus) => {
    const nextStatus =
      currentStatus === "not-processed"
        ? "pending"
        : currentStatus === "pending"
        ? "closed"
        : null;

    if (!nextStatus) {
      return;
    }

    try {
      const res = await axios.patch(`http://localhost:5000/api/complaints/${id}`, {
        status: nextStatus,
      });
      if (res.data.msg === "status updated") {
        fetchComplaints();
      } else {
        window.alert(res.data.msg || "Failed to update status");
      }
    } catch (err) {
      console.error(err);
      window.alert("Error updating complaint status.");
    }
  };

  const rows = complaints.map((complaint, index) => [
    index + 1,
    complaint.userName,
    complaint.complaintTypeName,
    complaint.status,
    new Date(complaint.createdAt).toLocaleDateString(),
    complaint.status === "closed" ? (
      <span className="badge bg-success" style={{ fontSize: "14px" }}>
        Resolved
      </span>
    ) : (
      <button
        type="button"
        className="edit-btn"
        onClick={() => handleStatusUpdate(complaint._id, complaint.status)}
      >
        {complaint.status === "not-processed" ? "Mark Pending" : "Close Complaint"}
      </button>
    ),
  ]);

  return (
    <div className="admin-dashboard">
      <AdminSidebar />

      <div className="content">
        <AdminTopbar breadcrumb={config.breadcrumb} />

        <div className="college-page">
          <DataTable
            title={config.title}
            columns={complaintColumns}
            rows={loading ? [] : rows}
            emptyMessage={config.emptyMessage}
          />
        </div>
      </div>
    </div>
  );
};

export default Complaints;
