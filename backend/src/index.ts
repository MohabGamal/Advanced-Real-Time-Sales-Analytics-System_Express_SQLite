import { NODE_ENV, PORT } from './constants'
import server from './server'
import { initWebSocket } from './ws';


const app = server.listen(PORT, () => {
  console.log(`connected to ${PORT} in ${NODE_ENV} mode`)
}) 
initWebSocket(app);
