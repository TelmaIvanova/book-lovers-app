// import React, { useState, useEffect } from 'react';
// import { Link } from 'react-router-dom';
// import { useAuth } from '../context/AuthContext';

// const Users = () => {
//   const [users, setUsers] = useState([]);
//   const { token, user } = useAuth();

//   useEffect(() => {
//     if (!token) {
//       console.error('No token available');
//       return;
//     }

//     fetch('/api/users', {
//       headers: {
//         'Authorization': `Bearer ${token}`,
//         'User-Role': user?.role,
//       },
//     })
//       .then((response) => response.json())
//       .then((data) => {
//         setUsers(data.data.users);
//       })
//       .catch((error) => console.error('Error fetching users:', error));
//   }, [token, user?.role]);

//   return (
//     <div className='container mt-4'>
//       <h1 className='mb-4'>Users</h1>
//       <div className='row'>
//         {users.map((user) => (
//           <div className='col-md-4 mb-4' key={user._id}>
//             <div className='card'>
//               <div className='card-body'>
//                 <h5 className='card-title'>{user.firstName} {user.lastName}</h5>
//                 <p className='card-text'><strong>Role:</strong> {user.role}</p>
//                 <Link to={`/users/${user._id}`} className='btn btn-secondary'>
//                   View Details
//                 </Link>
//               </div>
//             </div>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// };

// export default Users;
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Users = () => {
  const [users, setUsers] = useState([]);
  const { token } = useAuth();

  useEffect(() => {
    if (!token) {
      console.error('No token available');
      return;
    }

    fetch('/api/users', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        setUsers(data.data.users);
      })
      .catch((error) => console.error('Error fetching users:', error));
  }, [token]);

  return (
    <div className='container mt-4'>
      <h1 className='mb-4'>Users</h1>

      <div className='mb-3'>
        <Link to='/create-user' className='btn btn-primary'>
          Create New User
        </Link>
      </div>

      <div className='row'>
        {users.map((user) => (
          <div className='col-md-4 mb-4' key={user._id}>
            <div className='card'>
              <div className='card-body'>
                <h5 className='card-title'>
                  {user.firstName} {user.lastName}
                </h5>
                <p className='card-text'>
                  <strong>Role:</strong> {user.role}
                </p>
                <Link to={`/users/${user._id}`} className='btn btn-secondary'>
                  View Details
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Users;
