import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';

const AddInventoryRequestForm = () => {
  const [formData, setFormData] = useState({
    requested_by: '',
    material_type: '',
    color: '',
    required_quantity: ''
  });

  const [status, setStatus] = useState('');
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
      // Set status to error
      setStatus('Error');
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
          text: `we have informed to the department.`
        });
      }
    });
  };

  return (
    <div>

    <div style={{ fontFamily: 'Arial, sans-serif', maxWidth: '400px', margin: 'auto', border: '1px solid #ccc', padding: '20px' , marginTop : '75px', marginBottom:'60px' }}>
    <h2 style={{ textAlign: 'center', marginBottom: '40px',  marginTop : '25px' , textDecoration:'underline' }}>Inventory Check</h2>
    <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '20px' }}>
        <div>
            <label style={{ fontWeight: 'bold', display: 'block', marginBottom: '5px' }}>Requested By:</label>
            <input type="text" name="requested_by" value={formData.requested_by} onChange={handleChange} required style={{ width: 'calc(100% - 16px)', padding: '8px', borderRadius: '5px', border: '1px solid #ccc', outline: 'none' }} />
        </div>
        <div>
            <label style={{ fontWeight: 'bold', display: 'block', marginBottom: '5px' }}>Material Type:</label>
            <select name="material_type" value={formData.material_type} onChange={handleChange} required style={{ width: 'calc(100% - 75px)', padding: '8px', borderRadius: '5px', border: '1px solid #ccc', outline: 'none'  }}>
                <option value="">Select Material Type</option>
                <option value="Material">Material</option>
                <option value="Button">Button</option>
                <option value="Threads">Threads</option>
                <option value="Other">Other</option>
            </select>
        </div>
        {formData.material_type === 'Other' && (
            <div>
                <label style={{ fontWeight: 'bold', display: 'block', marginBottom: '5px' }}>Name:</label>
                <input type="text" name="name" value={formData.name} onChange={handleChange} required style={{ width: 'calc(100% - 16px)', padding: '8px', borderRadius: '5px', border: '1px solid #ccc', outline: 'none' }} />
            </div>
        )}
        <div>
            <label style={{ fontWeight: 'bold', display: 'block', marginBottom: '5px' }}>Color:</label>
            <select name="color" value={formData.color} onChange={handleChange} required style={{ width: 'calc(100% - 75px)', padding: '8px', borderRadius: '5px', border: '1px solid #ccc', outline: 'none' }}>
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
        <div>
            <label style={{ fontWeight: 'bold', display: 'block', marginBottom: '5px' }}>Required Quantity:</label>
            <input type="number" name="required_quantity" value={formData.required_quantity} onChange={handleChange} required style={{ width: 'calc(100% - 16px)', padding: '8px', borderRadius: '5px', border: '1px solid #ccc', outline: 'none' }} />
        </div>
        <button type="submit" style={{ width: '100%', padding: '10px 0', border: 'none', backgroundColor: 'black', color: 'white', fontWeight: 'bold', cursor: 'pointer' }}>Check Status</button>
    </form>
  </div>
  </div>
  );
};

export default AddInventoryRequestForm;
