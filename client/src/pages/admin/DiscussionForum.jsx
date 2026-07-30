import { useEffect, useState } from "react";
import axios from "axios";
import AdminSidebar from "../../components/admin/AdminSidebar";
import AdminTopbar from "../../components/admin/AdminTopbar";
import DataTable from "../../components/admin/DataTable";
import "./CollegeManagement.css";

const DiscussionForum = () => {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchDiscussionForum = async () => {
    setLoading(true);
    try {
      const res = await axios.get("http://localhost:5000/api/discussion/questions");
      if (res.data.msg === "Data fetched") {
        const data = res.data.questions || [];
        const formattedRows = data.flatMap((q, index) => {
          const questionRow = [
            `Q${index + 1}`,
            q.userId?.name || "Username unavailable",
            q.question,
            <div className="d-flex flex-column gap-1">
              <span>{q.status || "-"}</span>
              <button type="button" className="btn btn-sm btn-danger" onClick={() => deleteQuestion(q._id)}>Delete</button>
            </div>,
            q.createdAt ? new Date(q.createdAt).toLocaleString() : "-",
            "Question",
          ];
          const answerRows = (q.answers || []).map((answer, answerIndex) => [
            `Q${index + 1}-A${answerIndex + 1}`,
            answer.userId?.name || "Username unavailable",
            answer.answer,
            <div className="d-flex flex-column gap-1">
              <span>{answer.status || "-"}</span>
              <div className="d-flex gap-1">
                <button type="button" className="btn btn-sm btn-success" onClick={() => updateAnswerStatus(answer._id, "active")}>Active</button>
                <button type="button" className="btn btn-sm btn-warning" onClick={() => updateAnswerStatus(answer._id, "inactive")}>Inactive</button>
                <button type="button" className="btn btn-sm btn-danger" onClick={() => deleteAnswer(answer._id)}>Delete</button>
              </div>
            </div>,
            answer.createdAt ? new Date(answer.createdAt).toLocaleString() : "-",
            "Answer",
          ]);
          return [questionRow, ...answerRows];
        });
        setRows(formattedRows);
      } else {
        setRows([]);
      }
    } catch (error) {
      console.error("Error fetching discussion forum:", error);
      setRows([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDiscussionForum();
  }, []);

  const updateAnswerStatus = async (answerId, status) => {
    await axios.patch(`http://localhost:5000/api/discussion/answer/${answerId}/status`, { status });
    fetchDiscussionForum();
  };

  const deleteAnswer = async (answerId) => {
    await axios.delete(`http://localhost:5000/api/discussion/answer/${answerId}`);
    fetchDiscussionForum();
  };

  const deleteQuestion = async (questionId) => {
    if (!window.confirm("Delete this question and all of its answers?")) return;
    await axios.delete(`http://localhost:5000/api/discussion/question/${questionId}`);
    fetchDiscussionForum();
  };

  const forumColumns = [
    "ID",
    "USER NAME",
    "QUESTION / ANSWER",
    "STATUS",
    "TIMESTAMP",
    "TYPE",
  ];

  return (
    <div className="admin-dashboard">
      <AdminSidebar />

      <div className="content">
        <AdminTopbar breadcrumb="discussion forum" />

        <div className="college-page">
          <DataTable
            title="Discussion Forum"
            columns={forumColumns}
            rows={rows}
            emptyMessage={loading ? "Loading..." : "No discussion topics found"}
          />
        </div>
      </div>
    </div>
  );
};

export default DiscussionForum;
