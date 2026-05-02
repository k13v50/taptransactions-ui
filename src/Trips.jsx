import React, { useEffect, useState } from 'react';
import { parse, format, isValid } from 'date-fns';
import './App.css'; 

const TripList = () => {
  // 1. All State Definitions
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [pageSize] = useState(10);
  const [sortConfig, setSortConfig] = useState({ key: 'started', direction: 'desc' });

  // Search States
  const [searchCategory, setSearchCategory] = useState('status');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilters, setActiveFilters] = useState({ category: '', value: '' });

  const [startRange, setStartRange] = useState(''); // Format: YYYY-MM-DD from picker
  const [endRange, setEndRange] = useState('');

  const [error, setError] = useState('');

  // 2. Helper Functions (Formatting, Sorting, Pagination)
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    try {
      const incomingFormat = "dd-MM-yyyy HH:mm:ss";
      const utcDate = parse(dateString.trim(), incomingFormat, new Date());
      if (!isValid(utcDate)) return dateString;
      const localDate = new Date(utcDate.getTime() - (utcDate.getTimezoneOffset() * 60000));
      return format(localDate, "dd-MM-yyyy hh:mm aa");
    } catch (error) { 
      return dateString; }
  };

  const requestSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') direction = 'desc';
    setSortConfig({ key, direction });
    setCurrentPage(0);
  };

  const getSortIcon = (key) => {
    if (sortConfig.key !== key) return '↕️';
    return sortConfig.direction === 'asc' ? '🔼' : '🔽';
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 0 && newPage < totalPages) setCurrentPage(newPage);
  };

  const handleDateChange = (type, value) => {
    if (type === 'start') setStartRange(value);
    else setEndRange(value);
  };

  // 3. API Fetch Logic
  const fetchTrips = async () => {
    setLoading(true);
    setError('');
    const token = localStorage.getItem('token');
    const sortParam = `${sortConfig.key},${sortConfig.direction}`;
    
    let url = `http://localhost:8080/trips?page=${currentPage}&size=${pageSize}&sort=${sortParam}`;
    
    if (activeFilters.value) {
      url += `&${activeFilters.category}=${encodeURIComponent(activeFilters.value)}`;
    }

    // Convert HTML date (YYYY-MM-DD) to Backend format (dd-MM-yyyy HH:mm:ss)
    if (startRange) {
      const [y, m, d] = startRange.split('-');
      url += `&startDate=${d}-${m}-${y} 00:00:00`;
    }
    if (endRange) {
      const [y, m, d] = endRange.split('-');
      url += `&endDate=${d}-${m}-${y} 23:59:59`;
    }

    try {
      const response = await fetch(url, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      setTrips(data.content || []);
      setTotalPages(data.totalPages || 0);
    } catch (error) {
      setError('Error processing request.');
      console.error("Fetch error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTrips();
  }, [currentPage, sortConfig, activeFilters]);


  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setCurrentPage(0); 
    
    // Update activeFilters with everything at once
    setActiveFilters({ 
      category: searchCategory, 
      value: searchQuery,
      startDate: startRange, // Add these to your activeFilters state
      endDate: endRange 
    });
  };

  const handleClear = () => {
    setSearchQuery('');
    setStartRange('');
    setEndRange('');
    setActiveFilters({ category: '', value: '', startDate: '', endDate: '' });
    setCurrentPage(0);
  };

  return (
    <div className="trip-container">
      <h3>Trip History</h3>

      <form className="search-form" onSubmit={handleSearchSubmit}>
        <div className="filter-row" style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          <div className="filter-item search-main">
            <select 
              value={searchCategory} 
              onChange={(e) => setSearchCategory(e.target.value)}
              className="search-dropdown"
            >
              <option value="busId">Bus ID</option>
              <option value="companyId">Company</option>
              <option value="pan">Account (PAN)</option>
              <option value="status">Status</option>
            </select>
            
            <input 
              type="text" 
              placeholder={`Search by ${searchCategory}...`}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="search-input"
            />
            
          </div>
          <div className="range-group" style={{ display: 'flex', gap: '10px' }}>
            <div className="filter-item date-field">
              <label>From:</label>
              <input 
                type="date" 
                value={startRange}
                onChange={(e) => handleDateChange('start', e.target.value)} // Arrow function is key
              />
            </div>
            <div className="filter-item date-field">
              <label>To:</label>
              <input 
                type="date" 
                value={endRange}
                onChange={(e) => setEndRange(e.target.value)}
                className="date-input"
              />
            </div>
          </div>

          {/* button for search */}
          <button type="submit" className="search-submit-btn">Apply Filters</button>
          </div>
      </form>

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
          {/* Use 'trips' directly since backend handles filtering */}
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
                <td data-label="Account" className="account-cell">{trip.pan}</td>
                <td data-label="Status">
                  <span className={`status-badge ${trip.status?.toLowerCase()}`}>
                    {trip.status}
                  </span>
                </td>
              </tr>
            ))
          ) : !loading && (
            <tr>
              <td colSpan="9" style={{ textAlign: 'center', padding: '2rem' }}>
                No transactions found for "{activeFilters.value}"
              </td>
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