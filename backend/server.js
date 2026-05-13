const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const env = require('dotenv');
env.config();

const app = express();
app.use(express.json());
app.use(cors());

function connectDB() {
    mongoose.connect(process.env.MONGO_URI).then(() => {
        console.log('MongoDB Connected Successfully!');
    }).catch((error) => {
        console.log("MongoDB Connection Failed ", error.message);
    })
}

const noteBoardSchema = new mongoose.Schema({
    title: {
        type: String,
        unique: true,
        required: true
    },
    content: {
        type: String,
        required: true,
        trim: true
    }
}, { timestamps: true });

const NoteBoard = mongoose.model("NoteBoard", noteBoardSchema);

app.get('/',async(req,res)=>{
    try {
      const notes = await NoteBoard.find().sort({createdAt : -1});
      return res.status(200).json({message:"Notes fetched successfully!",notes})  
    } catch (error) {
        console.log(error.message);
        return res.status(500).json({message:`Internal server error : ${error.message}`});
    }
})

app.get('/:id',async(req,res)=>{
    try {
       const {id} = req.params;
       if(!mongoose.Types.ObjectId.isValid(id)) return res.status(400).json({message:"Note ID is invalid"})
       const note = await NoteBoard.findById(id);
       if(!note) return res.status(404).json({message:"Note with given id is not found"});
       return res.status(200).json({message:"Note fetched successfully!",note}) 
    } catch (error) {
        console.log(error.message);
        return res.status(500).json({message:`Internal server error : ${error.message}`});
    }
})

app.post('/',async(req,res)=>{
    try {
       const {title , content} = req.body;
       if(!title || !content || title.trim() === '' || content.trim() === '') return res.status(400).json({message:"Give all the required fields!"});
       const note = await NoteBoard.findOne({title});
       if(note) return res.status(409).json({message:"Note already exists!"});
       const newNote = new NoteBoard({
        title,
        content
       });
       await newNote.save();
       return res.status(201).json({message:"Note created successfully!",newNote});
    } catch (error) {
        console.log(error.message);
        return res.status(500).json({message:`Internal server error : ${error.message}`});
    }
})

app.put('/:id',async(req,res)=>{
    try {
      const {id} = req.params;  
      const {title , content} = req.body;
      const note = await NoteBoard.findByIdAndUpdate(id,{
        title,
        content,
      });
      if(!note) return res.status(404).json({message:"Note not found"});
      return res.status(200).json({message:"Note updated successfully!",note});
    } catch (error) {
        console.log(error.message);
        return res.status(500).json({message:`Internal server error : ${error.message}`});
    }
});

app.delete('/:id',async(req,res)=>{
    try {
       const {id} = req.params;
       const note = await NoteBoard.findByIdAndDelete(id);
       if(!note) return res.status(404).json({message:"Note not found!"});
       return res.status(200).json({message:"Note deleted successfully!"}); 
    } catch (error) {
        console.log(error.message);
        return res.status(500).json({message:`Internal server error : ${error.message}`});
    }
})

app.listen(process.env.PORT,()=>{
    connectDB();
    console.log("Server running on port 5000");
});