import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import Header from '../../Product/Header';
import { Link } from 'react-router-dom';

const AddInventoryRequestForm = () => {
  const [formData, setFormData] = useState({
    requested_by: '',
    material_type: '',
    color: '',
    required_quantity: ''
  });

  const [inventoryRequests, setInventoryRequests] = useState([]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Submit the request first without checking availability
      await axios.post("http://localhost:8075/inventoryRequest/add", formData);
  
      // Reset form data after successful submission
      setFormData({
        requested_by: '',
        material_type: '',
        color: '',
        required_quantity: ''
      });

      // Fetch updated inventory requests after adding the new request
      fetchInventoryRequests();
    } catch (error) {
      console.error('Error adding inventory request:', error);
      // Show error alert
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'There was an issue adding your inventory request.',
      });
    }
  };

  useEffect(() => {
    // Fetch inventory requests when the component mounts
    fetchInventoryRequests();
  }, []);

  const fetchInventoryRequests = async () => {
    try {
      const response = await axios.get("http://localhost:8075/inventoryRequest/retrieve");
      const filteredRequests = response.data.filter(request =>
        request.requested_by === formData.requested_by
      );
      setInventoryRequests(filteredRequests);
      showStatusAlert(filteredRequests);
    } catch (error) {
      console.error('Error retrieving inventory requests:', error);
    }
  };

  const showStatusAlert = (requests) => {
    requests.forEach(request => {
      if (request.status === 'sufficient') {
        Swal.fire({
          icon: 'success',
          title: 'Product is available',
          text: `Requested by: ${request.requested_by}, Material Type: ${request.material_type}, Color: ${request.color}, Required Quantity: ${request.required_quantity}`
        });
      } else {
        Swal.fire({
          icon: 'warning',
          title: 'Product is not available, we will restock soon',
          text: 'We have informed the department.'
        });
      }
    });
  };

  return (
    <div>
      <Header />
      <div className="container mt-5">
        <Link to="/ManageOrder" className="btn btn-secondary mb-3">
          Back to Manage Orders
        </Link>
        <div className="card" style={{ maxWidth: '500px', margin: 'auto' }}>
          <div className="card-body">
            <h2 className="card-title text-center mb-4" style={{ textDecoration: 'underline' }}>
              Inventory Check
            </h2>
            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label className="form-label">Requested By:</label>
                <select 
                  name="requested_by" 
                  value={formData.requested_by} 
                  onChange={handleChange} 
                  className="form-select" 
                  required>
                  <option value="">Select Role</option>
                  <option value="Admin">Admin</option>
                </select>
              </div>
              <div className="mb-3">
                <label className="form-label">Material Type:</label>
                <select 
                  name="material_type" 
                  value={formData.material_type} 
                  onChange={handleChange} 
                  className="form-select" 
                  required>
                  <option value="">Select Material Type</option>
                  <option value="Material">Material</option>
                  <option value="Button">Button</option>
                  <option value="Threads">Threads</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              {formData.material_type === 'Other' && (
                <div className="mb-3">
                  <label className="form-label">Name:</label>
                  <input 
                    type="text" 
                    name="name" 
                    value={formData.name} 
                    onChange={handleChange} 
                    className="form-control" 
                    required />
                </div>
              )}
              <div className="mb-3">
                <label className="form-label">Color:</label>
                <select 
                  name="color" 
                  value={formData.color} 
                  onChange={handleChange} 
                  className="form-select" 
                  required>
                  <option value="">Select Color</option>
                  <option value="Red">Red</option>
                  <option value="Blue">Blue</option>
                  <option value="Green">Green</option>
                  <option value="Yellow">Yellow</option>
                  <option value="Orange">Orange</option>
                  <option value="Purple">Purple</option>
                  <option value="Pink">Pink</option>
                  <option value="Brown">Brown</option>
                  <option value="Gray">Gray</option>
                  <option value="Black">Black</option>
                  {/* Add more color options as needed */}
                </select>
              </div>
              <div className="mb-3">
                <label className="form-label">Required Quantity:</label>
                <input 
                  type="number" 
                  name="required_quantity" 
                  value={formData.required_quantity} 
                  onChange={handleChange} 
                  className="form-control" 
                  required />
              </div>
              <button type="submit" className="btn btn-primary w-100">Check Status</button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddInventoryRequestForm;
