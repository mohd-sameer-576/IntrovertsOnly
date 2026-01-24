import Message from '../models/Message.js'
import User from '../models/User.js'



export const getAllUsers = async (req, res) => {
    // Logic to get all users
    try {
        const loggedInUserId = req.user._id;
        const users = await User.find({ _id: { $ne: loggedInUserId } }).select('-password');
        res.status(200).json(users);
    } catch (error) {

        res.status(500).json({ message: "Error fetching users", error: error.message });
    }
}
export const getMessagesByUserId = async (req, res) => {
    try {
        const myId = req.user._id;
        const {id: otherUserId} = req.params;
        const messages = await Message.find({
            $or: [
                { sender: myId, receiverId: otherUserId },
                { sender: otherUserId, receiverId: myId }
            ],
        })
        res.status(200).json(messages);
    } catch (error) {
        res.status(500).json({ message: "Error fetching messages", error: error.message });
    }
}
export const sendMessage = async (req, res) => {
    try {
        const { text, image } = req.body;
        const senderId = req.user._id;
        const { id: receiverId } = req.params;
        if(!text && !image) {
            return  res.status(400).json({ message: "Message text or image is required" });
        }
        if(senderId.toString() === receiverId) {
            return res.status(400).json({ message: "Cannot send message to yourself" });
        }
        const receiverExists = await User.exists({ _id: receiverId });
        if(!receiverExists) {
            return res.status(404).json({ message: "Receiver not found" });
        }
        let imageUrl;
        if (image) {
            const uploadResponse = await cloudinary.uploader.upload(image);
            imageUrl = uploadResponse.secure_url;
        }
        const newMessage = new Message({
            sender: senderId,
            receiverId,
            text,
            image: imageUrl
        });
        await newMessage.save();
        res.status(201).json(newMessage);
    } catch (error) {
        res.status(500).json({ message: "Error sending message", error: error.message });
    }
}
export const getFriends = async (req, res) => {
    try {
        const loggedInUserId = req.user._id;
        const messages = await Message.find({
            $or: [{ sender: loggedInUserId }, { receiverId: loggedInUserId }]
        });
        const friendIds = [...new Set(messages.map(msg => 
            msg.sender.toString() === loggedInUserId.toString() ? msg.receiverId.toString() : msg.sender.toString()
        ))];
        const friends = await User.find({ _id: { $in: friendIds } }).select('-password');
        res.status(200).json(friends);
    } catch (error) {
        res.status(500).json({ message: "Error fetching friends", error: error.message });
    }
}