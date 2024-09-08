"use client";
import { useState, useEffect } from "react";

export default function Home() {
  const [books, setBooks] = useState([]);
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [currentID, setcurrentID] = useState("");
  const [isDisabled, setIsDisabled] = useState(false);

  //for enabling or disabling add+ or update button
  useEffect(() => {
    if (!title || !author) {
      setIsDisabled(true);
    } else {
      setIsDisabled(false);
    }
  }, [title, author]);

  //First time getting data from server
  useEffect(() => {
    fetch("/api/books/")
      .then((response) => response.json())
      .then((data) => setBooks(data))
      .catch((error) => console.log(error));
  }, []);

  //handleAddBook Function
  const handleAddBook = (title, author) => {
    alert("Adding new book...");
    fetch("/api/books/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, author }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          alert("New book added successfully!");
          setBooks((prevBooks) => [...prevBooks, data.data]);
          setTitle("");
          setAuthor("");
        }
      })
      .catch((error) => console.error("Error", error));
  };
  /////////////////
  //handleEditBook(obj)
  const handleEditBook = ({ id, title, author }) => {
    setTitle(title);
    setAuthor(author);
    setcurrentID(id);
  };
  ///////////

  //handleUpdateBook()
  const handleUpdateBook = () => {
    fetch("/api/books/", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: currentID, title: title, author: author }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          alert("updated successfully");
          setBooks(data.data); //setting all the books again to show updated content
          setTitle("");
          setAuthor("");
        }
      })
      .catch((error) => console.error("Error", error));
  };
  //////////////////

  //handleDeleteBook(id)
  const handleDeleteBook = ({ id }) => {
    alert("Deleting... id: " + id);
    fetch("/api/books/", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: id }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          alert("Deleted Successfully");
          setBooks((prevBooks) => prevBooks.filter((book) => book._id !== id));
        }
      })
      .catch((error) => console.error("Error!", error));
  };

  return (
    <>
      <h1 className="relative mt-3 ml-[45%] text-white text-3xl p-3 font-bold border inline-block">
        Books List
      </h1>
      <br />
      <div className="w-[45%] p-3 bg-white rounded-md shadow-md mx-auto my-5 ">
        <div className="input-container flex flex-row gap-3 justify-around">
          <input
            className="border rounded-sm p-3 m-2 hover:shadow-sm"
            type="text"
            placeholder="Enter Book Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <input
            className="border rounded-sm p-3 m-2 hover:shadow-sm"
            type="text"
            placeholder="Enter Author Name"
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
          />
        </div>
        <div className="btn-container flex flex-row-reverse justify-center">
          <button
            type="submit"
            onClick={() => handleAddBook(title, author)}
            className={`cursor-pointer bg-green-500 text-black font-extrabold rounded-sm shadow-sm border p-2 m-2 ${
              isDisabled ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            + Add Book
          </button>
          <button
            disabled={title && author ? false : true}
            className={`cursor-pointer bg-black text-white font-extrabold rounded-sm shadow-sm border p-2 m-2 ${
              isDisabled ? "opacity-50 cursor-not-allowed" : ""
            }`}
            onClick={() => handleUpdateBook()}
          >
            Update
          </button>
        </div>
      </div>
      {books.map((book) => (
        <div
          key={book._id}
          className="bg-white p-3 rounded-sm shadow-sm inline-block m-2 cursor-pointer hover:shadow-lg"
        >
          <h1 className="text-blue-700 font-bold">{`Title: ${book.title}`}</h1>
          <p className="text-green-600">{`Author: ${book.author}`}</p>
          <button
            className="p-1 bg-blue-700 text-white font-extrabold rounded-sm mt-2 mr-1"
            onClick={() =>
              handleEditBook({
                id: book._id,
                title: book.title,
                author: book.author,
              })
            }
          >
            Edit
          </button>
          <button
            className="p-1 bg-red-700 text-white font-extrabold rounded-sm mt-2"
            onClick={() => handleDeleteBook({ id: book._id })}
          >
            Delete
          </button>
        </div>
      ))}
    </>
  );
}
