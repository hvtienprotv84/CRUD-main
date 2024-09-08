import { ObjectId } from "mongodb";
import { connectDatabase, disconnectDatabase } from "../../lib/mongodb";
import { NextResponse } from "next/server";

//Handle Get Requests
export async function GET() {
  try {
    const client = await connectDatabase();
    const db = client.db("blog");
    // const collection = db.collection("books");
    const result = await db.collection("books").find().toArray();
    return NextResponse.json(result);
  } catch (error) {
    console.log(error);
  } finally {
    await disconnectDatabase();
  }
}

//Handle POST requests
export async function POST(request) {
  const { title, author } = await request.json(); //await request.json() is like req.body and has the data sent from frontend
  if (!title || !author) {
    return NextResponse.json({ success: false, error: "Empty data" });
  }
  try {
    const client = await connectDatabase();
    const db = client.db("blog");
    const book = { title, author };
    await db.collection("books").insertOne(book);
    return NextResponse.json({ success: true, data: book });
  } catch (error) {
    return NextResponse.json({ success: false, error: "Server Error!" });
  } finally {
    await disconnectDatabase();
  }
}

//handle PUT requests (for updating documents)
export async function PUT(request) {
  const { id, title, author } = await request.json();
  if (!id || !title || !author) {
    return NextResponse.json({ success: false, error: "Empty data" });
  }
  try {
    const client = await connectDatabase();
    const db = client.db("blog");
    const filter = { _id: new ObjectId(id) }; //new keyword is important
    const updateDocument = { $set: { title: title, author: author } };
    const result = await db
      .collection("books")
      .updateOne(filter, updateDocument);
    if (result.modifiedCount === 1) {
      //modifiedCount =1 means updated successfully
      //fetching all the books again to show updated result in frontend
      const updatedBooks = await db.collection("books").find().toArray();
      return NextResponse.json({ success: true, data: updatedBooks });
    } else {
      //data not found
      return NextResponse.json({ success: false, error: "Data Not Found!" });
    }
  } catch (error) {
    return NextResponse.json({ success: false, error: "Server Error!" });
  } finally {
    await disconnectDatabase();
  }
}

//handle DELETE request
export async function DELETE(request) {
  const { id } = await request.json();

  if (!id) {
    return NextResponse.json({ success: false, error: "Missing data!" });
  }

  try {
    const client = await connectDatabase();
    const db = client.db("blog");
    const filter = { _id: new ObjectId(id) };
    const result = await db.collection("books").deleteOne(filter);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ success: false, error: "Server Error!" });
  } finally {
    await disconnectDatabase();
  }
}
