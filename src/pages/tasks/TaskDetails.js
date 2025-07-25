import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import styles from "../../styles/TaskDetail.module.css";

const TaskDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [task, setTask] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editing, setEditing] = useState(false);
  const [userRole, setUserRole] = useState("");
  const [showSuccess, setShowSuccess] = useState(false);
  const [userId, setUserId] = useState("");
  const [updating, setUpdating] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    status: "",
    priority: "",
    dueDate: "",
    assignedTo: "",
  });

  useEffect(() => {
    const fetchTask = async () => {
      try {
        const token = localStorage.getItem("token");

        // Decode token to get user info
        const decodedToken = JSON.parse(atob(token.split(".")[1]));
        setUserRole(decodedToken.role);
        setUserId(decodedToken.userId);

        // Get task details
        const response = await axios.get(
          `http://localhost:5001/api/tasks/${id}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        setTask(response.data);
        setFormData({
          title: response.data.title,
          description: response.data.description,
          status: response.data.status,
          priority: response.data.priority,
          dueDate: response.data.dueDate
            ? response.data.dueDate.split("T")[0]
            : "",
          assignedTo: response.data.assignedTo?._id || "",
        });
        setLoading(false);
      } catch (err) {
        setError(err.response?.data?.message || err.message);
        setLoading(false);
      }
    };

    fetchTask();
  }, [id]);

const handleStatusUpdate = async (newStatus) => {
  try {
    setUpdating(true);
    const token = localStorage.getItem("token");
    const response = await axios.put(
      `http://localhost:5001/api/tasks/${id}/status`,
      { status: newStatus },
      { headers: { Authorization: `Bearer ${token}` } }
    );

    if (response.data.success) {
      // Update both task and formData states with FULL populated data
      const updatedTask = response.data.task;
      
      setTask(updatedTask);
      setFormData({
        title: updatedTask.title,
        description: updatedTask.description,
        status: updatedTask.status,
        priority: updatedTask.priority,
        dueDate: updatedTask.dueDate ? updatedTask.dueDate.split("T")[0] : "",
        assignedTo: updatedTask.assignedTo?._id || ""
      });

      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
    }
  } catch (err) {
    setError(err.response?.data?.message || err.message);
    alert('Status update failed: ' + (err.response?.data?.message || err.message));
  } finally {
    setUpdating(false);
  }
};

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      const response = await axios.put(
        `http://localhost:5001/api/tasks/${id}`,
        formData,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.data.success) {
        // Update both task state and formData state with populated data
        const updatedTask = response.data.task;
        setTask(updatedTask);

        setFormData({
          title: updatedTask.title,
          description: updatedTask.description,
          status: updatedTask.status,
          priority: updatedTask.priority,
          dueDate: updatedTask.dueDate ? updatedTask.dueDate.split("T")[0] : "",
          assignedTo: updatedTask.assignedTo?._id || "",
        });
        setShowSuccess(true);
        setTimeout(() => setShowSuccess(false), 3000);
        setEditing(false);
        alert("Task updated successfully!");
      } else {
        throw new Error(response.data.message);
      }
    } catch (err) {
      setError(err.response?.data?.message || err.message);
      alert(
        "Error updating task: " + (err.response?.data?.message || err.message)
      );
    } finally {
      setUpdating(false);
    }
  };


  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete this task?")) {
      try {
        const token = localStorage.getItem("token");
        await axios.delete(`http://localhost:5001/api/tasks/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        navigate("/tasks");
      } catch (err) {
        setError(err.response?.data?.message || err.message);
      }
    }
  };

 const renderStatusOptions = () => {
  if (!task) return null;

  const isAssignedToMe = String(task.assignedTo?._id) === userId;
  const isCreatedByMe = String(task.createdBy?._id) === userId;

  // Manager can only update tasks assigned to them (not tasks they assigned to others)
  const canUpdate =
    (userRole === "Manager" && isAssignedToMe) ||
    ((userRole === "TeamMember" || userRole === "Intern") && isAssignedToMe);

  if (!canUpdate) return null;

  return (
    <div className={styles.statusUpdateContainer}>
      <h3>Update Status:</h3>
      <div className={styles.statusButtons}>
        {["Pending", "In Progress", "Completed", "Blocked"].map((status) => (
          <button
            key={status}
            type="button"
            onClick={() => {
              setUpdating(true);
              handleStatusUpdate(status)
                .finally(() => setUpdating(false));
            }}
            disabled={
              updating ||
              (userRole === "Intern" && status !== "Completed") ||
              task.status === status
            }
            className={`${styles.statusButton} ${
              task.status === status ? styles.activeStatus : ""
            }`}
          >
            {status}
          </button>
        ))}
      </div>
    </div>
  );
};

  const canEditTask = () => {
    if (!task) return false;
    return (
      userRole === "CEO" ||
      (userRole === "Manager" && String(task.createdBy?._id) === userId)
    );
  };

  const canDeleteTask = () => {
    return userRole === "CEO";
  };

  if (loading)
    return <div className={styles.loading}>Loading task details...</div>;
  if (error) return <div className={styles.error}>Error: {error}</div>;
  if (!task) return <div className={styles.notFound}>Task not found</div>;

  return (
    <div className={styles.taskDetailContainer}>
      <div className={styles.taskDetailHeader}>
        <h1>{task.title}</h1>
        <div className={styles.taskActions}>
          {!editing && canEditTask() && (
            <button
              onClick={() => setEditing(true)}
              className={styles.editButton}
            >
              Edit
            </button>
          )}
          {canDeleteTask() && (
            <button onClick={handleDelete} className={styles.deleteButton}>
              Delete
            </button>
          )}
        </div>
      </div>
      {showSuccess && (
      <div className={styles.successMessage}>
      <span>✓</span> Task updated successfully!
      </div>
       )}
      {editing ? (
        <form onSubmit={handleSubmit} className={styles.taskForm}>
          <div className={styles.formGroup}>
            <label>Title</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
            />
          </div>

          <div className={styles.formGroup}>
            <label>Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows="4"
            />
          </div>

          <div className={styles.formRow}>
            <div className={styles.formGroup}>
              <label>Status</label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                required
              >
                <option value="Pending">Pending</option>
                <option value="In Progress">In Progress</option>
                <option value="Completed">Completed</option>
                <option value="Blocked">Blocked</option>
              </select>
            </div>

            <div className={styles.formGroup}>
              <label>Priority</label>
              <select
                name="priority"
                value={formData.priority}
                onChange={handleChange}
                required
              >
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
              </select>
            </div>
          </div>

          <div className={styles.formRow}>
            <div className={styles.formGroup}>
              <label>Due Date</label>
              <input
                type="date"
                name="dueDate"
                value={formData.dueDate}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className={styles.formActions}>
            <button
              type="submit"
              className={styles.saveButton}
              disabled={updating}
            >
              {updating ? (
                <>
                  <span className={styles.spinner}></span> Updating...
                </>
              ) : (
                "Save Changes"
              )}
            </button>
            <button
              type="button"
              onClick={() => setEditing(false)}
              className={styles.cancelButton}
            >
              Cancel
            </button>
          </div>
        </form>
      ) : (
        <div className={styles.taskDetailContent}>
          <p className={styles.taskDescription}>
            {task.description || "No description provided"}
          </p>

          {renderStatusOptions()}

          <div className={styles.taskMeta}>
            <div className={styles.metaItem}>
              <span className={styles.metaLabel}>Status:</span>
              <span
                className={styles.metaValue}
                style={{
                  color:
                    task.status === "Completed"
                      ? "#10b981"
                      : task.status === "In Progress"
                      ? "#3b82f6"
                      : task.status === "Blocked"
                      ? "#ef4444"
                      : "#64748b",
                }}
              >
                {task.status}
              </span>
            </div>

            <div className={styles.metaItem}>
              <span className={styles.metaLabel}>Priority:</span>
              <span
                className={styles.metaValue}
                style={{
                  color:
                    task.priority === "High"
                      ? "#ef4444"
                      : task.priority === "Medium"
                      ? "#f59e0b"
                      : "#10b981",
                }}
              >
                {task.priority}
              </span>
            </div>

            {task.dueDate && (
              <div className={styles.metaItem}>
                <span className={styles.metaLabel}>Due Date:</span>
                <span className={styles.metaValue}>
                  {new Date(task.dueDate).toLocaleDateString()}
                </span>
              </div>
            )}

            <div className={styles.metaItem}>
              <span className={styles.metaLabel}>Created By:</span>
              <span className={styles.metaValue}>
                {task.createdBy?.name || "Unknown"}
              </span>
            </div>

            <div className={styles.metaItem}>
              <span className={styles.metaLabel}>Assigned To:</span>
              <span className={styles.metaValue}>
                {task.assignedTo?.name || "Unassigned"}
              </span>
            </div>

            <div className={styles.metaItem}>
              <span className={styles.metaLabel}>Created At:</span>
              <span className={styles.metaValue}>
                {new Date(task.createdAt).toLocaleString()}
              </span>
            </div>

            {task.updatedAt && (
              <div className={styles.metaItem}>
                <span className={styles.metaLabel}>Last Updated:</span>
                <span className={styles.metaValue}>
                  {new Date(task.updatedAt).toLocaleString()}
                </span>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default TaskDetail;
