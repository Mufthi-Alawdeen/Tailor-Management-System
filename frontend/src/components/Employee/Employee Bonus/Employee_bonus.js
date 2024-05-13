import React, { useState } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';

const AddEmployeeBonus = () => {
  const [formData, setFormData] = useState({
    Eid: '',
    bonus: '',
    month: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:8075/employeeBonus/add', formData);
      Swal.fire({
        icon: 'success',
        title: 'Success',
        text: 'Employee bonus record added successfully',
      });
      setFormData({ Eid: '', bonus: '', month: '' });
    } catch (error) {
      console.error('Error adding employee bonus record:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'An error occurred while adding employee bonus record',
      });
    }
  };

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <div className="card">
            <div className="card-body">
              <h2 className="mb-4">Add Employee Bonus</h2>
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label className="form-label">Employee ID:</label>
                  <input
                    type="text"
                    className="form-control"
                    name="Eid"
                    value={formData.Eid}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Bonus:</label>
                  <input
                    type="number"
                    className="form-control"
                    name="bonus"
                    value={formData.bonus}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Month:</label>
                  <select
                    className="form-select"
                    name="month"
                    value={formData.month}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Select month</option>
                    <option value="January">January</option>
                    <option value="February">February</option>
                    <option value="March">March</option>
                    {/* Add other months as needed */}
                  </select>
                </div>
                <button type="submit" className="btn btn-primary">Add Bonus</button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddEmployeeBonus;
