import axios from "axios";

export const codanteApi = axios.create({
    baseURL : 'https://apis.codante.io/api/register-user',
})