import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import Select from 'react-select';
import Header from '../../Product/Header';

const AddEmployeeBonus = () => {
  const [formData, setFormData] = useState({
    Eid: '',
    bonus: '',
    bonusType: '',
    month: '',
  });
  const [employeeOptions, setEmployeeOptions] = useState([]);

  useEffect(() => {
    fetchEmployeeIds();
  }, []);

  const fetchEmployeeIds = async () => {
    try {
      const response = await axios.get('http://localhost:8075/employee');
      const employees = response.data;
      const options = employees.map(emp => ({
        value: emp.Eid,
        label: `${emp.Eid} - ${emp.fname} ${emp.lname}`
      }));
      setEmployeeOptions(options);
    } catch (error) {
      console.error('Error fetching employee IDs:', error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSelectChange = (selectedOption) => {
    setFormData({ ...formData, Eid: selectedOption ? selectedOption.value : '' });
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
      setFormData({ Eid: '', bonus: '', bonusType: '', month: '' });
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
    <div>
      <Header />
      <div className="container mt-5">
        <div className="row justify-content-center">
          <div className="col-md-6">
            <div className="card">
              <div className="card-body">
                <h2 className="mb-4">Add Employee Bonus</h2>
                <form onSubmit={handleSubmit}>
                  <div className="mb-3">
                    <label className="form-label">Employee ID:</label>
                    <Select
                      options={employeeOptions}
                      onChange={handleSelectChange}
                      isClearable
                      value={employeeOptions.find(option => option.value === formData.Eid) || null}
                      placeholder="Select employee"
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
                    <label className="form-label">Select Bonus Type:</label>
                    <select
                      className="form-select"
                      name="bonusType"
                      value={formData.bonusType}
                      onChange={handleChange}
                      required
                    >
                      <option value="">Select bonus type</option>
                      <option value="Bonus">Bonus</option>
                      <option value="Festival Bonus">Festival Bonus</option>
                      <option value="Performance Bonus">Performance Bonus</option>
                    </select>
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
                      <option value="April">April</option>
                      <option value="May">May</option>
                      <option value="June">June</option>
                      <option value="July">July</option>
                      <option value="August">August</option>
                      <option value="September">September</option>
                      <option value="October">October</option>
                      <option value="November">November</option>
                      <option value="December">December</option>
                    </select>
                  </div>
                  <button type="submit" className="btn btn-primary">Add Bonus</button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddEmployeeBonus;
