import { createContext } from 'react';
import { IUser } from '../model/type';


const UserContext = createContext<IUser | null>(null);

export default UserContext

