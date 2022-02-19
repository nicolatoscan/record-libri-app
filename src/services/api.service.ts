import axios from 'axios';
import userService from './user.service';
import AuthService from './api/auth.service';
import LibrariesService from './api/libraries.service';
import UsersService from './api/users.service';
import RecordTypesService from './api/rercord-types.service';

class APIService {

    public readonly auth = new AuthService(axios, process.env.VUE_APP_API_URL);
    public readonly libraries = new LibrariesService(axios, process.env.VUE_APP_API_URL);
    public readonly users = new UsersService(axios, process.env.VUE_APP_API_URL);
    public readonly recordTypes = new RecordTypesService(axios, process.env.VUE_APP_API_URL);

    constructor() {
        const token = userService.getToken();
        if (token) {
            this.setToken(token);
        }
    }

    public setToken(token: string) {
        axios.interceptors.request.use((config) => {
            if (config?.headers) {
                config.headers.Authorization = `Bearer ${token}`;
            }
            return config;
        });
    }

}

export default new APIService();