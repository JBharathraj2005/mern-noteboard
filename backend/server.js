const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config();

const app = express();

app.use(express.json());

if (process.env.NODE_ENV !== "production") {
    app.use(cors({
        origin: "http://localhost:5173",
    }));
}

async function connectDB() {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("MongoDB Connected Successfully!");
    } catch (error) {
        console.log("MongoDB Connection Failed:", error.message);
        process.exit(1);
    }
}

const noteBoardSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            unique: true,
            required: true,
            trim: true,
        },
        content: {
            type: String,
            required: true,
            trim: true,
        },
    },
    { timestamps: true }
);

const NoteBoard = mongoose.model("NoteBoard", noteBoardSchema);

app.get('/api/notes', async (req, res) => {
    try {
        const notes = await NoteBoard.find().sort({ createdAt: -1 });

        return res.status(200).json({
            message: "Notes fetched successfully!",
            notes,
        });

    } catch (error) {
        console.log(error.message);

        return res.status(500).json({
            message: `Internal server error: ${error.message}`,
        });
    }
});

app.get('/api/notes/:id', async (req, res) => {
    try {
        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                message: "Note ID is invalid",
            });
        }

        const note = await NoteBoard.findById(id);

        if (!note) {
            return res.status(404).json({
                message: "Note with given ID not found",
            });
        }

        return res.status(200).json({
            message: "Note fetched successfully!",
            note,
        });

    } catch (error) {
        console.log(error.message);

        return res.status(500).json({
            message: `Internal server error: ${error.message}`,
        });
    }
});

app.post('/api/notes', async (req, res) => {
    try {
        const { title, content } = req.body;

        if (
            !title ||
            !content ||
            title.trim() === '' ||
            content.trim() === ''
        ) {
            return res.status(400).json({
                message: "Give all required fields!",
            });
        }

        const existingNote = await NoteBoard.findOne({ title });

        if (existingNote) {
            return res.status(409).json({
                message: "Note already exists!",
            });
        }

        const newNote = new NoteBoard({
            title,
            content,
        });

        await newNote.save();

        return res.status(201).json({
            message: "Note created successfully!",
            newNote,
        });

    } catch (error) {
        console.log(error.message);

        return res.status(500).json({
            message: `Internal server error: ${error.message}`,
        });
    }
});

app.put('/api/notes/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { title, content } = req.body;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                message: "Invalid note ID",
            });
        }

        const updatedNote = await NoteBoard.findByIdAndUpdate(
            id,
            {
                title,
                content,
            },
            {
                new: true,
                runValidators: true,
            }
        );

        if (!updatedNote) {
            return res.status(404).json({
                message: "Note not found",
            });
        }

        return res.status(200).json({
            message: "Note updated successfully!",
            updatedNote,
        });

    } catch (error) {
        console.log(error.message);

        return res.status(500).json({
            message: `Internal server error: ${error.message}`,
        });
    }
});

app.delete('/api/notes/:id', async (req, res) => {
    try {
        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                message: "Invalid note ID",
            });
        }

        const deletedNote = await NoteBoard.findByIdAndDelete(id);

        if (!deletedNote) {
            return res.status(404).json({
                message: "Note not found!",
            });
        }

        return res.status(200).json({
            message: "Note deleted successfully!",
        });

    } catch (error) {
        console.log(error.message);

        return res.status(500).json({
            message: `Internal server error: ${error.message}`,
        });
    }
});

if (process.env.NODE_ENV === "production") {

    app.use(express.static(path.join(__dirname, "../frontend/dist")));

    app.use((req, res) => {
        res.sendFile(
            path.join(__dirname, "../frontend/dist/index.html")
        );
    });
}

const PORT = process.env.PORT || 5000;

app.listen(PORT, async () => {
    await connectDB();
    console.log(`Server running on port ${PORT}`);
});