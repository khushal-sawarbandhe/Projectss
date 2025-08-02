// middleware/upload.js
const multer = require('multer');
const path = require('path'); // Import path module

// Set storage engine for Multer
const storage = multer.diskStorage({
    // Define the destination folder for uploads
    destination: function(req, file, cb){
        // cb(error, destination_path)
        cb(null, './uploads/'); // Files will be saved in the 'uploads/' directory relative to server.js
    },
    // Define the filename for the uploaded file
    filename: function(req, file, cb){
        // cb(error, filename)
        // Use original fieldname + timestamp + original extension to ensure unique names
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    }
});

// Initialize upload middleware
const upload = multer({
    storage: storage, // Use the defined storage engine
    limits:{ fileSize: 5 * 1024 * 1024 }, // Limit file size to 5MB (5 * 1024 * 1024 bytes)
    fileFilter: function(req, file, cb){
        checkFileType(file, cb); // Apply a file type filter
    }
}).single('eventImage'); // Expect a single file upload from a field named 'eventImage'

// Helper function to check file type
function checkFileType(file, cb){
    // Allowed file extensions (regex)
    const filetypes = /jpeg|jpg|png|gif/;
    // Check extension
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    // Check MIME type
    const mimetype = filetypes.test(file.mimetype);

    if(mimetype && extname){
        // If both MIME type and extension are allowed, accept the file
        return cb(null, true);
    } else {
        // Otherwise, reject the file with an error message
        cb('Error: Images Only (JPEG, JPG, PNG, GIF)!');
    }
}

module.exports = upload;