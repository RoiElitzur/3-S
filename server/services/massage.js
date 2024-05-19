import Massage from '../models/massage.js'


const createMessage = async(sender,content) => {
    const massage = new Massage({sender: sender , content : content })
    return await massage.save();
}

export default {createMessage};

