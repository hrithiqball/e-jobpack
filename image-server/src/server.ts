import express, { Request, Response } from "express";
import multer, { FileFilterCallback } from "multer";
import dotenv from "dotenv";
import path from "path";

dotenv.config();

const app = express();
const port = process.env.PORT || 3001;

// Set up multer for handling file uploads
const storage = multer.diskStorage({
	destination: (
		req: Request,
		file: Express.Multer.File,
		cb: (error: Error | null, destination: string) => void
	) => {
		cb(null, "uploads/");
	},
	filename: (
		req: Request,
		file: Express.Multer.File,
		cb: (error: Error | null, filename: string) => void
	) => {
		const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
		cb(
			null,
			file.fieldname + "-" + uniqueSuffix + path.extname(file.originalname)
		);
	},
});

const upload = multer({
	storage,
	fileFilter: (
		req: Request,
		file: Express.Multer.File,
		cb: FileFilterCallback
	) => {
		// Add your file type filtering logic here if needed
		cb(null, true);
	},
});

// Serve static files (uploaded images)
app.use("/assets", express.static("uploads"));

// Handle image upload
app.post("/upload", upload.single("image"), (req: Request, res: Response) => {
	// Assuming you have some logic here to store assetId and fileName in a database
	const assetId = "123"; // Replace with your logic
	const fileName = (req.file as Express.Multer.File).filename;

	res.json({ success: true, assetId, fileName });
});

app.get("/test", (req: Request, res: Response) => res.send("Test works"));

app.get("/", (req: Request, res: Response) => {
	res.send("Image server running");
});

app.listen(port, () => {
	console.log(`Server is running on http://localhost:${port}`);
});
