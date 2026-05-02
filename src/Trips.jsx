import React, { useEffect, useState } from 'react';
import { parse, format, isValid } from 'date-fns';
import './App.css'; 

const TripList = () => {
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [pageSize] = useState(10);
  const [sortConfig, setSortConfig] = useState({ key: 'started', direction: 'desc' });

  // Date Formatting Logic
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    try {
      const incomingFormat = "dd-MM-yyyy HH:mm:ss";
      const utcDate = parse(dateString.trim(), incomingFormat, new Date());
      if (!isValid(utcDate)) return dateString;
      const localDate = new Date(utcDate.getTime() - (utcDate.getTimezoneOffset() * 60000));
      return format(localDate, "dd-MM-yyyy hh:mm aa");
    } catch (error) {
      return dateString;
    }
  };

  const fetchTrips = async () => {
    setLoading(true);
    const token = localStorage.getItem('token');
    const sortParam = `${sortConfig.key},${sortConfig.direction}`;
    
    try {
      const response = await fetch(
        `http://localhost:8080/trips?page=${currentPage}&size=${pageSize}&sort=${sortParam}`, 
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );
      const data = await response.json();
      setTrips(data.content || []);
      setTotalPages(data.totalPages || 0);
    } catch (error) {
      console.error("Error fetching trips:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTrips();
  }, [currentPage, sortConfig]);

  const requestSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
    setCurrentPage(0);
  };

  const getSortIcon = (key) => {
    if (sortConfig.key !== key) return '↕️';
    return sortConfig.direction === 'asc' ? '🔼' : '🔽';
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 0 && newPage < totalPages) {
      setCurrentPage(newPage);
    }
  };

  if (loading && trips.length === 0) return <div className="loading">Loading trip history...</div>;

  return (
    <div className="trip-container">
      <h3>Trip History</h3>
      <table className="trip-table">
        <thead>
          <tr>
            <th onClick={() => requestSort('startStop')}>Dept. {getSortIcon('startStop')}</th>
            <th onClick={() => requestSort('started')}>Dep. Time {getSortIcon('started')}</th>
            <th onClick={() => requestSort('endStop')}>Dest. {getSortIcon('endStop')}</th>
            <th onClick={() => requestSort('finished')}>Arr. Time {getSortIcon('finished')}</th>
            <th onClick={() => requestSort('busId')}>Bus {getSortIcon('busId')}</th>
            <th onClick={() => requestSort('companyId')}>Company {getSortIcon('companyId')}</th>
            <th onClick={() => requestSort('chargedAmount')}>Amount {getSortIcon('chargedAmount')}</th>
            <th onClick={() => requestSort('pan')}>Account {getSortIcon('pan')}</th>
            <th onClick={() => requestSort('status')}>Status {getSortIcon('status')}</th>
          </tr>
        </thead>
        <tbody>
          {trips.length > 0 ? (
            trips.map((trip, index) => (
              <tr key={index}>
                <td data-label="Dept." title={trip.startStop}>{trip.startStop}</td>
                <td data-label="Dep. Time">{formatDate(trip.started)}</td>
                <td data-label="Dest." title={trip.endStop}>{trip.endStop}</td>
                <td data-label="Arr. Time">{formatDate(trip.finished)}</td>
                <td data-label="Bus">{trip.busId}</td>
                <td data-label="Company">{trip.companyId}</td>
                <td data-label="Amount">${trip.chargedAmount?.toFixed(2)}</td>
                {/* We apply a specific class for Account to handle long numbers via CSS */}
                <td data-label="Account" className="account-cell">{trip.pan}</td>
                <td data-label="Status">
                  {/* .toLowerCase() ensures "COMPLETED" matches "completed" */}
                  <span className={`status-badge ${trip.status?.toLowerCase()}`}>
                    {trip.status}
                  </span>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="9" style={{ textAlign: 'center' }}>No trips found.</td>
            </tr>
          )}
        </tbody>
      </table>

      <div className="pagination">
        <button onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 0 || loading}>
          Previous
        </button>
        <span className="page-info">
          Page <strong>{currentPage + 1}</strong> of {totalPages}
        </span>
        <button onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage >= totalPages - 1 || loading}>
          Next
        </button>
      </div>
    </div>
  );
};

export default TripList;