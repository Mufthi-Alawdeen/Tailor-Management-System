import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Header from '../../Product/Header';
import Swal from 'sweetalert2';

export default function EmployeeBonusTable() {
  const [employeeBonuses, setEmployeeBonuses] = useState([]);
  const [employeeDetails, setEmployeeDetails] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [editBonus, setEditBonus] = useState(null); // To manage the bonus being edited

  useEffect(() => {
    fetchEmployeeBonuses();
  }, []);

  const fetchEmployeeBonuses = async () => {
    try {
      const response = await axios.get('http://localhost:8075/employeeBonus/all');
      const bonuses = response.data;

      const employeeDetailsMap = {};
      await Promise.all(
        bonuses.map(async (bonus) => {
          const { Eid } = bonus;
          if (!employeeDetailsMap[Eid]) {
            const employeeResponse = await axios.get(`http://localhost:8075/employee/getbyEid/${Eid}`);
            if (employeeResponse.data.exists) {
              employeeDetailsMap[Eid] = employeeResponse.data.employee;
            } else {
              employeeDetailsMap[Eid] = null;
            }
          }
        })
      );

      setEmployeeBonuses(bonuses);
      setEmployeeDetails(employeeDetailsMap);
      setIsLoading(false);
    } catch (error) {
      console.error('Error fetching employee bonuses or details:', error);
      setIsLoading(false);
    }
  };


const handleDelete = async (Eid) => {
  // Show a confirmation dialog before deleting
  Swal.fire({
    title: 'Are you sure?',
    text: 'You will not be able to recover this data!',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#d33',
    cancelButtonColor: '#3085d6',
    confirmButtonText: 'Yes, delete it!',
    cancelButtonText: 'Cancel',
  }).then(async (result) => {
    if (result.isConfirmed) {
      try {
        await axios.delete(`http://localhost:8075/employeeBonus/delete/${Eid}`);
        fetchEmployeeBonuses(); // Refresh the data after deletion
        Swal.fire({
          icon: 'success',
          title: 'Deleted!',
          text: 'Employee bonus has been deleted.',
        });
      } catch (error) {
        console.error('Error deleting employee bonus:', error);
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'An error occurred while deleting employee bonus.',
        });
      }
    }
  });
};


  const handleEdit = (bonus) => {
    setEditBonus(bonus);
  };

  const handleUpdateBonus = async (event) => {
    event.preventDefault();
    try {
      await axios.put(`http://localhost:8075/employeeBonus/update/${editBonus.Eid}`, {
        bonus: editBonus.bonus,
      }).then(() => {
        Swal.fire({
          icon: 'success',
          title: 'Updated!',
          text: 'Bonus updated successfully.',
        });
        setEditBonus(null); // Update the state after the alert is shown
        fetchEmployeeBonuses(); // Refresh the data after update
      });
    } catch (error) {
      console.error('Error updating employee bonus:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'An error occurred while updating employee bonus.',
      });
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditBonus({ ...editBonus, [name]: value });
  };

  const groupBonusesByMonth = () => {
    return employeeBonuses.reduce((acc, bonus) => {
      const month = bonus.month;
      if (!acc[month]) {
        acc[month] = [];
      }
      acc[month].push(bonus);
      return acc;
    }, {});
  };

  const renderTableRows = (bonuses) => {
    return bonuses.map(bonus => {
      const employee = employeeDetails[bonus.Eid];
      const salary = employee ? employee.salary : 0;
      const bonusAmount = bonus.bonus || 0;
      const totalSalary = salary + bonusAmount;

      return (
        <tr key={bonus.Eid}>
          <td style={{ border: '1px solid #ccc', padding: '6px' }}>{bonus.Eid}</td>
          <td style={{ border: '1px solid #ccc', padding: '8px' }}>{employee ? employee.fname : 'N/A'}</td>
          <td style={{ border: '1px solid #ccc', padding: '8px' }}>{employee ? employee.lname : 'N/A'}</td>
          <td style={{ border: '1px solid #ccc', padding: '8px' }}>{bonus.month}</td>
          <td style={{ border: '1px solid #ccc', padding: '6px' }}>{salary.toString()}</td>
          <td style={{ border: '1px solid #ccc', padding: '6px' }}>{bonus.bonusType}</td>
          <td style={{ border: '1px solid #ccc', padding: '6px' }}>{bonusAmount.toString()}</td>
          <td style={{ border: '1px solid #ccc', padding: '6px' }}>{totalSalary.toString()}</td>
          <td style={{ border: '1px solid #ccc', padding: '8px'}}>
            <button onClick={() => handleEdit(bonus)}>Edit</button>
            <button style={{marginLeft:'12px'}} onClick={() => handleDelete(bonus.Eid)}>Delete</button>
          </td>
        </tr>
      );
    });
  };

  const renderTablesByMonth = () => {
    const groupedBonuses = groupBonusesByMonth();

    return Object.keys(groupedBonuses).map(month => (
      <div key={month} style={{justifyContent:'center', marginBottom:'10px', marginTop:'20px'}}>
        <h2 style={{textDecoration:'underline'}}>{month}</h2>
        <table style={{ width: '92%', borderCollapse: 'collapse', marginTop: '20px', marginLeft:'80px' }}>
          <thead>
            <tr>
              <th style={{ border: '1px solid #B7B7B7', padding: '8px', backgroundColor:'#ccc' }}>EID</th>
              <th style={{ border: '1px solid #B7B7B7', padding: '8px' , backgroundColor:'#ccc'}}>First Name</th>
              <th style={{ border: '1px solid #B7B7B7', padding: '8px' , backgroundColor:'#ccc'}}>Last Name</th>
              <th style={{ border: '1px solid #B7B7B7', padding: '8px', backgroundColor:'#ccc' }}>Month</th>
              <th style={{ border: '1px solid #B7B7B7', padding: '8px', backgroundColor:'#ccc' }}>Base Salary</th>
              <th style={{ border: '1px solid #B7B7B7', padding: '6px', backgroundColor:'#ccc' }}>Bonus Type</th>
              <th style={{ border: '1px solid #B7B7B7', padding: '6px', backgroundColor:'#ccc' }}>Bonus Amount</th>
              <th style={{ border: '1px solid #B7B7B7', padding: '8px' , backgroundColor:'#ccc'}}>Total Salary</th>
              <th style={{ border: '1px solid #B7B7B7', padding: '4px', backgroundColor:'#ccc' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {renderTableRows(groupedBonuses[month])}
          </tbody>
        </table>
      </div>
    ));
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div>

        <Header/>
    
    <div>
      <h2 style={{textAlign:'center', marginTop:'50px', textDecoration:'underline', fontWeight:'bold'}} >Employee Salary Details</h2>

      <div style={{textAlign:'center', marginTop:'30px'}}>{renderTablesByMonth()} </div>

      {editBonus && (
        <div>
        {/* Background overlay */}
        <div className="overlay" style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0, 0, 0, 0.5)', zIndex: 999, backdropFilter:'blur(8px)' }}></div>
        
        {/* Popup */}
        <div className="popup" style={{ position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', backgroundColor: '#fff', padding: '20px', borderRadius: '8px', boxShadow: '0 4px 8px rgba(0,0,0,0.2)', zIndex: 1000 }}>
          <h2 style={{textAlign:'center', marginBottom:'20px'}}>Edit Bonus</h2>
          <form onSubmit={handleUpdateBonus}>
            <label style={{fontSize:'18px', textAlign:'center'}}>
              <b>Bonus Amount: </b>
              <input
                type="number"
                name="bonus"
                value={editBonus.bonus}
                onChange={handleInputChange}
                required
                style={{padding:'10px', width:'40%'}}
              />
            </label>
            <div style={{marginTop:'25px'}}> 
              <button style={{marginLeft:'35px'}} type="submit">Update</button>
              <button style={{marginLeft:'123px'}} type="button" onClick={() => setEditBonus(null)}>Cancel</button>
            </div>
          </form>
        </div>
      </div>
      
      )}
    </div>
    </div>
  );
}
