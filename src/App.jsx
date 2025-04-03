import { useEffect, useState } from "react";
import axios from "axios";
import './App.css'

function App() {
  const [users, setUsers] = useState([]);
  const [fiteredUsers, setFilterUsers] = useState([]);
  const [isOpen, isModelOpen] = useState(false);
  const [userData,setUserData]=useState({name:"",age:"",city:""});
let url='https://crud-b-sb8a.onrender.com'
// let url='http://localhost:8000'
  const getAllUsers = async () => {
    await axios.get(`${url}/users`).then((res) => {
      // console.log(res.data);
      setUsers(res.data);
      setFilterUsers(res.data);
    });
  };
  useEffect(() => {
    getAllUsers();
  }, []);
  //Search Function 
  const handleSearch = (e) => {
    const searchText = e.target.value.toLowerCase();
    const filterUsers = users.filter((user) => (user.name.toLowerCase().includes(searchText)) || (user.city.toLowerCase().includes(searchText)));
    setFilterUsers(filterUsers);
  };
  //Delete USer function
  const handleDelete = async (id) => {

    const isConfirmed = window.confirm("Are you sure you want to delete this user?");
    if (isConfirmed) {
      await axios.post(`${url}/users/${id}`).then((res) => {
        setUsers(res.data);
        setFilterUsers(res.data);
      });
    }
  };
//Close Model 
const modelClose=()=>{
  isModelOpen(false);
  getAllUsers();
};
  // add detail for user

  const handleAdd= ()=>{
    setUserData({name:"",age:"",city:""});
    isModelOpen(true);
  };
const handleData=(e)=>{
  setUserData({...userData,[e.target.name]:e.target.value});
};

const handleSubmit= async(e)=>{
  e.preventDefault();
  if(userData.id){
    await axios.patch(`${url}/users/${userData.id}`,userData).then((res)=>{
      console.log(res)});
  }else{
  await axios.post(`${url}/users`,userData).then((res)=>{
    console.log(res)});
  }
  modelClose();
  setUserData({name:"",age:"",city:""});

};

//Update User Record
const handleUpdateRecord=(user)=>{
  setUserData(user);
  isModelOpen(true);
};

  return (
    <>
      <div className='container'>
        <h3>CRUD Application</h3>
        <div className="input-search">
          <input type="search" placeholder="Search text here" onChange={handleSearch} />
          <button className='btn green' onClick={handleAdd}>Add Record</button>
        </div>
        <table className='table'>
          <thead>
            <tr>
              <th>S.No</th>
              <th>Name</th>
              <th>Age</th>
              <th>City</th>
              <th>Edit</th>
              <th>Delete</th>
            </tr>
          </thead>
          <tbody>
            {fiteredUsers && fiteredUsers.map((user, index) => {
              return (
                <tr key={user.id}>
                  <td>{index + 1}</td>
                  <td>{user.name}</td>
                  <td>{user.age}</td>
                  <td>{user.city}</td>
                  <td><button className='btn green' onClick={()=>handleUpdateRecord(user)}>Edit</button></td>
                  <td><button className='btn red' onClick={() => handleDelete(user.id)}>Delete</button></td>
                </tr>
              );
            })

            }

          </tbody>
        </table>
        {isOpen && (
          <div className="model">
            <div className="modelContent">
              <span className="close" onClick={modelClose}>&times;</span>
              <h2>{userData.id ? "Update Record" : "Add Record"}</h2>
              <div className="inputDetail">
                  <label htmlFor="name">FullName</label>
                  <input type="text" id="name" name="name" value={userData.name} onChange={handleData}/>
              </div>
              <div className="inputDetail">
                  <label htmlFor="age">Age</label>
                  <input type="number" id="age" name="age"  value={userData.age} onChange={handleData}/>
              </div>
              <div className="inputDetail">
                  <label htmlFor="city">City</label>
                  <input type="text" id="city" name="city"  value={userData.city} onChange={handleData} />
              </div>
              <button className="btn green" onClick={handleSubmit}> {userData.id ? "Update User" : "Add User"}</button>
            </div>
          </div>
        )}
      </div>

    </>
  )
}

export default App
