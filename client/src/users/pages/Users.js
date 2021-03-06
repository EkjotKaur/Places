import React, {useEffect, useState} from 'react';

import UsersList from '../components/UsersList';
import ErrorModal from '../../shared/components/UIElement/ErrorModal';
import LoadingSpinner from '../../shared/components/UIElement/LoadingSpinner';
import {useHttpClient} from "../../shared/hooks/http-hook";


const Users = () => {
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const [loadUsers, setLoadedUsers] = useState();

 useEffect(() => {
  const fetchUsers = async () => {
    try{
      const responseData = await sendRequest('http://localhost:5000/api/users');

      setLoadedUsers(responseData.users);
    } catch(err) {
    }
  };
  fetchUsers();
  }, [sendRequest]);


  return (
    <React.Fragment>
      <ErrorModal error={error} onClear={clearError} />
      {isLoading && (
        <div className="center">
          <LoadingSpinner />
        </div>
      )}
      {!isLoading && loadUsers && <UsersList items={loadUsers}/>}
    </React.Fragment>
  ) 
};

export default Users;