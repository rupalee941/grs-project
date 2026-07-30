import AdminSidebar from "../../components/admin/AdminSidebar";
import AdminTopbar from "../../components/admin/AdminTopbar";
import DataTable from "../../components/admin/DataTable";
import "./CollegeManagement.css";

const blockedUserColumns = [
  "S NO.",
  "NAME",
  "EMAIL",
  "MOBILE",
  "BLOCKED ON",
  "REASON",
  "ACTIONS",
];

const BlockedUsers = () => {
  return (
    <div className="admin-dashboard">
      <AdminSidebar />

      <div className="content">
        <AdminTopbar breadcrumb="blocked users" />

        <div className="college-page">
          <DataTable
            title="Blocked Users"
            columns={blockedUserColumns}
            rows={[]}
            emptyMessage="No blocked users found"
          />
        </div>
      </div>
    </div>
  );
};

export default BlockedUsers;
