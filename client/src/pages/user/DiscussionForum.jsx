import React, { useEffect, useState } from "react";
import axios from "axios";
import UserSidebar from "../../components/user/UserSidebar";
import UserTopbar from "../../components/user/UserTopbar";
import "./DiscussionForum.css";

const DiscussionForum = () => {
  const [question, setQuestion] = useState("");
  const [topics, setTopics] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedTopicId, setSelectedTopicId] = useState(null);
  const [expandedTopicId, setExpandedTopicId] = useState(null);
  const [answerInputs, setAnswerInputs] = useState({});

  const savedUser = JSON.parse(localStorage.getItem("user") || "{}");
  const userId = savedUser.id || localStorage.getItem("userId") || "";

  const fetchTopics = async () => {
    setLoading(true);
    try {
      const res = await axios.get("http://localhost:5000/api/discussion/questions");
      if (res.data.msg === "Data fetched") {
        setTopics(res.data.questions || []);
      } else {
        setTopics([]);
      }
    } catch (error) {
      console.error(error);
      window.alert("Unable to load discussion topics.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTopics();
  }, []);

  const handleAddQuestion = async (event) => {
    event.preventDefault();
    if (!question.trim()) {
      window.alert("Please enter your question.");
      return;
    }

    if (!userId) {
      window.alert("Please login first.");
      return;
    }

    try {
      const res = await axios.post("http://localhost:5000/api/discussion/question", {
        question: question.trim(),
        userId: userId,
      });

      if (res.data.msg === "Question registered") {
        setQuestion("");
        fetchTopics();
        window.alert("Question posted successfully!");
      } else {
        window.alert(res.data.msg || "Unable to add question.");
      }
    } catch (error) {
      console.error(error);
      window.alert("Server error adding question.");
    }
  };

  const toggleAnswerForm = (topicId) => {
    setSelectedTopicId((current) => (current === topicId ? null : topicId));
    setExpandedTopicId((current) => (current === topicId ? null : current));
  };

  const toggleAnswers = (topicId) => {
    setExpandedTopicId((current) => (current === topicId ? null : topicId));
  };

  const handleAnswerChange = (topicId, value) => {
    setAnswerInputs((prev) => ({ ...prev, [topicId]: value }));
  };

  const submitAnswer = async (topicId) => {
    const answerText = (answerInputs[topicId] || "").trim();
    if (!answerText) {
      window.alert("Please enter an answer before posting.");
      return;
    }

    if (!userId) {
      window.alert("Please login first.");
      return;
    }

    try {
      const res = await axios.post("http://localhost:5000/api/discussion/answer", {
        answer: answerText,
        questionId: topicId,
        userId: userId,
      });

      if (res.data.msg === "Answer added") {
        setAnswerInputs((prev) => ({ ...prev, [topicId]: "" }));
        fetchTopics();
        setExpandedTopicId(topicId);
        window.alert("Answer posted successfully!");
      } else {
        window.alert(res.data.msg || "Unable to post answer.");
      }
    } catch (error) {
      console.error(error);
      window.alert("Server error posting answer.");
    }
  };

  const updateAnswerStatus = async (answerId, status) => {
    await axios.patch(`http://localhost:5000/api/discussion/answer/${answerId}/status`, { status });
    fetchTopics();
  };

  const deleteAnswer = async (answerId) => {
    await axios.delete(`http://localhost:5000/api/discussion/answer/${answerId}`);
    fetchTopics();
  };

  return (
    <div className="student-dashboard">
      <UserSidebar />

      <div className="content">
        <UserTopbar />

        <div className="forum-page">
          <section className="forum-card">
            <h3>Ask Question</h3>
            <form className="question-form" onSubmit={handleAddQuestion}>
              <textarea
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                placeholder="Please enter your question"
              />
              <button type="submit" className="primary-button">
                Add Question
              </button>
            </form>
          </section>

          <section className="forum-table-section">
            <h3>Discussion Forum</h3>
            <div className="table-responsive">
              <table className="forum-table">
                <thead>
                  <tr>
                    <th>S NO.</th>
                    <th>Question</th>
                    <th>Username</th>
                    <th>Post Answer</th>
                    <th>View Answer</th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr>
                      <td colSpan="5" className="empty-table-cell">
                        Loading discussion topics...
                      </td>
                    </tr>
                  ) : topics.length === 0 ? (
                    <tr>
                      <td colSpan="5" className="empty-table-cell">
                        No questions have been posted yet.
                      </td>
                    </tr>
                  ) : (
                    topics.map((topic, index) => (
                      <React.Fragment key={topic._id}>
                        <tr>
                          <td>{index + 1}</td>
                          <td>{topic.question}</td>
                          <td>{topic.userId?.name || "Username unavailable"}</td>
                          <td>
                            <button
                              type="button"
                              className="secondary-button"
                              onClick={() => toggleAnswerForm(topic._id)}
                            >
                              Post
                            </button>
                          </td>
                          <td>
                            <button
                              type="button"
                              className="outline-button"
                              onClick={() => toggleAnswers(topic._id)}
                            >
                              View ({topic.answers?.length || 0})
                            </button>
                          </td>
                        </tr>
                        {selectedTopicId === topic._id && (
                          <tr className="answer-row">
                            <td colSpan="5">
                              <textarea
                                value={answerInputs[topic._id] || ""}
                                onChange={(e) => handleAnswerChange(topic._id, e.target.value)}
                                placeholder="Write your answer here"
                                className="answer-textarea"
                              />
                              <button
                                type="button"
                                className="primary-button"
                                onClick={() => submitAnswer(topic._id)}
                              >
                                Submit Answer
                              </button>
                            </td>
                          </tr>
                        )}
                        {expandedTopicId === topic._id && (
                          <tr className="answer-row">
                            <td colSpan="5">
                              {topic.answers?.length ? (
                                <div className="answer-list">
                                  {topic.answers.map((answer, answerIndex) => (
                                    <div key={`${topic._id}-${answerIndex}`} className="answer-item">
                                      <div className="answer-meta">
                                        <span>{answer.userId?.name || 'Username unavailable'}</span>
                                        <span>{new Date(answer.createdAt).toLocaleString()}</span>
                                        <span>Status: {answer.status}</span>
                                      </div>
                                      <p>{answer.answer}</p>
                                      <div className="d-flex gap-2">
                                        <button type="button" className="secondary-button" onClick={() => updateAnswerStatus(answer._id, "active")}>Active</button>
                                        <button type="button" className="outline-button" onClick={() => updateAnswerStatus(answer._id, "inactive")}>Inactive</button>
                                        <button type="button" className="outline-button" onClick={() => deleteAnswer(answer._id)}>Delete</button>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              ) : (
                                <div className="empty-table-cell">No answers yet.</div>
                              )}
                            </td>
                          </tr>
                        )}
                      </React.Fragment>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default DiscussionForum;
