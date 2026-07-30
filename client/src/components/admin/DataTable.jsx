const DataTable = ({
  title,
  columns,
  rows = [],
  emptyMessage = "No data available in table",
}) => {
  const totalEntries = rows.length;
  const showingFrom = totalEntries > 0 ? 1 : 0;
  const showingTo = totalEntries;

  return (
    <section className="registered-colleges">
      <h3>{title}</h3>

      <div className="table-controls">
        <div className="entries-control">
          <select defaultValue="10">
            <option value="10">10</option>
            <option value="25">25</option>
            <option value="50">50</option>
          </select>
          <span>entries per page</span>
        </div>

        <input type="search" placeholder="Search records..." />
      </div>

      <div className="table-responsive">
        <table className="college-table">
          <thead>
            <tr>
              {columns.map((column) => (
                <th key={column}>{column}</th>
              ))}
            </tr>
          </thead>

          <tbody>
            {rows.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className="empty-table-cell">
                  {emptyMessage}
                </td>
              </tr>
            ) : (
              rows.map((row, index) => (
                <tr key={index}>
                  {row.map((cell, cellIndex) => (
                    <td key={cellIndex}>{cell}</td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="table-footer">
        <span>
          Showing {showingFrom} to {showingTo} of {totalEntries} entries
        </span>

        <div className="pagination">
          <button type="button" className="page-btn" disabled>
            &laquo;
          </button>
          <button type="button" className="page-btn" disabled>
            &lsaquo;
          </button>
          <button type="button" className="page-btn active">
            1
          </button>
          <button type="button" className="page-btn" disabled>
            &rsaquo;
          </button>
          <button type="button" className="page-btn" disabled>
            &raquo;
          </button>
        </div>
      </div>
    </section>
  );
};

export default DataTable;
