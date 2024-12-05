import { ApiInstance } from '../services/axios';
import axios from 'axios';
import { createContext } from 'react';

const ApiContext = createContext<ApiInstance>(new ApiInstance(axios.create()));

export default ApiContext

