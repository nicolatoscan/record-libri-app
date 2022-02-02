import axios from 'axios';
import AuthService from './api/auth.service';
import LibrariesService from './api/libraries.service';
import userService from './user.service';

class APIService {

    public readonly auth = new AuthService(axios, process.env.VUE_APP_API_URL);
    public readonly libraries = new LibrariesService(axios, process.env.VUE_APP_API_URL);

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