import { create } from 'apisauce';
import { Config } from '../../config';
import storage from '../auth/storage';


const apiClient = create({
    baseURL: `${Config.serverUrl}/api`
})

apiClient.addAsyncRequestTransform(async (request) => {
    const authToken = await storage.getToken()
    if (!authToken) return;
    request.headers["authorization"] = "Bearer " + authToken;
})

export default apiClient;