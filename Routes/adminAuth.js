import { Router } from "express";
import authenticate from "../Middleware/auth.js";
import adminCheck from "../Middleware/adminCheck.js";

const adminAuth = Router();
const libbook = new Map();

adminAuth.post("/addBook", authenticate, adminCheck, (req, res) => {
    try {
        const { BookTitle,BookId,AuthorName,BookCategory,Edition,PublishedYear,Description } = req.body;
        if (libbook.get(BookId)) {
            res.status(400).json({ msg: "Book in this ID already exists" });
        }
        else{
            libbook.set( BookId,{ BookTitle,AuthorName,BookCategory,Edition,PublishedYear,Description});
            const result = libbook.get(BookId);
            console.log(`Book ${result} added successfully`);
            res.status(201).json({ msg: `${BookTitle} added successfully` });
        }
    } catch {
        res.status(500).json({ msg: "Internal Server Error" });
    }
});

adminAuth.get('/viewBook', (req, res) => {
    try {
       const name = req.query.BookId;
       console.log(name);

       const result = libbook.get(name);

        if (result) {
            console.log("Book details:", result);
            res.status(200).json({ book: result });
        } else {
            res.status(404).json({ msg: "Book doesn't exist" });
        }
    } catch {
        res.status(500).json({ msg: "Internal Server Error" });
    }
});

adminAuth.patch('/updateBook', authenticate, adminCheck, (req, res) => {
    try {
        const { BookId, Edition, PublishedYear, Description } = req.body; 
        console.log(BookId);
        const result = libbook.get(BookId);
        console.log(result);

        if (result) {
            libbook.set(BookId,{ BookTitle:result.BookTitle,AuthorName:result.AuthorName,BookCategory:result.BookCategory ,Edition, PublishedYear, Description})
            console.log("Updated book details:", BookId);
            res.status(200).json({ msg: "Book updated successfully" });
        } else {
            res.status(404).json({ msg: "Book not found" });
        }
    } catch {
        res.status(500).json({ msg: "Internal Server Error" });
    }
});


adminAuth.delete('/deletebook', authenticate, adminCheck, (req, res) => {
    try {
        const { BookId } = req.body; 
        if (libbook.get(BookId)) {  
            libbook.delete(BookId);
            console.log(`${BookId} deleted successfully.`);
            res.status(200).json({ msg: "Book deleted successfully" });
        } else {
            res.status(404).json({ msg: "Book not found" });
        }
    } catch {
        res.status(500).json({ msg: "Internal Server Error" });
    }
});

adminAuth.post('/issueBook',authenticate,adminCheck, (req,res)=>{
    try{
        const {BookId,BookTitle,IssuedTo,IssueDate,ReturnDate} =  req.body;
        console.log("Issuing Book :",BookTitle);

        const result = libbook.get(BookId);
        console.log("Book Details:",result);

        if(result){
            if(result.IssuedTo){
                res.status(400).json({ msg: "Book already issued" });
            }
            const updatedBook = { BookTitle: result.BookTitle,IssuedTo,IssueDate,ReturnDate,Status: 'Issued'};
            libbook.set(BookId, updatedBook);
            console.log("Issued book details:", updatedBook);
            res.status(201).json({ msg: "Book issued successfully" });
        } else {
            res.status(404).json({ msg: "Book not found" });
        }

    }catch{
        res.status(500).json({ msg: "Internal Server Error" });
    }
})

export default adminAuth;